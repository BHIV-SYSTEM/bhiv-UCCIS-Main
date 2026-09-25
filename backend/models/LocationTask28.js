const { task28DB } = require("../config/db");

class LocationTask28 {

  static async create(data) {

    const [result] = await db.query(
      `
      INSERT INTO locations
      (
        location_name,
        latitude,
        longitude
      )
      VALUES (?, ?, ?)
      `,
      [
        data.location_name,
        data.latitude,
        data.longitude
      ]
    );

    return result;
  }
}

module.exports = LocationTask28;