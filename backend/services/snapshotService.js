const fs = require("fs");
const path = require("path");

const { validateZoneArray } = require("../utils/schemaValidator");

const filePath = path.join(__dirname, "../storage/intelligence_snapshot.json");

const readSnapshot = () => {
  if (!fs.existsSync(filePath)) {
    return { latest: [], history: [] };
  }

  return JSON.parse(fs.readFileSync(filePath));
};

const writeSnapshot = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const saveSnapshot = (zonesData, trace_id) => {
  // ❌ VALIDATION CHECK
  if (!validateZoneArray(zonesData)) {
    return {
      trace_id,
      status: "error",
      error_code: "INVALID_SCHEMA"
    };
  }

  const snapshot = readSnapshot();
  const timestamp = new Date().toISOString();

  const enriched = zonesData.map((z) => ({
    ...z,
    trace_id,
    timestamp
  }));

  snapshot.latest = enriched;

  snapshot.history.push({
    trace_id,
    timestamp,
    data: enriched
  });

  writeSnapshot(snapshot);

  return { status: "success" };
};

module.exports = { saveSnapshot };