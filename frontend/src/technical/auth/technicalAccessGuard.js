// src/technical/auth/technicalAccessGuard.js

export function technicalAccessGuard() {

  const mode =
    localStorage.getItem(
      "UCCIS_TECHNICAL_MODE"
    );

  return mode === "ENABLED";

}