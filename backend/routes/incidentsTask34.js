const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    totalIncidents: 10,
    openIncidents: 4,
    resolvedIncidents: 6
  });

});

router.get("/list", (req, res) => {

  res.json([
    {
      id: 1,
      trace_id: "TRACE-3001",
      incident_name: "Flood Zone Alert",
      priority: "HIGH",
      status: "OPEN"
    },
    {
      id: 2,
      trace_id: "TRACE-3002",
      incident_name: "Traffic Failure",
      priority: "MEDIUM",
      status: "OPEN"
    },
    {
      id: 3,
      trace_id: "TRACE-3003",
      incident_name: "Power Grid Failure",
      priority: "CRITICAL",
      status: "RESOLVED"
    }
  ]);

});

module.exports = router;