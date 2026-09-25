const EvidenceTask39 =
require("../models/EvidenceTask39");

exports.createEvidence =
async (req, res) => {

  try {

    const evidence =
      await EvidenceTask39.create({

        evidenceId:
          `EVD-${Date.now()}`,

        replayId:
          req.body.replayId,

        traceId:
          req.body.traceId,

        status:
          "Stored"
      });

    res.status(201).json({
      success: true,
      data: evidence
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getEvidence =
async (req, res) => {

  try {

    const evidence =
      await EvidenceTask39.find()
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: evidence.length,
      data: evidence
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};