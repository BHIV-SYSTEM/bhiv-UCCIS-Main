const express = require("express");
const router = express.Router();

const { processSignals } = require("./signalController");

// Trigger full pipeline
router.get("/run", async (req, res) => {
  const result = await processSignals();
  res.json(result);
});

module.exports = router;