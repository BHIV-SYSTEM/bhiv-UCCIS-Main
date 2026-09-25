const EscalationTask39 =
require("../models/EscalationTask39");

class EscalationService {

  async create(incident) {

    return await EscalationTask39.create({

      escalationId:
        `ESC-${Date.now()}`,

      incidentId:
        incident.incidentId,

      traceId:
        incident.traceId,

      priority:
        incident.severity,

      assignedTo:
        "Runtime Team",

      status:
        "Open"

    });

  }

  async getAll() {

    return await EscalationTask39.find()
      .sort({ createdAt: -1 });

  }

}

module.exports =
new EscalationService();