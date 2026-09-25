const escalationService =
require("./escalation.service");

exports.createEscalation =
async (req, res) => {

  try {

    const escalation =
      await escalationService.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: escalation
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getEscalations =
async (req, res) => {

  try {

    const data =
      await escalationService.findAll();

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

exports.getEscalation =
async (req, res) => {

  try {

    const data =
      await escalationService.findById(
        req.params.id
      );

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

exports.updateEscalation =
async (req, res) => {

  try {

    const data =
      await escalationService.updateStatus(
        req.params.id,
        req.body.status
      );

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

exports.deleteEscalation =
async (req, res) => {

  try {

    await escalationService.delete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Escalation deleted"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};