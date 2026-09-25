const Replay = require("../models/Replay");

class ReplayEngine {

  async execute(traceId) {

    const replay =
      await Replay.create({
        replayId: `REP-${Date.now()}`,
        traceId,
        status: "RUNNING",
        executionTime: 0,
        result: "Processing"
      });

    setTimeout(async () => {

      replay.status = "COMPLETED";
      replay.executionTime = 4.2;
      replay.result = "SUCCESS";

      await replay.save();

    }, 3000);

    return replay;
  }

}

module.exports =
  new ReplayEngine();