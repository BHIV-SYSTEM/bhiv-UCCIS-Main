const express = require("express");
const router = express.Router();

const {
  getTelemetry,
  addTelemetry
} = require("../controllers/telemetryControllerTask26");

router.get("/", getTelemetry);
router.post("/", addTelemetry);

module.exports = router;