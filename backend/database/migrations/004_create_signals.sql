CREATE TABLE signals (
    signal_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    signal_type VARCHAR(100),
    severity VARCHAR(50),
    status VARCHAR(50),

    FOREIGN KEY(location_id)
    REFERENCES locations(location_id)
);