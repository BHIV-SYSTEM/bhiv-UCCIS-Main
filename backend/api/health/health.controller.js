const Signal =
require("../../models/Signal");

const Incident =
require("../../models/Incident");

const Replay =
require("../../models/Replay");

exports.health =
async (req, res) => {

  const signals =
    await Signal.countDocuments();

  const incidents =
    await Incident.countDocuments();

  const replays =
    await Replay.countDocuments();

  res.json({

    status:
      "Healthy",

    uptime:
      process.uptime(),

    signals,

    incidents,

    replays,

    timestamp:
      new Date()

  });

};