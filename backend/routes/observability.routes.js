const express = require("express");

const router = express.Router();

const observabilityController =
  require("../modules/observability/observability.controller");

router.get(
  "/",
  observabilityController.getMetrics
);

module.exports = router;