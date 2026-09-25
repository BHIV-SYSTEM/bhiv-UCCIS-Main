// src/pages/HomeDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const AIS_FILE = "/AIS_file.csv";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    const row = {};

    headers.forEach((header, index) => {
      row[header] =
        values[index] !== undefined
          ? values[index].trim()
          : "";
    });

    return row;
  });
}

/* =========================================================
   AIS NORMALIZATION
   ========================================================= */

function normalizeAISRow(row) {
  const mmsi = String(
    row.MMSI ??
      row.mmsi ??
      ""
  ).trim();

  const timestamp = String(
    row.BaseDateTime ??
      row.baseDateTime ??
      row.timestamp ??
      ""
  ).trim();

  const lat = Number(
    row.LAT ??
      row.lat
  );

  const lon = Number(
    row.LON ??
      row.lon
  );

  const sog = Number(
    row.SOG ??
      row.sog
  );

  const vesselType = Number(
    row.VesselType ??
      row.vesselType
  );

  return {
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType,
  };
}

/* =========================================================
   VALIDATION
   ========================================================= */

function isValidAISRow(row) {
  const validMMSI =
    row.mmsi &&
    row.mmsi !== "undefined" &&
    row.mmsi !== "null";

  const validTimestamp =
    row.timestamp &&
    !Number.isNaN(
      new Date(row.timestamp).getTime()
    );

  const validLatitude =
    Number.isFinite(row.lat) &&
    row.lat >= -90 &&
    row.lat <= 90;

  const validLongitude =
    Number.isFinite(row.lon) &&
    row.lon >= -180 &&
    row.lon <= 180;

  const validSOG =
    Number.isFinite(row.sog) &&
    row.sog >= 0;

  return (
    validMMSI &&
    validTimestamp &&
    validLatitude &&
    validLongitude &&
    validSOG
  );
}

/* =========================================================
   WHITE TOOLTIP
   ========================================================= */

function WhiteTooltip({ active, payload, label }) {
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
        background: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        padding: "10px 13px",
        color: "#111827",
        boxShadow:
          "0 5px 15px rgba(0,0,0,0.25)",
      }}
    >
      {label && (
        <div
          style={{
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}

      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            fontSize: "13px",
            marginTop: "3px",
          }}
        >
          <strong>
            {entry.name}:
          </strong>{" "}
          {entry.value}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   HOME DASHBOARD
   ========================================================= */

export default function HomeDashboard({
  onOpenOperationalDashboard,
}) {
  const [aisData, setAisData] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD AIS CSV
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(AIS_FILE);

        if (!response.ok) {
          throw new Error(
            `AIS file request failed: ${response.status}`
          );
        }

        const csvText =
          await response.text();

        const rows =
          parseCSV(csvText);

        const normalized =
          rows.map(normalizeAISRow);

        const validRows =
          normalized.filter(
            isValidAISRow
          );

        if (mounted) {
          setAisData(validRows);
        }
      } catch (err) {
        console.error(
          "AIS loading error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load AIS_file.csv"
          );
          setAisData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AIS METRICS
     ======================================================= */

  const metrics = useMemo(() => {
    const records =
      aisData.length;

    const vessels =
      new Set(
        aisData.map(
          (row) => row.mmsi
        )
      ).size;

    const moving =
      aisData.filter(
        (row) => row.sog > 0
      ).length;

    const stationary =
      aisData.filter(
        (row) => row.sog === 0
      ).length;

    const averageSOG =
      records > 0
        ? aisData.reduce(
            (sum, row) =>
              sum + row.sog,
            0
          ) / records
        : 0;

    const maxSOG =
      records > 0
        ? Math.max(
            ...aisData.map(
              (row) => row.sog
            )
          )
        : 0;

    const movingPercentage =
      records > 0
        ? Math.round(
            (moving / records) *
              100
          )
        : 0;

    return {
      records,
      vessels,
      moving,
      stationary,
      averageSOG,
      maxSOG,
      movingPercentage,
    };
  }, [aisData]);

  /* =======================================================
     PHASE / TIME ACTIVITY
     ======================================================= */

  const phaseData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    // Sort the AIS records chronologically so the chart
    // represents the actual progression of the uploaded data.
    const sortedRows = [...aisData].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();

      return timeA - timeB;
    });

    // Split the complete AIS dataset into 4 chronological
    // operational phases. This guarantees multiple bars even
    // when all records fall within the same clock hour.
    const phaseCount = 4;
    const phases = [];

    for (let index = 0; index < phaseCount; index += 1) {
      const start = Math.floor(
        (index * sortedRows.length) / phaseCount
      );

      const end = Math.floor(
        ((index + 1) * sortedRows.length) / phaseCount
      );

      const rows = sortedRows.slice(start, end);

      if (!rows.length) {
        continue;
      }

      const movingRecords = rows.filter(
        (row) => row.sog > 0
      ).length;

      const movingPercentage =
        rows.length > 0
          ? Math.round(
              (movingRecords / rows.length) * 100
            )
          : 0;

      phases.push({
        phase: `P${index + 1}`,
        value: movingPercentage,
        records: rows.length,
        movingRecords,
      });
    }

    return phases;
  }, [aisData]);

  /* =======================================================
     AIS ACTIVITY DISTRIBUTION
     ======================================================= */

  const replayData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    let moving = 0;
    let slow = 0;
    let moderate = 0;
    let high = 0;

    aisData.forEach((row) => {
      if (row.sog === 0) {
        moving += 1;
      } else if (row.sog <= 5) {
        slow += 1;
      } else if (row.sog <= 15) {
        moderate += 1;
      } else {
        high += 1;
      }
    });

    return [
      {
        name: "Stationary",
        value: moving,
      },
      {
        name: "Slow",
        value: slow,
      },
      {
        name: "Moderate",
        value: moderate,
      },
      {
        name: "High Speed",
        value: high,
      },
    ].filter(
      (item) => item.value > 0
    );
  }, [aisData]);

  /* =======================================================
     VESSEL TYPE ACTIVITY
     ======================================================= */

  const activityData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    const vesselTypes = {};

    aisData.forEach((row) => {
      const type =
        Number.isFinite(
          row.vesselType
        )
          ? String(
              row.vesselType
            )
          : "Unknown";

      if (!vesselTypes[type]) {
        vesselTypes[type] = 0;
      }

      vesselTypes[type] += 1;
    });

    return Object.entries(
      vesselTypes
    )
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 6)
      .map(
        ([type, value]) => ({
          subject: `Type ${type}`,
          value,
        })
      );
  }, [aisData]);

  /* =======================================================
     OPERATIONAL STATUS
     ======================================================= */

  const operationalStatus =
    useMemo(() => {
      if (!aisData.length) {
        return "NO DATA";
      }

      if (
        metrics.movingPercentage >=
        70
      ) {
        return "HIGH ACTIVITY";
      }

      if (
        metrics.movingPercentage >=
        40
      ) {
        return "ACTIVE";
      }

      return "LOW ACTIVITY";
    }, [
      aisData,
      metrics.movingPercentage,
    ]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "30px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          background: "#0f172a",
          padding: "30px",
          borderRadius: "16px",
          border:
            "1px solid #334155",
        }}
      >

        <h1
          style={{
            fontSize: "38px",
            marginBottom: "15px",
          }}
        >
          UCCIS Replay Reconstruction Platform
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.9",
            maxWidth: "1000px",
          }}
        >
          AIS-driven operational continuity
          dashboard using vessel telemetry,
          movement activity, vessel identity,
          speed observations and time-based
          operational activity.
        </p>

        {/* OPEN DASHBOARD */}

        <button
          type="button"
          onClick={
            onOpenOperationalDashboard
          }
          style={{
            marginTop: "25px",
            padding:
              "14px 28px",
            background:
              "#2563eb",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Open Operational Dashboard
        </button>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#0f172a",
            border:
              "1px solid #334155",
            borderRadius: "10px",
            color: "#93c5fd",
          }}
        >
          Loading AIS_file.csv...
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#450a0a",
            border:
              "1px solid #7f1d1d",
            borderRadius: "10px",
            color: "#fecaca",
          }}
        >
          {error}

          <div
            style={{
              marginTop: "6px",
              fontSize: "12px",
            }}
          >
            Make sure AIS_file.csv is inside:
            <br />
            <strong>
              frontend/public/AIS_file.csv
            </strong>
          </div>
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* AIS RECORDS */}

        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius:
              "12px",
            border:
              "1px solid #1e293b",
          }}
        >
          <h2>
            {metrics.records.toLocaleString()}
          </h2>

          <p
            style={{
              color:
                "#94a3b8",
            }}
          >
            AIS Records
          </p>
        </div>

        {/* UNIQUE VESSELS */}

        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius:
              "12px",
            border:
              "1px solid #1e293b",
          }}
        >
          <h2>
            {metrics.vessels.toLocaleString()}
          </h2>

          <p
            style={{
              color:
                "#94a3b8",
            }}
          >
            Unique Vessels
          </p>
        </div>

        {/* MOVEMENT */}

        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius:
              "12px",
            border:
              "1px solid #1e293b",
          }}
        >
          <h2>
            {metrics.movingPercentage}%
          </h2>

          <p
            style={{
              color:
                "#94a3b8",
            }}
          >
            Moving Activity
          </p>
        </div>

        {/* STATUS */}

        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius:
              "12px",
            border:
              "1px solid #1e293b",
          }}
        >
          <h2
            style={{
              color:
                "#10b981",
            }}
          >
            {operationalStatus}
          </h2>

          <p
            style={{
              color:
                "#94a3b8",
            }}
          >
            AIS Operational Status
          </p>
        </div>

      </div>

      {/* =================================================
          CHART ROW
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* =================================================
            AIS PHASE / TIME ACTIVITY
        ================================================= */}

        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius:
              "12px",
            height: "400px",
          }}
        >

          <h2>
            AIS Time-Based Activity
          </h2>

          <ResponsiveContainer
            width="100%"
            height="90%"
          >

            <BarChart
              data={phaseData}
              margin={{
                top: 10,
                right: 20,
                left: 15,
                bottom: 35,
              }}
            >

              <CartesianGrid
                stroke="#1e293b"
              />

              <XAxis
                dataKey="phase"
                stroke="#ffffff"
                tick={{
                  fill: "#ffffff",
                }}
                label={{
                  value:
                    "Operational Phase",
                  position:
                    "insideBottom",
                  offset: -10,
                  fill: "#ffffff",
                }}
              />

              <YAxis
                stroke="#ffffff"
                tick={{
                  fill: "#ffffff",
                }}
                domain={[
                  0,
                  100,
                ]}
                label={{
                  value:
                    "Moving Activity (%)",
                  angle: -90,
                  position:
                    "insideLeft",
                  fill: "#ffffff",
                }}
              />

              <Tooltip
                content={
                  <WhiteTooltip />
                }
              />

              <Bar
                dataKey="value"
                name="Moving Activity %"
                fill="#2563eb"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                barSize={70}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* =================================================
            SPEED DISTRIBUTION
        ================================================= */}

        <div
          style={{
            background:
              "#111827",
            padding: "20px",
            borderRadius:
              "12px",
            height: "400px",
          }}
        >

          <h2>
            AIS Speed Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height="90%"
          >

            <PieChart>

              <Pie
                data={replayData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >

                {replayData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={`speed-cell-${index}`}
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
                  <WhiteTooltip />
                }
              />

              <Legend
                wrapperStyle={{
                  color: "#ffffff",
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* =================================================
          VESSEL TYPE ACTIVITY
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
          background:
            "#111827",
          padding: "20px",
          borderRadius:
            "12px",
          height: "500px",
        }}
      >

        <h2>
          Vessel Type Activity
        </h2>

        <ResponsiveContainer
          width="100%"
          height="90%"
        >

          <PieChart>

            <Pie
              data={activityData}
              dataKey="value"
              nameKey="subject"
              innerRadius={90}
              outerRadius={160}
              paddingAngle={5}
              label
            >

              {activityData.map(
                (
                  entry,
                  index
                ) => (
                  <Cell
                    key={`activity-cell-${index}`}
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
                <WhiteTooltip />
              }
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* =================================================
          AIS SUMMARY
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "20px",
        }}
      >

        <div
          style={{
            background:
              "#0f172a",
            padding: "22px",
            borderRadius:
              "12px",
            border:
              "1px solid #334155",
          }}
        >
          <h3>
            Average SOG
          </h3>

          <strong
            style={{
              fontSize: "28px",
              color:
                "#38bdf8",
            }}
          >
            {metrics.averageSOG.toFixed(
              2
            )}
          </strong>

          <p
            style={{
              color:
                "#94a3b8",
              fontSize: "12px",
            }}
          >
            Average speed over ground
          </p>
        </div>

        <div
          style={{
            background:
              "#0f172a",
            padding: "22px",
            borderRadius:
              "12px",
            border:
              "1px solid #334155",
          }}
        >
          <h3>
            Maximum SOG
          </h3>

          <strong
            style={{
              fontSize: "28px",
              color:
                "#f59e0b",
            }}
          >
            {metrics.maxSOG.toFixed(
              2
            )}
          </strong>

          <p
            style={{
              color:
                "#94a3b8",
              fontSize: "12px",
            }}
          >
            Maximum recorded speed
          </p>
        </div>

        <div
          style={{
            background:
              "#0f172a",
            padding: "22px",
            borderRadius:
              "12px",
            border:
              "1px solid #334155",
          }}
        >
          <h3>
            Stationary Records
          </h3>

          <strong
            style={{
              fontSize: "28px",
              color:
                "#10b981",
            }}
          >
            {metrics.stationary.toLocaleString()}
          </strong>

          <p
            style={{
              color:
                "#94a3b8",
              fontSize: "12px",
            }}
          >
            AIS observations with SOG = 0
          </p>
        </div>

      </div>

      {/* =================================================
          PROJECT CAPABILITIES
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
          background:
            "#0f172a",
          padding: "25px",
          borderRadius:
            "12px",
          lineHeight: "2",
          border:
            "1px solid #334155",
        }}
      >

        <h2>
          AIS Operational Capabilities
        </h2>

        ✔ AIS Telemetry Ingestion
        <br />

        ✔ Vessel Identity Tracking
        <br />

        ✔ Movement Activity Analysis
        <br />

        ✔ Speed Distribution Analysis
        <br />

        ✔ Vessel Type Distribution
        <br />

        ✔ Time-Based Operational Activity
        <br />

        ✔ Stationary Vessel Detection
        <br />

        ✔ Operational Activity Monitoring
        <br />

        ✔ AIS Data Validation
        <br />

        ✔ Real-Time Dashboard Visualization

      </div>

    </div>
  );
}