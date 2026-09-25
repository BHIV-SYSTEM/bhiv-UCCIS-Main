const { mysqlDB: db } = require("../config/db");

class ReplaySessionTask27 {
  static async create(incidentId, replayResult) {
    const [result] = await db.query(
      `INSERT INTO replay_sessions
       (incident_id, replay_result)
       VALUES (?, ?)`,
      [incidentId, replayResult]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM replay_sessions"
    );

    return rows;
  }
}

module.exports = ReplaySessionTask27;