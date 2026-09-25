const snapshots = [];

class SnapshotJournal {

  append(snapshot) {

    snapshots.push(

      Object.freeze({

        ...snapshot,

        persisted_at:
          Date.now()
      })
    );
  }

  getAll() {

    return snapshots;
  }

  getByTrace(traceId) {

    return snapshots.find(
      item =>
        item.trace_id === traceId
    );
  }
}

module.exports =
  new SnapshotJournal();