const express = require("express");
const router = express.Router();

const {
  getTelemetry
} = require("../controllers/telemetryControllerTask30");

router.get("/", getTelemetry);

module.exports = router;