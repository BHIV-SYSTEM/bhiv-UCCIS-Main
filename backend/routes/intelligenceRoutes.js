const express = require("express");

const router = express.Router();

const {
  getZoneIntelligence,
  runIntelligence,
} = require("../controllers/intelligenceController");

// Existing zone intelligence API
router.get(
  "/zone/intelligence",
  getZoneIntelligence
);

// Live intelligence API used by UrbanIntelligence.jsx
router.get(
  "/run",
  runIntelligence
);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "UCCIS Intelligence",
    status: "RUNNING",
    timestamp: Date.now(),
  });
});

module.exports = router;
