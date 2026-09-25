const { processSignals } = require("../signal-adapter/signalController");

// replaces manual trigger if needed
const runRuntimeEngine = async () => {
  return await processSignals();
};

module.exports = {
  runRuntimeEngine
};