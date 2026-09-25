const { task30DB } = require("../config/db");

class IncidentTask30 {
  static getAll() {
    return db.promise().query(
      "SELECT * FROM incidents"
    );
  }

  static getById(id) {
    return db.promise().query(
      "SELECT * FROM incidents WHERE incident_id = ?",
      [id]
    );
  }

  static create(data) {
    return db.promise().query(
      "INSERT INTO incidents SET ?",
      [data]
    );
  }
}

module.exports = IncidentTask30;