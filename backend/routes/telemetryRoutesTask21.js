const express = require("express");

const router = express.Router();

const {
  getTelemetry
} = require("../controllers/telemetryControllerTask21");

router.get("/", getTelemetry);

module.exports = router;