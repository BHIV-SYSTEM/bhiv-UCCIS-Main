const db = require("../config/db");

class Department {
  static async create(name) {
    const [result] = await db.query(
      "INSERT INTO departments (department_name) VALUES (?)",
      [name]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM departments"
    );
    return rows;
  }
}

module.exports = Department;