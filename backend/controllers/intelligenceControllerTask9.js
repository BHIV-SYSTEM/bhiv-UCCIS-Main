const {
  processSignal
} = require("../../engine/intelligence/intelligenceEngine");

exports.runIntelligence = async (req, res) => {

  const signal = req.body;

  const result = processSignal(signal);

  res.json({
    trace_id: req.trace_id,
    success: true,
    result
  });
};