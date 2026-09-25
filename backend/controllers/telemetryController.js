const {
  generateTelemetry
} = require("../services/telemetryService");

const getTelemetry = (req, res) => {

  const data = generateTelemetry();

  res.json(data);
};

module.exports = {
  getTelemetry
};