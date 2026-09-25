const Escalation = require("../models/Escalation");

class EscalationEngine {

  async escalate(incident) {

    const escalation =
      await Escalation.create({
        escalationId: `ESC-${Date.now()}`,
        incidentId: incident.incidentId,
        traceId: incident.traceId,
        assignedTo: "Operations Team",
        priority:
          incident.severity === "CRITICAL"
            ? "P1"
            : "P3",
        status: "ACTIVE"
      });

    return escalation;
  }

}

module.exports =
  new EscalationEngine();