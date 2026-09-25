const express = require("express");

const router = express.Router();

const {
  getTelemetry,
  createTelemetry
} = require("../controllers/telemetryController");

router.get("/", getTelemetry);
router.post("/", createTelemetry);

module.exports = router;