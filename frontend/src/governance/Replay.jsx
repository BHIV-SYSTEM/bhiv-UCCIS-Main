import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

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
      if (char === "\r" && next === "\n") i++;
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

  if (!rows.length) return [];

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

  const date =
    timestamp !== ""
      ? new Date(timestamp)
      : null;

  const validTimestamp =
    date &&
    !Number.isNaN(date.getTime());

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(mmsi || "Unknown"),
    timestamp: timestamp || "Unknown",
    date: validTimestamp ? date : null,
    lat,
    lon,
    sog,
    vesselType: String(
      vesselType || "Unknown"
    ),
    valid:
      validMMSI &&
      validCoordinates &&
      validSOG &&
      validTimestamp,
  };
}

function getReplayStatus(row) {
  if (!row.valid) return "Failed";
  if (row.sog === 0) return "In Progress";
  return "Completed";
}

function getSeverity(row) {
  if (!row.valid) return "Critical";
  if (row.sog === 0) return "High";
  return "Medium";
}

function getComplexity(row) {
  if (!row.valid) return "High Complexity";
  if (row.sog === 0) return "Medium Complexity";
  return "Low Complexity";
}

function getService(row) {
  if (row.vesselType === "Unknown") {
    return "AIS Telemetry Engine";
  }

  return `AIS ${row.vesselType} Monitoring`;
}

function getReplayTitle(row) {
  if (!row.valid) {
    return "AIS Validation Replay";
  }

  if (row.sog === 0) {
    return "Stationary Vessel Replay";
  }

  return "Active Vessel Telemetry Replay";
}

function formatDate(value) {
  if (!value || value === "Unknown") {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

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

export default function Replay() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

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

  const traces = useMemo(() => {
    return [...aisRows]
      .sort(
        (a, b) =>
          (b.date?.getTime() || 0) -
          (a.date?.getTime() || 0)
      )
      .slice(0, 25)
      .map((row) => ({
        id: `TRACE-${row.mmsi}-${row.id.replace(
          "AIS-",
          ""
        )}`,
        title:
          getReplayTitle(row),
        status:
          getReplayStatus(row),
        service:
          getService(row),
        duration:
          row.valid
            ? Math.max(
                1,
                Math.round(
                  row.sog * 10
                )
              )
            : 0,
        steps:
          row.valid
            ? row.sog > 0
              ? 10
              : 7
            : 4,
        severity:
          getSeverity(row),
        complexity:
          getComplexity(row),
        mmsi:
          row.mmsi,
        vesselType:
          row.vesselType,
        sog:
          row.sog,
        timestamp:
          row.timestamp,
        lat:
          row.lat,
        lon:
          row.lon,
        valid:
          row.valid,
      }));
  }, [aisRows]);

  const stats = useMemo(() => ({
    total: aisRows.length,
    completed:
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      ).length,
    inProgress:
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      ).length,
    failed:
      aisRows.filter(
        (row) => !row.valid
      ).length,
  }), [aisRows]);

  const pieData = useMemo(
    () => [
      {
        name: "Completed",
        value: stats.completed,
      },
      {
        name: "In Progress",
        value: stats.inProgress,
      },
      {
        name: "Failed",
        value: stats.failed,
      },
    ],
    [stats]
  );

  const pieColors = [
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  const barData = useMemo(
    () => [
      {
        name: "Low Complexity",
        value:
          aisRows.filter(
            (row) =>
              row.valid &&
              row.sog > 0
          ).length,
      },
      {
        name: "Medium Complexity",
        value:
          aisRows.filter(
            (row) =>
              row.valid &&
              row.sog === 0
          ).length,
      },
      {
        name: "High Complexity",
        value:
          aisRows.filter(
            (row) => !row.valid
          ).length,
      },
    ],
    [aisRows]
  );

  const barColors = [
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <div className="page">

      <h2>
        AIS Replay Engine
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
          <h3>Total Traces</h3>
          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : stats.total.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : stats.completed.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>In Progress</h3>
          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : stats.inProgress.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Failed</h3>
          <h1
            style={{
              color: "#ffffff",
            }}
          >
            {loading
              ? "..."
              : stats.failed.toLocaleString()}
          </h1>
        </div>

      </div>

      <div className="grid">

        {/* TRACE LIST */}
        <div className="card">

          <h3>
            AIS Trace Replay List
          </h3>

          {loading ? (
            <p
              style={{
                color: "#000000",
              }}
            >
              Loading AIS replay data...
            </p>
          ) : traces.length === 0 ? (
            <p
              style={{
                color: "#000000",
              }}
            >
              No AIS replay records found.
            </p>
          ) : (
            traces.map((t) => (
              <div
                key={t.id}
                className="card"
                style={{
                  marginBottom: "10px",
                  color: "#000000",
                }}
              >
                <b>
                  {t.id}
                </b>

                <p>
                  {t.title}
                </p>

                <p>
                  Status:{" "}
                  {t.status}
                </p>

                <p>
                  Vessel Type:{" "}
                  {t.vesselType}
                </p>

                <p>
                  MMSI:{" "}
                  {t.mmsi}
                </p>

                <p>
                  Service:{" "}
                  {t.service}
                </p>

                <p>
                  Steps:{" "}
                  {t.steps}
                </p>

                <p>
                  Duration:{" "}
                  {t.duration}ms
                </p>

                <p>
                  Severity:{" "}
                  {t.severity}
                </p>

                <p>
                  Timestamp:{" "}
                  {formatDate(
                    t.timestamp
                  )}
                </p>
              </div>
            ))
          )}

        </div>

        {/* PIE CHART */}
        <div className="card">

          <h3>
            AIS Replay Status Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        pieColors[
                          index
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

      </div>

      {/* BAR CHART */}
      <div className="card">

        <h3>
          AIS Trace Complexity Distribution
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={barData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 45,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              label={{
                value:
                  "Trace Complexity",
                position:
                  "insideBottom",
                offset: -20,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value:
                  "Trace Count",
                angle: -90,
                position:
                  "insideLeft",
              }}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

            <Bar
              dataKey="value"
              name="AIS Traces"
            >
              {barData.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      barColors[
                        index
                      ]
                    }
                  />
                )
              )}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* AIS REPLAY RESPONSE */}
      <div className="card">

        <h3>
          AIS Replay Response
        </h3>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >

          <table
            className="uccis-table"
            style={{
              width: "100%",
              minWidth: "1100px",
            }}
          >

            <thead>
              <tr>
                <th>Trace ID</th>
                <th>MMSI</th>
                <th>Vessel Type</th>
                <th>Status</th>
                <th>Severity</th>
                <th>SOG</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px",
                    }}
                  >
                    Loading AIS replay response...
                  </td>
                </tr>
              ) : traces.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px",
                    }}
                  >
                    No AIS replay records found.
                  </td>
                </tr>
              ) : (
                traces
                  .slice(0, 15)
                  .map(
                    (item) => (
                      <tr
                        key={`${item.id}-table`}
                      >
                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {item.id}
                        </td>

                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {item.mmsi}
                        </td>

                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {item.vesselType}
                        </td>

                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {item.status}
                        </td>

                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {item.severity}
                        </td>

                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {Number.isFinite(
                            item.sog
                          )
                            ? item.sog.toFixed(
                                2
                              )
                            : "Invalid"}
                        </td>

                        <td
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {formatDate(
                            item.timestamp
                          )}
                        </td>
                      </tr>
                    )
                  )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
