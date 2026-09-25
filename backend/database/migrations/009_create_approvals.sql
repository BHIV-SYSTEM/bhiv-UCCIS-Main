CREATE TABLE approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    decision_id INT NOT NULL,
    approved_by VARCHAR(150),
    approval_status VARCHAR(50),

    FOREIGN KEY(decision_id)
    REFERENCES decisions(decision_id)
);