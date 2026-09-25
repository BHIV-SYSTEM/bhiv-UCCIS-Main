const snapshotEngine = require("./snapshotEngine");

class ReplayEngine {

  // =====================================
  // TASK 8 COMPATIBILITY
  // =====================================

  replayState(history = []) {
    return {
      success: true,
      totalSnapshots: history.length,
      replay: history
    };
  }

  // =====================================
  // GET ALL REPLAY SNAPSHOTS
  // =====================================

  getReplay() {
    return snapshotEngine.getAll();
  }

  // =====================================
  // GET BY TRACE ID
  // =====================================

  getReplayByTrace(traceId) {

    const snapshots = snapshotEngine.getAll();

    return snapshots.find(
      snapshot => snapshot.trace_id === traceId
    );
  }

  // =====================================
  // GET TIMELINE BY ZONE
  // =====================================

  getTimeline(zoneId) {

    const snapshots = snapshotEngine.getAll();

    return snapshots.filter(
      snapshot =>
        String(snapshot.zone_id) ===
        String(zoneId)
    );
  }

  // =====================================
  // COMPARE STATES
  // =====================================

  compareStates(zoneId) {

    const timeline = this.getTimeline(zoneId);

    if (timeline.length < 2) {
      return {
        message: "Not enough historical states"
      };
    }

    const previous = timeline[timeline.length - 2];
    const current = timeline[timeline.length - 1];

    return {

      previous_state: {
        final_score: previous.final_score,
        final_level: previous.final_level,
        dominant_domain: previous.dominant_domain
      },

      current_state: {
        final_score: current.final_score,
        final_level: current.final_level,
        dominant_domain: current.dominant_domain
      }

    };

  }

}

module.exports = new ReplayEngine();