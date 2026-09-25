const express = require("express");

const router = express.Router();

const {
  getEscalation
} = require("../controllers/escalationController");

router.get("/", getEscalation);

module.exports = router;