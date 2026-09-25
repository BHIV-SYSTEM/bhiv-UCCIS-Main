const express = require("express");

const governanceDecisionEngine =
require("../../governance/conflict_engine/governanceDecisionEngine");

const sampleDomainSignals =
require("../../governance/conflict_engine/sampleDomainSignals");

const router = express.Router();

router.get("/", (req, res) => {

  try {

    const result =
      governanceDecisionEngine(
        sampleDomainSignals
      );

    res.json({
      success: true,
      timestamp: new Date(),
      data: result,
      message:
        "Governance conflict resolution completed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      timestamp: new Date(),
      error: error.message
    });

  }

});

module.exports = router;