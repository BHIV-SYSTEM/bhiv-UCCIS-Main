const Telemetry = require("../models/Telemetry");

exports.getTelemetry = async (req, res) => {
  const data = await Telemetry.find();

  res.json(data);
};

exports.createTelemetry = async (req, res) => {
  const telemetry = await Telemetry.create(req.body);

  res.json(telemetry);
};