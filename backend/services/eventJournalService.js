const fs = require("fs");
const { JOURNAL_PATH } = require("../config/constants");

function appendEvent(event) {
  fs.appendFileSync(
    JOURNAL_PATH,
    JSON.stringify(event) + "\n"
  );
}

function readAllEvents() {
  if (!fs.existsSync(JOURNAL_PATH)) {
    return [];
  }

  const data = fs.readFileSync(JOURNAL_PATH, "utf-8");

  return data
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

module.exports = {
  appendEvent,
  readAllEvents
};