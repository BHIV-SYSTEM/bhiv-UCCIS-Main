const express = require("express");

const router = express.Router();

const telemetryController =
  require("../modules/telemetry/telemetry.controller");

router.post(
  "/",
  telemetryController.createTelemetry
);

router.get(
  "/",
  telemetryController.getTelemetry
);

module.exports = router;