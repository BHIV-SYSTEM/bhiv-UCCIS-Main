CREATE TABLE incidents (
    incident_id INT AUTO_INCREMENT PRIMARY KEY,
    telemetry_id INT NOT NULL,
    incident_type VARCHAR(100),
    severity VARCHAR(50),
    status VARCHAR(50),

    FOREIGN KEY(telemetry_id)
    REFERENCES telemetry_events(telemetry_id)
);