const SignalTask39 =
require("../models/SignalTask39");

const IncidentTask39 =
require("../models/IncidentTask39");

const EscalationTask39 =
require("../models/EscalationTask39");

const ReplayTask39 =
require("../models/ReplayTask39");

const EvidenceTask39 =
require("../models/EvidenceTask39");

exports.getMetrics =
async (req, res) => {

  try {

    const activeSignals =
      await SignalTask39.countDocuments();

    const openIncidents =
      await IncidentTask39.countDocuments({
        status: "Open"
      });

    const openEscalations =
      await EscalationTask39.countDocuments({
        status: "Open"
      });

    const replayQueue =
      await ReplayTask39.countDocuments({
        status: "Pending"
      });

    const evidenceCount =
      await EvidenceTask39.countDocuments();

    const runtimeHealth =
      openIncidents > 20
        ? "Critical"
        : openIncidents > 10
        ? "Warning"
        : "Healthy";

    res.json({

      activeSignals,

      openIncidents,

      openEscalations,

      replayQueue,

      evidenceCount,

      runtimeHealth,

      lastUpdated:
        new Date()

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};