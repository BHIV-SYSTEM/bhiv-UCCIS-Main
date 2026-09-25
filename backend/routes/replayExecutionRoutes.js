const express = require("express");

const replayOrchestrator =
require("../../replay/execution_journal/replayOrchestrator");

const sampleReplayData =
require("../../replay/execution_journal/sampleReplayData");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const result =
      replayOrchestrator(
        sampleReplayData
      );

    res.json({
      success: true,
      timestamp: new Date(),
      data: result,
      message:
        "Replay reconstruction completed"
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