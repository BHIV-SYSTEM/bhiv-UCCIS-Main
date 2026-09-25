const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../state_history/state.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

function load() {
  return JSON.parse(fs.readFileSync(filePath));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function addSnapshot(snapshot) {
  const data = load();
  data.push(snapshot);
  save(data);
}

function getZoneHistory(zone_id) {
  const data = load();
  return data.filter(d => d.zone_id === zone_id);
}

module.exports = {
  addSnapshot,
  getZoneHistory
};