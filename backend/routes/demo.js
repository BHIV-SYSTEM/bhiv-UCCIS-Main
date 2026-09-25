// backend/routes/demo.js

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({

    success: true,

    module: "DEMO",

    operationalDemo: "RUNNING",

    replayVisualization: "ACTIVE",

    governanceOverlay: "VISIBLE",

    timestamp: new Date().toISOString()

  });

});

module.exports = router;