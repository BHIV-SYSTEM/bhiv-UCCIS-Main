import React, { useEffect, useMemo, useState } from "react";
import EscalationChartTask38 from "../components/Charts/EscalationChartTask38";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

/* ---------------------------------
   CSV parser
---------------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value.trim());
      value = "";

      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value.trim());

    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) =>
    String(header || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
  );

  return rows.slice(1).map((cells) => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = cells[index] ?? "";
    });

    return item;
  });
}

/* ---------------------------------
   AIS field helper
---------------------------------- */
function getField(row, names) {
  for (const name of names) {
    const key = name.toLowerCase();

    if (
      row[key] !== undefined &&
      row[key] !== null &&
      row[key] !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

/* ---------------------------------
   Normalize AIS row
---------------------------------- */
function normalizeAISRow(row, index) {
  const mmsi = getField(row, ["mmsi"]);

  const timestamp = getField(row, [
    "basedatetime",
    "base_datetime",
    "base date time",
    "timestamp",
    "datetime",
    "time",
  ]);

  const lat = Number(
    getField(row, ["lat", "latitude"])
  );

  const lon = Number(
    getField(row, ["lon", "lng", "longitude"])
  );

  const sog = Number(
    getField(row, [
      "sog",
      "speed over ground",
      "speed",
    ])
  );

  const vesselType = getField(row, [
    "vesseltype",
    "vessel type",
    "shiptype",
    "ship type",
    "type",
  ]);

  const validMMSI =
    String(mmsi).trim() !== "";

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  const parsedDate =
    timestamp !== ""
      ? new Date(timestamp)
      : null;

  const validTimestamp =
    parsedDate &&
    !Number.isNaN(
      parsedDate.getTime()
    );

  const valid =
    validMMSI &&
    validCoordinates &&
    validSOG &&
    validTimestamp;

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(
      mmsi || "Unknown"
    ),
    timestamp:
      timestamp || "Unknown",
    date: validTimestamp
      ? parsedDate
      : null,
    lat,
    lon,
    sog,
    vesselType: String(
      vesselType || "Unknown"
    ),
    valid,
  };
}

/* ---------------------------------
   Tooltip
---------------------------------- */
function CustomTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "6px",
        padding: "10px 12px",
        color: "#ffffff",
      }}
    >
      {label && (
        <div
          style={{
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: "5px",
          }}
        >
          {label}
        </div>
      )}

      {payload.map((item, index) => (
        <div
          key={index}
          style={{
            color: "#ffffff",
          }}
        >
          {item.name}:{" "}
          {typeof item.value === "number"
            ? item.value.toLocaleString()
            : item.value}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  /* ---------------------------------
     Load AIS_file.csv
  ---------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          AIS_FILE,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv (${response.status})`
          );
        }

        const csvText =
          await response.text();

        const parsed =
          parseCSV(csvText);

        const normalized =
          parsed.map(
            normalizeAISRow
          );

        if (!cancelled) {
          setAisRows(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Failed to load AIS data."
          );
          setAisRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------------
     AIS dashboard metrics
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total =
      aisRows.length;

    const valid =
      aisRows.filter(
        (row) => row.valid
      ).length;

    const moving =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      ).length;

    const stationary =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      ).length;

    const invalid =
      aisRows.filter(
        (row) => !row.valid
      ).length;

    const uniqueVessels =
      new Set(
        aisRows
          .map((row) => row.mmsi)
          .filter(
            (mmsi) =>
              mmsi &&
              mmsi !== "Unknown"
          )
      ).size;

    const health =
      total > 0
        ? (valid / total) * 100
        : 0;

    return {
      total,
      valid,
      moving,
      stationary,
      invalid,
      uniqueVessels,
      health,
    };
  }, [aisRows]);

  /* ---------------------------------
     Incident-style distribution

     These are AIS operational states,
     not literal civic incidents.
  ---------------------------------- */
  const incidentData =
    useMemo(
      () => [
        {
          name: "Moving",
          value: metrics.moving,
        },
        {
          name: "Stationary",
          value: metrics.stationary,
        },
        {
          name: "Invalid Telemetry",
          value: metrics.invalid,
        },
      ],
      [metrics]
    );

  const COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div className="page">

      {/* HEADER */}
      <h2>
        UCCIS AIS Dashboard
      </h2>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border:
              "1px solid #ef4444",
            color: "#991b1b",
            padding:
              "12px 14px",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid">

        <div className="card">
          <h3>
            Total AIS Records
          </h3>

          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : metrics.total.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>
            Active Vessel Records
          </h3>

          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : metrics.moving.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>
            Invalid AIS Records
          </h3>

          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : metrics.invalid.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>
            AIS Data Health
          </h3>

          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : `${metrics.health.toFixed(
                  1
                )}%`}
          </h1>
        </div>

      </div>

      {/* AIS SUMMARY */}
      <div className="card">

        <h3>
          AIS Operational Summary
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginTop: "12px",
          }}
        >

          <div
            style={{
              padding: "14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          >
            <strong>
              Unique Vessels
            </strong>
            <br />
            {loading
              ? "Loading..."
              : metrics.uniqueVessels.toLocaleString()}
          </div>

          <div
            style={{
              padding: "14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          >
            <strong>
              Moving Records
            </strong>
            <br />
            {loading
              ? "Loading..."
              : metrics.moving.toLocaleString()}
          </div>

          <div
            style={{
              padding: "14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          >
            <strong>
              Stationary Records
            </strong>
            <br />
            {loading
              ? "Loading..."
              : metrics.stationary.toLocaleString()}
          </div>

          <div
            style={{
              padding: "14px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          >
            <strong>
              Valid Records
            </strong>
            <br />
            {loading
              ? "Loading..."
              : metrics.valid.toLocaleString()}
          </div>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid">

        {/* PIE CHART */}
        <div className="card">

          <h3>
            AIS Activity Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={incidentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {incidentData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* ESCALATION CHART */}
        <div className="card">

          <h3>
            Escalation Breakdown
          </h3>

          <EscalationChartTask38 />

        </div>

      </div>

      {/* AIS DATA STATUS */}
      <div className="card">

        <h3>
          AIS Data Status
        </h3>

        <table
          className="uccis-table"
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>
                Metric
              </th>
              <th>
                Value
              </th>
              <th>
                Meaning
              </th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td
                style={{
                  color: "#000000",
                }}
              >
                Total Records
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                {metrics.total.toLocaleString()}
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                AIS telemetry records
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#000000",
                }}
              >
                Valid Records
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                {metrics.valid.toLocaleString()}
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                Records with valid MMSI,
                coordinates, SOG and timestamp
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#000000",
                }}
              >
                Moving
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                {metrics.moving.toLocaleString()}
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                Valid records with SOG greater than 0
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#000000",
                }}
              >
                Stationary
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                {metrics.stationary.toLocaleString()}
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                Valid records with SOG equal to 0
              </td>
            </tr>

            <tr>
              <td
                style={{
                  color: "#000000",
                }}
              >
                Invalid
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                {metrics.invalid.toLocaleString()}
              </td>

              <td
                style={{
                  color: "#000000",
                }}
              >
                Records failing AIS validation
              </td>
            </tr>

          </tbody>
        </table>

      </div>

    </div>
  );
}
