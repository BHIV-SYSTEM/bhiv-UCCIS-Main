const express = require("express");

const router = express.Router();

const {
  floodScenario,
  trafficScenario,
  medicalScenario,
  powerScenario,
  cyberScenario
} = require("../controllers/operationalControllerTask29");

router.post("/flood", floodScenario);

router.post("/traffic", trafficScenario);

router.post("/medical", medicalScenario);

router.post("/power", powerScenario);

router.post("/cyber", cyberScenario);

module.exports = router;