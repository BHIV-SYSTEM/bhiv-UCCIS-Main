const propagationMap = {

  "South Mumbai": ["Bandra"],

  "Bandra": ["Thane West"],

  "Thane West": ["Kalyan"],

  "Kalyan": ["Navi Mumbai"],

  "Navi Mumbai": ["Panvel"]
};

function propagationLogic(zone, escalationLevel) {

  const connectedZones =
    propagationMap[zone] || [];

  return {
    propagation_risk:
      escalationLevel === "CRITICAL"
        ? "HIGH"
        : "LOW",

    impacted_zones: connectedZones
  };
}

module.exports = propagationLogic;