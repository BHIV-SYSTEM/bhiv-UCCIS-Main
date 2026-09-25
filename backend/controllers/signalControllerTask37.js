const SignalTask37 =
  require("../models/SignalTask37");

exports.getSignals = async (
  req,
  res
) => {
  const signals =
    await SignalTask37.find();

  res.json(signals);
};

exports.createSignal =
  async (req, res) => {
    const signal =
      await SignalTask37.create(
        req.body
      );

    res.status(201).json(signal);
  };