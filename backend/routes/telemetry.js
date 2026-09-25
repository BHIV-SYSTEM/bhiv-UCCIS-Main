// backend/routes/telemetry.js

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({

    success: true,

    module: "TELEMETRY",

    cpuUsage: Math.floor(Math.random() * 100),

    replayLoad: Math.floor(Math.random() * 100),

    systemHealth: "STABLE",

    timestamp: new Date().toISOString()

  });

});

module.exports = router;