from pyspark.sql import SparkSession
from pyspark.sql.functions import desc
from pyspark.sql.window import Window
from pyspark.sql import functions as F
from pyspark.sql.functions import col, lit, lower, current_timestamp
from pyspark.sql.functions import when, desc
from datetime import datetime, timedelta
from pyspark.sql.functions import expr, broadcast
from pyspark.sql.functions import date_format, to_date
from pyspark.sql.functions import row_number
from pyspark.sql import Row
from pyspark.sql.functions import to_timestamp
from pyspark.sql.types import StructType, StructField, StringType, IntegerType,  TimestampType
from pyspark.sql.functions import max as sparkMax
import psycopg2
import pandas as pd
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.sql.functions import col, from_json, explode
from pyspark.sql.types import *
import os,json
from pyspark.sql.functions import arrays_zip, explode
from pyspark.sql.functions import concat
import uuid
from pyspark.sql.functions import monotonically_increasing_id

spark = SparkSession.builder \
    .appName("KafkaToHIVEWeatherAlerts") \
    .master("yarn") \
    .config("spark.sql.parquet.int96RebaseModeInWrite", "LEGACY") \
    .config("spark.executor.instances", "1") \
    .config("spark.executor.memory", "512m") \
    .config("spark.executor.cores", "1") \
    .config("spark.driver.memory", "512m") \
    .config("spark.driver.cores", "1") \
    .config("spark.scheduler.mode", "FAIR") \
    .enableHiveSupport() \
    .getOrCreate()

with open(os.environ["DB_CONFIG_PATH_POSTGRES"]) as f:
    postgres_config = json.load(f)

postgres_url = postgres_config["url_dms_demo"]
postgres_user = postgres_config["user"]
postgres_pwd = postgres_config["password"]
postgres_driver = "org.postgresql.Driver"


severity_df = spark.read \
    .format("jdbc") \
    .option("url", postgres_url) \
    .option("dbtable", "public.admin_web_dms_disaster_severity") \
    .option("user", postgres_user) \
    .option("password", postgres_pwd) \
    .option("driver", postgres_driver) \
    .load()

def get_thresholds(hazard_name):
    return severity_df.filter(col("hazard_types") == hazard_name) \
        .select("hazard_rng_low", "hazard_rng_medium", "hazard_rng_high") \
        .limit(1).collect()[0].asDict()

rain_thresholds = get_thresholds("rainfall")
precip_thresholds = get_thresholds("precipitation")
temp_thresholds = get_thresholds("temperature")

# 2. Kafka configuration
kafka_bootstrap_servers = "122.176.232.35:9092"
kafka_topic = "weather_alerts_rain"


weather_schema = ArrayType(
    StructType([
        StructField("latitude", DoubleType(), True),
        StructField("longitude", DoubleType(), True),
        StructField("elevation", DoubleType(), True),
        StructField("timezone", StringType(), True),
        StructField("timezone_abbreviation", StringType(), True),
        StructField("utc_offset_seconds", IntegerType(), True),
        StructField("generationtime_ms", DoubleType(), True),
        StructField("location_id", IntegerType(), True),
        StructField("current_units", MapType(StringType(), StringType()), True),
        StructField("current", StructType([
            StructField("time", StringType(), True),
            StructField("interval", IntegerType(), True),
            StructField("temperature_2m", DoubleType(), True),
            StructField("rain", DoubleType(), True),
            StructField("precipitation", DoubleType(), True),
            StructField("weather_code", IntegerType(), True)
        ]), True)
    ])
)

# 5. Read from Kafka
kafka_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
    .option("subscribe", kafka_topic) \
    .option("startingOffsets", "latest") \
    .load()

# 6. Parse and explode JSON array
parsed_df = kafka_df.selectExpr("CAST(value AS STRING) as json_str") \
    .withColumn("data", from_json(col("json_str"), weather_schema)) \
    .withColumn("entry", explode(col("data"))) \
    .select(
        col("entry.latitude"),
        col("entry.longitude"),
        col("entry.elevation"),
        col("entry.timezone"),
        col("entry.timezone_abbreviation"),
        col("entry.utc_offset_seconds"),
        col("entry.current.time").alias("time"),
        col("entry.current.temperature_2m").alias("temperature_2m"),
        col("entry.current.rain").alias("rain"),
        col("entry.current.precipitation").alias("precipitation"),
        col("entry.current.weather_code").alias("weather_code")
    ) \
    .withColumn("time", col("time").cast("timestamp")) \
    .withColumn("added_date", current_timestamp()) \
    .withColumn("added_by", lit("admin")) \
    .withColumn("modified_date", current_timestamp()) \
    .withColumn("modified_by", lit("admin")) \
    .withColumn("triger_status", lit(1)) \
    .withColumnRenamed("time","alert_datetime") \
    .withColumn("disaster_id_id", lit(1)) \
    .withColumn("alert_code", F.concat(F.lit("C-"), F.lit("RAIN-"), F.date_format(F.current_timestamp(), "yyyyMMddHHmm"), F.lit("-"), F.expr("substring(uuid(), 1, 8)"))) \
    .withColumn(
    "alert_type",
    when(col("rain") >= lit(rain_thresholds["hazard_rng_high"]), lit(1))
    .when(col("rain") >= lit(rain_thresholds["hazard_rng_medium"]), lit(2))
    .when(col("rain") >= lit(rain_thresholds["hazard_rng_low"]), lit(3))
    .otherwise(lit(4))
)

filtered_df = parsed_df.filter(
    (col("rain") >= lit(rain_thresholds["hazard_rng_low"])) |
    (col("precipitation") >= lit(precip_thresholds["hazard_rng_low"])) |
    (col("temperature_2m") >= lit(temp_thresholds["hazard_rng_low"]))
)

spark.catalog.refreshTable("raw_demo.raw_weather_alerts")
hive_table_name = "raw_demo.raw_weather_alerts"
spark.table("raw_demo.raw_weather_alerts").printSchema()

def write_to_both(batch_df, batch_id):
    # Write to Hive
    batch_df.write \
    .mode("append") \
    .format("hive") \
    .saveAsTable(hive_table_name)
    
    # Write to Postgres
    batch_df.write \
        .format("jdbc") \
        .option("url", postgres_url) \
        .option("dbtable", "public.admin_web_weather_alerts") \
        .option("user", postgres_user) \
        .option("password", postgres_pwd) \
        .option("driver", postgres_driver) \
        .mode("append") \
        .save()
    

query = filtered_df \
    .writeStream \
    .foreachBatch(write_to_both) \
    .outputMode("append") \
    .start()

query.awaitTermination()


