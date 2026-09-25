const SignalTask37 =
  require("../models/SignalTask37");

const IncidentTask37 =
  require("../models/IncidentTask37");

const EscalationTask37 =
  require("../models/EscalationTask37");

const ReplayTask37 =
  require("../models/ReplayTask37");

exports.getAnalytics =
  async (req, res) => {

    const totalSignals =
      await SignalTask37.countDocuments();

    const totalIncidents =
      await IncidentTask37.countDocuments();

    const totalEscalations =
      await EscalationTask37.countDocuments();

    const totalReplays =
      await ReplayTask37.countDocuments();

    res.json({
      totalSignals,
      totalIncidents,
      totalEscalations,
      totalReplays,
      runtimeHealth: "98%",
      status: "Healthy"
    });
  };