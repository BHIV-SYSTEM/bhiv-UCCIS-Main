const express = require("express");

const {
  getReplay,
  getConcurrency,
  getCorruption,
  getLineage,
  getEnforcement,
  getField,
  getStability,
  getGovernance,
  getFailure,
  getFinal,
} = require("../controllers/phaseController");

const router = express.Router();

router.get("/replay", getReplay);

router.get("/concurrency", getConcurrency);

router.get("/corruption", getCorruption);

router.get("/lineage", getLineage);

router.get("/enforcement", getEnforcement);

router.get("/field", getField);

router.get("/stability", getStability);

router.get("/governance", getGovernance);

router.get("/failure", getFailure);

router.get("/final", getFinal);

module.exports = router;