const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "snapshots.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

function readJSON() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
}

exports.saveSnapshot = (snapshot) => {
  const data = readJSON();
  data.push(snapshot);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.getAllSnapshots = () => readJSON();