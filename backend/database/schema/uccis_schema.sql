DROP DATABASE IF EXISTS uccis;
CREATE DATABASE uccis;

USE uccis;

-- =====================================================
-- DEPARTMENTS
-- =====================================================

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(30) UNIQUE NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    department_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- OPERATORS
-- =====================================================

CREATE TABLE operators (
    operator_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,

    operator_code VARCHAR(30) UNIQUE NOT NULL,
    operator_name VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE,
    phone VARCHAR(30),

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_operator_department
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- =====================================================
-- LOCATIONS
-- =====================================================

CREATE TABLE locations (

    location_id INT AUTO_INCREMENT PRIMARY KEY,

    location_code VARCHAR(30) UNIQUE NOT NULL,
    location_name VARCHAR(150) NOT NULL,

    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),

    city VARCHAR(100),
    state_name VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SIGNALS
-- =====================================================

CREATE TABLE signals (

    signal_id INT AUTO_INCREMENT PRIMARY KEY,

    location_id INT NOT NULL,

    signal_code VARCHAR(30) UNIQUE NOT NULL,

    signal_type VARCHAR(100) NOT NULL,

    severity ENUM(
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL'
    ) NOT NULL,

    status ENUM(
      'ACTIVE',
      'PROCESSED',
      'CLOSED'
    ) DEFAULT 'ACTIVE',

    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_signal_location
    FOREIGN KEY(location_id)
    REFERENCES locations(location_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- =====================================================
-- TELEMETRY EVENTS
-- =====================================================

CREATE TABLE telemetry_events (

    telemetry_id INT AUTO_INCREMENT PRIMARY KEY,

    signal_id INT NOT NULL,

    telemetry_source VARCHAR(100),

    telemetry_data JSON,

    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_telemetry_signal
    FOREIGN KEY(signal_id)
    REFERENCES signals(signal_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- INCIDENTS
-- =====================================================

CREATE TABLE incidents (

    incident_id INT AUTO_INCREMENT PRIMARY KEY,

    telemetry_id INT NOT NULL,

    incident_code VARCHAR(30) UNIQUE NOT NULL,

    incident_type VARCHAR(100),

    severity ENUM(
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL'
    ),

    status ENUM(
      'OPEN',
      'INVESTIGATING',
      'RESOLVED'
    ) DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_incident_telemetry
    FOREIGN KEY(telemetry_id)
    REFERENCES telemetry_events(telemetry_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- ESCALATIONS
-- =====================================================

CREATE TABLE escalations (

    escalation_id INT AUTO_INCREMENT PRIMARY KEY,

    incident_id INT NOT NULL,

    escalation_code VARCHAR(30) UNIQUE NOT NULL,

    escalation_level VARCHAR(50),

    assigned_team VARCHAR(150),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_escalation_incident
    FOREIGN KEY(incident_id)
    REFERENCES incidents(incident_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- DECISIONS
-- =====================================================

CREATE TABLE decisions (

    decision_id INT AUTO_INCREMENT PRIMARY KEY,

    escalation_id INT NOT NULL,

    decision_code VARCHAR(30) UNIQUE NOT NULL,

    decision_text TEXT,

    decision_owner VARCHAR(150),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_decision_escalation
    FOREIGN KEY(escalation_id)
    REFERENCES escalations(escalation_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- APPROVALS
-- =====================================================

CREATE TABLE approvals (

    approval_id INT AUTO_INCREMENT PRIMARY KEY,

    decision_id INT NOT NULL,

    approval_code VARCHAR(30) UNIQUE NOT NULL,

    approved_by VARCHAR(150),

    approval_status ENUM(
      'PENDING',
      'APPROVED',
      'REJECTED'
    ) DEFAULT 'PENDING',

    approved_at TIMESTAMP NULL,

    CONSTRAINT fk_approval_decision
    FOREIGN KEY(decision_id)
    REFERENCES decisions(decision_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- REPLAY SESSIONS
-- =====================================================

CREATE TABLE replay_sessions (

    replay_id INT AUTO_INCREMENT PRIMARY KEY,

    approval_id INT NOT NULL,

    replay_code VARCHAR(30) UNIQUE NOT NULL,

    replay_json JSON,

    replay_status VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_replay_approval
    FOREIGN KEY(approval_id)
    REFERENCES approvals(approval_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- RUNTIME LOGS
-- =====================================================

CREATE TABLE runtime_logs (

    log_id INT AUTO_INCREMENT PRIMARY KEY,

    replay_id INT NOT NULL,

    log_level ENUM(
      'INFO',
      'WARNING',
      'ERROR'
    ) DEFAULT 'INFO',

    log_message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_runtime_replay
    FOREIGN KEY(replay_id)
    REFERENCES replay_sessions(replay_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_operator_department
ON operators(department_id);

CREATE INDEX idx_signal_location
ON signals(location_id);

CREATE INDEX idx_telemetry_signal
ON telemetry_events(signal_id);

CREATE INDEX idx_incident_telemetry
ON incidents(telemetry_id);

CREATE INDEX idx_escalation_incident
ON escalations(incident_id);

CREATE INDEX idx_decision_escalation
ON decisions(escalation_id);

CREATE INDEX idx_approval_decision
ON approvals(decision_id);

CREATE INDEX idx_replay_approval
ON replay_sessions(approval_id);

CREATE INDEX idx_runtime_replay
ON runtime_logs(replay_id);

-- =====================================================
-- RELATIONSHIP TEST QUERY
-- =====================================================

/*
Signal
→ Telemetry
→ Incident
→ Escalation
→ Decision
→ Approval
→ Replay
→ Runtime Log
*/

SELECT
s.signal_code,
t.telemetry_id,
i.incident_code,
e.escalation_code,
d.decision_code,
a.approval_code,
r.replay_code,
l.log_id
FROM signals s
JOIN telemetry_events t
ON s.signal_id=t.signal_id
JOIN incidents i
ON t.telemetry_id=i.telemetry_id
JOIN escalations e
ON i.incident_id=e.incident_id
JOIN decisions d
ON e.escalation_id=d.escalation_id
JOIN approvals a
ON d.decision_id=a.decision_id
JOIN replay_sessions r
ON a.approval_id=r.approval_id
JOIN runtime_logs l
ON r.replay_id=l.replay_id;