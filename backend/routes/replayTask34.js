const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    totalReplays: 18,
    successfulReplays: 14,
    failedReplays: 4
  });

});

router.get("/list", (req, res) => {

  res.json([
    {
      id: 1,
      trace_id: "TRACE-5001",
      replay_name: "Flood Scenario Replay",
      status: "SUCCESS",
      duration: "3.2s"
    },
    {
      id: 2,
      trace_id: "TRACE-5002",
      replay_name: "Traffic Scenario Replay",
      status: "SUCCESS",
      duration: "2.8s"
    },
    {
      id: 3,
      trace_id: "TRACE-5003",
      replay_name: "Power Scenario Replay",
      status: "FAILED",
      duration: "1.4s"
    }
  ]);

});

module.exports = router;