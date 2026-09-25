const { mysqlDB: db } = require("../config/db");

class RuntimeLogTask27 {
  static async create(replayId, message) {
    const [result] = await db.query(
      `INSERT INTO runtime_logs
       (replay_id, log_message)
       VALUES (?, ?)`,
      [replayId, message]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT *
      FROM runtime_logs
      ORDER BY log_id DESC
    `);

    return rows;
  }
}

module.exports = RuntimeLogTask27;