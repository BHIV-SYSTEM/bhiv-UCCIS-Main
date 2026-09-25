const express = require("express");
const router = express.Router();

const {
  createIncident
} = require("../controllers/incidentControllerTask28");

router.post("/create", createIncident);

module.exports = router;