const { task28DB } = require("../config/db");

class ReplaySessionTask28 {

  static async create(data) {

    const [result] = await db.query(
      `
      INSERT INTO replay_sessions
      (
        approval_id,
        replay_json
      )
      VALUES (?, ?)
      `,
      [
        data.approval_id,
        JSON.stringify(data.replay_json)
      ]
    );

    return result;
  }
}

module.exports = ReplaySessionTask28;