const Escalation =
  require("./escalation.model");

class EscalationService {
  async create(data) {
    return await Escalation.create(
      data
    );
  }

  async getAll() {
    return await Escalation.find()
      .sort({ createdAt: -1 });
  }
}

module.exports =
  new EscalationService();