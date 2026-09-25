const { task25DB: db } = require("../config/db");

class SignalTask25 {
  static create(data, callback) {
    db.run(
      `INSERT INTO signals
      (signal_type, ward, severity, payload)
      VALUES (?, ?, ?, ?)`,
      [
        data.signal_type,
        data.ward,
        data.severity,
        JSON.stringify(data.payload),
      ],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(`SELECT * FROM signals ORDER BY id DESC`, callback);
  }
}

module.exports = SignalTask25;