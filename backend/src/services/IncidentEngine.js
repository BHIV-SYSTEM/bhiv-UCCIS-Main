const Incident = require("../models/Incident");

class IncidentEngine {

  async createIncident(telemetry) {

    const incident = await Incident.create({
      incidentId: `INC-${Date.now()}`,
      traceId: telemetry.traceId,
      title: telemetry.metric,
      severity: telemetry.value > 80
        ? "CRITICAL"
        : "LOW",
      status: "OPEN",
      description: "Generated from telemetry"
    });

    return incident;
  }

}

module.exports = new IncidentEngine();