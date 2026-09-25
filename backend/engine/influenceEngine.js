function applyInfluence(domains) {

  // Example:
  // Water shortage increases complaint intensity

  if (
    domains.water_shortage &&
    domains.water_shortage.level === "HIGH"
  ) {
    domains.complaints.score += 15;
    domains.complaints.influenced_by = "water_shortage";
  }

  // Flooding affects traffic

  if (
    domains.flooding &&
    domains.flooding.level === "HIGH"
  ) {
    domains.traffic.score += 20;
    domains.traffic.influenced_by = "flooding";
  }

  return domains;
}

module.exports = {
  applyInfluence
};