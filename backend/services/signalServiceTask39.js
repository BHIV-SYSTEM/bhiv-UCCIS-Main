const SignalTask39 = require("../models/SignalTask39");

class SignalService {

  async create(payload) {

    return await SignalTask39.create({

      signalId: `SIG-${Date.now()}`,

      source: payload.source,

      severity: payload.severity,

      payload: payload.payload

    });

  }

  async getAll() {

    return await SignalTask39.find()
      .sort({ createdAt: -1 });

  }

  async getById(id) {

    return await SignalTask39.findById(id);

  }

  async count() {

    return await SignalTask39.countDocuments();

  }

}

module.exports = new SignalService();