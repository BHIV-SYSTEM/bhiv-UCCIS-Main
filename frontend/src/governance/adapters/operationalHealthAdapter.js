// src/governance/adapters/operationalHealthAdapter.js

export function operationalHealthAdapter(
  rawDistricts = []
) {

  return rawDistricts.map(
    (district, index) => {

      const score =
        district.healthScore || 0;

      return {

        id:
          district.id || index + 1,

        district:
          district.name ||
          "Unknown District",

        operationalHealthScore:
          score,

        operationalStatus:
          score > 80
            ? "Operationally Stable"
            : score > 60
            ? "Moderate Operational Stress"
            : "Critical Operational Pressure",

        fieldResponse:
          district.fieldResponse ||
          "Stable",

        escalationLoad:
          district.escalationLoad ||
          "Moderate",

        citizenImpact:
          district.citizenImpact ||
          "Localized disruptions reported.",

        resourceAvailability:
          district.resources ||
          "Available",

        executionEfficiency:
          district.executionEfficiency ||
          "72%",

        recommendedAttention:
          score < 60
            ? "Immediate administrative review recommended."
            : "Continue operational monitoring."

      };
    });
}