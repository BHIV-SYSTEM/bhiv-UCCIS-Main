class SnapshotEngine {

  constructor() {

    this.snapshots = [];

  }

  // =====================================
  // SAVE SNAPSHOT
  // =====================================

  save(snapshot) {

    this.snapshots.push(snapshot);

  }

  // =====================================
  // GET ALL
  // =====================================

  getAll() {

    return this.snapshots;

  }

  // =====================================
  // GET BY TRACE
  // =====================================

  getByTrace(traceId) {

    return this.snapshots.find(
      snapshot =>
        snapshot.trace_id === traceId
    );
  }

  // =====================================
  // GET BY ZONE
  // =====================================

  getByZone(zoneId) {

    return this.snapshots.filter(
      snapshot =>
        String(snapshot.zone_id) ===
        String(zoneId)
    );
  }
}

module.exports =
  new SnapshotEngine();