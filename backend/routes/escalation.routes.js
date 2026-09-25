const express = require("express");

const router = express.Router();

const escalationController =
  require("../modules/escalations/escalation.controller");

router.post(
  "/",
  escalationController.createEscalation
);

router.get(
  "/",
  escalationController.getEscalations
);

module.exports = router;