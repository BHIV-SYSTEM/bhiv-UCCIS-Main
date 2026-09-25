const express =
require("express");

const router =
express.Router();

const controller =
require("./telemetry.controller");

const validate =
require("./telemetry.validation");

router.post(
  "/",
  validate,
  controller.generate
);

router.get(
  "/",
  controller.getTelemetry
);

module.exports = router;