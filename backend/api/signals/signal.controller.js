const signalService =
require("./signal.service");

exports.createSignal =
async (req, res) => {

  try {

    const signal =
      await signalService.create(
        req.body
      );

    res.status(201).json({
      success: true,
      data: signal
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getSignals =
async (req, res) => {

  try {

    const data =
      await signalService.findAll();

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