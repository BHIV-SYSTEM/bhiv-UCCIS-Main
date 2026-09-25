const Analytics = require("../models/Analytics");
const Incident = require("../models/Incident");
const Escalation = require("../models/Escalation");
const Replay = require("../models/Replay");

exports.getAnalytics = async (req, res) => {

  const incidents = await Incident.countDocuments();
  const escalations = await Escalation.countDocuments();
  const replays = await Replay.countDocuments();

  res.json({
    incidents,
    escalations,
    replays,
    runtimeHealth: "98%"
  });
};

exports.createMetric = async (req, res) => {
  const metric = await Analytics.create(req.body);

  res.json(metric);
};