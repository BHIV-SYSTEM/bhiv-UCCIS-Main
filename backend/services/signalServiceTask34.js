const { task34DB } = require("../config/db");

exports.getAllSignals = async () => {
  return {
    totalSignals: 12,
    activeSignals: 8,
    criticalSignals: 4
  };
};

exports.createSignal = async (data) => {
  return {
    message: "Signal Created",
    signal: data
  };
};