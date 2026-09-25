const lastExecutionMap = new Map();

function shouldTrigger(zone_id, state) {
  const key = zone_id;
  const last = lastExecutionMap.get(key);

  if (!last || last !== state) {
    lastExecutionMap.set(key, state);
    return true;
  }

  return false;
}

module.exports = { shouldTrigger };