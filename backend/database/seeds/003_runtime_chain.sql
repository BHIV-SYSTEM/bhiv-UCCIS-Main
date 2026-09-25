INSERT INTO signals
(location_id, signal_type, severity, status)
VALUES
(1,'Flood Sensor','HIGH','ACTIVE');

INSERT INTO telemetry_events
(signal_id, telemetry_data)
VALUES
(1,'{"waterLevel":"92%"}');

INSERT INTO incidents
(telemetry_id, incident_type, severity, status)
VALUES
(1,'Flood Alert','CRITICAL','OPEN');

INSERT INTO escalations
(incident_id, escalation_level, assigned_team)
VALUES
(1,'L3','Emergency Operations');

INSERT INTO decisions
(escalation_id, decision_text)
VALUES
(1,'Evacuate Sector A');

INSERT INTO approvals
(decision_id, approved_by, approval_status)
VALUES
(1,'Control Room Officer','APPROVED');

INSERT INTO replay_sessions
(approval_id, replay_json)
VALUES
(1,'{"replay":"generated"}');

INSERT INTO runtime_logs
(replay_id, log_message)
VALUES
(1,'Complete runtime chain executed');