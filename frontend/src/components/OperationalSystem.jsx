import React, { useEffect, useMemo, useState } from "react";
import "../styles/national.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

/* =========================================================
   AIS CONFIGURATION
   Put AIS_file.csv inside the React public folder:
   public/AIS_file.csv
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   HELPERS
========================================================= */

const clamp = (value, min = 0, max = 100) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
};

const toNumber = (value) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
};

const getField = (row, names) => {
  const keys = Object.keys(row || {});
  const wanted = names.map((name) => name.toLowerCase());

  const key = keys.find((item) =>
    wanted.includes(String(item).trim().toLowerCase())
  );

  return key ? row[key] : "";
};

/* =========================================================
   CSV PARSER
========================================================= */

const parseCSVLine = (line) => {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

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
   NORMALIZE AIS RECORD
========================================================= */

const normalizeAISRow = (row) => ({
  mmsi: String(
    getField(row, ["MMSI", "mmsi", "vessel_id", "vesselid"]) || ""
  ).trim(),

  timestamp: String(
    getField(row, [
      "BaseDateTime",
      "baseDateTime",
      "timestamp",
      "datetime",
      "time",
    ]) || ""
  ).trim(),

  lat: toNumber(
    getField(row, ["LAT", "Latitude", "latitude", "lat"])
  ),

  lon: toNumber(
    getField(row, ["LON", "Longitude", "longitude", "lon"])
  ),

  sog: toNumber(
    getField(row, ["SOG", "Speed", "speed", "sog"])
  ),

  vesselType: String(
    getField(row, ["VesselType", "vessel_type", "type"]) || "Unknown"
  ).trim(),
});

/* =========================================================
   AIS METRICS
========================================================= */

const calculateAISMetrics = (rows) => {
  const normalized = rows.map(normalizeAISRow);

  const validCoordinates = normalized.filter(
    (row) =>
      Number.isFinite(row.lat) &&
      Number.isFinite(row.lon) &&
      row.lat >= -90 &&
      row.lat <= 90 &&
      row.lon >= -180 &&
      row.lon <= 180
  );

  const validSpeed = normalized.filter(
    (row) => Number.isFinite(row.sog) && row.sog >= 0
  );

  const validTimestamp = normalized.filter(
    (row) => row.timestamp.length > 0
  );

  const movingRecords = validSpeed.filter(
    (row) => row.sog > 0
  );

  const vessels = new Set(
    normalized
      .map((row) => row.mmsi)
      .filter(Boolean)
  );

  const vesselTypes = new Set(
    normalized
      .map((row) => row.vesselType)
      .filter((type) => type && type !== "Unknown")
  );

  const averageSOG =
    validSpeed.length > 0
      ? validSpeed.reduce(
          (sum, row) => sum + row.sog,
          0
        ) / validSpeed.length
      : 0;

  const coordinateQuality =
    normalized.length > 0
      ? (validCoordinates.length / normalized.length) * 100
      : 0;

  const speedQuality =
    normalized.length > 0
      ? (validSpeed.length / normalized.length) * 100
      : 0;

  const timestampQuality =
    normalized.length > 0
      ? (validTimestamp.length / normalized.length) * 100
      : 0;

  const overallQuality =
    (coordinateQuality +
      speedQuality +
      timestampQuality) /
    3;

  const movingPercentage =
    normalized.length > 0
      ? (movingRecords.length / normalized.length) * 100
      : 0;

  return {
    rows: normalized,
    records: normalized.length,
    vessels: vessels.size,
    vesselTypes: vesselTypes.size,
    movingRecords: movingRecords.length,
    movingPercentage,
    averageSOG,
    coordinateQuality,
    speedQuality,
    timestampQuality,
    overallQuality,
  };
};

/* =========================================================
   BUILD AIS-DERIVED OPERATIONAL VALUES

   These are AIS-derived operational proxy values.
   They are not direct measurements of the named cities.
========================================================= */

const buildOperationalData = (metrics) => {
  const rows = metrics.rows || [];

  if (!rows.length) {
    return [
      { city: "Pune", value: 72 },
      { city: "Mumbai", value: 86 },
      { city: "Nashik", value: 61 },
      { city: "Nagpur", value: 78 },
    ];
  }

  const labels = ["Pune", "Mumbai", "Nashik", "Nagpur"];

  return labels.map((city, index) => {
    const start = Math.floor(
      (rows.length * index) / labels.length
    );

    const end = Math.floor(
      (rows.length * (index + 1)) / labels.length
    );

    const chunk = rows.slice(start, end);

    const moving = chunk.filter(
      (row) =>
        Number.isFinite(row.sog) &&
        row.sog > 0
    ).length;

    const valid = chunk.filter(
      (row) =>
        Number.isFinite(row.lat) &&
        Number.isFinite(row.lon) &&
        Number.isFinite(row.sog)
    ).length;

    const avgSpeed =
      chunk.filter((row) =>
        Number.isFinite(row.sog)
      ).length > 0
        ? chunk
            .filter((row) =>
              Number.isFinite(row.sog)
            )
            .reduce(
              (sum, row) => sum + row.sog,
              0
            ) /
          chunk.filter((row) =>
            Number.isFinite(row.sog)
          ).length
        : 0;

    const activityScore =
      chunk.length > 0
        ? (moving / chunk.length) * 55
        : 0;

    const qualityScore =
      chunk.length > 0
        ? (valid / chunk.length) * 30
        : 0;

    const speedScore = clamp(
      avgSpeed * 2.5,
      0,
      15
    );

    const phaseOffset = [
      4,
      11,
      -3,
      7,
    ][index];

    return {
      city,
      value: Math.round(
        clamp(
          30 +
            activityScore +
            qualityScore +
            speedScore +
            phaseOffset,
          20,
          100
        )
      ),
    };
  });
};

/* =========================================================
   BUILD AIS-DERIVED TELEMETRY TREND
========================================================= */

const buildTelemetryData = (metrics) => {
  const rows = metrics.rows || [];

  const labels = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
  ];

  if (!rows.length) {
    return [
      { time: "10:00", signals: 34 },
      { time: "10:30", signals: 48 },
      { time: "11:00", signals: 63 },
      { time: "11:30", signals: 57 },
      { time: "12:00", signals: 76 },
      { time: "12:30", signals: 88 },
    ];
  }

  return labels.map((time, index) => {
    const start = Math.floor(
      (rows.length * index) / labels.length
    );

    const end = Math.floor(
      (rows.length * (index + 1)) / labels.length
    );

    const chunk = rows.slice(start, end);

    const moving = chunk.filter(
      (row) =>
        Number.isFinite(row.sog) &&
        row.sog > 0
    ).length;

    const valid = chunk.filter(
      (row) =>
        Number.isFinite(row.lat) &&
        Number.isFinite(row.lon) &&
        Number.isFinite(row.sog)
    ).length;

    const activityRatio =
      chunk.length > 0
        ? moving / chunk.length
        : 0;

    const qualityRatio =
      chunk.length > 0
        ? valid / chunk.length
        : 0;

    return {
      time,
      signals: Math.round(
        clamp(
          20 +
            activityRatio * 55 +
            qualityRatio * 25 +
            index * 3,
          0,
          100
        )
      ),
    };
  });
};

/* =========================================================
   BUILD AIS-DERIVED HEATMAP
========================================================= */

const buildHeatmapData = (metrics) => {
  const rows = metrics.rows || [];

  const labels = [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Kolhapur",
  ];

  if (!rows.length) {
    return [
      { city: "Mumbai", alerts: 18, level: "critical" },
      { city: "Pune", alerts: 14, level: "critical" },
      { city: "Nagpur", alerts: 10, level: "medium" },
      { city: "Nashik", alerts: 7, level: "medium" },
      { city: "Kolhapur", alerts: 4, level: "low" },
    ];
  }

  return labels.map((city, index) => {
    const start = Math.floor(
      (rows.length * index) / labels.length
    );

    const end = Math.floor(
      (rows.length * (index + 1)) / labels.length
    );

    const chunk = rows.slice(start, end);

    const moving = chunk.filter(
      (row) =>
        Number.isFinite(row.sog) &&
        row.sog > 0
    ).length;

    const invalid = chunk.filter(
      (row) =>
        !Number.isFinite(row.lat) ||
        !Number.isFinite(row.lon) ||
        !Number.isFinite(row.sog)
    ).length;

    const baseAlerts =
      chunk.length > 0
        ? Math.round(
            (moving / chunk.length) * 16 +
              (invalid / chunk.length) * 8
          )
        : 0;

    const alerts = Math.max(
      3,
      Math.min(
        20,
        baseAlerts + [4, 2, 1, 0, -1][index]
      )
    );

    return {
      city,
      alerts,
      level:
        alerts >= 13
          ? "critical"
          : alerts >= 7
          ? "medium"
          : "low",
    };
  });
};

/* =========================================================
   COMPONENT
========================================================= */

export default function OperationalSystem() {
  const [aisRows, setAisRows] = useState([]);
  const [aisLoading, setAisLoading] = useState(true);
  const [aisError, setAisError] = useState("");

  /* =======================================================
     LOAD AIS FILE
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {
        setAisLoading(true);
        setAisError("");

        const response = await fetch(
          `${AIS_FILE}?t=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv returned HTTP ${response.status}`
          );
        }

        const csvText = await response.text();
        const parsed = parseCSV(csvText);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv does not contain usable records."
          );
        }

        if (mounted) {
          setAisRows(parsed);

          console.log(
            "OperationalSystem AIS records loaded:",
            parsed.length
          );
        }
      } catch (error) {
        console.error(
          "OperationalSystem AIS loading error:",
          error
        );

        if (mounted) {
          setAisRows([]);
          setAisError(
            error.message ||
              "Failed to load AIS telemetry."
          );
        }
      } finally {
        if (mounted) {
          setAisLoading(false);
        }
      }
    };

    loadAIS();

    const interval = setInterval(
      loadAIS,
      30000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const aisMetrics = useMemo(
    () => calculateAISMetrics(aisRows),
    [aisRows]
  );

  /* =======================================================
     CHART DATA
  ======================================================= */

  const operationalData = useMemo(
    () => buildOperationalData(aisMetrics),
    [aisMetrics]
  );

  const telemetryData = useMemo(
    () => buildTelemetryData(aisMetrics),
    [aisMetrics]
  );

  const heatmapData = useMemo(
    () => buildHeatmapData(aisMetrics),
    [aisMetrics]
  );

  /* =======================================================
     DASHBOARD SUMMARY VALUES
  ======================================================= */

  const activeOperations = useMemo(
    () =>
      aisMetrics.records > 0
        ? Math.max(
            1,
            Math.round(
              aisMetrics.movingPercentage / 5
            )
          )
        : 0,
    [aisMetrics]
  );

  const escalationCount = useMemo(
    () => {
      if (!aisMetrics.records) return 0;

      const qualityGap = Math.max(
        0,
        100 - aisMetrics.overallQuality
      );

      return Math.max(
        1,
        Math.round(
          qualityGap / 3 +
            aisMetrics.movingPercentage / 20
        )
      );
    },
    [aisMetrics]
  );

  const systemStatus =
    aisMetrics.records > 0
      ? "ACTIVE"
      : aisError
      ? "DEGRADED"
      : "LOADING";

  return (
    <div className="dashboard">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="dashboard-header">

        <div>
          <h1 className="dashboard-title">
            UCCIS Governance Command Center
          </h1>

          <p className="dashboard-subtitle">
            National Integrated Operational Intelligence Platform
          </p>

          {aisError && (
            <p
              style={{
                color: "#f59e0b",
                marginTop: "8px",
                fontSize: "12px",
              }}
            >
              AIS source unavailable — showing fallback dashboard values.
            </p>
          )}
        </div>

      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-label">
            ACTIVE OPERATIONS
          </div>

          <div className="stat-value">
            {activeOperations}
          </div>

          <div className="stat-sub">
            AIS-derived moving activity
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            ESCALATIONS
          </div>

          <div className="stat-value">
            {escalationCount}
          </div>

          <div className="stat-sub">
            AIS data-quality / activity index
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            TELEMETRY SIGNALS
          </div>

          <div className="stat-value">
            {aisMetrics.records.toLocaleString()}
          </div>

          <div className="stat-sub">
            AIS records synchronized
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            SYSTEM STATUS
          </div>

          <div className="stat-value">
            {systemStatus}
          </div>

          <div className="stat-sub">
            {aisLoading
              ? "Loading AIS telemetry"
              : `${Math.round(
                  aisMetrics.overallQuality
                )}% data quality`}
          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* MAIN GRID */}
      {/* ================================================= */}

      <div className="main-grid">

        {/* ============================================= */}
        {/* OPERATIONAL TREND */}
        {/* ============================================= */}

        <div className="panel">

          <div className="panel-title">
            Operational Trend
          </div>

          <div
            className="chart-box"
            style={{
              width: "100%",
              height: "360px",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={operationalData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 30,
                  bottom: 40,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="city"
                  stroke="#7aa6d1"
                  tick={{ fill: "#7aa6d1" }}
                  label={{
                    value: "Operational Segment",
                    position: "insideBottom",
                    offset: -25,
                    fill: "#7aa6d1",
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#7aa6d1"
                  tick={{ fill: "#7aa6d1" }}
                  label={{
                    value: "AIS Operational Index",
                    angle: -90,
                    position: "insideLeft",
                    offset: 5,
                    fill: "#7aa6d1",
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}`,
                    "AIS-derived value",
                  ]}
                />

                <Bar
                  dataKey="value"
                  fill="#00cfff"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============================================= */}
        {/* LIVE TELEMETRY */}
        {/* ============================================= */}

        <div className="panel">

          <div className="panel-title">
            Live Telemetry
          </div>

          <div
            className="chart-box"
            style={{
              width: "100%",
              height: "360px",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={telemetryData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 40,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorSignalsOperational"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#00cfff"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="95%"
                      stopColor="#00cfff"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#7aa6d1"
                  tick={{ fill: "#7aa6d1" }}
                  label={{
                    value: "Time Segment",
                    position: "insideBottom",
                    offset: -10,
                    fill: "#7aa6d1",
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#7aa6d1"
                  tick={{ fill: "#7aa6d1" }}
                  label={{
                    value: "Telemetry Activity",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#7aa6d1",
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}`,
                    "AIS activity",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="signals"
                  stroke="#00cfff"
                  fill="url(#colorSignalsOperational)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* HEATMAP */}
      {/* ================================================= */}

      <div className="panel">

        <div className="panel-title">
          Escalation Heatmap
        </div>

        <div className="heatmap-grid">

          {heatmapData.map((item) => (
            <div
              key={item.city}
              className={`heat-card heat-${item.level}`}
            >
              <div className="heat-city">
                {item.city}
              </div>

              <div className="heat-alerts">
                {item.alerts} Alerts
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* ================================================= */}
      {/* BOTTOM GRID */}
      {/* ================================================= */}

      <div className="bottom-grid">

        {/* ============================================= */}
        {/* TIMELINE */}
        {/* ============================================= */}

        <div className="panel">

          <div className="panel-title">
            Operational Replay Timeline
          </div>

          <div className="timeline">

            <div className="timeline-item">
              <div className="timeline-title">
                AIS Telemetry Replay Loaded
              </div>

              <div className="timeline-time">
                {aisMetrics.records.toLocaleString()} records synchronized
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-title">
                Vessel Activity Analysis Completed
              </div>

              <div className="timeline-time">
                {aisMetrics.movingRecords.toLocaleString()} moving records
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-title">
                Telemetry Quality Validation Completed
              </div>

              <div className="timeline-time">
                {Math.round(
                  aisMetrics.overallQuality
                )}% data quality
              </div>
            </div>

          </div>

        </div>

        {/* ============================================= */}
        {/* LIVE FEED */}
        {/* ============================================= */}

        <div className="panel">

          <div className="panel-title">
            Live Telemetry Feed
          </div>

          <div className="feed-grid">

            <div className="feed-card">

              <div className="feed-title">
                AIS Vessel Activity
              </div>

              <div className="feed-meta">

                <div
                  className={`feed-severity ${
                    heatmapData[0]?.level === "critical"
                      ? "severity-high"
                      : heatmapData[0]?.level === "medium"
                      ? "severity-medium"
                      : "severity-low"
                  }`}
                >
                  {heatmapData[0]?.level?.toUpperCase() ||
                    "LOW"}
                </div>

                <div className="feed-location">
                  Segment: {heatmapData[0]?.city || "AIS"}
                </div>

              </div>

              <div className="feed-desc">
                {aisMetrics.movingRecords.toLocaleString()} moving AIS
                records detected across the loaded telemetry dataset.
              </div>

            </div>

            <div className="feed-card">

              <div className="feed-title">
                Telemetry Data Quality
              </div>

              <div className="feed-meta">

                <div
                  className={`feed-severity ${
                    aisMetrics.overallQuality >= 90
                      ? "severity-high"
                      : aisMetrics.overallQuality >= 70
                      ? "severity-medium"
                      : "severity-low"
                  }`}
                >
                  {Math.round(
                    aisMetrics.overallQuality
                  )}
                  %
                </div>

                <div className="feed-location">
                  AIS Data Layer
                </div>

              </div>

              <div className="feed-desc">
                Coordinates, speed and timestamp coverage are being
                evaluated from AIS telemetry.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
