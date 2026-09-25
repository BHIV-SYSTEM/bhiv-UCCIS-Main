// src/governance/adapters/geoOperationalAdapter.js

export function geoOperationalAdapter(
  rawGeoOperations = []
) {

  return rawGeoOperations.map(
    (geo, index) => {

      return {

        id:
          geo.id || index + 1,

        district:
          geo.district ||
          "Unknown District",

        operationalZone:
          geo.zone ||
          "Sector Zone",

        geoLocation:
          geo.location ||
          "Location unavailable",

        operationalStatus:
          geo.status ||
          "Operational Monitoring Active",

        fieldTeam:
          geo.fieldTeam ||
          "Field Unit Alpha",

        citizenImpact:
          geo.citizenImpact ||
          "Localized operational disruption detected.",

        accessCondition:
          geo.accessCondition ||
          "Routes operationally accessible.",

        deploymentStatus:
          geo.deploymentStatus ||
          "Field deployment active.",

        operationalRisk:
          geo.operationalRisk ||
          "Moderate",

        recommendedAction:
          geo.recommendedAction ||
          "Continue field coordination and monitoring.",

        updatedAt:
          geo.updatedAt ||
          "3 mins ago"

      };
    });
}