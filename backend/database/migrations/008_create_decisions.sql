CREATE TABLE decisions (
    decision_id INT AUTO_INCREMENT PRIMARY KEY,
    escalation_id INT NOT NULL,
    decision_text TEXT,

    FOREIGN KEY(escalation_id)
    REFERENCES escalations(escalation_id)
);