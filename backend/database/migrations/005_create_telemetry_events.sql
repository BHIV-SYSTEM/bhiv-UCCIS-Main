CREATE TABLE telemetry_events (
    telemetry_id INT AUTO_INCREMENT PRIMARY KEY,
    signal_id INT NOT NULL,
    telemetry_data JSON,

    FOREIGN KEY(signal_id)
    REFERENCES signals(signal_id)
);