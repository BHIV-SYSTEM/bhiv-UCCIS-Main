const express = require("express");

const router = express.Router();

const observabilityController = require(
  "../controllers/observabilityController"
);

router.get(
  "/overview",
  observabilityController.getOverview
);

module.exports = router;