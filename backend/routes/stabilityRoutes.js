const express = require("express");

const {
  runObservabilityInspector,
} = require("../stability/observabilityEngine");

const {
  validateStability,
} = require("../stability/stabilityValidator");

const router = express.Router();

router.get("/", (req, res) => {

  const nodes = runObservabilityInspector();

  const validation = validateStability();

  res.json({
    success: true,
    nodes,
    validation,
  });

});

module.exports = router;