// backend/routes/signal.js

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({

    success: true,

    module: "SIGNAL",

    signalStrength: 92,

    activeSignals: 128,

    telemetry: "STABLE",

    timestamp: new Date().toISOString()

  });

});

module.exports = router;