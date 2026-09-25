const fs = require("fs");
const path = require("path");

function replayIndexer(contract) {

  const replayDir =
    path.join(
      __dirname,
      "../../storage/replay/lifecycle"
    );

  if (!fs.existsSync(replayDir)) {

    fs.mkdirSync(replayDir, {
      recursive: true
    });

  }

  const replayFile =
    path.join(
      replayDir,
      `${contract.trace_id}.json`
    );

  fs.writeFileSync(
    replayFile,
    JSON.stringify(contract, null, 2)
  );

  return replayFile;
}

module.exports =
replayIndexer;