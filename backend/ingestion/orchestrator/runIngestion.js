const ingestWeatherData = require("../weather/weatherAdapter");
const ingestFloodingData = require("../flooding/floodingAdapter");
const ingestTrafficData = require("../traffic/trafficAdapter");
const ingestComplaintData = require("../complaints/complaintsAdapter");
const ingestWaterData = require("../water/waterAdapter");
const ingestWasteData = require("../waste/wasteAdapter");

const traceLogger = require("../../storage/traces/traceLogger");

const storeReplaySignal = require("../../storage/replay/replayStorage");

function runIngestion() {

  const signals = [];

  signals.push(ingestWeatherData());
  signals.push(ingestFloodingData());
  signals.push(ingestTrafficData());
  signals.push(ingestComplaintData());
  signals.push(ingestWaterData());
  signals.push(ingestWasteData());

  signals.forEach((signal) => {

    traceLogger(signal);

    storeReplaySignal(signal);
  });

  return signals;
}

module.exports = runIngestion;