const ReplayTask39 =
require("../models/ReplayTask39");

class ReplayService {

  async create(escalation) {

    const startedAt =
      Date.now();

    const completedAt =
      Date.now();

    return await ReplayTask39.create({

      replayId:
        `REP-${Date.now()}`,

      incidentId:
        escalation.incidentId,

      traceId:
        escalation.traceId,

      status:
        "Completed",

      startedAt:
        new Date(startedAt),

      completedAt:
        new Date(completedAt),

      duration:
        completedAt - startedAt

    });

  }

  async getAll() {

    return await ReplayTask39.find()
      .sort({ createdAt: -1 });

  }

}

module.exports =
new ReplayService();