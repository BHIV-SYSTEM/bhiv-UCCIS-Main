CREATE TABLE replay_sessions (
    replay_id INT AUTO_INCREMENT PRIMARY KEY,
    approval_id INT NOT NULL,
    replay_json JSON,

    FOREIGN KEY(approval_id)
    REFERENCES approvals(approval_id)
);