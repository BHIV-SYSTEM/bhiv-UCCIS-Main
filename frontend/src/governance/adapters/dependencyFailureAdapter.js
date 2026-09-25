// src/governance/adapters/dependencyFailureAdapter.js

export function dependencyFailureAdapter(
  rawDependencies = []
) {

  return rawDependencies.map(
    (dependency, index) => ({

      id:
        dependency.id || index + 1,

      dependencyName:
        dependency.name ||
        "Operational Dependency",

      affectedDistrict:
        dependency.district ||
        "Unknown District",

      failureImpact:
        dependency.impact ||
        "Execution coordination affected.",

      operationalSeverity:
        dependency.severity || "High",

      affectedDepartments:
        dependency.departments || [
          "Emergency Response"
        ],

      operationalRisk:
        dependency.risk ||
        "Execution delays increasing.",

      mitigationRecommendation:
        dependency.recommendation ||
        "Initiate contingency allocation.",

      updatedAt:
        dependency.updatedAt ||
        "10 mins ago"

    }))
}