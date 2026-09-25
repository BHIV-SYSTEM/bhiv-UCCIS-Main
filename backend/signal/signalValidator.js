function validateSignal(signal) {
  if (!signal.trace_id) return false;
  if (!signal.zone_id) return false;
  if (!signal.data) return false;

  return true;
}

module.exports = {
  validateSignal
};