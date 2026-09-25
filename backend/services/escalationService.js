const Escalation = require("../models/Escalation");

class EscalationService {
  static async create(incidentId) {
    return await Escalation.create(
      incidentId,
      "DISTRICT_CONTROL_ROOM"
    );
  }
}

module.exports = EscalationService;