const { task30DB } = require("../config/db");

class SignalTask30 {
  static getAll() {
    return db.promise().query(
      "SELECT * FROM signals ORDER BY signal_id DESC"
    );
  }

  static getById(id) {
    return db.promise().query(
      "SELECT * FROM signals WHERE signal_id = ?",
      [id]
    );
  }

  static create(signal_type, location_id) {
    return db.promise().query(
      `INSERT INTO signals
      (signal_type, location_id)
      VALUES (?, ?)`,
      [signal_type, location_id]
    );
  }
}

module.exports = SignalTask30;