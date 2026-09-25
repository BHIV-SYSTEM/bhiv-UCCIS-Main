const express = require("express");

const router = express.Router();

const failureController = require(
  "../controllers/failureController"
);

router.get(
  "/failures/:trace_id",
  failureController.getFailures
);

router.get(
  "/recoveries/:trace_id",
  failureController.getRecoveries
);

router.get(
  "/validate/:trace_id",
  failureController.validateFailures
);

module.exports = router;