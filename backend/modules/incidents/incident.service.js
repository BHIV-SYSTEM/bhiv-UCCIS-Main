const Incident =
  require("./incident.model");

class IncidentService {
  async create(data) {
    return await Incident.create(data);
  }

  async getAll() {
    return await Incident.find()
      .sort({ createdAt: -1 });
  }

  async update(id, status) {
    return await Incident.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }
}

module.exports =
  new IncidentService();