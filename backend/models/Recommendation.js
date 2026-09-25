const { task24DB: db } = require("../config/db");

const createRecommendationTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      incident_id INTEGER,
      recommendation_text TEXT
    )
  `);
};

module.exports = createRecommendationTable;