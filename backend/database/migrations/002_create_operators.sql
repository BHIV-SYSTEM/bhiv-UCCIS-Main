CREATE TABLE operators (
    operator_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    operator_name VARCHAR(150),
    email VARCHAR(200),

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);