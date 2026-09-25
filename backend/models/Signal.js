const { task24DB: db } = require("../config/db");

const createSignalTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      source_id INTEGER,
      confidence REAL,
      timestamp TEXT
    )
  `);
};

module.exports = createSignalTable;