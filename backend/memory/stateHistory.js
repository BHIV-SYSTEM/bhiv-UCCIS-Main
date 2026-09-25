const history = [];

function pushState(snapshot) {
  if (!snapshot || !snapshot.zone_id) return;

  history.push({
    zone_id: String(snapshot.zone_id).toLowerCase(),
    current_state: snapshot.current_state || "UNKNOWN",
    risk_score: snapshot.risk_score ?? 0,
    confidence_score: snapshot.confidence_score ?? 0,
    timestamp: snapshot.timestamp || new Date().toISOString(),
  });

  if (history.length > 100) {
    history.shift();
  }

  console.log("Replay History Saved");
  console.log(history);
}

function getHistory(zone_id) {
  return history.filter(
    h => h.zone_id === String(zone_id).toLowerCase()
  );
}

module.exports = {
  pushState,
  getHistory,
};