import React, { useMemo } from "react";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* =========================================================
   TEST DATA
   ========================================================= */

const TEST_DATA = [
  { run: "T1", pass: 82 },
  { run: "T2", pass: 91 },
  { run: "T3", pass: 88 },
  { run: "T4", pass: 96 },
  { run: "T5", pass: 93 },
];

/* =========================================================
   TESTING COMPONENT
   ========================================================= */

export default function Testing() {
  /* =======================================================
     TESTING METRICS
     ======================================================= */

  const testingMetrics = useMemo(() => {
    if (!TEST_DATA.length) {
      return {
        averagePassRate: 0,
        latestPassRate: 0,
        highestPassRate: 0,
        lowestPassRate: 0,
      };
    }

    const passRates = TEST_DATA.map((item) =>
      Number(item.pass || 0)
    );

    const total = passRates.reduce(
      (sum, value) => sum + value,
      0
    );

    return {
      averagePassRate: Math.round(
        total / passRates.length
      ),
      latestPassRate:
        passRates[passRates.length - 1],
      highestPassRate: Math.max(...passRates),
      lowestPassRate: Math.min(...passRates),
    };
  }, []);

  const {
    averagePassRate,
    latestPassRate,
    highestPassRate,
  } = testingMetrics;

  /* =======================================================
     CUSTOM TOOLTIP
     ======================================================= */

  const WhiteTooltip = ({
    active,
    payload,
    label,
  }) => {
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
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "10px 12px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: "130px",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            color: "#111827",
            fontWeight: 700,
            fontSize: "13px",
          }}
        >
          {label}
        </p>

        <p
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "13px",
          }}
        >
          Pass Rate:{" "}
          <strong>
            {payload[0]?.value ?? 0}%
          </strong>
        </p>
      </div>
    );
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="page-header">
        <div>
          <h1>Testing Validation Center</h1>

          <p>
            Operational replay validation and
            deployment verification
          </p>
        </div>
      </div>

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="stats-grid">

        {/* TESTING PROTOCOL */}

        <div className="stat-card">
          <p className="stat-title">
            Testing Protocol
          </p>

          <h1>BHIV v2</h1>
        </div>

        {/* DEPLOYMENT */}

        <div className="stat-card">
          <p className="stat-title">
            Deployment
          </p>

          <h1 className="green-text">
            STABLE
          </h1>
        </div>

        {/* REPLAY TESTS */}

        <div className="stat-card">
          <p className="stat-title">
            Replay Tests
          </p>

          <h1>184</h1>
        </div>

        {/* RECOVERY STATUS */}

        <div className="stat-card">
          <p className="stat-title">
            Recovery Status
          </p>

          <h1 className="green-text">
            VERIFIED
          </h1>
        </div>
      </div>

      {/* ===================================================
          TESTING CONTINUITY CHART
      =================================================== */}

      <div className="panel">
        <h2>Testing Continuity</h2>

        <ResponsiveContainer
          width="100%"
          height={340}
        >
          <BarChart
            data={TEST_DATA}
            margin={{
              top: 15,
              right: 25,
              left: 15,
              bottom: 45,
            }}
            barCategoryGap="25%"
          >
            {/* GRID */}

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 3"
            />

            {/* X AXIS */}

            <XAxis
              dataKey="run"
              tick={{
                fill: "#8b96a5",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "#273344",
              }}
              tickLine={{
                stroke: "#273344",
              }}
              label={{
                value: "Test Runs",
                position: "insideBottom",
                offset: -30,
                fill: "#d6dde5",
                fontSize: 13,
              }}
            />

            {/* Y AXIS */}

            <YAxis
              domain={[0, 100]}
              allowDecimals={false}
              tick={{
                fill: "#8b96a5",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "#273344",
              }}
              tickLine={{
                stroke: "#273344",
              }}
              label={{
                value: "Pass Rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: 5,
                fill: "#d6dde5",
                fontSize: 13,
              }}
            />

            {/* TOOLTIP */}

            <Tooltip
              content={<WhiteTooltip />}
              cursor={{
                fill: "rgba(255,255,255,0.04)",
              }}
            />

            {/* BARS */}

            <Bar
              dataKey="pass"
              name="Pass Rate"
              fill="#00ff90"
              radius={[
                6,
                6,
                0,
                0,
              ]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===================================================
          TEST SUMMARY
      =================================================== */}

      <div className="bottom-grid">

        {/* =================================================
            TEST EVENTS
        ================================================= */}

        <div className="panel">
          <h2>Testing Events</h2>

          <div className="recovery-list">

            <p>
              {">"} Replay continuity validated
            </p>

            <p>
              {">"} Recovery simulation completed
            </p>

            <p>
              {">"} Deployment continuity verified
            </p>

            <p>
              {">"} Concurrency testing passed
            </p>

            <p>
              {">"} Replay corruption recovery
              confirmed
            </p>

          </div>
        </div>

        {/* =================================================
            VALIDATION METRICS
        ================================================= */}

        <div className="panel">
          <h2>Validation Metrics</h2>

          <div className="metrics-box">

            <div className="metric-row">
              <span>
                Replay Safety
              </span>

              <span className="green-text">
                PASS
              </span>
            </div>

            <div className="metric-row">
              <span>
                Recovery Testing
              </span>

              <span className="green-text">
                VERIFIED
              </span>
            </div>

            <div className="metric-row">
              <span>
                Deployment Stability
              </span>

              <span className="green-text">
                ACTIVE
              </span>
            </div>

            <div className="metric-row">
              <span>
                Validation Integrity
              </span>

              <span className="green-text">
                ENABLED
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================
          PERFORMANCE SUMMARY
      =================================================== */}

      <div className="panel testing-summary-panel">
        <h2>
          Testing Performance Summary
        </h2>

        <div className="metrics-box">

          {/* AVERAGE */}

          <div className="metric-row">
            <span>
              Average Pass Rate
            </span>

            <span className="green-text">
              {averagePassRate}%
            </span>
          </div>

          {/* LATEST */}

          <div className="metric-row">
            <span>
              Latest Test Pass Rate
            </span>

            <span className="green-text">
              {latestPassRate}%
            </span>
          </div>

          {/* HIGHEST */}

          <div className="metric-row">
            <span>
              Highest Pass Rate
            </span>

            <span className="green-text">
              {highestPassRate}%
            </span>
          </div>

          {/* VALIDATION */}

          <div className="metric-row">
            <span>
              Validation State
            </span>

            <span className="green-text">
              VERIFIED
            </span>
          </div>

        </div>
      </div>

      {/* ===================================================
          BACKEND RESPONSE
          Kept commented as in your original component.
      =================================================== */}

      {/*
      <div className="panel">
        <h2>Backend Testing Response</h2>

        <div className="terminal-box">
          <pre>
{`{
  "testingProtocol": "BHIV v2",
  "replayContinuity": "PASS",
  "recoveryTests": "PASS",
  "deployment": "STABLE",
  "mobileValidation": true,
  "antiMisrepresentation": true,
  "timestamp": "2026-05-18T11:22:04Z"
}`}
          </pre>
        </div>
      </div>
      */}

    </div>
  );
}