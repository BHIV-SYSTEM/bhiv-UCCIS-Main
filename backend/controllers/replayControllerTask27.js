const ReplayServiceTask27 =
require("../services/replayServiceTask27");

const RuntimeService =
require("../services/runtimeService");

exports.generateReplay =
async (req, res) => {

  try {

    const { incidentId } = req.body;

    const replay =
      await ReplayService.create(
        incidentId
      );

    await RuntimeService.create(
      replay.insertId
    );

    res.status(201).json({
      success: true,
      replayId: replay.insertId
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};