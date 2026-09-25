// src/governance/transformers/operationalDelayTransformer.js

export function operationalDelayTransformer(
  delays = []
) {

  return delays.map(
    (delay, index) => {

      const delayMinutes =
        delay.delayMinutes || 0;

      return {

        id:
          delay.id || index + 1,

        operation:
          delay.operation ||
          "Operational Activity",

        district:
          delay.district ||
          "Unknown District",

        delayDuration:
          `${delayMinutes} mins`,

        delaySeverity:

          delayMinutes > 90
            ? "Critical"

            : delayMinutes > 45
            ? "High"

            : delayMinutes > 20
            ? "Moderate"

            : "Minor",

        operationalImpact:

          delayMinutes > 90

            ? "Critical execution degradation affecting dependent operations."

            : delayMinutes > 45

            ? "Execution timelines significantly impacted."

            : delayMinutes > 20

            ? "Operational efficiency reduced temporarily."

            : "Minor execution slowdown detected.",

        rootCause:
          delay.reason ||
          "Traffic congestion and field pressure.",

        affectedUnits:
          delay.affectedUnits || [
            "Emergency Response Team"
          ],

        mitigationRecommendation:

          delayMinutes > 90

            ? "Immediate administrative intervention required."

            : delayMinutes > 45

            ? "Increase deployment coordination capacity."

            : "Continue operational monitoring.",

        expectedRecovery:
          delay.expectedRecovery ||
          "30 mins"

      };
    });
}