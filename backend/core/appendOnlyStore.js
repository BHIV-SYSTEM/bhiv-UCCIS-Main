const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/eventStore.json");

function appendEvent(event) {
  let events = [];

  if (fs.existsSync(filePath)) {
    events = JSON.parse(fs.readFileSync(filePath));
  }

  events.push(event);

  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
}

function getEvents() {
  if (!fs.existsSync(filePath)) return [];

  return JSON.parse(fs.readFileSync(filePath));
}

module.exports = {
  appendEvent,
  getEvents
};