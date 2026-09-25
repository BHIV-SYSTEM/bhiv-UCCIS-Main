const { task24DB: db } = require("../config/db");

const createDecisionTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS decisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recommendation_id INTEGER,
      decision_status TEXT
    )
  `);
};

module.exports = createDecisionTable;