const { task24DB: db } = require("../config/db");

const createOperatorTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS operators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      role TEXT,
      shift TEXT
    )
  `);
};

module.exports = createOperatorTable;