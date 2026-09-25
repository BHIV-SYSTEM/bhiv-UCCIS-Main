// src/governance/replayValidation/staleSessionDetector.js

export function staleSessionDetector(sessions = []) {

  return sessions.map(session => {

    const ageMinutes =
      session.ageMinutes || 0;

    return {

      sessionId: session.id,

      status:
        ageMinutes > 30
          ? "STALE"
          : "ACTIVE",

      riskLevel:
        ageMinutes > 30
          ? "HIGH"
          : "LOW",

      recommendation:
        ageMinutes > 30
          ? "Force refresh session state"
          : "Session healthy"

    };
  });
}