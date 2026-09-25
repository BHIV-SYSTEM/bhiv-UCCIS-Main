const express = require("express");
const router = express.Router();

const {
  getIncidents
} = require("../controllers/incidentControllerTask30");

router.get("/", getIncidents);

module.exports = router;