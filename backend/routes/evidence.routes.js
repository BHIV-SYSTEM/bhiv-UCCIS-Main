const express = require("express");

const router = express.Router();

const evidenceController =
  require("../modules/evidence/evidence.controller");

router.post(
  "/",
  evidenceController.createEvidence
);

router.get(
  "/",
  evidenceController.getEvidence
);

module.exports = router;