import React, { useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

/* =========================================================
   AIS CONFIGURATION

   Put the file here:
   frontend/public/AIS_file.csv
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   CSV PARSER
========================================================= */

const parseCSVLine = (line) => {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseAISCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.replace(/^"|"$/g, "").trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
};

/* =========================================================
   AIS FIELD HELPER
========================================================= */

const getAISField = (row, names) => {
  const keys = Object.keys(row || {});
  const wanted = names.map((name) =>
    String(name).toLowerCase().trim()
  );

  const matchedKey = keys.find((key) =>
    wanted.includes(String(key).toLowerCase().trim())
  );

  return matchedKey ? row[matchedKey] : "";
};

/* =========================================================
   NORMALIZE AIS RECORD
========================================================= */

const normalizeAISRow = (row, index) => {
  const mmsi = String(
    getAISField(row, [
      "MMSI",
      "mmsi",
      "Mmsi",
      "vessel_id",
      "vesselId",
    ]) || ""
  ).trim();

  const timestamp = String(
    getAISField(row, [
      "BaseDateTime",
      "baseDateTime",
      "Timestamp",
      "timestamp",
      "DateTime",
      "datetime",
      "time",
    ]) || ""
  ).trim();

  const lat = Number(
    getAISField(row, [
      "LAT",
      "lat",
      "Latitude",
      "latitude",
    ])
  );

  const lon = Number(
    getAISField(row, [
      "LON",
      "lon",
      "Longitude",
      "longitude",
    ])
  );

  const sog = Number(
    getAISField(row, [
      "SOG",
      "sog",
      "Speed",
      "speed",
    ])
  );

  const vesselType = String(
    getAISField(row, [
      "VesselType",
      "vessel_type",
      "vesselType",
      "Vessel Type",
      "type",
    ]) || "Unknown"
  ).trim();

  return {
    id: mmsi || `AIS-${index + 1}`,
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType,
  };
};

/* =========================================================
   HELPERS
========================================================= */

const isValidCoordinates = (row) =>
  Number.isFinite(row.lat) &&
  row.lat >= -90 &&
  row.lat <= 90 &&
  Number.isFinite(row.lon) &&
  row.lon >= -180 &&
  row.lon <= 180;

const isValidSOG = (row) =>
  Number.isFinite(row.sog) && row.sog >= 0;

const getSignalStatus = (row) => {
  if (!isValidSOG(row) || !isValidCoordinates(row)) {
    return "INVALID";
  }

  if (row.sog > 0) {
    return "MOVING";
  }

  return "STATIONARY";
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
};

const formatLocation = (row) => {
  if (!isValidCoordinates(row)) {
    return "Invalid Coordinates";
  }

  return `${row.lat.toFixed(4)}, ${row.lon.toFixed(4)}`;
};

/* =========================================================
   TOOLTIP
========================================================= */

const RuntimeTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "8px",
        padding: "10px 12px",
        color: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 5,
        }}
      >
        {label}
      </div>

      <div>
        AIS Records:{" "}
        <strong>
          {Number(payload[0].value || 0).toLocaleString()}
        </strong>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT

   This component now owns:
   1. AIS loading
   2. Runtime metric cards
   3. Runtime Metrics chart
   4. Active Signals summary
   5. Recent Signals table

   No hardcoded 13 / 11 / 35 / 18 / 450 values.
========================================================= */

function RuntimeMetricsChart({ summary }) {
  const [aisData, setAISData] = useState([]);
  const [aisLoading, setAISLoading] = useState(true);
  const [aisError, setAISError] = useState("");

  /* =======================================================
     LOAD AIS FILE
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {
        setAISLoading(true);
        setAISError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv returned HTTP ${response.status}`
          );
        }

        const csvText = await response.text();
        const parsedRows = parseAISCSV(csvText);

        const normalizedRows = parsedRows
          .map(normalizeAISRow)
          .filter((row) => row.id);

        if (!normalizedRows.length) {
          throw new Error(
            "AIS_file.csv contains no usable records."
          );
        }

        if (mounted) {
          setAISData(normalizedRows);
        }
      } catch (error) {
        console.error(
          "RuntimeMetricsChart AIS error:",
          error
        );

        if (mounted) {
          setAISData([]);
          setAISError(
            error.message || "Unable to load AIS_file.csv"
          );
        }
      } finally {
        if (mounted) {
          setAISLoading(false);
        }
      }
    };

    loadAIS();

    /*
      Refresh the AIS file periodically so the dashboard
      reflects the current CSV without a page reload.
    */

    const intervalId = window.setInterval(
      loadAIS,
      30000
    );

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const aisMetrics = useMemo(() => {
    const totalRecords = aisData.length;

    let validTelemetry = 0;
    let moving = 0;
    let stationary = 0;
    let invalidTelemetry = 0;
    let validCoordinates = 0;

    const vessels = new Set();

    aisData.forEach((row) => {
      if (row.mmsi) {
        vessels.add(row.mmsi);
      }

      const validCoordinatesForRow =
        isValidCoordinates(row);

      if (validCoordinatesForRow) {
        validCoordinates += 1;
      }

      if (isValidSOG(row)) {
        validTelemetry += 1;

        if (row.sog > 0) {
          moving += 1;
        } else {
          stationary += 1;
        }
      } else {
        invalidTelemetry += 1;
      }
    });

    return {
      totalRecords,
      validTelemetry,
      moving,
      stationary,
      invalidTelemetry,
      uniqueVessels: vessels.size,
      validCoordinates,
    };
  }, [aisData]);

  /* =======================================================
     RUNTIME CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    if (aisData.length > 0) {
      return [
        {
          name: "Signals",
          value: aisMetrics.totalRecords,
          color: "#3b82f6",
        },
        {
          name: "Telemetry",
          value: aisMetrics.validTelemetry,
          color: "#22c55e",
        },
        {
          name: "Incidents",
          value: aisMetrics.stationary,
          color: "#ef4444",
        },
        {
          name: "Escalations",
          value: aisMetrics.invalidTelemetry,
          color: "#f59e0b",
        },
        {
          name: "Replay",
          value: aisMetrics.uniqueVessels,
          color: "#a855f7",
        },
        {
          name: "Evidence",
          value: aisMetrics.validCoordinates,
          color: "#14b8a6",
        },
      ];
    }

    /*
      Only used when AIS_file.csv cannot be loaded.
      These values are not used when AIS is available.
    */

    return [
      {
        name: "Signals",
        value: Number(summary?.signals) || 0,
        color: "#3b82f6",
      },
      {
        name: "Telemetry",
        value: Number(summary?.telemetry) || 0,
        color: "#22c55e",
      },
      {
        name: "Incidents",
        value: Number(summary?.incidents) || 0,
        color: "#ef4444",
      },
      {
        name: "Escalations",
        value: Number(summary?.escalations) || 0,
        color: "#f59e0b",
      },
      {
        name: "Replay",
        value:
          Number(
            summary?.replayEvents ??
              summary?.replay
          ) || 0,
        color: "#a855f7",
      },
      {
        name: "Evidence",
        value: Number(summary?.evidence) || 0,
        color: "#14b8a6",
      },
    ];
  }, [aisData, aisMetrics, summary]);

  /* =======================================================
     ACTIVE SIGNALS
  ======================================================= */

  const activeSignals = useMemo(() => {
    /*
      In AIS, a record with SOG > 0 represents current
      moving activity. This is displayed as an operational
      AIS activity count, not a civic emergency count.
    */

    return aisMetrics.moving;
  }, [aisMetrics]);

  /* =======================================================
     RECENT SIGNALS

     Uses actual AIS records instead of fake:
     FIRE_ALERT / FLOOD_ALERT / CYBER_ATTACK
     and fake city names.
  ======================================================= */

  const recentSignals = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    return [...aisData]
      .sort((a, b) => {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();

        if (
          Number.isFinite(aTime) &&
          Number.isFinite(bTime)
        ) {
          return bTime - aTime;
        }

        return 0;
      })
      .slice(0, 8);
  }, [aisData]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (aisLoading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: 350,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020817",
          color: "#ffffff",
          fontSize: "15px",
          borderRadius: "12px",
        }}
      >
        Loading AIS_file.csv...
      </div>
    );
  }

  /* =======================================================
     FULL RUNTIME METRICS UI
  ======================================================= */

  return (
    <div
      style={{
        width: "100%",
        background: "#020817",
        color: "#ffffff",
        padding: "0 14px 30px",
        boxSizing: "border-box",
      }}
    >
      {/* ===================================================
          AIS ERROR
      =================================================== */}

      {aisError && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px 12px",
            background: "#451a03",
            border: "1px solid #92400e",
            borderRadius: "8px",
            color: "#fed7aa",
            fontSize: "13px",
          }}
        >
          {aisError}
        </div>
      )}

      {/* ===================================================
          METRIC CARDS
      =================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "26px",
          marginBottom: "24px",
        }}
      >
        <MetricCard
          title="Signals"
          value={aisMetrics.totalRecords}
        />

        <MetricCard
          title="Telemetry"
          value={aisMetrics.validTelemetry}
        />

        <MetricCard
          title="Incidents"
          value={aisMetrics.stationary}
        />

        <MetricCard
          title="Escalations"
          value={aisMetrics.invalidTelemetry}
        />

        <MetricCard
          title="Replay"
          value={aisMetrics.uniqueVessels}
        />

        <MetricCard
          title="Evidence"
          value={aisMetrics.validCoordinates}
        />
      </div>

      {/* ===================================================
          RUNTIME METRICS
      =================================================== */}

      <section>
        <h2
          style={{
            margin: "0 0 12px",
            paddingBottom: "12px",
            borderBottom: "2px solid #06b6d4",
            color: "#ffffff",
            fontSize: "30px",
            fontWeight: 800,
          }}
        >
          Runtime Metrics
        </h2>

        <ResponsiveContainer
          width="100%"
          height={390}
        >
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 25,
              bottom: 55,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#64748b"
            />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              label={{
                value: "Runtime Metric",
                position: "insideBottom",
                offset: -30,
                fill: "#94a3b8",
                fontSize: 16,
              }}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              label={{
                value: "AIS Record Count",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                fill: "#94a3b8",
                fontSize: 16,
              }}
            />

            <Tooltip
              content={<RuntimeTooltip />}
            />

            <Bar
              dataKey="value"
              name="AIS Records"
              radius={[3, 3, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`runtime-cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ===================================================
          ACTIVE SIGNALS
      =================================================== */}

      <section
        style={{
          marginTop: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "30px",
            fontWeight: 800,
          }}
        >
          Active Signals
        </h2>

        <div
          style={{
            marginTop: "10px",
            padding: "16px 18px",
            background: "#111827",
            border: "1px solid #26364f",
            borderRadius: "10px",
            color: "#cbd5e1",
          }}
        >
          <strong
            style={{
              color: "#ffffff",
              fontSize: "24px",
            }}
          >
            {activeSignals.toLocaleString()}
          </strong>

          <div
            style={{
              marginTop: "4px",
              fontSize: "13px",
            }}
          >
            Moving AIS records with SOG greater than 0
          </div>
        </div>
      </section>

      {/* ===================================================
          RECENT SIGNALS
      =================================================== */}

      <section
        style={{
          marginTop: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 18px",
            color: "#ffffff",
            fontSize: "30px",
            fontWeight: 800,
          }}
        >
          Recent Signals
        </h2>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            border: "1px solid #334155",
            borderRadius: "4px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#ffffff",
              color: "#111827",
              minWidth: "850px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#111827",
                  color: "#ffffff",
                }}
              >
                <th style={tableHeaderStyle}>
                  ID
                </th>

                <th style={tableHeaderStyle}>
                  Vessel Type
                </th>

                <th style={tableHeaderStyle}>
                  Location
                </th>

                <th style={tableHeaderStyle}>
                  Status
                </th>

                <th style={tableHeaderStyle}>
                  Timestamp
                </th>
              </tr>
            </thead>

            <tbody>
              {recentSignals.length > 0 ? (
                recentSignals.map((signal, index) => {
                  const status =
                    getSignalStatus(signal);

                  return (
                    <tr
                      key={`${signal.id}-${index}`}
                    >
                      <td style={tableCellStyle}>
                        {signal.id}
                      </td>

                      <td style={tableCellStyle}>
                        {signal.vesselType ||
                          "Unknown"}
                      </td>

                      <td style={tableCellStyle}>
                        {formatLocation(signal)}
                      </td>

                      <td
                        style={{
                          ...tableCellStyle,
                          fontWeight: 700,
                          color:
                            status === "MOVING"
                              ? "#15803d"
                              : status ===
                                  "STATIONARY"
                                ? "#b45309"
                                : "#dc2626",
                        }}
                      >
                        {status}
                      </td>

                      <td style={tableCellStyle}>
                        {formatTimestamp(
                          signal.timestamp
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    No AIS signals available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        minHeight: "125px",
        padding: "20px 16px",
        background: "#111827",
        border: "1px solid #26364f",
        borderRadius: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: "30px",
          fontWeight: 800,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "6px",
          color: "#ffffff",
          fontSize: "40px",
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        {Number(value || 0).toLocaleString()}
      </div>
    </div>
  );
}

/* =========================================================
   TABLE STYLES
========================================================= */

const tableHeaderStyle = {
  padding: "14px 16px",
  borderRight: "1px solid #334155",
  borderBottom: "1px solid #334155",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "13px 16px",
  borderRight: "1px solid #cbd5e1",
  borderBottom: "1px solid #cbd5e1",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

export default RuntimeMetricsChart;
