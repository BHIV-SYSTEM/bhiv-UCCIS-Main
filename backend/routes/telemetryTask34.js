const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    totalTelemetry: 25,
    healthyStreams: 20,
    warningStreams: 5
  });
});

router.get("/list", (req, res) => {
  res.json([
    {
      id: 1,
      trace_id: "TRACE-2001",
      source: "Flood Sensor",
      status: "HEALTHY",
      latency: "12ms"
    },
    {
      id: 2,
      trace_id: "TRACE-2002",
      source: "Weather Station",
      status: "HEALTHY",
      latency: "18ms"
    },
    {
      id: 3,
      trace_id: "TRACE-2003",
      source: "Traffic Camera",
      status: "WARNING",
      latency: "45ms"
    }
  ]);
});

module.exports = router;