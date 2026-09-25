const express = require("express");

const lifecycleOrchestrator =
require("../governance/lifecycle/lifecycleOrchestrator");

const sampleLifecycleActions =
require("../governance/lifecycle/sampleLifecycleActions");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const result =
      lifecycleOrchestrator(
        sampleLifecycleActions
      );

    res.json({
      success: true,
      timestamp: new Date(),
      data: result,
      message:
        "Governance lifecycle processed"
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