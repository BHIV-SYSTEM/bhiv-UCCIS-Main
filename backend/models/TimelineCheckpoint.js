const { task24DB: db } = require("../config/db");

const createTimelineCheckpointTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS timeline_checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checkpoint_name TEXT,
      checkpoint_time TEXT,
      description TEXT
    )
  `);
};

module.exports = createTimelineCheckpointTable;