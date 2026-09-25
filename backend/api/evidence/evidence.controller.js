const evidenceService =
require("./evidence.service");

exports.createEvidence =
async (req, res) => {

  try {

    const evidence =
      await evidenceService.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: evidence
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getEvidence =
async (req, res) => {

  try {

    const data =
      await evidenceService.findAll();

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};