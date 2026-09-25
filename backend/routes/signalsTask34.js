const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    totalSignals: 24,
    activeSignals: 18,
    criticalSignals: 6
  });
});

router.get("/list", (req, res) => {
  res.json([
    {
      id: 1,
      trace_id: "TRACE-1001",
      signal_name: "Flood Alert",
      severity: "CRITICAL",
      status: "ACTIVE"
    },
    {
      id: 2,
      trace_id: "TRACE-1002",
      signal_name: "Traffic Alert",
      severity: "HIGH",
      status: "ACTIVE"
    },
    {
      id: 3,
      trace_id: "TRACE-1003",
      signal_name: "Power Failure",
      severity: "MEDIUM",
      status: "ACTIVE"
    }
  ]);
});

module.exports = router;