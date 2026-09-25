const express = require("express");

const {
  simulateCorruption,
} = require("../corruption/corruptionSimulator");

const {
  validateRecovery,
} = require("../corruption/recoveryValidator");

const router = express.Router();

router.get("/", (req, res) => {

  const corruption = simulateCorruption();

  const recovery = validateRecovery();

  res.json({
    success: true,
    corruption,
    recovery,
  });

});

module.exports = router;