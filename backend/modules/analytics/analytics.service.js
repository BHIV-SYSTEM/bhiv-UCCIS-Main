const Signal =
  require("../signals/signal.model");

const Incident =
  require("../incidents/incident.model");

const Escalation =
  require("../escalations/escalation.model");

class AnalyticsService {
  async dashboardStats() {
    const signals =
      await Signal.countDocuments();

    const incidents =
      await Incident.countDocuments();

    const escalations =
      await Escalation.countDocuments();

    return {
      signals,
      incidents,
      escalations
    };
  }
}

module.exports =
  new AnalyticsService();