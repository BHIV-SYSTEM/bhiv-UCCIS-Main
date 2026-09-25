const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    totalEscalations: 12,
    activeEscalations: 7,
    resolvedEscalations: 5
  });

});

router.get("/list", (req, res) => {

  res.json([
    {
      id: 1,
      trace_id: "TRACE-4001",
      escalation_name: "Flood Emergency",
      priority: "CRITICAL",
      status: "ACTIVE"
    },
    {
      id: 2,
      trace_id: "TRACE-4002",
      escalation_name: "Traffic Breakdown",
      priority: "HIGH",
      status: "ACTIVE"
    },
    {
      id: 3,
      trace_id: "TRACE-4003",
      escalation_name: "Power Grid Escalation",
      priority: "HIGH",
      status: "RESOLVED"
    }
  ]);

});

module.exports = router;