const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    totalEvents: 119,
    successEvents: 102,
    failedEvents: 17
  });

});

router.get("/list", (req, res) => {

  res.json([
    {
      id: 1,
      trace_id: "TRACE-7001",
      module: "Signals",
      status: "SUCCESS",
      latency: "12ms"
    },
    {
      id: 2,
      trace_id: "TRACE-7002",
      module: "Telemetry",
      status: "SUCCESS",
      latency: "18ms"
    },
    {
      id: 3,
      trace_id: "TRACE-7003",
      module: "Incidents",
      status: "FAILED",
      latency: "45ms"
    },
    {
      id: 4,
      trace_id: "TRACE-7004",
      module: "Evidence",
      status: "SUCCESS",
      latency: "9ms"
    }
  ]);

});

module.exports = router;