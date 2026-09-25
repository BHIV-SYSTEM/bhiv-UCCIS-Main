const express = require("express");

const runIngestion = require("../../ingestion/orchestrator/runIngestion");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const signals = runIngestion();

    res.json({
      success: true,
      timestamp: new Date(),
      data: signals,
      message: "Urban ingestion completed"
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