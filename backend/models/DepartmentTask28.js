const { task28DB } = require("../config/db");

class DepartmentTask28 {
  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM departments"
    );
    return rows;
  }

  static async create(name) {
    const [result] = await db.query(
      "INSERT INTO departments(department_name) VALUES(?)",
      [name]
    );
    return result;
  }
}

module.exports = DepartmentTask28;