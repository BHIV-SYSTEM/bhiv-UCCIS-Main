const { mysqlDB: db } = require("../config/db");

class IncidentTask27 {
  static async create(eventId, severity) {
    const [result] = await db.query(
      `INSERT INTO incidents
       (event_id, severity)
       VALUES (?, ?)`,
      [eventId, severity]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT *
      FROM incidents
    `);

    return rows;
  }
}

module.exports = IncidentTask27;