const { task24DB: db } = require("../config/db");

const createConfidenceTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS confidence_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score REAL,
      calculated_at TEXT
    )
  `);
};

module.exports = createConfidenceTable;