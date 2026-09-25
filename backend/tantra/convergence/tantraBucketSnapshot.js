const fs = require("fs");
const path = require("path");

function tantraBucketSnapshot(
  traceId,
  state
) {

  const bucketDir =
    path.join(
      __dirname,
      "../../storage/replay/buckets"
    );

  if (!fs.existsSync(bucketDir)) {

    fs.mkdirSync(bucketDir, {
      recursive: true
    });

  }

  const snapshot = {

    trace_id:
      traceId,

    snapshot_time:
      new Date(),

    state
  };

  const filePath =
    path.join(
      bucketDir,
      `${traceId}.json`
    );

  fs.writeFileSync(
    filePath,
    JSON.stringify(snapshot, null, 2)
  );

  return snapshot;
}

module.exports =
tantraBucketSnapshot;