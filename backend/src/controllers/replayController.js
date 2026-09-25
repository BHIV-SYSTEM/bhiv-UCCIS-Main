const Replay = require("../models/Replay");

exports.getReplays = async (req, res) => {
  const data = await Replay.find();
  res.json(data);
};

exports.createReplay = async (req, res) => {
  const replay = await Replay.create(req.body);

  res.json(replay);
};

exports.runReplay = async (req, res) => {
  const replay = await Replay.findById(req.params.id);

  replay.status = "COMPLETED";

  await replay.save();

  res.json({
    success: true,
    traceId: replay.traceId,
    status: replay.status
  });
};