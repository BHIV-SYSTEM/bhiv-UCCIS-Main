const ReplaySessionTask27 = require("../models/ReplaySessionTask27");

class ReplayServiceTask27 {
  static async create(incidentId) {
    return await ReplaySession.create(
      incidentId,
      "REPLAY_GENERATED_SUCCESSFULLY"
    );
  }
}

module.exports = ReplayServiceTask27;