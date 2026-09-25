CREATE DATABASE IF NOT EXISTS uccis;

USE uccis;

CREATE TABLE signals (
id INT AUTO_INCREMENT PRIMARY KEY,
signal_type VARCHAR(100),
location_name VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry (
id INT AUTO_INCREMENT PRIMARY KEY,
signal_id INT,
telemetry_data TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incidents (
id INT AUTO_INCREMENT PRIMARY KEY,
signal_id INT,
incident_type VARCHAR(100),
severity VARCHAR(50),
status VARCHAR(50)
);

CREATE TABLE escalations (
id INT AUTO_INCREMENT PRIMARY KEY,
incident_id INT,
escalation_level VARCHAR(50),
assigned_to VARCHAR(100)
);

CREATE TABLE decisions (
id INT AUTO_INCREMENT PRIMARY KEY,
escalation_id INT,
decision_text TEXT
);

CREATE TABLE replay_records (
id INT AUTO_INCREMENT PRIMARY KEY,
incident_id INT,
replay_json JSON
);

CREATE TABLE runtime_logs (
id INT AUTO_INCREMENT PRIMARY KEY,
log_message TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);