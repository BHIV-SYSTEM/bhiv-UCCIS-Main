// src/governance/safety/executiveVisibilityFilter.js

const forbiddenExecutiveFields = [
  "contracts",
  "payloads",
  "packets",
  "telemetry",
  "traces",
  "schemas",
  "debug",
  "sync"
];

export function executiveVisibilityFilter(data) {
  const cloned =
    JSON.parse(JSON.stringify(data));

  function remove(obj) {

    Object.keys(obj).forEach((key) => {

      const lower = key.toLowerCase();

      if (
        forbiddenExecutiveFields.some(term =>
          lower.includes(term)
        )
      ) {
        delete obj[key];
      }

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        remove(obj[key]);
      }

    });
  }

  remove(cloned);

  return cloned;
}