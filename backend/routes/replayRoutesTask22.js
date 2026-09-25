const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        replay_id: "REP001",
        event: "Flood Scenario",
        status: "RECORDED",
        timestamp: new Date().toISOString(),
      },
      {
        replay_id: "REP002",
        event: "Traffic Congestion",
        status: "REPLAY READY",
        timestamp: new Date().toISOString(),
      },
    ],
  });
});

module.exports = router;