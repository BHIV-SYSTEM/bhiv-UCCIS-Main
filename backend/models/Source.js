const { task24DB: db } = require("../config/db");

const createSourceTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_name TEXT,
      source_type TEXT
    )
  `);
};

module.exports = createSourceTable;