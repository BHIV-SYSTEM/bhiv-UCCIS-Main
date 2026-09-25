const { mysqlDB: db } = require("../config/db");

class ApprovalTask27 {
  static async create(decisionId, approvedBy) {
    const [result] = await db.query(
      `INSERT INTO approvals
       (decision_id, approved_by)
       VALUES (?, ?)`,
      [decisionId, approvedBy]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM approvals"
    );

    return rows;
  }
}

module.exports = ApprovalTask27;