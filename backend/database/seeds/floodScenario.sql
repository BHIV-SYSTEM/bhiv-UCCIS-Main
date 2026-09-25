USE uccis;

INSERT INTO locations
(location_name)
VALUES
('Zone A'),
('Zone B'),
('Zone C');

INSERT INTO departments
(department_name)
VALUES
('Emergency Response'),
('Traffic Control'),
('Medical Services');

INSERT INTO operators
(operator_name, department_id)
VALUES
('Operator One', 1),
('Operator Two', 2),
('Operator Three', 3);

INSERT INTO signals
(signal_type, location_id)
VALUES
('Flood Alert', 1);

INSERT INTO telemetry_events
(signal_id)
VALUES
(1);

INSERT INTO incidents
(signal_id)
VALUES
(1);

INSERT INTO escalations
(incident_id)
VALUES
(1);

INSERT INTO decisions
(incident_id)
VALUES
(1);

INSERT INTO replay_sessions
(incident_id)
VALUES
(1);

INSERT INTO runtime_logs
(incident_id)
VALUES
(1);