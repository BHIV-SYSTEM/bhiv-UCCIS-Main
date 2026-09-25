const db = require("../config/db");

class RuntimeLog {
  static create(data, callback) {
    db.run(
      `INSERT INTO runtime_logs
      (source,message)
      VALUES (?,?)`,
      [data.source, data.message],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(
      `SELECT * FROM runtime_logs ORDER BY id DESC`,
      callback
    );
  }
}

module.exports = RuntimeLog;