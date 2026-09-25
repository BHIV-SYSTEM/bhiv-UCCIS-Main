const express = require("express");

const {
  runFinalReplay,
} = require("../final/finalReplayEngine");

const {
  validateFinalReplay,
} = require("../final/finalValidationEngine");

const router = express.Router();

router.get("/", (req, res) => {

  const replay = runFinalReplay();

  const validation = validateFinalReplay();

  res.json({
    success: true,
    replay,
    validation,
  });

});

module.exports = router;