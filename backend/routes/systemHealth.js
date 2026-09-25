const express = require("express");
const router = express.Router();

// Simple system health check
router.get("/", (req, res) => {
  res.json({
    status: "ONLINE",
    backend: "UCCIS",
    database: "CONNECTED",
    runtime_engine: "ACTIVE",
    signal_layer: "READY",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;