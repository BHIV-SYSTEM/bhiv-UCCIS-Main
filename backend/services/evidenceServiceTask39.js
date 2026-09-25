const EvidenceTask39 =
require("../models/EvidenceTask39");

class EvidenceService {

  async create(replay) {

    return await EvidenceTask39.create({

      evidenceId:
        `EVD-${Date.now()}`,

      traceId:
        replay.traceId,

      replayId:
        replay.replayId,

      status:
        "Stored",

      location:
        "/evidence/runtime"

    });

  }

  async getAll() {

    return await EvidenceTask39.find()
      .sort({ createdAt: -1 });

  }

  async count() {

    return await EvidenceTask39.countDocuments();

  }

}

module.exports =
new EvidenceService();