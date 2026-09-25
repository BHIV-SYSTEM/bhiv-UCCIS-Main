const DOMAIN_PRIORITY = {
  flooding: 5,
  water_shortage: 4,
  waste_overload: 3,
  complaints: 2,
  traffic: 1
};

const GOVERNANCE_STATES = [
  "APPROVED",
  "REJECTED",
  "RETRY",
  "HOLD",
  "ESCALATED"
];

module.exports = {
  DOMAIN_PRIORITY,
  GOVERNANCE_STATES
};