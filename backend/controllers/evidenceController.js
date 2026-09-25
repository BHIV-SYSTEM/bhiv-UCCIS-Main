exports.getEvidence = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      layer: "Evidence",
      traceId: req.traceId,
      evidenceFiles: 32,
      verifiedEvidence: 29
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createEvidence = async (req, res) => {
  try {
    const { title } = req.body;

    res.status(201).json({
      success: true,
      title,
      traceId: req.traceId
    });
  } catch (error) {
    res.status(500).json(error);
  }
};