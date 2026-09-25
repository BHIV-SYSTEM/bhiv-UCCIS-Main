const ReplayTask37 =
  require("../models/ReplayTask37");

exports.getReplays =
  async (req, res) => {
    const replays =
      await ReplayTask37.find();

    res.json(replays);
  };

exports.createReplay =
  async (req, res) => {
    const replay =
      await ReplayTask37.create(
        req.body
      );

    res.status(201).json(
      replay
    );
  };