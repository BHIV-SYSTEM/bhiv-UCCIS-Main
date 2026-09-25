// backend/routes/anomaly.js

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({

    success: true,

    module: "ANOMALY",

    anomalyDetected: false,

    divergenceRisk: "LOW",

    governanceRisk: "LOW",

    timestamp: new Date().toISOString()

  });

});

module.exports = router;