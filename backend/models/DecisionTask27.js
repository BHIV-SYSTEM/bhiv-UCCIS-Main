const { mysqlDB } = require("../config/db");

class DecisionTask27 {
  static async create(escalationId, decisionText) {
    const [result] = await db.query(
      `INSERT INTO decisions
       (escalation_id, decision_text)
       VALUES (?, ?)`,
      [escalationId, decisionText]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM decisions"
    );

    return rows;
  }
}

module.exports = DecisionTask27;