const express = require("express");

const tantraFlowOrchestrator =
require("../../tantra/convergence/tantraFlowOrchestrator");

const sampleTantraPayload =
require("../../tantra/convergence/sampleTantraPayload");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const result =
      tantraFlowOrchestrator(
        sampleTantraPayload
      );

    res.json({

      success: true,

      timestamp:
        new Date(),

      data:
        result,

      message:
        "Tantra convergence flow executed"
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