const validateZone = (zone) => {
  if (
    !zone ||
    typeof zone.zone_id !== "string" ||
    typeof zone.trace_id !== "string" ||
    typeof zone.risk_score !== "number" ||
    typeof zone.decision_ready !== "boolean" ||
    typeof zone.decision_type !== "string"
  ) {
    return false;
  }

  return true;
};

const validateZoneArray = (zones) => {
  if (!Array.isArray(zones)) return false;

  return zones.every(validateZone);
};

module.exports = {
  validateZone,
  validateZoneArray
};