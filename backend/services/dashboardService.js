const Signal =
require("../models/Signal");

const Incident =
require("../models/Incident");

const Escalation =
require("../models/Escalation");

const Replay =
require("../models/Replay");

const Evidence =
require("../models/Evidence");

class DashboardService {

  async metrics() {

    const activeSignals =
      await Signal.countDocuments();

    const openIncidents =
      await Incident.countDocuments({
        status: "Open"
      });

    const openEscalations =
      await Escalation.countDocuments({
        status: "Open"
      });

    const replayQueue =
      await Replay.countDocuments({
        status: "Pending"
      });

    const evidenceCount =
      await Evidence.countDocuments();

    const runtimeHealth =
      openIncidents > 20
        ? "Critical"
        : openIncidents > 10
        ? "Warning"
        : "Healthy";

    return {

      activeSignals,

      openIncidents,

      openEscalations,

      replayQueue,

      evidenceCount,

      runtimeHealth,

      timestamp:
        new Date()

    };

  }

}

module.exports =
new DashboardService();