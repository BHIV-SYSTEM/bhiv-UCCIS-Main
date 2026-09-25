const express = require("express");

const router = express.Router();

const {
  getTelemetry
} = require("../controllers/telemetryController");

router.get("/signals", getTelemetry);

module.exports = router;