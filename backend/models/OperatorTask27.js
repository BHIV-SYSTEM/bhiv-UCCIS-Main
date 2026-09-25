const { mysqlDB: db } = require("../config/db");

class OperatorTask27 {
  static async create(name, departmentId) {
    const [result] = await db.query(
      `INSERT INTO operators(name, department_id)
       VALUES (?, ?)`,
      [name, departmentId]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT o.*, d.department_name
      FROM operators o
      LEFT JOIN departments d
      ON o.department_id = d.department_id
    `);

    return rows;
  }
}

module.exports = OperatorTask27;