CREATE DATABASE IF NOT EXISTS uccis_runtime;

USE uccis_runtime;

CREATE TABLE signals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    signal_id VARCHAR(100),
    trace_id VARCHAR(100),
    signal_type VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telemetry_id VARCHAR(100),
    trace_id VARCHAR(100),
    signal_id VARCHAR(100),
    payload JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id VARCHAR(100),
    trace_id VARCHAR(100),
    telemetry_id VARCHAR(100),
    severity VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE escalations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escalation_id VARCHAR(100),
    trace_id VARCHAR(100),
    incident_id VARCHAR(100),
    level VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE runtime_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trace_id VARCHAR(100),
    event_type VARCHAR(100),
    event_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE replay_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trace_id VARCHAR(100),
    replay_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SAMPLE SIGNALS (10)
-- =====================================================

INSERT INTO signals (signal_id, trace_id, signal_type, status) VALUES
('SIG001','TR001','Flood','OPEN'),
('SIG002','TR002','Traffic','OPEN'),
('SIG003','TR003','Medical','OPEN'),
('SIG004','TR004','Fire','OPEN'),
('SIG005','TR005','Flood','OPEN'),
('SIG006','TR006','Traffic','OPEN'),
('SIG007','TR007','Medical','OPEN'),
('SIG008','TR008','Fire','OPEN'),
('SIG009','TR009','Flood','OPEN'),
('SIG010','TR010','Traffic','OPEN');

-- =====================================================
-- SAMPLE TELEMETRY (10)
-- =====================================================

INSERT INTO telemetry (telemetry_id, trace_id, signal_id, payload) VALUES
('TEL001','TR001','SIG001','{}'),
('TEL002','TR002','SIG002','{}'),
('TEL003','TR003','SIG003','{}'),
('TEL004','TR004','SIG004','{}'),
('TEL005','TR005','SIG005','{}'),
('TEL006','TR006','SIG006','{}'),
('TEL007','TR007','SIG007','{}'),
('TEL008','TR008','SIG008','{}'),
('TEL009','TR009','SIG009','{}'),
('TEL010','TR010','SIG010','{}');

-- =====================================================
-- SAMPLE INCIDENTS (10)
-- =====================================================

INSERT INTO incidents (incident_id, trace_id, telemetry_id, severity, status) VALUES
('INC001','TR001','TEL001','HIGH','OPEN'),
('INC002','TR002','TEL002','HIGH','OPEN'),
('INC003','TR003','TEL003','MEDIUM','OPEN'),
('INC004','TR004','TEL004','LOW','OPEN'),
('INC005','TR005','TEL005','HIGH','OPEN'),
('INC006','TR006','TEL006','LOW','OPEN'),
('INC007','TR007','TEL007','MEDIUM','OPEN'),
('INC008','TR008','TEL008','LOW','OPEN'),
('INC009','TR009','TEL009','HIGH','OPEN'),
('INC010','TR010','TEL010','LOW','OPEN');

-- =====================================================
-- SAMPLE ESCALATIONS (10)
-- =====================================================

INSERT INTO escalations (escalation_id, trace_id, incident_id, level, status) VALUES
('ESC001','TR001','INC001','L1','OPEN'),
('ESC002','TR002','INC002','L1','OPEN'),
('ESC003','TR003','INC003','L2','OPEN'),
('ESC004','TR004','INC004','L1','OPEN'),
('ESC005','TR005','INC005','L3','OPEN'),
('ESC006','TR006','INC006','L1','OPEN'),
('ESC007','TR007','INC007','L2','OPEN'),
('ESC008','TR008','INC008','L1','OPEN'),
('ESC009','TR009','INC009','L2','OPEN'),
('ESC010','TR010','INC010','L3','OPEN');

-- =====================================================
-- SAMPLE RUNTIME LOGS
-- =====================================================

INSERT INTO runtime_logs (trace_id, event_type, event_message) VALUES
('TR001','EXECUTION','Signal Executed'),
('TR002','EXECUTION','Telemetry Processed'),
('TR003','EXECUTION','Incident Generated'),
('TR004','EXECUTION','Escalation Created'),
('TR005','EXECUTION','Replay Completed');

-- =====================================================
-- SAMPLE REPLAY SESSIONS
-- =====================================================

INSERT INTO replay_sessions (trace_id, replay_data) VALUES
('TR001','{}'),
('TR002','{}'),
('TR003','{}');