CREATE TABLE escalations (
    escalation_id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    escalation_level VARCHAR(50),
    assigned_team VARCHAR(100),

    FOREIGN KEY(incident_id)
    REFERENCES incidents(incident_id)
);