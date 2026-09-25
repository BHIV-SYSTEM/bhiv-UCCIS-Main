const { mysqlDB } = require("../config/db");

class EscalationTask27 {
  static async create(incidentId, escalatedTo) {
    const [result] = await db.query(
      `INSERT INTO escalations
       (incident_id, escalated_to)
       VALUES (?, ?)`,
      [incidentId, escalatedTo]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM escalations"
    );

    return rows;
  }
}

module.exports = EscalationTask27;