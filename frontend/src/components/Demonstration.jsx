import React, { useEffect, useMemo, useState } from "react";
import StatCardTask29 from "../components/StatCardTask29";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";
const REFRESH_INTERVAL = 30000;

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
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
}

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header
      .trim()
      .toLowerCase()
      .replace(/^"|"$/g, "")
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

/* =========================================================
   GET FIELD
========================================================= */

function getField(row, names) {
  for (const name of names) {
    const key = name.toLowerCase();

    if (
      Object.prototype.hasOwnProperty.call(row, key) &&
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

/* =========================================================
   NUMBER CONVERSION
========================================================= */

function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(
    String(value)
      .replace(/,/g, "")
      .trim()
  );

  return Number.isFinite(number) ? number : null;
}

/* =========================================================
   NORMALIZE AIS DATA
========================================================= */

function normalizeAIS(row) {
  const mmsi = String(
    getField(row, [
      "mmsi",
      "vessel_id",
      "vesselid",
      "ship_id",
      "shipid",
      "imo",
    ])
  ).trim();

  const sog = toNumber(
    getField(row, [
      "sog",
      "speed",
      "speed_over_ground",
      "speedoverground",
      "velocity",
    ])
  );

  const lat = toNumber(
    getField(row, [
      "lat",
      "latitude",
      "y",
    ])
  );

  const lon = toNumber(
    getField(row, [
      "lon",
      "lng",
      "longitude",
      "x",
    ])
  );

  const timestamp = String(
    getField(row, [
      "timestamp",
      "time",
      "datetime",
      "date_time",
      "date",
    ])
  ).trim();

  const validCoordinates =
    lat !== null &&
    lon !== null &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSpeed =
    sog !== null && sog >= 0;

  const moving =
    validSpeed && sog > 0;

  const stationary =
    validSpeed && sog === 0;

  return {
    ...row,
    mmsi,
    sog,
    lat,
    lon,
    timestamp,
    validCoordinates,
    validSpeed,
    moving,
    stationary,
  };
}

/* =========================================================
   LOAD AIS FILE
========================================================= */

async function loadAISFile() {
  const response = await fetch(
    `${AIS_FILE}?t=${Date.now()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load AIS_file.csv (${response.status})`
    );
  }

  const text = await response.text();

  return parseCSV(text).map(normalizeAIS);
}

/* =========================================================
   UNIQUE VESSELS
========================================================= */

function getUniqueVesselCount(records) {
  const vessels = new Set();

  records.forEach((record) => {
    if (record.mmsi) {
      vessels.add(record.mmsi);
    }
  });

  return vessels.size;
}

/* =========================================================
   AIS METRICS
========================================================= */

function calculateAISMetrics(records) {
  const total = records.length;

  const validTelemetry = records.filter(
    (record) =>
      record.validCoordinates &&
      record.validSpeed
  ).length;

  const moving = records.filter(
    (record) => record.moving
  ).length;

  const stationary = records.filter(
    (record) => record.stationary
  ).length;

  const invalid = Math.max(
    total - validTelemetry,
    0
  );

  const uniqueVessels =
    getUniqueVesselCount(records);

  const speeds = records
    .filter((record) => record.validSpeed)
    .map((record) => record.sog);

  const averageSpeed =
    speeds.length > 0
      ? speeds.reduce(
          (sum, value) => sum + value,
          0
        ) / speeds.length
      : 0;

  const quality =
    total > 0
      ? Math.round(
          (validTelemetry / total) * 100
        )
      : 0;

  return {
    total,
    validTelemetry,
    moving,
    stationary,
    invalid,
    uniqueVessels,
    averageSpeed,
    quality,
  };
}

/* =========================================================
   CHECK SUMMARY VALUE
========================================================= */

function hasUsableSummaryValue(
  summary,
  key
) {
  if (!summary) {
    return false;
  }

  const value = Number(summary[key]);

  return (
    Number.isFinite(value) &&
    value > 0
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function Demonstration({
  summary = {},
}) {
  const [aisRecords, setAisRecords] =
    useState([]);

  const [aisLoading, setAisLoading] =
    useState(true);

  const [aisError, setAisError] =
    useState("");

  /* =======================================================
     LOAD AIS
  ======================================================= */

  const loadAIS = async () => {
    try {
      setAisError("");

      const records =
        await loadAISFile();

      setAisRecords(records);
    } catch (error) {
      console.error(
        "Task 29 AIS loading error:",
        error
      );

      setAisError(
        error?.message ||
          "Unable to load AIS_file.csv"
      );
    } finally {
      setAisLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD + REFRESH
  ======================================================= */

  useEffect(() => {
    loadAIS();

    const interval = setInterval(
      loadAIS,
      REFRESH_INTERVAL
    );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const aisMetrics = useMemo(
    () =>
      calculateAISMetrics(
        aisRecords
      ),
    [aisRecords]
  );

  /* =======================================================
     DASHBOARD METRICS

     Backend summary is preferred.
     AIS is fallback.
  ======================================================= */

  const metrics = useMemo(() => {
    return {
      signals:
        hasUsableSummaryValue(
          summary,
          "signals"
        )
          ? Number(summary.signals)
          : aisMetrics.total,

      telemetry:
        hasUsableSummaryValue(
          summary,
          "telemetry"
        )
          ? Number(summary.telemetry)
          : aisMetrics.validTelemetry,

      incidents:
        hasUsableSummaryValue(
          summary,
          "incidents"
        )
          ? Number(summary.incidents)
          : aisMetrics.stationary,

      runtimeLogs:
        hasUsableSummaryValue(
          summary,
          "runtimeLogs"
        )
          ? Number(summary.runtimeLogs)
          : aisMetrics.moving,
    };
  }, [
    summary,
    aisMetrics,
  ]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(
    () => [
      {
        name: "Signals",
        value: metrics.signals,
      },
      {
        name: "Telemetry",
        value: metrics.telemetry,
      },
      {
        name: "Incidents",
        value: metrics.incidents,
      },
      {
        name: "Runtime Logs",
        value: metrics.runtimeLogs,
      },
    ],
    [metrics]
  );

  /* =======================================================
     COLORS
  ======================================================= */

  const SIGNAL_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  const TREND_COLORS = [
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
  ];

  const PIE_COLORS = [
    "#8b5cf6",
    "#a855f7",
    "#c084fc",
    "#d8b4fe",
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* ===================================================
          DASHBOARD CARDS
      =================================================== */}

      <div className="cards-grid">

        <StatCardTask29
          title="Signals"
          value={metrics.signals}
          icon="📡"
        />

        <StatCardTask29
          title="Telemetry"
          value={metrics.telemetry}
          icon="📊"
        />

        <StatCardTask29
          title="Incidents"
          value={metrics.incidents}
          icon="🚨"
        />

        <StatCardTask29
          title="Runtime Logs"
          value={metrics.runtimeLogs}
          icon="📝"
        />

      </div>

      {/* ===================================================
          AIS INTEGRATION
      =================================================== */}

      <div
        className="chart-card"
        style={{
          marginBottom: "20px",
          padding: "18px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <h2
              style={{
                marginBottom: "6px",
              }}
            >
              AIS Data Integration
            </h2>

            <div
              style={{
                fontSize: "14px",
                color: aisError
                  ? "#ef4444"
                  : "#10b981",
                fontWeight: 600,
              }}
            >
              {aisLoading
                ? "Loading AIS data..."
                : aisError
                ? "AIS data unavailable"
                : `AIS data connected • ${aisRecords.length.toLocaleString()} records`}
            </div>

          </div>

          {/* AIS MINI METRICS */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >

            <div
              style={{
                padding:
                  "10px 14px",
                borderRadius: "8px",
                background:
                  "#f1f5f9",
                color: "#0f172a",
              }}
            >
              <strong>
                {aisMetrics.uniqueVessels.toLocaleString()}
              </strong>

              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                Vessels
              </span>
            </div>

            <div
              style={{
                padding:
                  "10px 14px",
                borderRadius: "8px",
                background:
                  "#f1f5f9",
                color: "#0f172a",
              }}
            >
              <strong>
                {aisMetrics.moving.toLocaleString()}
              </strong>

              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                Moving
              </span>
            </div>

            <div
              style={{
                padding:
                  "10px 14px",
                borderRadius: "8px",
                background:
                  "#f1f5f9",
                color: "#0f172a",
              }}
            >
              <strong>
                {aisMetrics.stationary.toLocaleString()}
              </strong>

              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                Stationary
              </span>
            </div>

            <div
              style={{
                padding:
                  "10px 14px",
                borderRadius: "8px",
                background:
                  "#f1f5f9",
                color: "#0f172a",
              }}
            >
              <strong>
                {aisMetrics.quality}%
              </strong>

              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                Quality
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          SIGNAL VOLUME ANALYSIS
      =================================================== */}

      <div className="chart-card">

        <h2>
          Signal Volume Analysis
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 35,
            }}
          >

            <XAxis
              dataKey="name"
              stroke="#cbd5e1"
              label={{
                value:
                  "Signal Type",
                position:
                  "insideBottom",
                offset: -20,
                fill:
                  "#cbd5e1",
              }}
            />

            <YAxis
              stroke="#cbd5e1"
              allowDecimals={false}
              label={{
                value:
                  "Signal Volume",
                angle: -90,
                position:
                  "insideLeft",
                fill:
                  "#cbd5e1",
              }}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              name="Signal Volume"
              radius={[
                6,
                6,
                0,
                0,
              ]}
            >

              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={`signal-${index}`}
                    fill={
                      SIGNAL_COLORS[
                        index %
                          SIGNAL_COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ===================================================
          OPERATIONS TREND
      =================================================== */}

      <div className="chart-card">

        <h2>
          Operations Trend
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 35,
            }}
          >

            <XAxis
              dataKey="name"
              stroke="#cbd5e1"
              label={{
                value:
                  "Operation",
                position:
                  "insideBottom",
                offset: -20,
                fill:
                  "#cbd5e1",
              }}
            />

            <YAxis
              stroke="#cbd5e1"
              allowDecimals={false}
              label={{
                value:
                  "Operation Count",
                angle: -90,
                position:
                  "insideLeft",
                fill:
                  "#cbd5e1",
              }}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              name="Operation Count"
              radius={[
                6,
                6,
                0,
                0,
              ]}
            >

              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={`trend-${index}`}
                    fill={
                      TREND_COLORS[
                        index %
                          TREND_COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ===================================================
          DISTRIBUTION OVERVIEW
      =================================================== */}

      <div className="chart-card">

        <h2>
          Distribution Overview
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >

              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={`pie-${index}`}
                    fill={
                      PIE_COLORS[
                        index %
                          PIE_COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
            />

          </PieChart>

        </ResponsiveContainer>

      </div>
    </>
  );
}

export default Demonstration;