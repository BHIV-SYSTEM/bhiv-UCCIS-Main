const Signal =
require("../../models/Signal");

const Incident =
require("../../models/Incident");

const Replay =
require("../../models/Replay");

const Evidence =
require("../../models/Evidence");

exports.getHealth =
async () => {

  return {

    status: "Healthy",

    uptime:
      process.uptime(),

    signals:
      await Signal.countDocuments(),

    incidents:
      await Incident.countDocuments(),

    replays:
      await Replay.countDocuments(),

    evidence:
      await Evidence.countDocuments(),

    timestamp:
      new Date()

  };

};