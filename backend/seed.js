const db = require("./config/sqlite");

console.log("Starting UCCIS Database Seeding...");

/* SIGNALS */

db.run(`
INSERT INTO signals
(signal_type,ward,severity,payload)
VALUES
(
'WasteOverflow',
'Ward-01',
'HIGH',
'{"fillLevel":96,"sensorId":"BIN-101"}'
)
`);

db.run(`
INSERT INTO signals
(signal_type,ward,severity,payload)
VALUES
(
'TrafficCongestion',
'Ward-07',
'CRITICAL',
'{"density":99,"junction":"MG Road"}'
)
`);

db.run(`
INSERT INTO signals
(signal_type,ward,severity,payload)
VALUES
(
'WaterLeakage',
'Ward-04',
'MEDIUM',
'{"pressure":35}'
)
`);

/* TELEMETRY */

db.run(`
INSERT INTO telemetry_events
(signal_id,event_type,status)
VALUES
(1,'SIGNAL_RECEIVED','SUCCESS')
`);

db.run(`
INSERT INTO telemetry_events
(signal_id,event_type,status)
VALUES
(2,'SIGNAL_RECEIVED','SUCCESS')
`);

db.run(`
INSERT INTO telemetry_events
(signal_id,event_type,status)
VALUES
(3,'SIGNAL_RECEIVED','SUCCESS')
`);

/* INCIDENTS */

db.run(`
INSERT INTO incidents
(title,description,severity,status)
VALUES
(
'Waste Bin Overflow',
'Overflow detected in Ward-01',
'HIGH',
'OPEN'
)
`);

db.run(`
INSERT INTO incidents
(title,description,severity,status)
VALUES
(
'Traffic Congestion',
'Heavy congestion detected',
'CRITICAL',
'OPEN'
)
`);

/* ESCALATIONS */

db.run(`
INSERT INTO escalations
(
incident_id,
escalation_level,
escalated_to,
status
)
VALUES
(
1,
'HIGH',
'Supervisor',
'ACTIVE'
)
`);

db.run(`
INSERT INTO escalations
(
incident_id,
escalation_level,
escalated_to,
status
)
VALUES
(
2,
'CRITICAL',
'Principal Secretary',
'ACTIVE'
)
`);

/* OPERATORS */

db.run(`
INSERT INTO operators
(name,department,role)
VALUES
(
'Madhumati',
'UCCIS',
'Primary Builder'
)
`);

db.run(`
INSERT INTO operators
(name,department,role)
VALUES
(
'Ankita',
'Master DB',
'Database Lead'
)
`);

db.run(`
INSERT INTO operators
(name,department,role)
VALUES
(
'Nupur',
'MDU',
'Data Supervisor'
)
`);

db.run(`
INSERT INTO operators
(name,department,role)
VALUES
(
'Soham',
'Runtime',
'Integration Lead'
)
`);

/* REPLAY */

db.run(`
INSERT INTO replay_sessions
(
session_name,
start_time,
end_time
)
VALUES
(
'Replay-101',
'2026-06-02 10:00:00',
'2026-06-02 10:10:00'
)
`);

db.run(`
INSERT INTO replay_sessions
(
session_name,
start_time,
end_time
)
VALUES
(
'Replay-102',
'2026-06-02 10:15:00',
'2026-06-02 10:25:00'
)
`);

/* LOGS */

db.run(`
INSERT INTO runtime_logs
(source,message)
VALUES
(
'backend',
'Signal stored successfully'
)
`);

db.run(`
INSERT INTO runtime_logs
(source,message)
VALUES
(
'telemetry',
'Telemetry event generated'
)
`);

db.run(`
INSERT INTO runtime_logs
(source,message)
VALUES
(
'escalation',
'Escalation created'
)
`);

db.run(`
INSERT INTO runtime_logs
(source,message)
VALUES
(
'replay',
'Replay session created'
)
`);

/* DECISIONS */

db.run(`
INSERT INTO decisions
(
incident_id,
decision_text
)
VALUES
(
1,
'Dispatch waste management crew'
)
`);

db.run(`
INSERT INTO decisions
(
incident_id,
decision_text
)
VALUES
(
2,
'Deploy traffic diversion team'
)
`);

/* APPROVALS */

db.run(`
INSERT INTO approvals
(
decision_id,
approved_by,
approval_status
)
VALUES
(
1,
'Supervisor',
'APPROVED'
)
`);

db.run(`
INSERT INTO approvals
(
decision_id,
approved_by,
approval_status
)
VALUES
(
2,
'Principal Secretary',
'APPROVED'
)
`);

console.log("UCCIS Sample Records Added");