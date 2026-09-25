const express =
  require("express");

const router =
  express.Router();

const {
  getEscalations,
  createEscalation
} = require(
  "../controllers/escalationControllerTask37"
);

router.get(
  "/",
  getEscalations
);

router.post(
  "/",
  createEscalation
);

module.exports = router;