const express = require("express");

const router = express.Router();

const {
  getIncidents,
  createIncident,
  getIncidentById,
  deleteIncident
} = require("../controllers/incidentController");

router.get("/", getIncidents);
router.post("/", createIncident);
router.get("/:id", getIncidentById);
router.delete("/:id", deleteIncident);

module.exports = router;