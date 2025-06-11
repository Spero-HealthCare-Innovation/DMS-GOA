from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import os, json
from datetime import datetime, timedelta
import logging

# ---------------------- Logging Setup ----------------------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# ---------------------- Spark Session ----------------------
spark = SparkSession.builder \
    .appName("Weather Alerts Merge") \
    .master("yarn") \
    .enableHiveSupport() \
    .config("spark.sql.catalogImplementation", "hive") \
    .config("hive.exec.dynamic.partition.mode", "nonstrict") \
    .config("hive.support.concurrency", "true") \
    .config("hive.txn.manager", "org.apache.hadoop.hive.ql.lockmgr.DbTxnManager") \
    .config("hive.enforce.bucketing", "true") \
    .config("spark.sql.sources.partitionOverwriteMode", "dynamic") \
    .config("spark.sql.orc.impl", "native") \
    .config("spark.sql.hive.convertMetastoreOrc", "false") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://10.108.1.41:9000") \
    .config("spark.hadoop.hive.metastore.uris", "thrift://localhost:9083") \
    .config("spark.hadoop.hive.metastore.warehouse.dir", "/user/hive/warehouse") \
    .config("spark.sql.warehouse.dir", "/user/hive/warehouse") \
    .config("spark.sql.parquet.int96RebaseModeInWrite", "LEGACY") \
    .config("spark.sql.parquet.datetimeRebaseModeInWrite", "LEGACY") \
    .getOrCreate()

# ---------------------- Constants ----------------------
TABLE_NAME = "processed_dms.weather_alerts"
SOURCE_TABLE = "admin_web_weather_alerts"
MERGE_KEYS = ["pk_id"]
MERGE_COLUMNS = [
    "pk_id", "latitude", "longitude", "elevation",
    "timezone", "timezone_abbreviation", "utc_offset_seconds",
    "alert_datetime", "temperature_2m", "rain",
    "precipitation", "weather_code", "added_by", "added_date",
    "modified_by", "modified_date", "triger_status",
    "alert_code", "disaster_id_id", "alert_type"
]

CHECKPOINT_DIR = "/tmp/spark_streaming_weather_alerts"
CHECKPOINT_FILE = "/tmp/last_modified_checkpoint.txt"
CHECKPOINT_ID_FILE = "/tmp/last_seen_pk_id.txt"

# ---------------------- Load DB Config ----------------------
with open(os.environ["DB_CONFIG_PATH_POSTGRES"]) as f:
    postgres_config = json.load(f)

postgres_url = postgres_config["url_dms"]
postgres_user = postgres_config["user"]
postgres_pwd = postgres_config["password"]
postgres_driver = "org.postgresql.Driver"

# ---------------------- Utility Functions ----------------------
def get_last_checkpoint():
    try:
        ts = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        pk_id = "0"
        if os.path.exists(CHECKPOINT_FILE):
            with open(CHECKPOINT_FILE, 'r') as f:
                ts = f.read().strip()
        if os.path.exists(CHECKPOINT_ID_FILE):
            with open(CHECKPOINT_ID_FILE, 'r') as f:
                pk_id = f.read().strip()
        return ts, pk_id
    except Exception:
        return "1900-01-01 00:00:00", "0"

def save_checkpoint(ts, pk_id):
    with open(CHECKPOINT_FILE, 'w') as f:
        f.write(ts)
    with open(CHECKPOINT_ID_FILE, 'w') as f:
        f.write(str(pk_id))

def read_postgres_delta(spark, last_ts, last_id):
    query = f"""
        (SELECT * FROM {SOURCE_TABLE}
         WHERE added_date > '{last_ts}'
         OR (added_date = '{last_ts}' AND pk_id > {last_id})) AS temp
    """
    return spark.read.format("jdbc") \
        .option("url", postgres_url) \
        .option("user", postgres_user) \
        .option("password", postgres_pwd) \
        .option("driver", postgres_driver) \
        .option("dbtable", query) \
        .load()

# Optional if you ever enable Hive ACID MERGE
def merge_into_hive(delta_df):
    delta_df.createOrReplaceTempView("delta_data")
    on_clause = " AND ".join([f"target.{key} = source.{key}" for key in MERGE_KEYS])
    update_clause = ", ".join([f"target.{col} = source.{col}" for col in MERGE_COLUMNS])
    insert_clause = ", ".join(MERGE_COLUMNS)
    values_clause = ", ".join([f"source.{col}" for col in MERGE_COLUMNS])
    merge_sql = f"""
        MERGE INTO {TABLE_NAME} AS target
        USING delta_data AS source
        ON {on_clause}
        WHEN MATCHED THEN UPDATE SET {update_clause}
        WHEN NOT MATCHED THEN INSERT ({insert_clause}) VALUES ({values_clause})
    """
    print("=== MERGE SQL ===")
    print(merge_sql)
    spark.sql(merge_sql)

# ---------------------- Batch Processing ----------------------
STAGING_TABLE_NAME = "processed_dms.weather_alerts_stage"

def process_batch(df, epoch_id):
    try:
        print("Batch started at (UTC):", datetime.utcnow())
        last_ts, last_id = get_last_checkpoint()
        logging.info(f"Fetching records modified after: {last_ts} and pk_id > {last_id}")
        delta_df = read_postgres_delta(spark, last_ts, last_id)
        delta_df.printSchema()

        count = delta_df.count()
        if count > 0:
            delta_df.show(truncate=False)
            max_row = delta_df.orderBy(col("added_date").desc(), col("pk_id").desc()).first()
            max_modified = max_row["added_date"]
            max_pk_id = max_row["pk_id"]

            # Load existing Hive data
            existing_df = spark.table(TABLE_NAME)

            # Filter out rows being updated
            filtered_existing_df = existing_df.join(delta_df.select("pk_id"), "pk_id", "left_anti")

            # Merge updated + new + untouched rows
            combined_df = filtered_existing_df.unionByName(delta_df)

            # Write to staging table (overwrite)
            combined_df.write.mode("overwrite").saveAsTable(STAGING_TABLE_NAME)

            # Overwrite final table via Spark SQL
            spark.sql(f"""
                INSERT OVERWRITE TABLE {TABLE_NAME}
                SELECT * FROM {STAGING_TABLE_NAME}
            """)

            save_checkpoint(max_modified.strftime("%Y-%m-%d %H:%M:%S"), max_pk_id)

            logging.info(f"Synced {count} records. Last modified: {max_modified}, Last pk_id: {max_pk_id}")
        else:
            logging.info("No new or updated records.")

    except Exception as e:
        import traceback
        traceback.print_exc()
        logging.error(f"Error in process_batch: {str(e)}")
        raise

    # After writing to staging table
    combined_df.write.mode("overwrite").saveAsTable("processed_dms.weather_alerts_stage")

    # Now safely overwrite the final table from staging
    spark.sql("""
        INSERT OVERWRITE TABLE processed_dms.weather_alerts
        SELECT * FROM processed_dms.weather_alerts_stage
    """)

# ---------------------- Trigger Dummy Stream ----------------------
rate_df = spark.readStream \
    .format("rate") \
    .option("rowsPerSecond", 1) \
    .load()

query = rate_df.writeStream \
    .foreachBatch(process_batch) \
    .outputMode("append") \
    .trigger(processingTime="60 seconds") \
    .option("checkpointLocation", CHECKPOINT_DIR) \
    .start()

query.awaitTermination()
