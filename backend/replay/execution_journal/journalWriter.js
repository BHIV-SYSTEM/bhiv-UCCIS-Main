const fs = require("fs");
const path = require("path");

function writeExecutionJournal(event) {

  const journalDir =
    path.join(
      __dirname,
      "../../storage/replay/journal"
    );

  if (!fs.existsSync(journalDir)) {

    fs.mkdirSync(journalDir, {
      recursive: true
    });

  }

  const filePath =
    path.join(
      journalDir,
      `${event.trace_id}.json`
    );

  let existingEvents = [];

  if (fs.existsSync(filePath)) {

    existingEvents =
      JSON.parse(
        fs.readFileSync(filePath)
      );

  }

  existingEvents.push(event);

  fs.writeFileSync(
    filePath,
    JSON.stringify(existingEvents, null, 2)
  );

  return filePath;
}

module.exports =
writeExecutionJournal;