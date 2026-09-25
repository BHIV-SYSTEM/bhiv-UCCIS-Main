const fs = require("fs");
const path = require("path");

function createSnapshot(traceId, state) {

  const snapshotDir =
    path.join(
      __dirname,
      "../../storage/replay/snapshots"
    );

  if (!fs.existsSync(snapshotDir)) {

    fs.mkdirSync(snapshotDir, {
      recursive: true
    });

  }

  const snapshot = {

    trace_id: traceId,

    snapshot_timestamp:
      new Date(),

    state
  };

  const filePath =
    path.join(
      snapshotDir,
      `${traceId}.json`
    );

  fs.writeFileSync(
    filePath,
    JSON.stringify(snapshot, null, 2)
  );

  return snapshot;
}

module.exports =
createSnapshot;