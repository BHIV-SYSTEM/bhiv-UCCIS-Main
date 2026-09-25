const express =
  require("express");

const router =
  express.Router();

const {
  getEvidence,
  createEvidence
} = require(
  "../controllers/evidenceController"
);

router.get("/", getEvidence);

router.post(
  "/",
  createEvidence
);

module.exports = router;