const express = require("express");

const router = express.Router();

const {
  getTraceIds,
  getRuntimeChain,
  getRuntimeSummary
} = require("../controllers/runtimeControllerTask33");

/*
=====================================================
RUNTIME SUMMARY
=====================================================
*/

router.get(
  "/summary",
  getRuntimeSummary
);

/*
=====================================================
ALL TRACE IDS
=====================================================
*/

router.get(
  "/trace-ids",
  getTraceIds
);

/*
=====================================================
TRACE CHAIN
=====================================================
*/

router.get(
  "/chain/:traceId",
  getRuntimeChain
);

/*
=====================================================
HEALTH CHECK
=====================================================
*/

router.get(
  "/ping",
  (req, res) => {

    res.status(200).json({
      success: true,
      service: "runtime",
      status: "UP",
      timestamp: new Date()
    });

  }
);

module.exports = router;