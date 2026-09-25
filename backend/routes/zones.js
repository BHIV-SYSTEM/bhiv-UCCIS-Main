const express = require("express");
const router = express.Router();

// ✅ IMPORT CONTROLLER FUNCTIONS (VERY IMPORTANT)
const {
  getZones,
  getRawZones
} = require("../controllers/zoneController");

// ===============================
// ✅ MAIN API (INTELLIGENCE OUTPUT)
// ===============================
router.get("/zones", getZones);

// ===============================
// 🧪 DEBUG API (RAW NORMALIZED DATA)
// ===============================
router.get("/zones/raw", getRawZones);

// ===============================
module.exports = router;