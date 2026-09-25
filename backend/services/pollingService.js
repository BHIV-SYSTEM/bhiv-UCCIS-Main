const startPolling = () => {
  setInterval(() => {
    console.log("Polling telemetry data...");
  }, 5000);
};

module.exports = startPolling;