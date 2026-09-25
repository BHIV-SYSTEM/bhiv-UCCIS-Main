const { runFloodScenario } = require("../services/operationalChain");

exports.executeFloodScenario = async (req, res) => {
  try {

    const result = await runFloodScenario();

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};