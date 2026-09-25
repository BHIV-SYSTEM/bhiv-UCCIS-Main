const express = require("express");
const router = express.Router();

const {
  createEscalation
} = require("../controllers/escalationControllerTask28");

router.post("/create", createEscalation);

module.exports = router;