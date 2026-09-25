const { mysqlDB } = require("../config/db");

class TelemetryEventTask27 {
  static async create(signalId, status) {
    const [result] = await db.query(
      `INSERT INTO telemetry_events
       (signal_id, event_status)
       VALUES (?, ?)`,
      [signalId, status]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT *
      FROM telemetry_events
    `);

    return rows;
  }
}

module.exports = TelemetryEventTask27;