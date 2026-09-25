const express = require("express");
const router = express.Router();
const { task31DB } = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [incidents] = await task31DB.query(
      "SELECT COUNT(*) AS total FROM incidents"
    );

    const [escalations] = await task31DB.query(
      "SELECT COUNT(*) AS total FROM escalations"
    );

    const [telemetry] = await task31DB.query(
      "SELECT COUNT(*) AS total FROM telemetry_events"
    );

    let latestIncidents = [];

    try {
      // Change incident_id if your table uses a different PK column
      const [rows] = await task31DB.query(
        "SELECT * FROM incidents ORDER BY incident_id DESC LIMIT 5"
      );

      latestIncidents = rows;
    } catch (err) {
      console.log("Latest incident query failed:", err.message);
    }

    res.json({
      summary: {
        incidents: incidents[0]?.total || 0,
        escalations: escalations[0]?.total || 0,
        telemetry_events: telemetry[0]?.total || 0
      },
      latest_incidents: latestIncidents
    });

  } catch (err) {
    console.error("Dashboard error:", err.message);

    res.status(500).json({
      error: "Dashboard fetch failed",
      details: err.message
    });
  }
});

module.exports = router;