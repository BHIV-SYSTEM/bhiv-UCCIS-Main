const express =
  require("express");

const router =
  express.Router();

const {
  getIncidents,
  createIncident
} = require(
  "../controllers/incidentControllerTask37"
);

router.get(
  "/",
  getIncidents
);

router.post(
  "/",
  createIncident
);

module.exports = router;