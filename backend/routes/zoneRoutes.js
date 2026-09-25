const express = require("express");
const router = express.Router();

const { getZoneIntelligence } = require("../controllers/zoneController");

router.post("/intelligence", getZoneIntelligence);

module.exports = router;