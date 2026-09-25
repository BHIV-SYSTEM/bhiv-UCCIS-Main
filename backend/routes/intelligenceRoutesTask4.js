const express = require("express");
const router = express.Router();

const {
  getZonesIntelligence,
  getZoneIntelligence
} = require("../controllers/intelligenceControllerTask4");

// =====================================================
// TASK 4 INTELLIGENCE APIs
// =====================================================

// Get intelligence for all zones
router.get("/zones/intelligence", getZonesIntelligence);

// Get intelligence for a single zone
router.get("/zone/intelligence", getZoneIntelligence);

module.exports = router;