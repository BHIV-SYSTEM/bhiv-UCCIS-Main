const Replay = require("../../models/Replay");

exports.create = async payload => {

  const replay = await Replay.create({
    replayId: `REP-${Date.now()}`,
    incidentId: payload.incidentId,
    traceId: payload.traceId,
    status: "Completed",
    startedAt: new Date(),
    completedAt: new Date(),
    duration: 0
  });

  return replay;
};

exports.findAll = async () => {
  return await Replay.find()
    .sort({ createdAt: -1 });
};

exports.findById = async id => {
  return await Replay.findById(id);
};

exports.updateStatus = async (
  id,
  status
) => {

  return await Replay.findByIdAndUpdate(
    id,
    {
      status
    },
    {
      new: true
    }
  );

};

exports.delete = async id => {

  return await Replay.findByIdAndDelete(
    id
  );

};