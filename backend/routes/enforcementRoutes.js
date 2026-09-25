const express = require("express");

const router = express.Router();

const enforcementController = require(
  "../controllers/enforcementController"
);

router.get(
  "/:trace_id",
  enforcementController.getEnforcement
);

router.get(
  "/boundary/:trace_id",
  enforcementController.validateBoundary
);

router.get(
  "/reconstruct/:trace_id",
  enforcementController.reconstructEnforcement
);

module.exports = router;