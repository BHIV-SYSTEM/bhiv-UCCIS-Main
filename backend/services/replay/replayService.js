class ReplayService {
  constructor() {
    this.replays = [];
  }

  executeReplay(traceId) {
    const replay = {
      replayId:
        "REP-" +
        Math.floor(
          Math.random() * 100000
        ),

      traceId,

      status: "Completed",

      executionTime:
        Math.floor(
          Math.random() * 500
        ) + "ms",

      timestamp: new Date()
    };

    this.replays.push(replay);

    return replay;
  }

  getReplays() {
    return this.replays;
  }
}

module.exports = new ReplayService();