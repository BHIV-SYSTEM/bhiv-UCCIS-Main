import React, { useEffect, useMemo, useState } from "react";
import RebuildSprint from "../../layout/RebuildSprint";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#dc2626"
];

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
   Normalize AIS record
---------------------------------- */
function normalizeAISRow(row, index) {
  const mmsi = getField(row, [
    "mmsi"
  ]);

  const timestamp = getField(row, [
    "basedatetime",
    "base_datetime",
    "base date time",
    "timestamp",
    "datetime",
    "time"
  ]);

  const latRaw = getField(row, [
    "lat",
    "latitude"
  ]);

  const lonRaw = getField(row, [
    "lon",
    "lng",
    "longitude"
  ]);

  const sogRaw = getField(row, [
    "sog",
    "speed over ground",
    "speed"
  ]);

  const vesselType = getField(row, [
    "vesseltype",
    "vessel type",
    "shiptype",
    "ship type",
    "type"
  ]);

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  const sog = Number(sogRaw);

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

  const validTimestamp =
    timestamp !== "" &&
    !Number.isNaN(
      new Date(timestamp).getTime()
    );

  const valid =
    validMMSI &&
    validCoordinates &&
    validSOG &&
    validTimestamp;

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(mmsi || "Unknown"),
    timestamp: timestamp || "Unknown",
    lat,
    lon,
    sog,
    vesselType: String(
      vesselType || "Unknown"
    ),
    validMMSI,
    validCoordinates,
    validSOG,
    validTimestamp,
    valid
  };
}

/* ---------------------------------
   Priority classification
---------------------------------- */
function getPriority(row) {
  /*
    P1 = invalid telemetry or very high
         vessel speed
    P2 = stationary operational activity
    P3 = normal moving activity
    P4 = valid low-speed activity
  */

  if (!row.valid || row.sog >= 20) {
    return "P1";
  }

  if (row.sog === 0) {
    return "P2";
  }

  if (row.sog >= 10) {
    return "P3";
  }

  return "P4";
}

/* ---------------------------------
   Escalation status
---------------------------------- */
function getStatus(row) {
  if (!row.valid || row.sog >= 20) {
    return "Critical";
  }

  if (row.sog === 0) {
    return "Open";
  }

  if (row.sog >= 10) {
    return "In Progress";
  }

  return "Resolved";
}

/* ---------------------------------
   Assignment based on AIS condition
---------------------------------- */
function getAssignedTeam(row) {
  if (!row.valid) {
    return "Telemetry Validation Team";
  }

  if (row.sog >= 20) {
    return "Maritime Operations Team";
  }

  if (row.sog === 0) {
    return "Operations Team";
  }

  if (row.sog >= 10) {
    return "Monitoring Team";
  }

  return "AIS Processing Team";
}

/* ---------------------------------
   Date formatting
---------------------------------- */
function formatDate(value) {
  if (!value || value === "Unknown") {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

/* ---------------------------------
   Custom tooltip
---------------------------------- */
function CustomTooltip({
  active,
  payload,
  label
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
        color: "#ffffff"
      }}
    >
      {label && (
        <div
          style={{
            color: "#ffffff",
            marginBottom: "5px",
            fontWeight: 600
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
            marginBottom: "2px"
          }}
        >
          {item.name}:{" "}
          {Number(item.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default function EscalationsView() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------------------------
     Load AIS CSV
  ---------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store"
        });

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
          parsed.map(normalizeAISRow);

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
     AIS metrics
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total = aisRows.length;

    const valid =
      aisRows.filter(
        (row) => row.valid
      );

    const invalid =
      aisRows.filter(
        (row) => !row.valid
      );

    const critical =
      aisRows.filter(
        (row) =>
          !row.valid ||
          row.sog >= 20
      );

    const open =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      );

    const inProgress =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog >= 10 &&
          row.sog < 20
      );

    const resolved =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0 &&
          row.sog < 10
      );

    const moving =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      );

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

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      critical: critical.length,
      open: open.length,
      inProgress: inProgress.length,
      resolved: resolved.length,
      moving: moving.length,
      uniqueVessels
    };
  }, [aisRows]);

  /* ---------------------------------
     Status chart
  ---------------------------------- */
  const escalationStatus =
    useMemo(
      () => [
        {
          name: "Open",
          value: metrics.open
        },
        {
          name: "In Progress",
          value: metrics.inProgress
        },
        {
          name: "Resolved",
          value: metrics.resolved
        },
        {
          name: "Critical",
          value: metrics.critical
        }
      ],
      [metrics]
    );

  /* ---------------------------------
     Priority chart
  ---------------------------------- */
  const escalationPriority =
    useMemo(() => {
      const counts = {
        P1: 0,
        P2: 0,
        P3: 0,
        P4: 0
      };

      aisRows.forEach((row) => {
        const priority =
          getPriority(row);

        counts[priority] += 1;
      });

      return [
        {
          priority: "P1",
          count: counts.P1
        },
        {
          priority: "P2",
          count: counts.P2
        },
        {
          priority: "P3",
          count: counts.P3
        },
        {
          priority: "P4",
          count: counts.P4
        }
      ];
    }, [aisRows]);

  /* ---------------------------------
     Recent AIS escalation records
  ---------------------------------- */
  const backendResponse =
    useMemo(() => {
      return [...aisRows]
        .sort((a, b) => {
          const aTime =
            new Date(
              a.timestamp
            ).getTime();

          const bTime =
            new Date(
              b.timestamp
            ).getTime();

          if (Number.isNaN(aTime)) {
            return 1;
          }

          if (Number.isNaN(bTime)) {
            return -1;
          }

          return bTime - aTime;
        })
        .slice(0, 10)
        .map((row) => ({
          escalationId:
            `ESC-${row.mmsi}`,
          traceId: row.id,
          priority:
            getPriority(row),
          assignedTo:
            getAssignedTeam(row),
          status:
            getStatus(row),
          timestamp:
            row.timestamp,
          vesselType:
            row.vesselType,
          sog: row.sog
        }));
    }, [aisRows]);

  return (
    <RebuildSprint>

      <h2>
        Escalation Management
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
            marginBottom: "16px"
          }}
        >
          {error}
        </div>
      )}

      {/* ---------------------------------
          KPI CARDS
      ---------------------------------- */}

      <div className="card-grid">

        <div className="kpi-card">
          <h4>
            Total Escalations
          </h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.total.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Open</h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.open.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Resolved</h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.resolved.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Critical</h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.critical.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ---------------------------------
          CHARTS
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>
            Escalation Status Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>

              <Pie
                data={escalationStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {escalationStatus.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
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

        <div className="card">

          <h3>
            Escalations By Priority
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={
                escalationPriority
              }
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 35
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="priority"
                label={{
                  value: "Priority",
                  position:
                    "insideBottom",
                  offset: -20
                }}
              />

              <YAxis
                allowDecimals={false}
                label={{
                  value:
                    "Escalation Count",
                  angle: -90,
                  position:
                    "insideLeft"
                }}
              />

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />

              <Bar
                dataKey="count"
                name="Escalations"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ---------------------------------
          AIS BACKEND RESPONSE
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Escalation Response
        </h3>

        {/* 
          Responsive table wrapper:
          The AIS response has 8 columns. On smaller screens,
          the table can scroll horizontally instead of cutting
          off SOG and Timestamp columns.
        */}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            borderRadius: "6px"
          }}
        >
          <table
            className="uccis-table"
            style={{
              width: "100%",
              minWidth: "980px",
              tableLayout: "fixed",
              borderCollapse: "collapse"
            }}
          >

            <colgroup>
              <col style={{ width: "150px" }} />
              <col style={{ width: "105px" }} />
              <col style={{ width: "105px" }} />
              <col style={{ width: "85px" }} />
              <col style={{ width: "155px" }} />
              <col style={{ width: "105px" }} />
              <col style={{ width: "75px" }} />
              <col style={{ width: "200px" }} />
            </colgroup>

            <thead>
              <tr>
                <th
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Escalation ID
                </th>

                <th
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Trace ID
                </th>

                <th
                  style={{
                    whiteSpace: "normal",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Vessel Type
                </th>

                <th
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Priority
                </th>

                <th
                  style={{
                    whiteSpace: "normal",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Assigned To
                </th>

                <th
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  SOG
                </th>

                <th
                  style={{
                    whiteSpace: "normal",
                    textAlign: "center",
                    padding: "12px 8px"
                  }}
                >
                  Timestamp
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                      padding: "18px"
                    }}
                  >
                    Loading AIS data...
                  </td>
                </tr>
              ) : backendResponse.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                      padding: "18px"
                    }}
                  >
                    No AIS escalation records found.
                  </td>
                </tr>
              ) : (
                backendResponse.map((item) => (
                  <tr key={item.traceId}>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {item.escalationId}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {item.traceId}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere"
                      }}
                    >
                      {item.vesselType}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {item.priority}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "normal",
                        overflowWrap: "break-word"
                      }}
                    >
                      {item.assignedTo}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "normal"
                      }}
                    >
                      {item.status}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {Number.isFinite(item.sog)
                        ? item.sog.toFixed(2)
                        : "Invalid"}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center",
                        padding: "12px 8px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere"
                      }}
                    >
                      {formatDate(item.timestamp)}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

      </div>

      {/* ---------------------------------
          AIS ESCALATION METRICS
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Escalation Metrics
        </h3>

        <div className="card-grid">

          <div className="kpi-card">
            <h4>
              Valid AIS Records
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.valid.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Moving Activity
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.moving.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Validation Failures
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.invalid.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Unique Vessels
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.uniqueVessels.toLocaleString()}
            </h2>
          </div>

        </div>

      </div>

    </RebuildSprint>
  );
}
