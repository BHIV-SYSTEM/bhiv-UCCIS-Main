const express =
  require("express");

const router =
  express.Router();

const incidentController =
  require(
    "../modules/incidents/incident.controller"
  );

router.post(
  "/",
  incidentController.createIncident
);

router.get(
  "/",
  incidentController.getIncidents
);

module.exports =
  router;