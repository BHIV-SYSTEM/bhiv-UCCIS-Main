import React, { useEffect, useState } from "react";

const AIS_FILE_PATH = "/AIS_file.csv";

const TIMESTAMP_COLUMNS = [
  "timestamp",
  "basedatetime",
  "base_datetime",
  "datetime",
  "date_time",
  "time",
  "eventtime",
];

const VESSEL_COLUMNS = [
  "mmsi",
  "vesselid",
  "vessel_id",
  "shipid",
  "ship_id",
  "imo",
];

const normalizeKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

function parseCSVLine(line) {
  const values = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value.trim());
  return values;
}

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.trim()
  );

  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });

  return { headers, rows };
}

function findColumn(headers, candidates) {
  return headers.find((header) =>
    candidates.includes(normalizeKey(header))
  );
}

function createFingerprint(rows, headers) {
  // Stable serialization: same headers and records produce
  // the same fingerprint while preserving row order.
  const serialized = JSON.stringify(
    rows.map((row) =>
      headers.map((header) => String(row[header] ?? ""))
    )
  );

  // Deterministic non-cryptographic checksum.
  let hash = 2166136261;

  for (let i = 0; i < serialized.length; i++) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function validateAISDataset(headers, rows) {
  const timestampColumn = findColumn(
    headers,
    TIMESTAMP_COLUMNS
  );

  const vesselColumn = findColumn(
    headers,
    VESSEL_COLUMNS
  );

  const timestamps = timestampColumn
    ? rows.map((row) => {
        const rawValue = row[timestampColumn];
        const parsed = Date.parse(rawValue);

        return Number.isNaN(parsed) ? null : parsed;
      })
    : [];

  const allTimestampsValid =
    Boolean(timestampColumn) &&
    timestamps.length > 0 &&
    timestamps.every((value) => value !== null);

  const timestampOrderValid =
    allTimestampsValid &&
    timestamps.every(
      (value, index) =>
        index === 0 || value >= timestamps[index - 1]
    );

  const fingerprint1 = createFingerprint(rows, headers);
  const fingerprint2 = createFingerprint(rows, headers);

  const uniqueVessels = vesselColumn
    ? new Set(
        rows
          .map((row) => String(row[vesselColumn] ?? "").trim())
          .filter(Boolean)
      ).size
    : null;

  return {
    recordCount: rows.length,
    uniqueVessels,
    timestampColumn: timestampColumn || null,
    vesselColumn: vesselColumn || null,
    immutableOrderValid: timestampColumn
      ? allTimestampsValid
        ? timestampOrderValid
        : null
      : null,
    appendOnlyValid: null,
    deterministicReplay: fingerprint1 === fingerprint2,
    fingerprint: fingerprint1,
    issues: [
      ...(!timestampColumn
        ? [
            "No supported timestamp column was found. Chronological order could not be checked.",
          ]
        : !allTimestampsValid
        ? [
            `The timestamp column "${timestampColumn}" contains missing or unrecognized timestamps.`,
          ]
        : !timestampOrderValid
        ? [
            `AIS records are not in chronological order according to "${timestampColumn}".`,
          ]
        : []),

      ...(!vesselColumn
        ? [
            "No recognized vessel ID column was found. Unique vessel count is unavailable.",
          ]
        : []),

      "Append-only behavior cannot be proven from a CSV snapshot alone. A prior baseline or audit log is required.",
    ],
  };
}

function StatusRow({ label, status, detail }) {
  const styles = {
    valid: {
      background: "#dcfce7",
      color: "#166534",
      label: "VALID",
    },
    broken: {
      background: "#fee2e2",
      color: "#991b1b",
      label: "BROKEN",
    },
    unverified: {
      background: "#fef3c7",
      color: "#92400e",
      label: "UNVERIFIED",
    },
  };

  const current = styles[status] || styles.unverified;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        padding: "14px 16px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {label}
        </div>

        {detail && (
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {detail}
          </div>
        )}
      </div>

      <span
        style={{
          padding: "6px 10px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 800,
          background: current.background,
          color: current.color,
          whiteSpace: "nowrap",
        }}
      >
        {current.label}
      </span>
    </div>
  );
}

function SummaryCard({ label, value, detail }) {
  return (
    <div
      style={{
        padding: 16,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#111827",
          fontSize: 25,
          fontWeight: 800,
        }}
      >
        {value}
      </div>

      {detail && (
        <div
          style={{
            marginTop: 4,
            color: "#64748b",
            fontSize: 12,
          }}
        >
          {detail}
        </div>
      )}
    </div>
  );
}

export default function ReplayValidationDashboard({
  result,
}) {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAISFile() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(AIS_FILE_PATH, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Could not load ${AIS_FILE_PATH} (HTTP ${response.status}).`
          );
        }

        const csvText = await response.text();
        const { headers, rows } = parseCSV(csvText);

        if (!headers.length || !rows.length) {
          throw new Error(
            "AIS_file.csv is empty or has an invalid CSV structure."
          );
        }

        const validation = validateAISDataset(headers, rows);

        if (!cancelled) {
          setDataset(validation);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "An error occurred while loading the AIS dataset."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAISFile();

    return () => {
      cancelled = true;
    };
  }, []);

  // Use externally supplied replay-validation results when available.
  // Otherwise, use the checks computed from AIS_file.csv.
  const immutableOrderValid =
    typeof result?.immutableOrderValid === "boolean"
      ? result.immutableOrderValid
      : dataset?.immutableOrderValid;

  const appendOnlyValid =
    typeof result?.appendOnlyValid === "boolean"
      ? result.appendOnlyValid
      : null;

  const deterministicReplay =
    typeof result?.deterministicReplay === "boolean"
      ? result.deterministicReplay
      : dataset?.deterministicReplay;

  const issues = [
    ...(Array.isArray(result?.issues) ? result.issues : []),
    ...(dataset?.issues || []),
  ];

  const uniqueIssues = [...new Set(issues)];

  const getStatus = (value) => {
    if (value === true) return "valid";
    if (value === false) return "broken";
    return "unverified";
  };

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        borderRadius: 16,
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
        color: "#111827",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 28,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Distributed Replay Validation
        </h1>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: 14,
          }}
        >
          AIS dataset integrity and deterministic processing checks
        </p>
      </div>

      {loading && (
        <div
          style={{
            padding: 16,
            marginBottom: 18,
            background: "#eff6ff",
            color: "#1d4ed8",
            borderRadius: 10,
          }}
        >
          Loading AIS_file.csv and validating records...
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: 16,
            marginBottom: 18,
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: 10,
          }}
        >
          <strong>AIS dataset loading failed.</strong>
          <p style={{ marginBottom: 0 }}>{error}</p>
          <p style={{ marginBottom: 0, fontSize: 13 }}>
            Confirm that AIS_file.csv is inside your React app's
            public folder.
          </p>
        </div>
      )}

      {dataset && (
        <>
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 18,
              color: "#111827",
            }}
          >
            AIS Dataset Summary
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <SummaryCard
              label="AIS Records"
              value={dataset.recordCount.toLocaleString("en-IN")}
              detail="Rows loaded from AIS_file.csv"
            />

            <SummaryCard
              label="Unique Vessels"
              value={
                dataset.uniqueVessels === null
                  ? "Unavailable"
                  : dataset.uniqueVessels.toLocaleString("en-IN")
              }
              detail={
                dataset.vesselColumn
                  ? `Column: ${dataset.vesselColumn}`
                  : "Vessel ID column not detected"
              }
            />

            <SummaryCard
              label="Dataset Fingerprint"
              value={dataset.fingerprint}
              detail="Order-sensitive checksum"
            />
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 18,
              color: "#111827",
            }}
          >
            Validation Results
          </h2>

          <div style={{ display: "grid", gap: 12 }}>
            <StatusRow
              label="Immutable Order"
              status={getStatus(immutableOrderValid)}
              detail={
                dataset.timestampColumn
                  ? `Checks chronological order using ${dataset.timestampColumn}. This does not prove historical immutability.`
                  : "A supported timestamp column is required to check chronological order."
              }
            />

            <StatusRow
              label="Append-only"
              status={getStatus(appendOnlyValid)}
              detail="Requires a stored baseline or append-only audit log."
            />

            <StatusRow
              label="Deterministic Replay"
              status={getStatus(deterministicReplay)}
              detail="Checks that repeated processing of the loaded CSV produces the same fingerprint; this is not a full historical replay comparison."
            />
          </div>

          {dataset.timestampColumn && (
            <p
              style={{
                marginTop: 14,
                fontSize: 12,
                color: "#64748b",
              }}
            >
              Timestamp column detected:{" "}
              <strong>{dataset.timestampColumn}</strong>
            </p>
          )}
        </>
      )}

      {uniqueIssues.length > 0 && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#ffffff",
            border: "1px solid #fecaca",
            borderRadius: 10,
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 17,
              color: "#b91c1c",
            }}
          >
            Validation Notes
          </h2>

          <ul
            style={{
              margin: 0,
              paddingLeft: 22,
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            {uniqueIssues.map((issue, index) => (
              <li key={`${index}-${issue}`}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
