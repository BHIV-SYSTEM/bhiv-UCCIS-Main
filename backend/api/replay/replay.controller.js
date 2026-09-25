const replayService =
require("./replay.service");

exports.createReplay =
async (req, res) => {

  try {

    const replay =
      await replayService.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: replay
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getReplays =
async (req, res) => {

  try {

    const replays =
      await replayService.findAll();

    res.json({
      success: true,
      data: replays
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getReplay =
async (req, res) => {

  try {

    const replay =
      await replayService.findById(
        req.params.id
      );

    if (!replay) {

      return res.status(404).json({
        success: false,
        message:
          "Replay not found"
      });

    }

    res.json({
      success: true,
      data: replay
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.updateReplay =
async (req, res) => {

  try {

    const replay =
      await replayService.updateStatus(
        req.params.id,
        req.body.status
      );

    res.json({
      success: true,
      data: replay
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.deleteReplay =
async (req, res) => {

  try {

    await replayService.delete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Replay deleted"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};