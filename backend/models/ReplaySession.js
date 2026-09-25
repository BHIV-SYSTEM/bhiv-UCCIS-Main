const db = require("../config/db");

class ReplaySession {
  static create(data, callback) {
    db.run(
      `INSERT INTO replay_sessions
      (session_name,start_time,end_time)
      VALUES (?,?,?)`,
      [
        data.session_name,
        data.start_time,
        data.end_time,
      ],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(`SELECT * FROM replay_sessions`, callback);
  }
}

module.exports = ReplaySession;