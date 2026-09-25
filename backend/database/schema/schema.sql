CREATE DATABASE IF NOT EXISTS uccis;

USE uccis;

CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100)
);

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE operators (
    operator_id INT AUTO_INCREMENT PRIMARY KEY,
    operator_name VARCHAR(100),
    department_id INT
);

CREATE TABLE signals (
    signal_id INT AUTO_INCREMENT PRIMARY KEY,
    signal_type VARCHAR(100),
    location_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry_events (
    telemetry_id INT AUTO_INCREMENT PRIMARY KEY,
    signal_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incidents (
    incident_id INT AUTO_INCREMENT PRIMARY KEY,
    signal_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE escalations (
    escalation_id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decisions (
    decision_id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    decision_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE replay_sessions (
    replay_id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE runtime_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);