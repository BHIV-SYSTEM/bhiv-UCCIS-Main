const { task28DB } = require("../config/db");

class RuntimeLogTask28 {

  static async create(data) {

    const [result] = await db.query(
      `
      INSERT INTO runtime_logs
      (
        replay_id,
        log_message
      )
      VALUES (?, ?)
      `,
      [
        data.replay_id,
        data.log_message
      ]
    );

    return result;
  }
}

module.exports = RuntimeLogTask28;