const express = require("express");

const failureOrchestrator =
require("../engine/failure_engine/failureOrchestrator");

const sampleFailurePayloads =
require("../engine/failure_engine/sampleFailurePayloads");

const router = express.Router();

router.get("/", async (req, res) => {

  try {

    const results = [];

    for (
      const payload
      of sampleFailurePayloads
    ) {

      const result =
        await failureOrchestrator(
          payload
        );

      results.push(result);
    }

    res.json({
      success: true,
      timestamp: new Date(),
      data: results,
      message:
        "Failure engineering completed"
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