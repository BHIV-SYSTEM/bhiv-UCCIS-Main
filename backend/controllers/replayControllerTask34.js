exports.getReplay = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      layer: "Replay",
      traceId: req.traceId,
      replayCount: 18,
      successfulReplay: 15,
      failedReplay: 3
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.startReplay = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Replay Started",
      traceId: req.traceId
    });
  } catch (error) {
    res.status(500).json(error);
  }
};