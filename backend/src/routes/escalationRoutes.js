const express = require("express");

const router = express.Router();

const {
  getEscalations,
  createEscalation,
  deleteEscalation
} = require("../controllers/escalationController");

router.get("/", getEscalations);
router.post("/", createEscalation);
router.delete("/:id", deleteEscalation);

module.exports = router;