CREATE TABLE runtime_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    replay_id INT NOT NULL,
    log_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(replay_id)
    REFERENCES replay_sessions(replay_id)
);