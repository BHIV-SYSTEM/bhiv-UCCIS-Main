const { mysqlDB: db } = require("../config/db");

class LocationTask27 {
  static async create(district, state) {
    const [result] = await db.query(
      `INSERT INTO locations(district, state)
       VALUES (?, ?)`,
      [district, state]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM locations"
    );
    return rows;
  }
}

module.exports = LocationTask27;