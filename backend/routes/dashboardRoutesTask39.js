const express = require("express");
const router = express.Router();

const SignalTask39 = require("../models/SignalTask39");
const IncidentTask39 = require("../models/IncidentTask39");
const EscalationTask39 = require("../models/EscalationTask39");
const ReplayTask39 = require("../models/ReplayTask39");
const EvidenceTask39 = require("../models/EvidenceTask39");

router.get("/metrics", async (req, res) => {

  try {

    const activeSignals =
      await SignalTask39.countDocuments();

    const openIncidents =
      await IncidentTask39.countDocuments();

    const openEscalations =
      await EscalationTask39.countDocuments();

    const replayQueue =
      await ReplayTask39.countDocuments();

    const evidenceCount =
      await EvidenceTask39.countDocuments();

    res.status(200).json({

      activeSignals,

      openIncidents,

      openEscalations,

      replayQueue,

      evidenceCount,

      runtimeHealth:
        "Operational",

      timestamp:
        new Date()

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

});

module.exports = router;