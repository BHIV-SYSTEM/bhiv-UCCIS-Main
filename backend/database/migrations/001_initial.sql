USE uccis;

ALTER TABLE operators
ADD CONSTRAINT fk_operator_department
FOREIGN KEY (department_id)
REFERENCES departments(department_id);

ALTER TABLE signals
ADD CONSTRAINT fk_signal_location
FOREIGN KEY (location_id)
REFERENCES locations(location_id);

ALTER TABLE telemetry_events
ADD CONSTRAINT fk_telemetry_signal
FOREIGN KEY (signal_id)
REFERENCES signals(signal_id);

ALTER TABLE incidents
ADD CONSTRAINT fk_incident_signal
FOREIGN KEY (signal_id)
REFERENCES signals(signal_id);

ALTER TABLE escalations
ADD CONSTRAINT fk_escalation_incident
FOREIGN KEY (incident_id)
REFERENCES incidents(incident_id);

ALTER TABLE decisions
ADD CONSTRAINT fk_decision_incident
FOREIGN KEY (incident_id)
REFERENCES incidents(incident_id);

ALTER TABLE approvals
ADD CONSTRAINT fk_approval_decision
FOREIGN KEY (decision_id)
REFERENCES decisions(decision_id);

ALTER TABLE replay_sessions
ADD CONSTRAINT fk_replay_incident
FOREIGN KEY (incident_id)
REFERENCES incidents(incident_id);

ALTER TABLE runtime_logs
ADD CONSTRAINT fk_runtime_incident
FOREIGN KEY (incident_id)
REFERENCES incidents(incident_id);