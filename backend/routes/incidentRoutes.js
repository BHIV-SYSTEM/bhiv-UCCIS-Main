const express = require("express");

const router = express.Router();

const incidentController =
require("../controllers/incidentController");

router.post(
  "/create",
  incidentController.createIncident
);

router.get(
  "/all",
  incidentController.getIncidents
);

module.exports = router;