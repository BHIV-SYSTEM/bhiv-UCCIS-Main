// src/governance/safety/fieldVisibilityFilter.js

const blockedOperationalFields = [

  /* =========================
     ENGINEERING INTERNALS
  ========================= */

  "payload",
  "payloads",

  "packet",
  "packets",

  "trace",
  "traces",

  "telemetry",

  "schema",
  "schemas",

  "debug",

  "sync",
  "synchronization",

  "node",
  "nodes",

  "transport",

  "serialization",

  "cluster",

  "eventstream",

  "raw",

  "internal",

  "systemlog",

  "queue",

  "broker",

  "consumer",

  "producer",

  "offset",

  "partition",

  "replica",

  "replication",

  /* =========================
     SECURITY / SENSITIVE
  ========================= */

  "token",

  "secret",

  "apikey",

  "credential",

  "password",

  "signature",

  "hash",

  "session",

  /* =========================
     CONTRACT / BACKEND
  ========================= */

  "contract",

  "contracts",

  "database",

  "collection",

  "mongodb",

  "postgres",

  "sql",

  "query",

  "pipeline",

  "aggregation",

  "index"

];

export function fieldVisibilityFilter(data) {

  if (!data) {
    return {};
  }

  const cloned =
    JSON.parse(JSON.stringify(data));

  function sanitize(obj) {

    if (!obj || typeof obj !== "object") {
      return;
    }

    Object.keys(obj).forEach((key) => {

      const normalizedKey =
        key.toLowerCase();

      const shouldBlock =
        blockedOperationalFields.some(
          field =>
            normalizedKey.includes(field)
        );

      /* =========================
         REMOVE BLOCKED FIELDS
      ========================= */

      if (shouldBlock) {

        delete obj[key];

        return;
      }

      /* =========================
         CLEAN STRINGS
      ========================= */

      if (
        typeof obj[key] === "string"
      ) {

        let cleanedValue =
          obj[key];

        blockedOperationalFields.forEach(
          (field) => {

            const regex =
              new RegExp(
                field,
                "gi"
              );

            cleanedValue =
              cleanedValue.replace(
                regex,
                "[REDACTED]"
              );
          }
        );

        obj[key] = cleanedValue;
      }

      /* =========================
         RECURSIVE CLEANING
      ========================= */

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        sanitize(obj[key]);
      }

    });
  }

  sanitize(cloned);

  return cloned;
}