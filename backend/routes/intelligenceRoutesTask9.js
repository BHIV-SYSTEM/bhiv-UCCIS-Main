const express = require("express");

const processZoneIntelligence =
require("../../engine/intelligence_engine/zoneIntelligenceOrchestrator");

const sampleZones =
require("../../engine/intelligence_engine/sampleZones");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const result =
      processZoneIntelligence(sampleZones);

    res.json({
      success: true,
      timestamp: new Date(),
      data: result,
      message:
        "Multi-zone intelligence processed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      timestamp: new Date(),
      error: error.message
    });

  }

});

module.exports = router;