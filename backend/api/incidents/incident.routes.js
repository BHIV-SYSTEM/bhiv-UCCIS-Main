const express = require("express");

const router = express.Router();

const controller =
require("./incident.controller");

router.post(
  "/",
  controller.createIncident
);

router.get(
  "/",
  controller.getIncidents
);

module.exports = router;