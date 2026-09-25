const express = require("express");

const {
  runConcurrentSimulation,
} = require("../concurrent/operatorSimulator");

const {
  generateReconciliationProof,
} = require("../concurrent/reconciliationEngine");

const router = express.Router();

router.get("/", (req, res) => {
  const simulation = runConcurrentSimulation();

  const reconciliation = generateReconciliationProof();

  res.json({
    success: true,
    simulation,
    reconciliation,
  });
});

module.exports = router;