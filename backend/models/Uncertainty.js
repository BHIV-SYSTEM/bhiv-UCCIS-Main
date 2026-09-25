const { task24DB: db } = require("../config/db");

const createUncertaintyTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS uncertainties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value REAL,
      reason TEXT
    )
  `);
};

module.exports = createUncertaintyTable;