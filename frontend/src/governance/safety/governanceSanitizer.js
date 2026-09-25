// src/governance/safety/governanceSanitizer.js

import { forbiddenTerms } from "./forbiddenTerms";

export function sanitizeOperationalData(data) {
  const cloned = JSON.parse(JSON.stringify(data));

  function clean(obj) {
    Object.keys(obj).forEach((key) => {
      const lower = key.toLowerCase();

      if (
        forbiddenTerms.some((term) =>
          lower.includes(term)
        )
      ) {
        delete obj[key];
      }

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        clean(obj[key]);
      }
    });
  }

  clean(cloned);

  return cloned;
}