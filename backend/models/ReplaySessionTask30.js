const { task30DB } = require("../config/db");

class ReplaySessionTask30 {
  static getAll() {
    return db.promise().query(
      "SELECT * FROM replay_sessions"
    );
  }

  static getById(id) {
    return db.promise().query(
      "SELECT * FROM replay_sessions WHERE replay_id = ?",
      [id]
    );
  }

  static create(data) {
    return db.promise().query(
      "INSERT INTO replay_sessions SET ?",
      [data]
    );
  }
}

module.exports = ReplaySessionTask30;