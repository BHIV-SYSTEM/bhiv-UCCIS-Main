const telemetryStore = {
  operators: 184,

  incidents: 12,

  entropy: 12,

  heartbeat: "ACTIVE",

  escalationRisk: "LOW",

  runtimeStatus: "STABLE",

  operationalIntelligence: {
    threatLevel: "MODERATE",

    fieldStability: 89,

    escalationPressure: 24,

    districtFocus: "PUNE"
  },

  updatedAt: new Date().toISOString()
};

module.exports = telemetryStore;