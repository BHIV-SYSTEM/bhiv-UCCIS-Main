const ReplayTask39 =
require("../models/ReplayTask39");

exports.createReplay =
async (req, res) => {

  try {

    const replay =
      await ReplayTask39.create({

        replayId:
          `REP-${Date.now()}`,

        incidentId:
          req.body.incidentId,

        traceId:
          req.body.traceId,

        status:
          "Completed",

        startedAt:
          new Date(),

        completedAt:
          new Date(),

        duration:
          0
      });

    res.status(201).json({
      success: true,
      data: replay
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getReplays =
async (req, res) => {

  try {

    const replays =
      await ReplayTask39.find()
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: replays.length,
      data: replays
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};