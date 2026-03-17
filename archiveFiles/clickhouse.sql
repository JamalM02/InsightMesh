-- =============================================
-- InsightMesh ClickHouse Setup
-- Run: docker exec -i insightmesh-clickhouse clickhouse-client --multiquery < archiveFiles/clickhouse.sql
-- =============================================

-- Drop existing tables (safe for fresh setup)
DROP TABLE IF EXISTS kafka_to_events;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS kafka_events;
DROP TABLE IF EXISTS applications;

-- 1. Kafka engine table — reads events from Kafka topic
CREATE TABLE kafka_events
(
    id    String,
    appId String,
    type  String,
    data  String
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'events',
    kafka_group_name = 'clickhouse_events_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1,
    kafka_max_block_size = 1048576,
    kafka_poll_max_batch_size = 1000,
    kafka_handle_error_mode = 'stream';

-- 2. Final storage table — permanent event storage
CREATE TABLE events
(
    id         String,
    appId      String,
    type       String,
    data       String,
    _timestamp DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (id, _timestamp);

-- 3. Materialized view — auto-pipes Kafka data into events table
CREATE MATERIALIZED VIEW kafka_to_events
TO events
AS
SELECT id, appId, type, data, now() AS _timestamp
FROM kafka_events;

-- 4. Applications metadata table — for Metabase dashboard joins
CREATE TABLE applications
(
    appId String,
    name  String,
    slug  String
) ENGINE = ReplacingMergeTree()
PRIMARY KEY (appId)
ORDER BY (appId, slug);
