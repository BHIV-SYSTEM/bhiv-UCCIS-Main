const Evidence =
  require("./evidence.model");

class EvidenceService {
  async create(data) {
    return await Evidence.create(data);
  }

  async getAll() {
    return await Evidence.find()
      .sort({ createdAt: -1 });
  }
}

module.exports =
  new EvidenceService();