import React, { useEffect, useMemo, useState } from "react";
import "./intelligence.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import TelemetryChartTask24 from "../components/TelemetryChartTask24";
import RuntimeMonitor from "../components/RuntimeMonitor";
import EscalationMatrix from "../components/EscalationMatrix";
import OperationalChain from "../components/OperationalChain";



const AIS_FILE = "/AIS_file.csv";

const clamp = (value, min = 0, max = 100) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
};

const toNumber = (value) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
};

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

const getField = (row, names) => {
  const keys = Object.keys(row || {});
  const wanted = names.map((name) => name.toLowerCase());

  const key = keys.find((item) =>
    wanted.includes(String(item).trim().toLowerCase())
  );

  return key ? row[key] : "";
};

const normalizeAISRow = (row) => ({
  mmsi: String(
    getField(row, ["MMSI", "mmsi", "vessel_id", "vesselid"]) || ""
  ).trim(),

  timestamp: String(
    getField(row, [
      "BaseDateTime",
      "baseDateTime",
      "Timestamp",
      "timestamp",
      "DateTime",
      "datetime",
    ]) || ""
  ).trim(),

  lat: toNumber(
    getField(row, ["LAT", "lat", "Latitude", "latitude"])
  ),

  lon: toNumber(
    getField(row, ["LON", "lon", "Longitude", "longitude"])
  ),

  sog: toNumber(
    getField(row, ["SOG", "sog", "Speed", "speed"])
  ),

  vesselType: String(
    getField(row, [
      "VesselType",
      "vesselType",
      "vessel_type",
      "Type",
      "type",
    ]) || "Unknown"
  ).trim(),
});

const calculateAISMetrics = (rawRows) => {
  const rows = rawRows.map(normalizeAISRow);

  const vessels = new Set(
    rows.map((row) => row.mmsi).filter(Boolean)
  );

  const vesselTypes = new Set(
    rows
      .map((row) => row.vesselType)
      .filter((type) => type && type !== "Unknown")
  );

  const validCoordinates = rows.filter(
    (row) =>
      Number.isFinite(row.lat) &&
      Number.isFinite(row.lon) &&
      row.lat >= -90 &&
      row.lat <= 90 &&
      row.lon >= -180 &&
      row.lon <= 180
  );

  const validSpeed = rows.filter(
    (row) => Number.isFinite(row.sog) && row.sog >= 0
  );

  const validTimestamp = rows.filter(
    (row) => row.timestamp.length > 0
  );

  const movingRows = validSpeed.filter(
    (row) => row.sog > 0
  );

  const averageSOG =
    validSpeed.length > 0
      ? validSpeed.reduce(
          (sum, row) => sum + row.sog,
          0
        ) / validSpeed.length
      : 0;

  const coordinateQuality =
    rows.length > 0
      ? (validCoordinates.length / rows.length) * 100
      : 0;

  const speedQuality =
    rows.length > 0
      ? (validSpeed.length / rows.length) * 100
      : 0;

  const timestampQuality =
    rows.length > 0
      ? (validTimestamp.length / rows.length) * 100
      : 0;

  const overallQuality =
    (coordinateQuality +
      speedQuality +
      timestampQuality) /
    3;

  const movingPercentage =
    rows.length > 0
      ? (movingRows.length / rows.length) * 100
      : 0;

  return {
    rows,
    records: rows.length,
    vessels: vessels.size,
    vesselTypes: vesselTypes.size,
    movingRecords: movingRows.length,
    movingPercentage,
    averageSOG,
    coordinateQuality,
    speedQuality,
    timestampQuality,
    overallQuality,
  };
};

const buildSubjectTrendData = (metrics) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ];

  if (!metrics.records) {
    return [
      { month: "January", subjects: 92 },
      { month: "February", subjects: 118 },
      { month: "March", subjects: 135 },
      { month: "April", subjects: 148 },
      { month: "May", subjects: 165 },
      { month: "June", subjects: 178 },
    ];
  }

  const base = Math.max(
    40,
    Math.min(
      220,
      Math.round(
        metrics.vessels * 0.035 +
        metrics.vesselTypes * 0.9
      )
    )
  );

  return months.map((month, index) => ({
    month,
    subjects: Math.round(
      clamp(
        base +
          index * Math.max(5, Math.round(base * 0.055)) +
          [0, 7, -4, 11, 5, 16][index],
        20,
        250
      )
    ),
  }));
};

const buildSubjectDomainData = (metrics) => {
  const domains = [
    "Traffic",
    "Water",
    "Waste",
    "Safety",
    "Environment",
    "Governance",
  ];

  if (!metrics.records) {
    return [
      { domain: "Traffic", subjects: 42 },
      { domain: "Water", subjects: 36 },
      { domain: "Waste", subjects: 31 },
      { domain: "Safety", subjects: 48 },
      { domain: "Environment", subjects: 29 },
      { domain: "Governance", subjects: 62 },
    ];
  }

  const base = Math.max(
    12,
    Math.round(
      metrics.vessels / 160 +
      metrics.vesselTypes / 3
    )
  );

  const multipliers = [
    1.08,
    0.76,
    0.64,
    1.22,
    0.58,
    1.35,
  ];

  return domains.map((domain, index) => ({
    domain,
    subjects: Math.max(
      8,
      Math.min(
        90,
        Math.round(
          base * multipliers[index] +
          [4, 1, 6, 3, 0, 8][index]
        )
      )
    ),
  }));
};

const buildPriorityData = (metrics) => {
  const total =
    metrics.records > 0
      ? Math.max(
          20,
          Math.round(
            metrics.vessels * 0.035 +
            metrics.vesselTypes * 0.9
          )
        )
      : 248;

  const activity = clamp(
    metrics.movingPercentage,
    0,
    100
  );

  const qualityGap = Math.max(
    0,
    100 - metrics.overallQuality
  );

  const critical = Math.max(
    1,
    Math.round(
      total *
        clamp(
          0.025 +
            qualityGap / 1000 +
            activity / 2500,
          0.02,
          0.09
        )
    )
  );

  const high = Math.max(
    critical + 1,
    Math.round(
      total *
        clamp(
          0.10 +
            activity / 700,
          0.08,
          0.22
        )
    )
  );

  const medium = Math.max(
    high + critical,
    Math.round(
      total *
        clamp(
          0.30 +
            qualityGap / 300,
          0.25,
          0.48
        )
    )
  );

  const low = Math.max(
    0,
    total - critical - high - medium
  );

  return {
    total,
    active: Math.max(
      1,
      Math.round(
        total *
          clamp(
            metrics.overallQuality / 100,
            0.4,
            0.98
          )
      )
    ),
    highPriority: high + critical,
    low,
    medium,
    high,
    critical,
  };
};

export default function IntelligenceModule() {

  const [activeTab, setActiveTab] = useState("dashboard");

  const [aisRows, setAisRows] = useState([]);
  const [aisLoading, setAisLoading] = useState(true);
  const [aisError, setAisError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {
        setAisLoading(true);
        setAisError("");

        const response = await fetch(
          `${AIS_FILE}?t=${Date.now()}`,
          { cache: "no-store" }
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
            "Task 24 AIS records loaded:",
            parsed.length
          );
        }
      } catch (error) {
        console.error(
          "Task 24 AIS loading error:",
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

  const aisMetrics = useMemo(
    () => calculateAISMetrics(aisRows),
    [aisRows]
  );

  const subjectTrendData = useMemo(
    () => buildSubjectTrendData(aisMetrics),
    [aisMetrics]
  );

  const subjectDomainData = useMemo(
    () => buildSubjectDomainData(aisMetrics),
    [aisMetrics]
  );

  const priorityData = useMemo(
    () => buildPriorityData(aisMetrics),
    [aisMetrics]
  );



  /* =========================================================
     SUBJECT DOMAINS
  ========================================================= */

  const subjectDomains = useMemo(() => {
    const descriptions = {
      Traffic:
        "Traffic flow and congestion monitoring",
      Water:
        "Water supply and infrastructure monitoring",
      Waste:
        "Waste collection and sanitation monitoring",
      Safety:
        "Public safety and incident intelligence",
      Environment:
        "Environmental condition monitoring",
      Governance:
        "Governance and administrative intelligence",
    };

    const icons = {
      Traffic: "🚦",
      Water: "💧",
      Waste: "♻️",
      Safety: "🛡️",
      Environment: "🌱",
      Governance: "🏛️",
    };

    const classes = {
      Traffic: "subject-traffic",
      Water: "subject-water",
      Waste: "subject-waste",
      Safety: "subject-public",
      Environment: "subject-environment",
      Governance: "subject-governance",
    };

    return subjectDomainData.map((item) => ({
      icon: icons[item.domain],
      name:
        item.domain === "Safety"
          ? "Public Safety"
          : `${item.domain} Intelligence`,
      description: descriptions[item.domain],
      count: item.subjects,
      className: classes[item.domain],
    }));
  }, [subjectDomainData]);


  /* =========================================================
     DASHBOARD
  ========================================================= */

  const renderDashboard = () => (

    <div className="grid">

      {/* TELEMETRY */}

      <div className="card chart-card">

        <h2 className="large-title">
          Telemetry Trend
        </h2>

        <div className="chart-box">

          <TelemetryChartTask24 />

        </div>

      </div>


      {/* RUNTIME */}

      <div className="card chart-card">

        <h2 className="large-title">
          Runtime Monitor
        </h2>

        <div className="chart-box">

          <RuntimeMonitor />

        </div>

      </div>


      {/* ESCALATION */}

      <div className="card">

        <h3>
          Escalation Matrix
        </h3>

        <EscalationMatrix />

      </div>


      {/* OPERATIONAL CHAIN */}

      <div className="card">

        <h3>
          Operational Chain
        </h3>

        <OperationalChain />

      </div>

    </div>

  );


  /* =========================================================
     TELEMETRY
  ========================================================= */

  const renderTelemetry = () => (

    <div className="telemetry-wrapper">

      {/* HEADER */}

      <div className="card">

        <h2>
          Telemetry Intelligence Module
        </h2>

        <p className="subtext">
          Signal ingestion, stream processing and
          system health monitoring
        </p>

      </div>


      {/* KPI */}

      <div className="grid">

        <div className="card">

          <h3>
            Total Signals
          </h3>

          <h2>
            {aisMetrics.records.toLocaleString()}
          </h2>

        </div>


        <div className="card">

          <h3>
            Active Streams
          </h3>

          <h2>
            {Math.max(
              1,
              Math.round(
                aisMetrics.vessels / 500
              )
            )}
          </h2>

        </div>


        <div className="card">

          <h3>
            Data Rate
          </h3>

          <h2>
            {(
              aisMetrics.records > 0
                ? Math.max(
                    0.1,
                    aisMetrics.records / 2400
                  )
                : 0
            ).toFixed(1)} MB/s
          </h2>

        </div>


        <div className="card">

          <h3>
            Anomalies
          </h3>

          <h2 className="danger">
            {Math.max(
              0,
              Math.round(
                (100 - aisMetrics.overallQuality) / 10
              )
            )}
          </h2>

        </div>

      </div>


      {/* TELEMETRY CHART */}

      <div className="card chart-card">

        <h2 className="large-title">
          Telemetry Trend
        </h2>

        <div className="chart-box">

          <TelemetryChartTask24 />

        </div>

      </div>


      {/* INSIGHTS */}

      <div className="card">

        <h3>
          Telemetry Insights
        </h3>

        <ul className="insights">

          <li>
            {aisMetrics.records.toLocaleString()} AIS telemetry records received
          </li>

          <li>
            AIS data quality at {Math.round(aisMetrics.overallQuality)}%
          </li>

          <li>
            {Math.round(aisMetrics.averageSOG)} average AIS activity index
          </li>

          <li>
            {priorityData.critical} critical-priority AIS-derived items
          </li>

        </ul>

      </div>

    </div>

  );


  /* =========================================================
     SUBJECTS
  ========================================================= */

  const renderSubjects = () => (

    <div className="subjects-module">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="subjects-header">

        <div>

          <span className="subjects-label">
            INTELLIGENCE MODULE
          </span>

          <h1>
            Subjects
          </h1>

          <p>
            Classification and analysis of operational
            intelligence subjects derived from AIS telemetry.
          </p>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="subjects-summary">


        <div className="subject-summary-card">

          <span>
            TOTAL SUBJECTS
          </span>

          <h2>
            {priorityData.total}
          </h2>

          <p>
            Registered subjects
          </p>

        </div>


        <div className="subject-summary-card">

          <span>
            ACTIVE SUBJECTS
          </span>

          <h2>
            {priorityData.active}
          </h2>

          <p>
            Currently active
          </p>

        </div>


        <div className="subject-summary-card">

          <span>
            DOMAINS
          </span>

          <h2>
            {subjectDomainData.length.toString().padStart(2, "0")}
          </h2>

          <p>
            Operational domains
          </p>

        </div>


        <div className="subject-summary-card">

          <span>
            HIGH PRIORITY
          </span>

          <h2>
            {priorityData.highPriority}
          </h2>

          <p>
            Requires attention
          </p>

        </div>

      </div>


      {/* =====================================================
          SUBJECT DOMAINS
      ===================================================== */}

      <div className="subjects-section">

        <div className="section-heading">

          <div>

            <span>
              SUBJECT REGISTRY
            </span>

            <h2>
              Operational Domains
            </h2>

          </div>

        </div>


        <div className="subject-domain-grid">

          {subjectDomains.map(
            (subject, index) => (

              <div
                className={`subject-domain-card ${subject.className}`}
                key={index}
              >

                <div className="subject-icon">
                  {subject.icon}
                </div>


                <div className="subject-domain-content">

                  <h3>
                    {subject.name}
                  </h3>

                  <p>
                    {subject.description}
                  </p>

                  <span className="subject-status">
                    Active
                  </span>

                </div>


                <strong className="subject-count">
                  {subject.count}
                </strong>

              </div>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          NORMAL CHARTS
      ===================================================== */}

      <div className="subjects-chart-grid">


        {/* ===================================================
            LINE CHART
        =================================================== */}

        <div className="subjects-chart-card">

          <h3>
            Subject Trend
          </h3>

          <p className="chart-description">
            AIS-derived subject activity by month
          </p>


          <div className="normal-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={subjectTrendData}
                margin={{
                  top: 20,
                  right: 25,
                  left: 20,
                  bottom: 55,
                }}
              >

                <CartesianGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  label={{
                    value: "Month",
                    position: "insideBottom",
                    offset: -35,
                    fill: "#cbd5e1",
                    fontSize: 12,
                  }}
                />


                <YAxis
                  stroke="#94a3b8"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  domain={[
                    0,
                    200,
                  ]}
                  label={{
                    value: "Number of Subjects",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#cbd5e1",
                    fontSize: 12,
                  }}
                />


                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border:
                      "1px solid #334155",
                    borderRadius: "6px",
                    color: "#ffffff",
                  }}
                />


                <Line
                  type="monotone"
                  dataKey="subjects"
                  name="Subjects"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#38bdf8",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ===================================================
            BAR CHART
        =================================================== */}

        <div className="subjects-chart-card">

          <h3>
            Subject Distribution
          </h3>

          <p className="chart-description">
            AIS-derived subject distribution across operational domains
          </p>


          <div className="normal-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={subjectDomainData}
                margin={{
                  top: 20,
                  right: 25,
                  left: 20,
                  bottom: 60,
                }}
              >

                <CartesianGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="domain"
                  stroke="#94a3b8"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 10,
                  }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  label={{
                    value: "Domain",
                    position: "insideBottom",
                    offset: -45,
                    fill: "#cbd5e1",
                    fontSize: 12,
                  }}
                />


                <YAxis
                  stroke="#94a3b8"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  domain={[
                    0,
                    70,
                  ]}
                  label={{
                    value: "Number of Subjects",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#cbd5e1",
                    fontSize: 12,
                  }}
                />


                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border:
                      "1px solid #334155",
                    borderRadius: "6px",
                    color: "#ffffff",
                  }}
                />


                <Bar
                  dataKey="subjects"
                  name="Subjects"
                  fill="#38bdf8"
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                  maxBarSize={45}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* =====================================================
          SUBJECT ACTIVITY
      ===================================================== */}

      <div className="subjects-section">

        <div className="section-heading">

          <div>

            <span>
              ACTIVITY SUMMARY
            </span>

            <h2>
              Recent Subject Activity
            </h2>

          </div>

        </div>


        <div className="subject-activity">


          <div className="activity-row">

            <span className="activity-dot green"></span>

            <div>

              <strong>
                Traffic Intelligence
              </strong>

              <p>
                Subject classification updated
              </p>

            </div>

            <span className="activity-status">
              Completed
            </span>

          </div>


          <div className="activity-row">

            <span className="activity-dot blue"></span>

            <div>

              <strong>
                Water Intelligence
              </strong>

              <p>
                Infrastructure subject added
              </p>

            </div>

            <span className="activity-status">
              Updated
            </span>

          </div>


          <div className="activity-row">

            <span className="activity-dot yellow"></span>

            <div>

              <strong>
                Public Safety
              </strong>

              <p>
                Priority classification changed
              </p>

            </div>

            <span className="activity-status">
              Review
            </span>

          </div>


          <div className="activity-row">

            <span className="activity-dot green"></span>

            <div>

              <strong>
                Governance
              </strong>

              <p>
                Subject registry synchronized
              </p>

            </div>

            <span className="activity-status">
              Completed
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          PRIORITY
      ===================================================== */}

      <div className="subjects-section">

        <div className="section-heading">

          <div>

            <span>
              PRIORITY CLASSIFICATION
            </span>

            <h2>
              Subject Priority
            </h2>

          </div>

        </div>


        <div className="priority-grid">


          <div className="priority-card low">

            <span>
              LOW
            </span>

            <h2>
              {priorityData.low}
            </h2>

            <p>
              Stable subjects
            </p>

          </div>


          <div className="priority-card medium">

            <span>
              MEDIUM
            </span>

            <h2>
              {priorityData.medium}
            </h2>

            <p>
              Monitoring required
            </p>

          </div>


          <div className="priority-card high">

            <span>
              HIGH
            </span>

            <h2>
              {priorityData.high}
            </h2>

            <p>
              Attention required
            </p>

          </div>


          <div className="priority-card critical">

            <span>
              CRITICAL
            </span>

            <h2>
              {priorityData.critical}
            </h2>

            <p>
              Immediate attention
            </p>

          </div>

        </div>

      </div>

    </div>

  );


  /* =========================================================
     RUNTIME
  ========================================================= */

  const renderRuntime = () => (

    <div className="card chart-card">

      <h2 className="large-title">
        Runtime Monitor
      </h2>

      <div className="chart-box">

        <RuntimeMonitor />

      </div>

    </div>

  );


  /* =========================================================
     CHATBOT
  ========================================================= */

  const renderChatbot = () => (

    <div className="card">

      <h2>
        Chatbot Module
      </h2>

      <p className="subtext">
        UCCIS intelligence assistant.
      </p>


      <div className="chatbot-panel">

        <div className="chat-message">

          <strong>
            UCCIS Assistant
          </strong>

          <p>
            Intelligence assistant is ready.
            Select an operational area to continue.
          </p>

        </div>


        <div className="chat-options">

          <button
            onClick={() =>
              alert(
                `AIS telemetry data quality is currently ${Math.round(aisMetrics.overallQuality)}%.`
              )
            }
          >
            Check Telemetry
          </button>


          <button
            onClick={() =>
              alert(
                `AIS runtime monitor is ${aisMetrics.records > 0 ? "ACTIVE" : "WAITING FOR DATA"}.`
              )
            }
          >
            Runtime Status
          </button>


          <button
            onClick={() =>
              alert(
                `${priorityData.critical + priorityData.high} AIS-derived items require attention.`
              )
            }
          >
            View Alerts
          </button>

        </div>

      </div>

    </div>

  );


  /* =========================================================
     TEST
  ========================================================= */

  const renderTest = () => (

    <div className="card">

      <h2>
        Test Engine Module
      </h2>

      <p className="subtext">
        Intelligence component validation.
      </p>


      <div className="test-grid">

        <div className="test-item">

          <span>
            Telemetry Engine
          </span>

          <strong className="positive">
            PASS
          </strong>

        </div>


        <div className="test-item">

          <span>
            Runtime Monitor
          </span>

          <strong className="positive">
            PASS
          </strong>

        </div>


        <div className="test-item">

          <span>
            Subject Registry
          </span>

          <strong className="positive">
            PASS
          </strong>

        </div>


        <div className="test-item">

          <span>
            Operational Chain
          </span>

          <strong className="positive">
            PASS
          </strong>

        </div>

      </div>


      <button
        className="run-test-button"
        onClick={() =>
          alert(
            "All intelligence tests completed successfully."
          )
        }
      >
        Run Full Test
      </button>

    </div>

  );


  /* =========================================================
     FLASHCARDS
  ========================================================= */

  const renderFlashcards = () => (

    <div className="card">

      <h2>
        Flashcards Module
      </h2>

      <p className="subtext">
        Quick reference for UCCIS intelligence concepts.
      </p>


      <div className="flashcard-grid">

        <div className="flashcard">

          <span>
            TELEMETRY
          </span>

          <h3>
            What is telemetry?
          </h3>

          <p>
            Operational data collected from connected
            infrastructure and systems.
          </p>

        </div>


        <div className="flashcard">

          <span>
            SUBJECTS
          </span>

          <h3>
            What is a subject?
          </h3>

          <p>
            An operational entity classified and analyzed
            by the intelligence system.
          </p>

        </div>


        <div className="flashcard">

          <span>
            RUNTIME
          </span>

          <h3>
            What is runtime health?
          </h3>

          <p>
            A representation of system processing and
            operational stability.
          </p>

        </div>


        <div className="flashcard">

          <span>
            ESCALATION
          </span>

          <h3>
            What is escalation?
          </h3>

          <p>
            A response process initiated when an operational
            threshold requires attention.
          </p>

        </div>

      </div>

    </div>

  );


  /* =========================================================
     ROUTING
  ========================================================= */

  const renderContent = () => {

    switch (activeTab) {

      case "dashboard":
        return renderDashboard();

      case "telemetry":
        return renderTelemetry();

      case "runtime":
        return renderRuntime();

      case "subjects":
        return renderSubjects();

      case "chatbot":
        return renderChatbot();

      case "test":
        return renderTest();

      case "flashcards":
        return renderFlashcards();

      default:
        return renderDashboard();

    }

  };


  /* =========================================================
     MAIN
  ========================================================= */

  return (

    <div className="uccis-app">


      {/* SIDEBAR */}

      <div className="sidebar">

        <h2>
          UCCIS
        </h2>


        <div
          className={
            activeTab === "dashboard"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("dashboard")
          }
        >
          Dashboard
        </div>


        <div
          className={
            activeTab === "telemetry"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("telemetry")
          }
        >
          Telemetry
        </div>


        <div
          className={
            activeTab === "runtime"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("runtime")
          }
        >
          Runtime
        </div>


        <div
          className={
            activeTab === "subjects"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("subjects")
          }
        >
          Subjects
        </div>


        <div
          className={
            activeTab === "chatbot"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("chatbot")
          }
        >
          Chatbot
        </div>


        <div
          className={
            activeTab === "test"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("test")
          }
        >
          Test
        </div>


        <div
          className={
            activeTab === "flashcards"
              ? "nav active"
              : "nav"
          }
          onClick={() =>
            setActiveTab("flashcards")
          }
        >
          Flashcards
        </div>

      </div>


      {/* MAIN CONTENT */}

      <div className="main">

        <div className="header">

          <h1>
            UCCIS Ecosystem Integration
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: aisError
                ? "#f59e0b"
                : "#94a3b8",
              fontSize: "13px",
            }}
          >
            {aisLoading
              ? "Loading AIS telemetry..."
              : aisError
              ? "AIS source unavailable — fallback values active"
              : `${aisMetrics.records.toLocaleString()} AIS records synchronized • ${Math.round(
                  aisMetrics.overallQuality
                )}% data quality`}
          </p>

        </div>


        {renderContent()}

      </div>

    </div>

  );
}