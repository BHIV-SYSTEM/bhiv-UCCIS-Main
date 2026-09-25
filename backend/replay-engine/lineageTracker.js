const lineage = [];

function trackReplay(event) {

  const replay = {
    id: Date.now(),
    event,
    confidence: Math.floor(Math.random() * 100),
    stale: false,
    divergence: false,
    corruption: false,
    delayedRecovery: false,
    uncertainty: "LOW",
    timestamp: new Date()
  };

  lineage.push(replay);

  return replay;
}

function getLineage() {
  return lineage;
}

module.exports = {
  trackReplay,
  getLineage
};