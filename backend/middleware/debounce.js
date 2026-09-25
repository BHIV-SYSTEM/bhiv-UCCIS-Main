const lastCallMap = new Map();

function debounceExecution(zone_id, cooldownMs = 5000) {
  const now = Date.now();
  const last = lastCallMap.get(zone_id) || 0;

  if (now - last < cooldownMs) {
    return false; // BLOCK
  }

  lastCallMap.set(zone_id, now);
  return true; // ALLOW
}

module.exports = debounceExecution;