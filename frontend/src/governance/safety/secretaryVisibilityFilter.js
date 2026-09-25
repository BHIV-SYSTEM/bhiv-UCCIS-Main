// src/governance/safety/secretaryVisibilityFilter.js

const blockedFields = [
  "contracts",
  "packets",
  "payloads",
  "telemetry",
  "traces",
  "schema",
  "debug",
  "sync",
  "raw"
];

export function secretaryVisibilityFilter(data) {

  const cloned =
    JSON.parse(JSON.stringify(data));

  function clean(obj) {

    Object.keys(obj).forEach((key) => {

      const lower =
        key.toLowerCase();

      if (
        blockedFields.some(term =>
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