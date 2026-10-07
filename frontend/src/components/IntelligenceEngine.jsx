import React, { useMemo, useState } from "react";
import axios from "axios";

/*
=========================================================
TASK 8 - AIS INTELLIGENCE ENGINE
=========================================================

AIS dataset:
- 10,000 records
- 6,728 unique vessels
- Observation window: 00:00:00 - 00:04:40
- 4,276 moving records
- 5,724 stationary records
- Average valid SOG: 2.51 kn
- Maximum SOG: 37.4 kn
- 938 records with SOG ≥ 10 kn
- 23 unavailable SOG records (102.3 sentinel)
- 57 vessel types

The Task 8 visualizations are AIS-derived.
No Zone 4 / complaint / urban mock data is used.
=========================================================
*/

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const INTELLIGENCE_ENDPOINT = `${API_BASE_URL}/intelligence-run`;

const AIS_SUMMARY = {
  records: 10000,
  uniqueVessels: 6728,
  moving: 4276,
  stationary: 5724,
  unavailableSog: 23,
  validSogRecords: 9977,
  averageSog: 2.5077778891450335,
  maxSog: 37.4,
  highSpeed10: 938,
  highSpeed15: 290,
  highSpeed20: 102,
  highSpeed25: 48,
  highSpeed30: 16,
  vesselTypes: 57,
  observationStart: "2022-01-01 00:00:00",
  observationEnd: "2022-01-01 00:04:40",
  dataQuality: 99.77,
  riskScore: 78,
  riskLevel: "HIGH",
};

const TEMPORAL_ACTIVITY = [
  { minute: "00:00", records: 4229, moving: 1805, stationary: 2424 },
  { minute: "00:01", records: 3849, moving: 1667, stationary: 2182 },
  { minute: "00:02", records: 1563, moving: 647, stationary: 916 },
  { minute: "00:03", records: 327, moving: 141, stationary: 186 },
  { minute: "00:04", records: 32, moving: 16, stationary: 16 },
];

const SOG_DISTRIBUTION = [
  { range: "0 kn", records: 5724 },
  { range: "0-5 kn", records: 2386 },
  { range: "5-10 kn", records: 952 },
  { range: "10-15 kn", records: 648 },
  { range: "15-20 kn", records: 188 },
  { range: "20-25 kn", records: 54 },
  { range: "25-30 kn", records: 32 },
  { range: "30+ kn", records: 16 },
];

const VESSEL_TYPES = [
  { type: "31", records: 3394 },
  { type: "37", records: 1641 },
  { type: "60", records: 954 },
  { type: "70", records: 849 },
  { type: "90", records: 677 },
  { type: "30", records: 662 },
  { type: "80", records: 417 },
  { type: "52", records: 293 },
  { type: "36", records: 281 },
  { type: "57", records: 183 },
];

const HOTSPOTS = [
  {
    id: "H1",
    location: "47.5-48.0 N / 122.5-122.0 W",
    records: 434,
    vessels: 340,
    stationary: 85.94,
    avgSog: 0.28,
    highSpeed: 2,
  },
  {
    id: "H2",
    location: "29.5-30.0 N / 90.5-90.0 W",
    records: 390,
    vessels: 247,
    stationary: 57.69,
    avgSog: 1.58,
    highSpeed: 3,
  },
  {
    id: "H3",
    location: "29.5-30.0 N / 95.5-95.0 W",
    records: 335,
    vessels: 208,
    stationary: 63.28,
    avgSog: 1.20,
    highSpeed: 0,
  },
  {
    id: "H4",
    location: "33.5-34.0 N / 118.5-118.0 W",
    records: 281,
    vessels: 212,
    stationary: 69.40,
    avgSog: 1.05,
    highSpeed: 0,
  },
  {
    id: "H5",
    location: "40.5-41.0 N / 74.5-74.0 W",
    records: 232,
    vessels: 136,
    stationary: 61.21,
    avgSog: 1.37,
    highSpeed: 7,
  },
  {
    id: "H6",
    location: "29.0-29.5 N / 95.0-94.5 W",
    records: 229,
    vessels: 149,
    stationary: 41.92,
    avgSog: 2.52,
    highSpeed: 1,
  },
  {
    id: "H7",
    location: "37.5-38.0 N / 122.5-122.0 W",
    records: 226,
    vessels: 150,
    stationary: 58.85,
    avgSog: 3.03,
    highSpeed: 19,
  },
  {
    id: "H8",
    location: "49.0-49.5 N / 123.5-123.0 W",
    records: 210,
    vessels: 133,
    stationary: 71.43,
    avgSog: 3.19,
    highSpeed: 8,
  },
  {
    id: "H9",
    location: "32.5-33.0 N / 117.5-117.0 W",
    records: 192,
    vessels: 160,
    stationary: 85.42,
    avgSog: 0.21,
    highSpeed: 0,
  },
  {
    id: "H10",
    location: "25.5-26.0 N / 80.5-80.0 W",
    records: 173,
    vessels: 134,
    stationary: 61.27,
    avgSog: 2.41,
    highSpeed: 6,
  },
];

const RISK_COMPONENTS = [
  { name: "Vessel concentration", score: 31 },
  { name: "Stationary activity", score: 24 },
  { name: "High-speed activity", score: 14 },
  { name: "Spatial concentration", score: 9 },
];

const ANOMALIES = [
  {
    level: "HIGH",
    title: "High-speed vessel activity",
    detail: "938 AIS records have SOG ≥ 10 kn; maximum observed SOG is 37.4 kn.",
  },
  {
    level: "HIGH",
    title: "Dense stationary concentration",
    detail: "57.24% of all valid movement records report SOG = 0.",
  },
  {
    level: "MEDIUM",
    title: "Hotspot H7 elevated speed",
    detail: "The 37.5-38.0 N / 122.5-122.0 W cell contains 19 records at ≥ 15 kn.",
  },
  {
    level: "MEDIUM",
    title: "Hotspot H5 elevated speed",
    detail: "The 40.5-41.0 N / 74.5-74.0 W cell contains 7 records at ≥ 15 kn.",
  },
];

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const pct = (value) => `${Number(value).toFixed(2)}%`;

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 18,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            margin: "5px 0 0",
            color: "#6b7280",
            fontSize: 13,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function BarGraph({
  data,
  valueKey,
  labelKey,
  title,
  suffix = "",
  maxValue,
}) {
  const max = maxValue || Math.max(...data.map((item) => item[valueKey]), 1);

  return (
    <Card style={{ minWidth: 0 }}>
      <SectionTitle title={title} />
      <div style={{ display: "grid", gap: 12 }}>
        {data.map((item) => {
          const value = Number(item[valueKey]) || 0;
          const width = `${clamp((value / max) * 100, 2, 100)}%`;

          return (
            <div key={`${item[labelKey]}-${value}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    color: "#374151",
                    fontWeight: 700,
                  }}
                >
                  {item[labelKey]}
                </span>
                <span
                  style={{
                    color: "#111827",
                    fontWeight: 800,
                  }}
                >
                  {formatNumber(value)}
                  {suffix}
                </span>
              </div>

              <div
                style={{
                  height: 12,
                  background: "#e5e7eb",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width,
                    height: "100%",
                    background: "#2563eb",
                    borderRadius: 20,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function LineGraph({ data, title }) {
  const width = 720;
  const height = 270;
  const left = 48;
  const right = 18;
  const top = 25;
  const bottom = 42;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const max = Math.max(...data.map((d) => d.records), 1);

  const points = data
    .map((item, index) => {
      const x =
        left +
        (index / Math.max(data.length - 1, 1)) * chartWidth;
      const y =
        top + chartHeight - (item.records / max) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Card style={{ minWidth: 0 }}>
      <SectionTitle
        title={title}
        subtitle="AIS records observed per minute"
      />

      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", minWidth: 520, height: 270 }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = top + chartHeight - fraction * chartHeight;
            const value = Math.round(max * fraction);

            return (
              <g key={fraction}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#e5e7eb"
                />
                <text
                  x={left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {formatNumber(value)}
                </text>
              </g>
            );
          })}

          <polyline
            points={points}
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {data.map((item, index) => {
            const x =
              left +
              (index / Math.max(data.length - 1, 1)) * chartWidth;
            const y =
              top +
              chartHeight -
              (item.records / max) * chartHeight;

            return (
              <g key={item.minute}>
                <circle cx={x} cy={y} r="5" fill="#1d4ed8" />
                <text
                  x={x}
                  y={height - 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#374151"
                >
                  {item.minute}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

function DonutGraph({ moving, stationary }) {
  const total = moving + stationary;
  const movingPct = (moving / total) * 100;
  const circumference = 2 * Math.PI * 55;
  const movingLength = (movingPct / 100) * circumference;

  return (
    <Card>
      <SectionTitle
        title="AIS Movement Composition"
        subtitle="Moving versus stationary observations"
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <svg width="170" height="170" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r="55"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="18"
          />
          <circle
            cx="70"
            cy="70"
            r="55"
            fill="none"
            stroke="#2563eb"
            strokeWidth="18"
            strokeDasharray={`${movingLength} ${circumference}`}
            strokeDashoffset={circumference / 4}
            transform="rotate(-90 70 70)"
          />
          <text
            x="70"
            y="66"
            textAnchor="middle"
            fontSize="20"
            fontWeight="800"
            fill="#111827"
          >
            {movingPct.toFixed(1)}%
          </text>
          <text
            x="70"
            y="83"
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            MOVING
          </text>
        </svg>

        <div style={{ display: "grid", gap: 12 }}>
          <Metric label="Moving" value={formatNumber(moving)} />
          <Metric label="Stationary" value={formatNumber(stationary)} />
          <Metric label="Total" value={formatNumber(total)} />
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value, small = false }) {
  return (
    <div>
      <div
        style={{
          color: "#6b7280",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 3,
          color: "#111827",
          fontSize: small ? 15 : 22,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function RiskGauge({ score }) {
  const angle = -90 + (score / 100) * 180;

  return (
    <Card>
      <SectionTitle
        title="AIS Risk Engine"
        subtitle="Rule-based operational risk score"
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 260,
            height: 140,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "22px solid #e5e7eb",
              borderBottomColor: "#dc2626",
              borderLeftColor: "#f59e0b",
              borderTopColor: "#16a34a",
              transform: "rotate(45deg)",
              left: 20,
              top: 25,
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 3,
              height: 95,
              background: "#111827",
              left: "50%",
              bottom: 0,
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${angle}deg)`,
              borderRadius: 4,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: "#dc2626",
            marginTop: -4,
          }}
        >
          {score}
        </div>

        <div
          style={{
            marginTop: 2,
            fontWeight: 900,
            color: "#dc2626",
            letterSpacing: 1,
          }}
        >
          HIGH RISK
        </div>

        <p
          style={{
            maxWidth: 430,
            textAlign: "center",
            color: "#6b7280",
            fontSize: 12,
            lineHeight: 1.5,
            marginBottom: 0,
          }}
        >
          Rule-based AIS operational risk. This is not an incident
          probability because the dataset contains no incident labels,
          weather, collision outcomes, or port-status labels.
        </p>
      </div>
    </Card>
  );
}

function RiskComponentGraph() {
  return (
    <BarGraph
      title="Risk Engine Components"
      data={RISK_COMPONENTS}
      valueKey="score"
      labelKey="name"
      suffix=" pts"
      maxValue={35}
    />
  );
}

function AnomalyList() {
  const levelStyle = {
    HIGH: {
      background: "#fee2e2",
      color: "#b91c1c",
    },
    MEDIUM: {
      background: "#fef3c7",
      color: "#92400e",
    },
  };

  return (
    <Card>
      <SectionTitle
        title="Anomaly Detection"
        subtitle="AIS-derived operational anomalies"
      />

      <div style={{ display: "grid", gap: 12 }}>
        {ANOMALIES.map((item) => (
          <div
            key={`${item.level}-${item.title}`}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 9,
              padding: 13,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "4px 8px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 900,
                ...levelStyle[item.level],
              }}
            >
              {item.level}
            </span>

            <div
              style={{
                marginTop: 7,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                marginTop: 4,
                color: "#6b7280",
                fontSize: 12,
                lineHeight: 1.45,
              }}
            >
              {item.detail}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HotspotTable() {
  return (
    <Card style={{ overflow: "hidden" }}>
      <SectionTitle
        title="AIS Spatial Hotspots"
        subtitle="Top 10 0.5° × 0.5° spatial cells"
      />

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
          }}
        >
          <thead>
            <tr style={{ background: "#111827", color: "#ffffff" }}>
              {[
                "Hotspot",
                "Spatial cell",
                "Records",
                "Vessels",
                "Stationary",
                "Avg SOG",
                ">=15 kn",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "11px 9px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {HOTSPOTS.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 10, fontWeight: 800 }}>{row.id}</td>
                <td style={{ padding: 10 }}>{row.location}</td>
                <td style={{ padding: 10 }}>{formatNumber(row.records)}</td>
                <td style={{ padding: 10 }}>{formatNumber(row.vessels)}</td>
                <td style={{ padding: 10 }}>{pct(row.stationary)}</td>
                <td style={{ padding: 10 }}>{row.avgSog.toFixed(2)} kn</td>
                <td style={{ padding: 10 }}>{row.highSpeed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AISIntelligenceOutput({ data }) {
  const backendSummary = data?.aisSummary || data?.summary || {};

  const summary = {
    ...AIS_SUMMARY,
    ...backendSummary,
  };

  return (
    <Card>
      <SectionTitle
        title="Intelligence Output"
        subtitle="Task 8 operational intelligence generated from AIS"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
        }}
      >
        <Metric label="Dataset" value="AIS_file.csv" small />
        <Metric label="Records analyzed" value={formatNumber(summary.records)} />
        <Metric
          label="Unique vessels"
          value={formatNumber(summary.uniqueVessels)}
        />
        <Metric
          label="Moving records"
          value={`${formatNumber(summary.moving)} (${((summary.moving / summary.records) * 100).toFixed(2)}%)`}
        />
        <Metric
          label="Stationary records"
          value={`${formatNumber(summary.stationary)} (${((summary.stationary / summary.records) * 100).toFixed(2)}%)`}
        />
        <Metric
          label="Average SOG"
          value={`${Number(summary.averageSog).toFixed(2)} kn`}
        />
        <Metric
          label="Maximum SOG"
          value={`${Number(summary.maxSog).toFixed(1)} kn`}
        />
        <Metric
          label="High-speed records"
          value={formatNumber(summary.highSpeed10)}
        />
        <Metric
          label="Vessel types"
          value={formatNumber(summary.vesselTypes)}
        />
        <Metric
          label="Data quality"
          value={`${Number(summary.dataQuality).toFixed(2)}%`}
        />
      </div>

      {/* <div
        style={{
          marginTop: 18,
          padding: 15,
          background: "#f9fafb",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Observation window
        </div>
        <div
          style={{
            marginTop: 5,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {summary.observationStart} — {summary.observationEnd}
        </div>
      </div> */}

      {/* <div
        style={{
          marginTop: 14,
          padding: 16,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            color: "#9a3412",
            marginBottom: 5,
          }}
        >
          ASSESSMENT: HIGH MARITIME ACTIVITY RISK
        </div>
        <div
          style={{
            color: "#7c2d12",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          High vessel concentration combined with elevated stationary
          activity. This is operational intelligence derived from AIS
          observations, not an incident probability.
        </div> */}
      {/* </div> */}
    </Card>
  );
}

function IntelligenceEngine() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRun, setLastRun] = useState(null);

  const runEngine = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(INTELLIGENCE_ENDPOINT, {
        timeout: 15000,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.data) {
        throw new Error("Backend returned an empty response.");
      }

      if (response.data.success === false) {
        throw new Error(
          response.data.error ||
            response.data.message ||
            "Intelligence Engine returned an unsuccessful response."
        );
      }

      setData(
        response.data.snapshot ||
          response.data.data ||
          response.data.result ||
          response.data
      );
      setLastRun(new Date().toLocaleTimeString());
    } catch (err) {
      /*
       * Task 8 remains usable with the verified AIS analytics even if
       * the optional backend endpoint is unavailable.
       */
      console.warn("Task 8 backend intelligence unavailable:", err);

      setData({
        source: "AIS_file.csv",
        mode: "AIS_LOCAL_ANALYTICS",
      });

      setError(
        err.response?.status
          ? `Backend HTTP ${err.response.status}. Showing AIS-derived Task 8 analytics.`
          : "Backend unavailable. Showing AIS-derived Task 8 analytics."
      );

      setLastRun(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  const movingPercentage = useMemo(
    () => (AIS_SUMMARY.moving / AIS_SUMMARY.records) * 100,
    []
  );

  const stationaryPercentage = useMemo(
    () => (AIS_SUMMARY.stationary / AIS_SUMMARY.records) * 100,
    []
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 25,
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          background: "#111827",
          color: "#ffffff",
          borderRadius: 14,
          padding: "24px 28px",
          marginBottom: 20,
          boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            {/* <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#60a5fa",
                letterSpacing: 1,
                marginBottom: 5,
              }}
            >
              TASK 8
            </div> */}

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 900,
              }}
            >
              AIS Intelligence Engine
            </h1>

            <p
              style={{
                margin: "7px 0 0",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              Risk engine • reasoning • anomaly detection • AIS analytics
            </p>
          </div>

          {/* <button
            type="button"
            onClick={runEngine}
            disabled={loading}
            style={{
              background: loading ? "#6b7280" : "#00c97b",
              color: "#ffffff",
              border: "none",
              padding: "13px 22px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
            }}
          >
            {loading ? "Running..." : "▶ Run Task 8 Intelligence"}
          </button> */}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            color: "#92400e",
            borderRadius: 10,
            padding: "12px 15px",
            marginBottom: 18,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Card>
          <Metric label="AIS records" value={formatNumber(AIS_SUMMARY.records)} />
        </Card>
        <Card>
          <Metric
            label="Unique vessels"
            value={formatNumber(AIS_SUMMARY.uniqueVessels)}
          />
        </Card>
        <Card>
          <Metric
            label="Moving"
            value={`${movingPercentage.toFixed(2)}%`}
          />
        </Card>
        <Card>
          <Metric
            label="Stationary"
            value={`${stationaryPercentage.toFixed(2)}%`}
          />
        </Card>
        <Card>
          <Metric
            label="Average SOG"
            value={`${AIS_SUMMARY.averageSog.toFixed(2)} kn`}
          />
        </Card>
        <Card>
          <Metric
            label="Maximum SOG"
            value={`${AIS_SUMMARY.maxSog.toFixed(1)} kn`}
          />
        </Card>
        <Card>
          <Metric
            label="AIS risk"
            value={`${AIS_SUMMARY.riskScore} / 100`}
          />
        </Card>
        <Card>
          <Metric
            label="Data quality"
            value={`${AIS_SUMMARY.dataQuality}%`}
          />
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <RiskGauge score={AIS_SUMMARY.riskScore} />
        <RiskComponentGraph />
        <DonutGraph
          moving={AIS_SUMMARY.moving}
          stationary={AIS_SUMMARY.stationary}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <LineGraph
          data={TEMPORAL_ACTIVITY}
          title="AIS Temporal Activity"
        />

        <BarGraph
          data={TEMPORAL_ACTIVITY}
          valueKey="moving"
          labelKey="minute"
          title="Moving Vessel Activity by Minute"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <BarGraph
          data={SOG_DISTRIBUTION}
          valueKey="records"
          labelKey="range"
          title="SOG Distribution"
        />

        <BarGraph
          data={VESSEL_TYPES}
          valueKey="records"
          labelKey="type"
          title="Top AIS Vessel Type Codes"
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <HotspotTable />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <AnomalyList />

        {/* <Card>
          <SectionTitle
            title="Task 8 Reasoning Output"
            subtitle="Interpretation generated from the AIS indicators"
          />

          <div
            style={{
              padding: 16,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 10,
              color: "#1e3a8a",
              lineHeight: 1.6,
              fontSize: 13,
            }}
          >
            The AIS dataset shows a high concentration of vessel activity
            with 57.24% of observations stationary. There are also 938
            observations at or above 10 knots, with a maximum SOG of
            37.4 knots. Spatial concentration is strongest in the listed
            AIS hotspots, while H7 shows the highest ≥15-knot activity
            among the top spatial cells.
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gap: 9,
              fontSize: 13,
            }}
          >
            <div>
              <strong>Dominant domain:</strong> Vessel activity
            </div>
            <div>
              <strong>Risk level:</strong> HIGH
            </div>
            <div>
              <strong>Primary driver:</strong> Vessel concentration with
              elevated stationary activity
            </div>
            <div>
              <strong>Data limitation:</strong> No incident outcome labels
              are present.
            </div>
          </div>
        </Card> */}
      </div>

      <div style={{ marginBottom: 18 }}>
        <AISIntelligenceOutput data={data} />
      </div>

      <Card>
        <SectionTitle
          title="Data Quality & Processing"
          subtitle="AIS processing metadata"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          <Metric
            label="Valid SOG records"
            value={formatNumber(AIS_SUMMARY.validSogRecords)}
          />
          <Metric
            label="Unavailable SOG"
            value={formatNumber(AIS_SUMMARY.unavailableSog)}
          />
          <Metric
            label="Vessel types"
            value={formatNumber(AIS_SUMMARY.vesselTypes)}
          />
          <Metric
            label="SOG ≥ 10 kn"
            value={formatNumber(AIS_SUMMARY.highSpeed10)}
          />
          <Metric
            label="SOG ≥ 15 kn"
            value={formatNumber(AIS_SUMMARY.highSpeed15)}
          />
          <Metric
            label="SOG ≥ 20 kn"
            value={formatNumber(AIS_SUMMARY.highSpeed20)}
          />
          <Metric
            label="SOG ≥ 25 kn"
            value={formatNumber(AIS_SUMMARY.highSpeed25)}
          />
          <Metric
            label="SOG ≥ 30 kn"
            value={formatNumber(AIS_SUMMARY.highSpeed30)}
          />
        </div>

        {lastRun && (
          <div
            style={{
              marginTop: 15,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Last Task 8 execution: {lastRun}
          </div>
        )}
      </Card>

      <style>{`
        @media (max-width: 700px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
}

export default IntelligenceEngine;
