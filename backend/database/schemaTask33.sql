CREATE DATABASE IF NOT EXISTS uccis_run;

USE uccis_run;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS runtime_health;
DROP TABLE IF EXISTS runtime_audit;
DROP TABLE IF EXISTS runtime_evidence;
DROP TABLE IF EXISTS replay_events;
DROP TABLE IF EXISTS escalations;
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS telemetry;
DROP TABLE IF EXISTS signals;

SET FOREIGN_KEY_CHECKS = 1;

/* SIGNALS */

CREATE TABLE signals (
signal_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100) NOT NULL UNIQUE,
signal_type VARCHAR(100) NOT NULL,
source_system VARCHAR(100),
severity VARCHAR(50) DEFAULT 'LOW',
status VARCHAR(50) DEFAULT 'ACTIVE',
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* TELEMETRY */

CREATE TABLE telemetry (
telemetry_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100) NOT NULL,
metric_name VARCHAR(100),
metric_value VARCHAR(255),
status VARCHAR(50) DEFAULT 'ACTIVE',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* INCIDENTS */

CREATE TABLE incidents (
incident_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100) NOT NULL,
incident_type VARCHAR(100),
severity VARCHAR(50),
status VARCHAR(50) DEFAULT 'OPEN',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* ESCALATIONS */

CREATE TABLE escalations (
escalation_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100) NOT NULL,
escalation_level VARCHAR(50),
status VARCHAR(50) DEFAULT 'ACTIVE',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* REPLAY EVENTS */

CREATE TABLE replay_events (
replay_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100) NOT NULL,
replay_status VARCHAR(50) DEFAULT 'READY',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* RUNTIME EVIDENCE */

CREATE TABLE runtime_evidence (
evidence_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100) NOT NULL,
origin VARCHAR(255),
payload LONGTEXT,
status VARCHAR(50) DEFAULT 'ACTIVE',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* RUNTIME AUDIT */

CREATE TABLE runtime_audit (
audit_id INT AUTO_INCREMENT PRIMARY KEY,
trace_id VARCHAR(100),
endpoint VARCHAR(255),
method VARCHAR(20),
status_code INT,
response_time BIGINT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* RUNTIME HEALTH */

CREATE TABLE runtime_health (
health_id INT AUTO_INCREMENT PRIMARY KEY,
backend_status VARCHAR(50),
database_status VARCHAR(50),
signal_count INT DEFAULT 0,
incident_count INT DEFAULT 0,
replay_count INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =====================================================
   SAMPLE SIGNALS (8)
===================================================== */

INSERT INTO signals
(trace_id, signal_type, source_system, severity, status, description)
VALUES
('TRACE-001','FLOOD','SENSOR','HIGH','ACTIVE','Flood detected'),
('TRACE-002','CYCLONE','WEATHER_ENGINE','CRITICAL','ACTIVE','Cyclone alert'),
('TRACE-003','NETWORK_FAILURE','NOC','MEDIUM','ACTIVE','Network outage detected'),
('TRACE-004','SERVER_OVERLOAD','DATACENTER','HIGH','ACTIVE','CPU utilization exceeded threshold'),
('TRACE-005','EARTHQUAKE','SENSOR','HIGH','ACTIVE','Earthquake detected'),
('TRACE-006','POWER_FAILURE','GRID','MEDIUM','ACTIVE','Power failure detected'),
('TRACE-007','LANDSLIDE','SENSOR','HIGH','ACTIVE','Landslide detected'),
('TRACE-008','FIRE_ALERT','FIRE_SYSTEM','CRITICAL','ACTIVE','Fire alert detected');

/* =====================================================
   SAMPLE TELEMETRY (6)
===================================================== */

INSERT INTO telemetry
(trace_id, metric_name, metric_value, status)
VALUES
('TRACE-001','Water Level','12m','ACTIVE'),
('TRACE-002','Wind Speed','180km/h','ACTIVE'),
('TRACE-003','Packet Loss','35%','ACTIVE'),
('TRACE-004','CPU Usage','98%','ACTIVE'),
('TRACE-005','Magnitude','6.5','ACTIVE'),
('TRACE-006','Voltage','0','ACTIVE');

/* =====================================================
   SAMPLE INCIDENTS (5)
===================================================== */

INSERT INTO incidents
(trace_id, incident_type, severity, status)
VALUES
('TRACE-001','FLOOD_INCIDENT','HIGH','OPEN'),
('TRACE-002','CYCLONE_INCIDENT','CRITICAL','OPEN'),
('TRACE-003','NETWORK_INCIDENT','MEDIUM','OPEN'),
('TRACE-004','SERVER_INCIDENT','HIGH','OPEN'),
('TRACE-005','EARTHQUAKE_INCIDENT','HIGH','OPEN');

/* =====================================================
   SAMPLE ESCALATIONS (3)
===================================================== */

INSERT INTO escalations
(trace_id, escalation_level, status)
VALUES
('TRACE-001','LEVEL_2','ACTIVE'),
('TRACE-002','LEVEL_3','ACTIVE'),
('TRACE-004','LEVEL_2','ACTIVE');

/* =====================================================
   SAMPLE REPLAY EVENTS (7)
===================================================== */

INSERT INTO replay_events
(trace_id, replay_status)
VALUES
('TRACE-001','READY'),
('TRACE-002','EXECUTED'),
('TRACE-003','READY'),
('TRACE-004','EXECUTED'),
('TRACE-005','READY'),
('TRACE-006','EXECUTED'),
('TRACE-007','READY');

/* =====================================================
   SAMPLE EVIDENCE (9)
===================================================== */

INSERT INTO runtime_evidence
(trace_id, origin, payload, status)
VALUES
('TRACE-001','Flood Scenario','{"waterLevel":"12m"}','ACTIVE'),
('TRACE-002','Cyclone Scenario','{"windSpeed":"180km/h"}','ACTIVE'),
('TRACE-003','Network Scenario','{"packetLoss":"35%"}','ACTIVE'),
('TRACE-004','Server Scenario','{"cpuUsage":"98%"}','ACTIVE'),
('TRACE-005','Earthquake Scenario','{"magnitude":"6.5"}','ACTIVE'),
('TRACE-006','Power Failure Scenario','{"voltage":"0"}','ACTIVE'),
('TRACE-007','Landslide Scenario','{"risk":"HIGH"}','ACTIVE'),
('TRACE-008','Fire Scenario','{"temperature":"450"}','ACTIVE'),
('TRACE-001','Verification Evidence','{"status":"PASSED"}','ACTIVE');

/* =====================================================
   INITIAL HEALTH
===================================================== */

INSERT INTO runtime_health
(
backend_status,
database_status,
signal_count,
incident_count,
replay_count
)
VALUES
(
'UP',
'CONNECTED',
8,
5,
7
);