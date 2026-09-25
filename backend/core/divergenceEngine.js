const { getEvents } = require("./appendOnlyStore");

function detectReplayDivergence() {

  const events = getEvents();

  let divergence = [];

  for (let i = 1; i < events.length; i++) {

    if (
      events[i].timestamp < events[i - 1].timestamp
    ) {
      divergence.push({
        index: i,
        issue: "OUT_OF_ORDER_EVENT"
      });
    }
  }

  return {
    divergenceDetected: divergence.length > 0,
    issues: divergence
  };
}

module.exports = {
  detectReplayDivergence
};