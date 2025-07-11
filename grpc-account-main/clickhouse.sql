-- Drop existing tables
DROP TABLE IF EXISTS kafka_events;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS kafka_to_events;
DROP TABLE IF EXISTS applications;

-- Create the Kafka table
CREATE TABLE kafka_events
(
    id    String,
    appId String,
    type  String,
    data  String
) ENGINE = Kafka
      SETTINGS
          kafka_broker_list = 'kafka:29092',
          kafka_topic_list = 'events',
          kafka_group_name = 'clickhouse_events_consumer',
          kafka_format = 'JSONEachRow',
          kafka_num_consumers = 1,
          kafka_max_block_size = 1048576,
          kafka_poll_max_batch_size = 1000,
          kafka_handle_error_mode = 'stream';
-- This will help with debugging

-- Create the destination table
CREATE TABLE events
(
    id         String,
    appId      String,
    type       String,
    data       String,
    _timestamp DateTime DEFAULT now()
) ENGINE = MergeTree()
      ORDER BY (id, _timestamp);

-- Create materialized view
CREATE MATERIALIZED VIEW kafka_to_events
    TO events
AS
SELECT id,
       appId,
       type,
       data,
       now() as _timestamp
FROM kafka_events;

-- Create applications table with uniqueness on appId and slug
CREATE TABLE applications
(
    appId String,
    name String,
    slug String
) ENGINE = ReplacingMergeTree()
  PRIMARY KEY (appId)
  ORDER BY (appId, slug);

-- Sample query for Metabase that joins events with applications
SELECT 
    e.id,
    e.type,
    e.data,
    e._timestamp,
    a.name as app_name,
    a.slug as app_slug
FROM events e
LEFT JOIN applications a ON e.appId = a.appId
ORDER BY e._timestamp DESC
LIMIT 100;

-- Count the number of events
SELECT count(*)
FROM events;

-- Sample insert for applications table
INSERT INTO applications (appId, name, slug) VALUES
('app1', 'First Application', 'first-app'),
('app2', 'Second Application', 'second-app'),
('app3', 'Third Application', 'third-app');

-- Query to show how many events each application has sent
SELECT
    a.name AS application_name,
    a.slug AS application_slug,
    a.appId,
    COUNT(e.id) AS event_count
FROM applications a
LEFT JOIN events e ON a.appId = e.appId
GROUP BY a.appId, a.name, a.slug
ORDER BY event_count DESC;

-- Alternative query with all apps that have sent events
SELECT
    e.appId,
    a.name AS application_name,
    COUNT(e.id) AS event_count,
    MIN(e._timestamp) AS first_event,
    MAX(e._timestamp) AS last_event
FROM events e
LEFT JOIN applications a ON e.appId = a.appId
GROUP BY e.appId, a.name
ORDER BY event_count DESC;