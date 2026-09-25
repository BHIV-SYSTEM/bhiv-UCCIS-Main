const express = require("express");

const simulationOrchestrator =
require("../deployment/simulation/simulationOrchestrator");

const sampleSimulationPayload =
require("../deployment/simulation/sampleSimulationPayload");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const result =
      simulationOrchestrator(
        sampleSimulationPayload
      );

    res.json({

      success: true,

      timestamp:
        new Date(),

      data:
        result,

      message:
        "Ministerial simulation completed"
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      timestamp:
        new Date(),

      error:
        error.message
    });

  }

});

module.exports = router;