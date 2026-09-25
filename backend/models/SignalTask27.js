const { mysqlDB: db } = require("../config/db");

class SignalTask27 {
  static async create(signalType, locationId) {
    const [result] = await db.query(
      `INSERT INTO signals
       (signal_type, location_id)
       VALUES (?, ?)`,
      [signalType, locationId]
    );

    return result;
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT s.*, l.district
      FROM signals s
      LEFT JOIN locations l
      ON s.location_id = l.location_id
      ORDER BY signal_id DESC
    `);

    return rows;
  }
}

module.exports = SignalTask27;