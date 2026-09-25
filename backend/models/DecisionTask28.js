const { task28DB } = require("../config/db");

class DecisionTask28 {

  static async create(data) {

    const [result] = await db.query(
      `
      INSERT INTO decisions
      (
        escalation_id,
        decision_text
      )
      VALUES (?, ?)
      `,
      [
        data.escalation_id,
        data.decision_text
      ]
    );

    return result;
  }
}

module.exports = DecisionTask28;