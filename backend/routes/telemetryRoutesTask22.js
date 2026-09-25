const express = require("express");

const router = express.Router();

const {
  getTelemetry,
  getTelemetryById,
  createTelemetry,
  updateTelemetry,
  deleteTelemetry,
  getTelemetryStats,
  getTelemetryHealth,
} = require("../controllers/telemetryController");

router.get("/", getTelemetry);

router.get(
  "/stats/overview",
  getTelemetryStats
);

router.get(
  "/health/status",
  getTelemetryHealth
);

router.get("/:id", getTelemetryById);

router.post("/", createTelemetry);

router.put("/:id", updateTelemetry);

router.delete("/:id", deleteTelemetry);

module.exports = router;