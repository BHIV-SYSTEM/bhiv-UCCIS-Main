// src/governance/live/districtStressEngine.js

export function districtStressEngine(
  districts = []
) {

  return districts.map((d) => {

    const stress =
      d.incidents * 10 +
      d.delays * 8 +
      d.escalations * 12;

    return {

      district: d.name,

      stressLevel: stress,

      category:

        stress > 80
          ? "CRITICAL"
          : stress > 50
          ? "HIGH"
          : "MODERATE",

      label:

        stress > 80
          ? "Severe Operational Pressure"
          : stress > 50
          ? "Rising Operational Load"
          : "Stable Operations"

    };
  });
}