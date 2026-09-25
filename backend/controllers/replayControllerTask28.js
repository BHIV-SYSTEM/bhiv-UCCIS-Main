const { task28DB } = require("../config/db");

exports.generateReplay = async (req, res) => {

  try {

    const { approval_id } = req.body;

    const replayData = {
      generatedAt: new Date(),
      approval_id
    };

    const [result] = await db.query(
      `
      INSERT INTO replay_sessions
      (
        approval_id,
        replay_json
      )
      VALUES
      (?, ?)
      `,
      [
        approval_id,
        JSON.stringify(replayData)
      ]
    );

    await db.query(
      `
      INSERT INTO runtime_logs
      (
        replay_id,
        log_message
      )
      VALUES
      (?, ?)
      `,
      [
        result.insertId,
        "Replay Session Generated"
      ]
    );

    res.status(201).json({
      success: true,
      replay_id: result.insertId
    });

  } catch (error) {
    res.status(500).json(error);
  }
};