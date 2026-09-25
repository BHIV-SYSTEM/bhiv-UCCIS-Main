import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

import StatusCard from "../components/Cards/StatusCard";
import AnalyticsCard from "../components/Cards/AnalyticsCard";

import "../Task14.css";

/* =========================================================
   FALLBACK DATA
   ========================================================= */

const INCIDENT_DATA = [
  { district: "Mumbai", incidents: 44 },
  { district: "Pune", incidents: 31 },
  { district: "Nashik", incidents: 18 },
  { district: "Nagpur", incidents: 27 },
  { district: "Satara", incidents: 14 },
];

const STRESS_DATA = [
  { name: "High", value: 6 },
  { name: "Medium", value: 11 },
  { name: "Low", value: 18 },
];

const STRESS_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#00d084",
];

const EXECUTION_TREND_DATA = [
  { hour: "08:00", execution: 52 },
  { hour: "09:00", execution: 61 },
  { hour: "10:00", execution: 68 },
  { hour: "11:00", execution: 74 },
  { hour: "12:00", execution: 81 },
  { hour: "13:00", execution: 88 },
];

/* =========================================================
   CHART STYLES
   ========================================================= */

const TOOLTIP_STYLE = {
  backgroundColor: "#111827",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "#ffffff",
};

const AXIS_TICK = {
  fill: "#d6dde5",
  fontSize: 13,
};

const AXIS_LABEL = {
  fill: "#d6dde5",
  fontSize: 13,
  fontWeight: 700,
};

/* =========================================================
   HELPERS
   ========================================================= */

const getApiBaseUrl = () =>
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

const firstDefined = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null
  );

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const extractPayload = (data) => {
  if (!data) {
    return {};
  }

  if (
    data.data &&
    typeof data.data === "object"
  ) {
    return data.data;
  }

  if (
    data.response &&
    typeof data.response === "object"
  ) {
    return data.response;
  }

  return data;
};

const extractArray = (payload, keys) => {
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  return [];
};

/* =========================================================
   NORMALIZE INCIDENT DATA
   ========================================================= */

const normalizeIncidentData = (payload) => {
  const rows = extractArray(payload, [
    "incidentData",
    "incidentsByDistrict",
    "districtIncidents",
    "incidents",
  ]);

  if (!rows.length) {
    return INCIDENT_DATA;
  }

  const normalized = rows
    .map((row) => ({
      district: String(
        firstDefined(
          row.district,
          row.zone,
          row.name,
          row.label,
          "Unknown"
        )
      ),

      incidents: toNumber(
        firstDefined(
          row.incidents,
          row.count,
          row.value,
          row.total
        )
      ),
    }))
    .filter(
      (row) =>
        row.district !== "Unknown"
    );

  return normalized.length
    ? normalized
    : INCIDENT_DATA;
};

/* =========================================================
   NORMALIZE STRESS DATA
   ========================================================= */

const normalizeStressData = (payload) => {
  const rows = extractArray(payload, [
    "stressData",
    "districtStress",
    "stressDistribution",
  ]);

  if (!rows.length) {
    return STRESS_DATA;
  }

  const normalized = rows
    .map((row) => ({
      name: String(
        firstDefined(
          row.name,
          row.status,
          row.level,
          "Unknown"
        )
      ),

      value: toNumber(
        firstDefined(
          row.value,
          row.count,
          row.total
        )
      ),
    }))
    .filter(
      (row) =>
        row.name !== "Unknown"
    );

  return normalized.length
    ? normalized
    : STRESS_DATA;
};

/* =========================================================
   NORMALIZE EXECUTION DATA
   ========================================================= */

const normalizeExecutionData = (payload) => {
  const rows = extractArray(payload, [
    "executionTrendData",
    "executionTrend",
    "execution",
    "executionHistory",
  ]);

  if (!rows.length) {
    return EXECUTION_TREND_DATA;
  }

  const normalized = rows
    .map((row) => ({
      hour: String(
        firstDefined(
          row.hour,
          row.time,
          row.timestamp,
          row.label,
          "N/A"
        )
      ),

      execution: toNumber(
        firstDefined(
          row.execution,
          row.count,
          row.value,
          row.total
        )
      ),
    }))
    .filter(
      (row) =>
        row.hour !== "N/A"
    );

  return normalized.length
    ? normalized
    : EXECUTION_TREND_DATA;
};

/* =========================================================
   KPI HELPER
   ========================================================= */

const getKpiValue = (
  payload,
  keys,
  fallback
) => {
  const directValue = firstDefined(
    ...keys.map(
      (key) => payload?.[key]
    )
  );

  if (
    directValue !== undefined &&
    directValue !== null
  ) {
    return directValue;
  }

  const metricValue = firstDefined(
    ...(keys.map(
      (key) =>
        payload?.metrics?.[key]
    ))
  );

  return (
    metricValue ??
    fallback
  );
};

/* =========================================================
   OPERATIONS PAGE
   ========================================================= */

export default function Operations() {
  const [
    backendData,
    setBackendData,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    backendError,
    setBackendError,
  ] = useState("");

  /* =======================================================
     LOAD OPERATIONS DATA
     ======================================================= */

  const loadOperations = async () => {
    setLoading(true);
    setBackendError("");

    try {
      const baseUrl =
        getApiBaseUrl().replace(
          /\/$/,
          ""
        );

      const response =
        await axios.get(
          `${baseUrl}/operations`,
          {
            timeout: 10000,
          }
        );

      setBackendData(
        extractPayload(
          response.data
        )
      );
    } catch (error) {
      console.error(
        "Operations API error:",
        error
      );

      setBackendError(
        error.response?.data
          ?.message ||
          error.response?.data
            ?.error ||
          "Operations backend is unavailable. Showing the local operational view."
      );

      setBackendData({});
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD + AUTO REFRESH
     ======================================================= */

  useEffect(() => {
    loadOperations();

    const interval =
      setInterval(
        loadOperations,
        30000
      );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     NORMALIZED DATA
     ======================================================= */

  const incidentData =
    useMemo(
      () =>
        normalizeIncidentData(
          backendData
        ),
      [backendData]
    );

  const stressData =
    useMemo(
      () =>
        normalizeStressData(
          backendData
        ),
      [backendData]
    );

  const executionTrendData =
    useMemo(
      () =>
        normalizeExecutionData(
          backendData
        ),
      [backendData]
    );

  /* =======================================================
     KPI VALUES
     ======================================================= */

  const activeIncidents =
    toNumber(
      getKpiValue(
        backendData,
        [
          "activeIncidents",
          "active_incidents",
          "incidentCount",
        ],
        incidentData.reduce(
          (sum, item) =>
            sum +
            toNumber(
              item.incidents
            ),
          0
        )
      )
    );

  const replayEvents =
    toNumber(
      getKpiValue(
        backendData,
        [
          "replayEvents",
          "replay_events",
          "replayCount",
        ],
        142
      )
    );

  const fieldResponse =
    getKpiValue(
      backendData,
      [
        "fieldResponse",
        "field_response",
        "responseRate",
      ],
      "91%"
    );

  const districtStress =
    String(
      getKpiValue(
        backendData,
        [
          "districtStress",
          "district_stress",
        ],
        "HIGH"
      )
    ).toUpperCase();

  const executionVelocity =
    String(
      getKpiValue(
        backendData,
        [
          "executionVelocity",
          "execution_velocity",
        ],
        "78%"
      )
    );

  const escalationLoad =
    String(
      getKpiValue(
        backendData,
        [
          "escalationLoad",
          "escalation_load",
        ],
        "19"
      )
    );

  const highStressDistricts =
    toNumber(
      getKpiValue(
        backendData,
        [
          "highStressDistricts",
          "overloadedDistricts",
        ],
        6
      )
    );

  const totalIncidents =
    incidentData.reduce(
      (sum, item) =>
        sum +
        toNumber(
          item.incidents
        ),
      0
    );

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="operations-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="operations-header">

        <div>

          {/* <div className="operations-eyebrow">
            UCCIS / TASK 14
          </div> */}

          <h1 className="operations-title">
            OPERATIONS COMMAND CENTER
          </h1>

          <p className="operations-subtitle">
            Real-time statewide operational
            intelligence, escalation visibility,
            district execution monitoring,
            replay coordination, and governance
            telemetry.
          </p>

        </div>

        {/* <div className="operations-status">

          <span
            className={`status-dot ${
              loading
                ? "status-dot-loading"
                : "status-dot-live"
            }`}
          />

          {loading
            ? "SYNCING"
            : "OPERATIONS LIVE"}

        </div> */}

      </div>

      {/* =================================================
          TICKER
          ================================================= */}

      <div className="command-ticker">

        <div className="ticker-item critical">
          <span>CRITICAL</span>
          Mumbai escalation aging threshold exceeded
        </div>

        <div className="ticker-item warning">
          <span>WARNING</span>
          Nashik telemetry stream delayed
        </div>

        <div className="ticker-item success">
          <span>STABLE</span>
          Replay synchronization restored
        </div>

        <div className="ticker-item">
          <span>LOAD</span>
          {highStressDistricts}
          {" "}
          districts under elevated operational load
        </div>

      </div>

      {/* =================================================
          API WARNING
          ================================================= */}

      {backendError && (
        <div className="operations-api-warning">

          <strong>
            Backend status:
          </strong>{" "}

          {backendError}

        </div>
      )}

      {/* =================================================
          KPI STRIP
          ================================================= */}

      <div className="kpi-strip">

        <StatusCard
          title="ACTIVE INCIDENTS"
          value={activeIncidents}
          status={
            backendError
              ? `${totalIncidents} incidents in local operational dataset`
              : "Critical escalation load active"
          }
          type="danger"
        />

        <StatusCard
          title="REPLAY EVENTS"
          value={replayEvents}
          status="Replay synchronization operational"
          type="success"
        />

        <StatusCard
          title="FIELD RESPONSE"
          value={fieldResponse}
          status="Operational response stable"
          type="primary"
        />

        <StatusCard
          title="DISTRICT STRESS"
          value={districtStress}
          status={`${highStressDistricts} districts overloaded`}
          type="warning"
        />

      </div>

      {/* =================================================
          MAIN GRID
          ================================================= */}

      <div className="governance-grid">

        {/* =================================================
            LEFT COLUMN
            ================================================= */}

        <div className="governance-left-column">

          <AnalyticsCard
            title="EXECUTION VELOCITY"
            metric={executionVelocity}
            change="+12%"
            description="Execution throughput since the previous operational cycle."
            type="primary"
          />

          <AnalyticsCard
            title="ESCALATION LOAD"
            metric={escalationLoad}
            change="+4%"
            description="Current escalation queue across the operational corridor."
            type="danger"
          />

          {/* =================================================
              SYNCHRONIZATION PANEL
              ================================================= */}

          <div className="operations-summary-card">

            <div className="operations-summary-header">

              <span>
                OPERATIONS SYNCHRONIZATION
              </span>

              <button
                type="button"
                className="refresh-button"
                onClick={loadOperations}
                disabled={loading}
              >
                {loading
                  ? "SYNCING..."
                  : "REFRESH"}
              </button>

            </div>

            <div className="sync-grid">

              <div>
                <span>
                  Telemetry
                </span>

                <strong>
                  HEALTHY
                </strong>
              </div>

              <div>
                <span>
                  Replay
                </span>

                <strong>
                  STABLE
                </strong>
              </div>

              <div>
                <span>
                  Governance
                </span>

                <strong>
                  ACTIVE
                </strong>
              </div>

              <div>
                <span>
                  Field Teams
                </span>

                <strong>
                  SYNCED
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            CENTER COLUMN
            ================================================= */}

        <div className="governance-center-column">

          {/* =================================================
              INCIDENT LOAD
              ================================================= */}

          <div className="chart-box large-chart">

            <div className="chart-title-row">

              <div>

                <div className="chart-title">
                  DISTRICT INCIDENT LOAD
                </div>

                <div className="chart-subtitle">
                  Incident distribution by operational district
                </div>

              </div>

              <div className="chart-total">
                {totalIncidents} TOTAL
              </div>

            </div>

            <div className="chart-frame chart-frame-lg">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={incidentData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 18,
                    bottom: 55,
                  }}
                  barCategoryGap="25%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#263547"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="district"
                    stroke="#8ea2b8"
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={{
                      stroke: "#415168",
                    }}
                    label={{
                      value: "District",
                      position: "insideBottom",
                      offset: -35,
                      ...AXIS_LABEL,
                    }}
                  />

                  <YAxis
                    stroke="#8ea2b8"
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={{
                      stroke: "#415168",
                    }}
                    allowDecimals={false}
                    label={{
                      value:
                        "Number of Incidents",
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      ...AXIS_LABEL,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(59,130,246,0.08)",
                    }}
                    contentStyle={
                      TOOLTIP_STYLE
                    }
                    formatter={(value) => [
                      value,
                      "Incidents",
                    ]}
                  />

                  <Bar
                    dataKey="incidents"
                    name="Incidents"
                    fill="#3b82f6"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                    isAnimationActive={false}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* =================================================
              EXECUTION TREND
              ================================================= */}

          <div className="chart-box large-chart">

            <div className="chart-title-row">

              <div>

                <div className="chart-title">
                  EXECUTION TREND ANALYTICS
                </div>

                <div className="chart-subtitle">
                  Operational execution count across hourly intervals
                </div>

              </div>

            </div>

            <div className="chart-frame chart-frame-lg">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={executionTrendData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 18,
                    bottom: 55,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#233142"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="hour"
                    stroke="#8ea2b8"
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={{
                      stroke: "#415168",
                    }}
                    label={{
                      value: "Time (Hours)",
                      position: "insideBottom",
                      offset: -35,
                      ...AXIS_LABEL,
                    }}
                  />

                  <YAxis
                    stroke="#8ea2b8"
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={{
                      stroke: "#415168",
                    }}
                    allowDecimals={false}
                    label={{
                      value:
                        "Execution Count",
                      angle: -90,
                      position: "insideLeft",
                      offset: 5,
                      ...AXIS_LABEL,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#64748b",
                      strokeDasharray:
                        "4 4",
                    }}
                    contentStyle={
                      TOOLTIP_STYLE
                    }
                    formatter={(value) => [
                      value,
                      "Execution",
                    ]}
                  />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                      color: "#d6dde5",
                      fontSize: 12,
                      paddingBottom: 10,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="execution"
                    name="Execution"
                    stroke="#00d084"
                    strokeWidth={4}
                    dot={{
                      r: 5,
                      fill: "#00d084",
                      stroke: "#0f172a",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 7,
                    }}
                    isAnimationActive={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT COLUMN
            ================================================= */}

        <div className="governance-right-column">

          {/* =================================================
              STRESS DISTRIBUTION
              ================================================= */}

          <div className="chart-box">

            <div className="chart-title-row">

              <div>

                <div className="chart-title">
                  DISTRICT STRESS DISTRIBUTION
                </div>

                <div className="chart-subtitle">
                  Current operational stress classification
                </div>

              </div>

            </div>

            <div className="stress-chart-frame">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={stressData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={68}
                    outerRadius={105}
                    paddingAngle={3}
                    stroke="#111827"
                    strokeWidth={3}
                    labelLine={false}
                    label={({
                      percent,
                      name,
                    }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >

                    {stressData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={
                            STRESS_COLORS[
                              index %
                                STRESS_COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    contentStyle={
                      TOOLTIP_STYLE
                    }
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{
                      color: "#ffffff",
                      paddingTop: 12,
                      fontSize: 13,
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* =================================================
              LIVE FEED
              ================================================= */}

          <div className="feed-panel">

            <div className="feed-header">

              <span>
                LIVE OPERATIONAL FEED
              </span>

              <span className="live-badge">
                LIVE
              </span>

            </div>

            <div className="feed-item success-feed">
              <span className="feed-indicator" />
              Statewide telemetry synchronization healthy.
            </div>

            <div className="feed-item warning-feed">
              <span className="feed-indicator" />
              Pune district response delay exceeded threshold.
            </div>

            <div className="feed-item danger-feed">
              <span className="feed-indicator" />
              Escalation backlog increasing in central corridor.
            </div>

            <div className="feed-item success-feed">
              <span className="feed-indicator" />
              Replay reconstruction completed successfully.
            </div>

          </div>

          {/* =================================================
              HEALTH
              ================================================= */}

          <div className="trust-panel">

            <div className="trust-header">
              OPERATIONAL HEALTH
            </div>

            <div className="trust-row">

              <span>
                Replay Stability
              </span>

              <strong className="health-good">
                STABLE
              </strong>

            </div>

            <div className="trust-row">

              <span>
                Telemetry Integrity
              </span>

              <strong className="health-good">
                HEALTHY
              </strong>

            </div>

            <div className="trust-row">

              <span>
                Governance Sync
              </span>

              <strong className="health-active">
                ACTIVE
              </strong>

            </div>

            <div className="trust-row">

              <span>
                Field Coordination
              </span>

              <strong className="health-good">
                SYNCED
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          FOOTER
          ================================================= */}

      <div className="dashboard-footer">
        Operations Monitoring Active • Replay Stable •
        Governance Protected • Field Coordination Healthy
      </div>

    </div>
  );
}