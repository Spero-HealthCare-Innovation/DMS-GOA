from pyspark.sql import SparkSession
from pyspark.sql.functions import col
import os, json
from datetime import datetime, timedelta
import logging

# ---------------------- Logging Setup ----------------------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# ---------------------- Spark Session ----------------------
spark = SparkSession.builder \
    .appName("Realtime Closure Report Join") \
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
TABLE_NAME = "reports.final_closure_report"
STAGING_TABLE_NAME = "reports.closure_report_stage"
CHECKPOINT_DIR = "/tmp/spark_streaming_closure_report"

# Incident Checkpoints
INC_CHECKPOINT_FILE = "/tmp/last_incident_modified.txt"
INC_CHECKPOINT_ID_FILE = "/tmp/last_incident_id.txt"

# Closure Checkpoints
CLOSURE_CHECKPOINT_FILE = "/tmp/last_closure_modified.txt"
CLOSURE_CHECKPOINT_ID_FILE = "/tmp/last_closure_id.txt"

MERGE_COLUMNS = [
    "inc_id", "incident_id", "responder_scope", "inc_is_deleted",
    "inc_added_by", "inc_added_date", "inc_modified_by", "inc_modified_date",
    "alert_id_id", "alert_type", "disaster_type_id", "inc_type", "latitude",
    "location", "longitude", "caller_id_id", "alert_code", "inc_datetime",
    "summary", "comment_id_id", "summary_id", "alert_division", "notify_id_id",
    "mode", "time", "closure_inc_id", "disaster_id", "disaster_is_deleted", "disaster_added_date","disaster_added_by", "disaster_modified_by", "disaster_modified_date", 
    "closure_id", "closure_acknowledge", "closure_start_base_location",
    "closure_at_scene", "closure_from_scene", "closure_back_to_base",
    "closure_is_deleted", "closure_added_by", "closure_added_date",
    "closure_modified_by", "closure_modified_date", "closure_remark", "image",
    "disaster_name", "disaster_rng_high", "disaster_rng_medium", "disaster_rng_low", "clouser_status", "incident_id_id"
]

# ---------------------- Load DB Config ----------------------
with open(os.environ["DB_CONFIG_PATH_POSTGRES"]) as f:
    postgres_config = json.load(f)

postgres_url = postgres_config["url_dms"]
postgres_user = postgres_config["user"]
postgres_pwd = postgres_config["password"]
postgres_driver = "org.postgresql.Driver"

# ---------------------- Checkpoint Utilities ----------------------
def get_checkpoint(ts_file, id_file):
    ts = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
    inc_id = "0"
    if os.path.exists(ts_file):
        with open(ts_file, 'r') as f:
            ts = f.read().strip()
    if os.path.exists(id_file):
        with open(id_file, 'r') as f:
            inc_id = f.read().strip()
    return ts, inc_id

def save_checkpoint(ts_file, id_file, ts, inc_id):
    with open(ts_file, 'w') as f:
        f.write(ts)
    with open(id_file, 'w') as f:
        f.write(str(inc_id))

# ---------------------- Delta Readers ----------------------
def read_incident_delta(spark, last_ts, last_id):
    query = f"""
        (SELECT * FROM admin_web_dms_incident
         WHERE inc_modified_date > '{last_ts}'
         OR (inc_modified_date = '{last_ts}' AND inc_id > {last_id})) AS temp
    """
    return spark.read.format("jdbc") \
        .option("url", postgres_url) \
        .option("user", postgres_user) \
        .option("password", postgres_pwd) \
        .option("driver", postgres_driver) \
        .option("dbtable", query) \
        .load()

def read_closure_delta(spark, last_ts, last_id):
    query = f"""
        (SELECT * FROM admin_web_dms_incident_closure
         WHERE closure_modified_date > '{last_ts}'
         OR (closure_modified_date = '{last_ts}' AND closure_id > {last_id})) AS temp
    """
    return spark.read.format("jdbc") \
        .option("url", postgres_url) \
        .option("user", postgres_user) \
        .option("password", postgres_pwd) \
        .option("driver", postgres_driver) \
        .option("dbtable", query) \
        .load()

# ---------------------- Batch Processor ----------------------
def process_batch(df, epoch_id):
    try:
        print("Batch started at (UTC):", datetime.utcnow())

        # Load checkpoints
        last_inc_ts, last_inc_id = get_checkpoint(INC_CHECKPOINT_FILE, INC_CHECKPOINT_ID_FILE)
        last_closure_ts, last_closure_id = get_checkpoint(CLOSURE_CHECKPOINT_FILE, CLOSURE_CHECKPOINT_ID_FILE)

        logging.info(f"Fetching incidents modified after: {last_inc_ts} and inc_id > {last_inc_id}")
        logging.info(f"Fetching closures modified after: {last_closure_ts} and closure_id > {last_closure_id}")

        # Load deltas
        df_incident = read_incident_delta(spark, last_inc_ts, last_inc_id)
        df_closure = read_closure_delta(spark, last_closure_ts, last_closure_id)

        if df_incident.count() == 0 and df_closure.count() == 0:
            logging.info("No new or updated incident or closure records.")
            return

        df_disaster = spark.read.format("jdbc") \
            .option("url", postgres_url) \
            .option("dbtable", "admin_web_dms_disaster_type") \
            .option("user", postgres_user) \
            .option("password", postgres_pwd) \
            .option("driver", postgres_driver) \
            .load()

        # Join all
        res_df = df_incident \
            .join(df_closure, df_closure.incident_id_id == df_incident.inc_id, "left") \
            .join(df_disaster, df_incident.disaster_type_id == df_disaster.disaster_id, "left") \
            .select(*MERGE_COLUMNS)

        # Final delta max IDs and timestamps
        max_inc = df_incident.orderBy(col("inc_modified_date").desc(), col("inc_id").desc()).first()
        max_closure = df_closure.orderBy(col("closure_modified_date").desc(), col("closure_id").desc()).first()

        max_inc_ts = max_inc["inc_modified_date"] if max_inc else last_inc_ts
        max_inc_id = max_inc["inc_id"] if max_inc else last_inc_id

        max_closure_ts = max_closure["closure_modified_date"] if max_closure else last_closure_ts
        max_closure_id = max_closure["closure_id"] if max_closure else last_closure_id

        # Merge with existing
        existing_df = spark.table(TABLE_NAME)
        filtered_existing_df = existing_df.join(res_df.select("inc_id").distinct(), "inc_id", "left_anti")
        combined_df = filtered_existing_df.unionByName(res_df)

        combined_df.write.mode("overwrite").saveAsTable(STAGING_TABLE_NAME)
        spark.sql(f"INSERT OVERWRITE TABLE {TABLE_NAME} SELECT * FROM {STAGING_TABLE_NAME}")

        # Save checkpoints
        save_checkpoint(INC_CHECKPOINT_FILE, INC_CHECKPOINT_ID_FILE, max_inc_ts.strftime("%Y-%m-%d %H:%M:%S"), max_inc_id)
        save_checkpoint(CLOSURE_CHECKPOINT_FILE, CLOSURE_CHECKPOINT_ID_FILE, max_closure_ts.strftime("%Y-%m-%d %H:%M:%S"), max_closure_id)

        logging.info(f"Synced {res_df.count()} records. Last inc_id: {max_inc_id}, closure_id: {max_closure_id}")

    except Exception as e:
        import traceback
        traceback.print_exc()
        logging.error(f"Error in process_batch: {str(e)}")

# ---------------------- Trigger Stream ----------------------
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
