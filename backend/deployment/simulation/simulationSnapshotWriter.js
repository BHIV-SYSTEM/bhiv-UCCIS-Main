const fs = require("fs");
const path = require("path");

function simulationSnapshotWriter(
  execution
) {

  const snapshotDir =
    path.join(
      __dirname,
      "../../storage/replay/demo_snapshots"
    );

  if (!fs.existsSync(snapshotDir)) {

    fs.mkdirSync(snapshotDir, {
      recursive: true
    });

  }

  const snapshot = {

    trace_id:
      execution
      .tantra_execution
      .trace_id,

    snapshot_time:
      new Date(),

    execution
  };

  const filePath =
    path.join(
      snapshotDir,
      `${snapshot.trace_id}.json`
    );

  fs.writeFileSync(
    filePath,
    JSON.stringify(snapshot, null, 2)
  );

  return snapshot;
}

module.exports =
simulationSnapshotWriter;