const { task24DB: db } = require("../config/db");

const createReplayTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS replays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      incident_id INTEGER,
      replay_url TEXT,
      created_at TEXT
    )
  `);
};

module.exports = createReplayTable;