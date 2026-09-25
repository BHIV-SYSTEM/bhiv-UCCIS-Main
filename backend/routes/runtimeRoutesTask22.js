const express = require("express");

const router = express.Router();

/*
=========================================================
GET RUNTIME STATUS
=========================================================
*/

router.get("/", (req, res) => {
  res.json({
    success: true,
    runtime: {
      runtime_state: "RUNNING",
      cpu_load: 42,
      active_alerts: 6,
      degraded_mode: false,
    },
  });
});

/*
=========================================================
GET LOGS
=========================================================
*/

router.get("/logs", (req, res) => {
  res.json({
    success: true,
    logs: [
      "Telemetry initialized",
      "Replay engine active",
      "Escalation generated",
      "Flood simulation completed",
    ],
  });
});

module.exports = router;