const express = require("express");

const router = express.Router();

const concurrencyController = require(
  "../controllers/concurrencyController"
);

router.get(
  "/:trace_id",
  concurrencyController.getConcurrency
);

router.get(
  "/validate/:trace_id",
  concurrencyController.validateConcurrency
);

router.get(
  "/reconstruct/:trace_id",
  concurrencyController.reconstructConcurrency
);

router.get(
  "/consistency/:trace_id",
  concurrencyController.operatorConsistency
);

module.exports = router;