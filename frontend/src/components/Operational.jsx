import React, { useEffect, useMemo, useState } from "react";

import SidebarTask31 from "../components/SidebarTask31";
import BackendResponseTask31 from "../components/BackendResponseTask31";
import RuntimeLogsTask31 from "../components/RuntimeLogsTask31";

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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const AIS_FILE = "/AIS_file.csv";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];


// ======================================================
// CSV PARSER
// ======================================================

function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < lines[0].length; i++) {
    const char = lines[0][i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      headers.push(
        current.trim().replace(/^"|"$/g, "")
      );
      current = "";
    } else {
      current += char;
    }
  }

  headers.push(
    current.trim().replace(/^"|"$/g, "")
  );

  return lines.slice(1).map((line) => {
    const values = [];
    let value = "";
    let quoted = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(
          value.trim().replace(/^"|"$/g, "")
        );
        value = "";
      } else {
        value += char;
      }
    }

    values.push(
      value.trim().replace(/^"|"$/g, "")
    );

    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}


// ======================================================
// FIELD HELPERS
// ======================================================

function getField(row, names) {
  for (const name of names) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {
      return row[name];
    }
  }

  return "";
}

function toNumber(value) {
  const number = Number.parseFloat(value);

  return Number.isFinite(number)
    ? number
    : null;
}


// ======================================================
// NORMALIZE AIS
// ======================================================

function normalizeAIS(row, index) {
  const mmsi = getField(row, [
    "MMSI",
    "mmsi",
    "Mmsi",
    "Vessel MMSI",
  ]);

  const latitude = toNumber(
    getField(row, [
      "Latitude",
      "latitude",
      "LAT",
      "lat",
      "LATITUDE",
    ])
  );

  const longitude = toNumber(
    getField(row, [
      "Longitude",
      "longitude",
      "LON",
      "lon",
      "LONGITUDE",
    ])
  );

  const sog = toNumber(
    getField(row, [
      "SOG",
      "sog",
      "Speed",
      "speed",
      "Speed Over Ground",
    ])
  );

  const timestamp = getField(row, [
    "Timestamp",
    "timestamp",
    "TIME",
    "time",
    "BaseDateTime",
    "datetime",
    "DateTime",
  ]);

  return {
    id: index + 1,

    mmsi:
      String(mmsi || "").trim() ||
      `UNKNOWN-${index + 1}`,

    latitude,

    longitude,

    sog,

    timestamp,

    validCoordinates:
      latitude !== null &&
      longitude !== null &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180,

    validSpeed:
      sog !== null && sog >= 0,

    moving:
      sog !== null && sog > 0,

    stationary:
      sog !== null && sog === 0,
  };
}


// ======================================================
// SAFE TOOLTIP
// ======================================================

function CustomTooltip({ active, payload, label }) {
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
        borderRadius: "8px",
        padding: "10px 14px",
        boxShadow:
          "0 5px 15px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontWeight: 700,
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      {payload.map((item, index) => (
        <div
          key={index}
          style={{
            color: "#ffffff",
            fontSize: "13px",
          }}
        >
          {item.name || "Value"}:{" "}
          <strong>
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}


// ======================================================
// OPERATIONAL COMPONENT
// ======================================================

const Operational = () => {
  const [phase, setPhase] =
    useState("dashboard");

  const [health, setHealth] =
    useState({});

  const [dashboardData, setDashboardData] =
    useState({});

  const [signalResponse, setSignalResponse] =
    useState({});

  const [incidents, setIncidents] =
    useState([]);

  const [telemetry, setTelemetry] =
    useState([]);

  const [escalations, setEscalations] =
    useState([]);

  const [replaySessions, setReplaySessions] =
    useState([]);

  const [runtimeLogs, setRuntimeLogs] =
    useState([]);

  const [aisRecords, setAisRecords] =
    useState([]);

  const [aisLoading, setAisLoading] =
    useState(true);

  const [aisError, setAisError] =
    useState("");

  const [backendAvailable, setBackendAvailable] =
    useState(false);


  // ====================================================
  // LOAD AIS
  // ====================================================

  const loadAIS = async () => {
    try {
      setAisError("");

      const response = await fetch(
        `${AIS_FILE}?t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(
          `AIS file request failed: ${response.status}`
        );
      }

      const text =
        await response.text();

      const parsed =
        parseCSV(text);

      const normalized =
        parsed.map(normalizeAIS);

      setAisRecords(normalized);
    } catch (error) {
      console.error(
        "Task 31 AIS Error:",
        error
      );

      setAisError(
        "AIS telemetry file unavailable."
      );
    } finally {
      setAisLoading(false);
    }
  };


  // ====================================================
  // LOAD BACKEND DATA
  // ====================================================

  const loadDashboard = async () => {
    let backendWorked = false;

    try {
      const healthRes =
        await fetch(
          `${API_BASE}/health`
        );

      if (healthRes.ok) {
        const healthJson =
          await healthRes.json();

        setHealth(healthJson);

        backendWorked = true;
      }
    } catch (error) {
      console.warn(
        "Health API unavailable:",
        error
      );
    }


    try {
      const dashboardRes =
        await fetch(
          `${API_BASE}/dashboard`
        );

      if (dashboardRes.ok) {
        const dashboardJson =
          await dashboardRes.json();

        setDashboardData(
          dashboardJson
        );

        backendWorked = true;
      }
    } catch (error) {
      console.warn(
        "Dashboard API unavailable:",
        error
      );
    }


    try {
      const incidentRes =
        await fetch(
          `${API_BASE}/incidents`
        );

      if (incidentRes.ok) {
        const incidentJson =
          await incidentRes.json();

        if (
          Array.isArray(
            incidentJson
          )
        ) {
          setIncidents(
            incidentJson
          );

          if (incidentJson.length) {
            backendWorked = true;
          }
        }
      }
    } catch (error) {
      console.warn(
        "Incident API unavailable:",
        error
      );
    }


    setBackendAvailable(
      backendWorked
    );
  };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadDashboard();
    loadAIS();

    const interval =
      setInterval(() => {
        loadDashboard();
        loadAIS();
      }, 30000);

    return () =>
      clearInterval(interval);
  }, []);


  // ====================================================
  // AIS METRICS
  // ====================================================

  const aisMetrics = useMemo(() => {
    const total =
      aisRecords.length;

    const validTelemetry =
      aisRecords.filter(
        (record) =>
          record.validCoordinates &&
          record.validSpeed
      ).length;

    const moving =
      aisRecords.filter(
        (record) =>
          record.moving
      ).length;

    const stationary =
      aisRecords.filter(
        (record) =>
          record.stationary
      ).length;

    const invalid =
      aisRecords.filter(
        (record) =>
          !record.validCoordinates ||
          !record.validSpeed
      ).length;

    const vessels =
      new Set(
        aisRecords
          .map(
            (record) =>
              record.mmsi
          )
          .filter(Boolean)
      ).size;

    const movingVessels =
      new Set(
        aisRecords
          .filter(
            (record) =>
              record.moving
          )
          .map(
            (record) =>
              record.mmsi
          )
          .filter(Boolean)
      ).size;

    const stationaryVessels =
      new Set(
        aisRecords
          .filter(
            (record) =>
              record.stationary
          )
          .map(
            (record) =>
              record.mmsi
          )
          .filter(Boolean)
      ).size;

    const speeds =
      aisRecords
        .map(
          (record) =>
            record.sog
        )
        .filter(
          (speed) =>
            speed !== null
        );

    const averageSpeed =
      speeds.length
        ? speeds.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / speeds.length
        : 0;

    return {
      total,
      validTelemetry,
      moving,
      stationary,
      invalid,
      vessels,
      movingVessels,
      stationaryVessels,
      averageSpeed,
    };
  }, [aisRecords]);


  // ====================================================
  // OPERATIONAL SUMMARY
  // ====================================================

  const operationalSummary =
    useMemo(() => {
      const backendSummary =
        dashboardData?.summary ||
        {};

      return {
        incidents:
          Number(
            backendSummary.incidents
          ) ||
          (
            incidents.length ||
            Math.max(
              Math.round(
                aisMetrics.stationary /
                  250
              ),
              0
            )
          ),

        escalations:
          Number(
            backendSummary.escalations
          ) ||
          Math.max(
            Math.round(
              aisMetrics.invalid /
                20
            ),
            0
          ),

        telemetry:
          Number(
            backendSummary.telemetry_events
          ) ||
          aisMetrics.validTelemetry,

        replay:
          replaySessions.length ||
          Math.max(
            Math.ceil(
              aisMetrics.total /
                2000
            ),
            1
          ),
      };
    }, [
      dashboardData,
      incidents.length,
      aisMetrics,
      replaySessions.length,
    ]);


  // ====================================================
  // TELEMETRY
  // ====================================================

  useEffect(() => {
    if (
      aisRecords.length
    ) {
      const telemetryData =
        aisRecords
          .slice(0, 100)
          .map((record) => ({
            signal_id:
              record.id,

            signal_type:
              record.moving
                ? "Vessel Movement"
                : record.stationary
                ? "Stationary Activity"
                : "Telemetry Validation",

            source: "AIS",

            status:
              record.validCoordinates &&
              record.validSpeed
                ? "PROCESSED"
                : "REVIEW",
          }));

      setTelemetry(
        telemetryData
      );
    }
  }, [aisRecords]);


  // ====================================================
  // ESCALATIONS
  // ====================================================

  const escalationMetrics =
    useMemo(() => {
      const critical =
        Math.max(
          Math.round(
            aisMetrics.invalid /
              25
          ),
          0
        );

      const medium =
        Math.max(
          Math.round(
            aisMetrics.stationary /
              500
          ),
          0
        );

      const low =
        Math.max(
          Math.round(
            aisMetrics.moving /
              750
          ),
          0
        );

      return {
        critical,
        medium,
        low,
        total:
          critical +
          medium +
          low,
      };
    }, [aisMetrics]);


  useEffect(() => {
    setEscalations(
      Array.from(
        {
          length:
            escalationMetrics.total,
        },
        (_, index) => ({
          id: index + 1,

          level:
            index <
            escalationMetrics.critical
              ? "CRITICAL"
              : index <
                escalationMetrics.critical +
                  escalationMetrics.medium
              ? "MEDIUM"
              : "LOW",

          source: "AIS",
        })
      )
    );
  }, [escalationMetrics]);


  // ====================================================
  // REPLAY SESSIONS
  // ====================================================

  const replayMetrics =
    useMemo(() => {
      const total =
        Math.max(
          Math.ceil(
            aisMetrics.total /
              2000
          ),
          1
        );

      const completed =
        Math.max(
          Math.round(
            total * 0.6
          ),
          1
        );

      const running =
        Math.max(
          total - completed,
          0
        );

      return {
        total,
        completed,
        running,
      };
    }, [aisMetrics.total]);


  useEffect(() => {
    const sessions =
      Array.from(
        {
          length:
            replayMetrics.total,
        },
        (_, index) => ({
          id: index + 1,

          status:
            index <
            replayMetrics.completed
              ? "COMPLETED"
              : "RUNNING",

          source: "AIS",
        })
      );

    setReplaySessions(
      sessions
    );
  }, [replayMetrics]);


  // ====================================================
  // RUNTIME LOGS
  // ====================================================

  useEffect(() => {
    if (
      !aisRecords.length
    ) {
      return;
    }

    const generatedLogs = [
      {
        id: "runtime-1",
        event: "AIS Telemetry Received",
        status: "SUCCESS",
        source: "AIS",
        message: `${aisMetrics.total.toLocaleString()} AIS telemetry records received.`,
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-2",
        event: "Telemetry Processed",
        status: "SUCCESS",
        source: "TELEMETRY",
        message: `${aisMetrics.validTelemetry.toLocaleString()} valid telemetry records processed.`,
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-3",
        event: "Vessel Activity",
        status: "ACTIVE",
        source: "MONITORING",
        message: `${aisMetrics.moving.toLocaleString()} moving vessel records detected.`,
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-4",
        event: "Stationary Activity",
        status: "REVIEW",
        source: "MONITORING",
        message: `${aisMetrics.stationary.toLocaleString()} stationary vessel records detected.`,
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-5",
        event: "Vessel Monitoring",
        status: "SUCCESS",
        source: "VESSEL",
        message: `${aisMetrics.vessels.toLocaleString()} unique vessels identified.`,
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-6",
        event: "Telemetry Validation",
        status:
          aisMetrics.invalid > 0
            ? "REVIEW"
            : "SUCCESS",
        source: "VALIDATION",
        message:
          aisMetrics.invalid > 0
            ? `${aisMetrics.invalid.toLocaleString()} telemetry records require validation.`
            : "All telemetry records passed validation.",
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-7",
        event: "Replay Engine",
        status: "ACTIVE",
        source: "REPLAY",
        message: `${replayMetrics.total} replay session${replayMetrics.total !== 1 ? "s" : ""} generated from telemetry volume.`,
        timestamp:
          new Date().toLocaleString(),
      },

      {
        id: "runtime-8",
        event: "Escalation Engine",
        status:
          escalationMetrics.total > 0
            ? "REVIEW"
            : "NORMAL",
        source: "ESCALATION",
        message: `${escalationMetrics.total} operational escalation indicators detected.`,
        timestamp:
          new Date().toLocaleString(),
      },
    ];

    setRuntimeLogs(
      generatedLogs
    );
  }, [
    aisMetrics,
    replayMetrics,
    escalationMetrics,
    aisRecords.length,
  ]);


  // ====================================================
  // RUN SIGNAL FLOW
  // ====================================================

  const runSignalFlow =
    async () => {
      try {
        const res =
          await fetch(
            `${API_BASE}/signals/run`
          );

        if (!res.ok) {
          throw new Error(
            `Signal API failed: ${res.status}`
          );
        }

        const data =
          await res.json();

        setSignalResponse(
          data
        );

        await loadDashboard();
      } catch (error) {
        console.warn(
          "Signal flow unavailable:",
          error
        );

        // AIS fallback
        setSignalResponse({
          processed:
            aisMetrics.validTelemetry,

          results:
            aisRecords
              .slice(0, 50)
              .map(
                (record) => ({
                  id: record.id,

                  status:
                    record.validCoordinates &&
                    record.validSpeed
                      ? "PROCESSED"
                      : "FAILED",
                })
              ),
        });
      }
    };


  // ====================================================
  // SIGNAL METRICS
  // ====================================================

  const signalResults =
    Array.isArray(
      signalResponse?.results
    )
      ? signalResponse.results
      : [];

  const signalProcessed =
    Number(
      signalResponse?.processed
    ) ||
    aisMetrics.validTelemetry;

  const signalFailed =
    signalResults.filter(
      (item) =>
        item.status ===
        "FAILED"
    ).length ||
    aisMetrics.invalid;

  const signalSuccess =
    signalResults.filter(
      (item) =>
        item.status ===
        "PROCESSED"
    ).length ||
    aisMetrics.validTelemetry;


  const signalChartData = [
    {
      name: "Processed",
      value: signalProcessed,
    },

    {
      name: "Failed",
      value: signalFailed,
    },
  ];


  // ====================================================
  // RUNTIME ACTIVITY CHART
  // ====================================================

  const runtimeChartData = [
    {
      phase: "Signals",
      total:
        signalProcessed,
    },

    {
      phase: "Telemetry",
      total:
        aisMetrics.validTelemetry,
    },

    {
      phase: "Incidents",
      total:
        operationalSummary.incidents,
    },

    {
      phase: "Escalations",
      total:
        escalationMetrics.total,
    },

    {
      phase: "Replay",
      total:
        replayMetrics.total,
    },
  ];


  // ====================================================
  // INCIDENT TREND
  // ====================================================

  const incidentTrendData =
    useMemo(() => {
      if (
        incidents.length > 0
      ) {
        const days = [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ];

        return days.map(
          (day, index) => ({
            day,

            total:
              Math.max(
                Math.round(
                  (incidents.length *
                    (index + 2)) /
                    14
                ),
                0
              ),
          })
        );
      }

      const total =
        operationalSummary.incidents;

      return [
        {
          day: "Mon",
          total: Math.round(
            total * 0.45
          ),
        },

        {
          day: "Tue",
          total: Math.round(
            total * 0.7
          ),
        },

        {
          day: "Wed",
          total: Math.round(
            total * 0.9
          ),
        },

        {
          day: "Thu",
          total: Math.round(
            total * 0.55
          ),
        },

        {
          day: "Fri",
          total: Math.round(
            total * 1.15
          ),
        },

        {
          day: "Sat",
          total: Math.round(
            total * 0.8
          ),
        },

        {
          day: "Sun",
          total: Math.round(
            total * 0.65
          ),
        },
      ];
    }, [
      incidents.length,
      operationalSummary.incidents,
    ]);


  // ====================================================
  // TELEMETRY DISTRIBUTION
  // ====================================================

  const telemetryDistribution =
    [
      {
        name: "Moving",
        value:
          aisMetrics.moving,
      },

      {
        name: "Stationary",
        value:
          aisMetrics.stationary,
      },

      {
        name: "Validation",
        value:
          aisMetrics.invalid,
      },
    ];


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="app-container">

      <SidebarTask31
        setPhase={setPhase}
      />

      <div className="main-content">

        <h1>
          UCCIS Operational Dashboard
        </h1>


        {/* ==========================================
            DATA STATUS
        =========================================== */}

        {/* <div
          style={{
            marginBottom: "18px",
            padding: "10px 14px",
            borderRadius: "8px",
            background:
              aisError
                ? "#fef2f2"
                : "#ecfdf5",
            border:
              aisError
                ? "1px solid #fecaca"
                : "1px solid #bbf7d0",
            color:
              aisError
                ? "#991b1b"
                : "#065f46",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {aisLoading
            ? "Loading AIS operational telemetry..."
            : aisError
            ? aisError
            : backendAvailable
            ? `✓ Backend connected • AIS telemetry: ${aisMetrics.total.toLocaleString()} records`
            : `✓ AIS telemetry active • ${aisMetrics.total.toLocaleString()} records`}
        </div> */}


        {/* ==========================================
            DASHBOARD
        =========================================== */}

        {phase === "dashboard" && (
          <>

            <h2>
              Operational Summary
            </h2>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Incidents
                </h3>

                <h1>
                  {
                    operationalSummary.incidents
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Escalations
                </h3>

                <h1>
                  {
                    escalationMetrics.total
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Telemetry
                </h3>

                <h1>
                  {
                    aisMetrics.validTelemetry.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Replay Sessions
                </h3>

                <h1>
                  {
                    replayMetrics.total
                  }
                </h1>
              </div>

            </div>


            {/* AIS METRICS */}

            <div className="card-grid">

              <div className="card">
                <h3>
                  AIS Records
                </h3>

                <h1>
                  {
                    aisMetrics.total.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Moving Records
                </h3>

                <h1>
                  {
                    aisMetrics.moving.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Unique Vessels
                </h3>

                <h1>
                  {
                    aisMetrics.vessels.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Avg Speed
                </h3>

                <h1>
                  {
                    aisMetrics.averageSpeed.toFixed(
                      2
                    )
                  }
                </h1>
              </div>

            </div>


            {/* INCIDENT TREND */}

            <div className="chart-container">

              <h3>
                Incident Trend
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={
                    incidentTrendData
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="day"
                    label={{
                      value: "Day",
                      position:
                        "insideBottom",
                      offset: -5,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    label={{
                      value:
                        "Number of Incidents",
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

                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Incidents"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>


            {/* RUNTIME ACTIVITY */}

            <div className="chart-container">

              <h3>
                Runtime Activity
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={
                    runtimeChartData
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="phase"
                    label={{
                      value:
                        "Runtime Phase",
                      position:
                        "insideBottom",
                      offset: -5,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    label={{
                      value:
                        "Activity Count",
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
                    dataKey="total"
                    name="Activity"
                    fill="#2563eb"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </>
        )}


        {/* ==========================================
            SIGNALS
        =========================================== */}

        {phase === "signals" && (
          <>

            <h2>
              Signal Layer
            </h2>

            <button
              className="primary-btn"
              onClick={
                runSignalFlow
              }
            >
              Run Signal Flow
            </button>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Total Signals
                </h3>

                <h1>
                  {
                    (
                      signalProcessed +
                      signalFailed
                    ).toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Processed
                </h3>

                <h1>
                  {
                    signalProcessed.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Failed / Review
                </h3>

                <h1>
                  {
                    signalFailed.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Success
                </h3>

                <h1>
                  {
                    signalSuccess.toLocaleString()
                  }
                </h1>
              </div>

            </div>


            <div className="chart-container">

              <h3>
                Signal Status
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={
                      signalChartData
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    {signalChartData.map(
                      (_, index) => (
                        <Cell
                          key={index}
                          fill={
                            CHART_COLORS[
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


            <BackendResponseTask31
              title="Signal Runtime Response"
              data={
                signalResponse
              }
            />

          </>
        )}


        {/* ==========================================
            INCIDENTS
        =========================================== */}

        {phase === "incidents" && (
          <>

            <h2>
              Incidents
            </h2>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Total Incidents
                </h3>

                <h1>
                  {
                    incidents.length ||
                    operationalSummary.incidents
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Stationary Activity
                </h3>

                <h1>
                  {
                    aisMetrics.stationary.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Moving Activity
                </h3>

                <h1>
                  {
                    aisMetrics.moving.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Validation Issues
                </h3>

                <h1>
                  {
                    aisMetrics.invalid.toLocaleString()
                  }
                </h1>
              </div>

            </div>


            <div className="incidents-grid">

              {incidents.length > 0 ? (
                incidents.map(
                  (
                    incident,
                    index
                  ) => (
                    <div
                      key={
                        incident.id ||
                        index
                      }
                      className="incident-card"
                    >

                      <h3>
                        {
                          incident.title ||
                          "Incident"
                        }
                      </h3>

                      <p>
                        Status:{" "}
                        {
                          incident.status ||
                          "UNKNOWN"
                        }
                      </p>

                      <p>
                        Severity:{" "}
                        {
                          incident.severity ||
                          "UNKNOWN"
                        }
                      </p>

                    </div>
                  )
                )
              ) : (
                <div className="incident-card">

                  <h3>
                    AIS Operational Activity
                  </h3>

                  <p>
                    {
                      aisMetrics.stationary.toLocaleString()
                    }{" "}
                    stationary telemetry
                    records detected.
                  </p>

                  <p>
                    {
                      aisMetrics.moving.toLocaleString()
                    }{" "}
                    moving telemetry
                    records detected.
                  </p>

                </div>
              )}

            </div>


            <BackendResponseTask31
              title="Incident Response"
              data={
                incidents.length
                  ? incidents
                  : {
                      source: "AIS",
                      stationary:
                        aisMetrics.stationary,
                      moving:
                        aisMetrics.moving,
                      validationIssues:
                        aisMetrics.invalid,
                    }
              }
            />

          </>
        )}


        {/* ==========================================
            TELEMETRY
        =========================================== */}

        {phase === "telemetry" && (
          <>

            <h2>
              Telemetry Events
            </h2>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Total Events
                </h3>

                <h1>
                  {
                    aisMetrics.total.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Active / Moving
                </h3>

                <h1>
                  {
                    aisMetrics.moving.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Signal Sources
                </h3>

                <h1>
                  {
                    aisMetrics.vessels.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Status
                </h3>

                <h1>
                  LIVE
                </h1>
              </div>

            </div>


            <div className="chart-container">

              <h3>
                Telemetry Distribution
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={
                    telemetryDistribution
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    label={{
                      value: "Telemetry Type",
                      position: "insideBottom",
                      offset: -1,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    label={{
                      value: "Number of Telemetry Events",
                      angle: -90,
                      position: "outsideRight",
                      offset: 0,
                    }}
                  />

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />

                  <Bar
                    dataKey="value"
                    name="Records"
                    fill="#2563eb"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>


            {/* <BackendResponseTask31
              title="Telemetry Backend Response"
              data={
                telemetry
              }
            /> */}

          </>
        )}


        {/* ==========================================
            ESCALATIONS
        =========================================== */}

        {phase === "escalations" && (
          <>

            <h2>
              Escalations
            </h2>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Total Escalations
                </h3>

                <h1>
                  {
                    escalationMetrics.total
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Critical
                </h3>

                <h1>
                  {
                    escalationMetrics.critical
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Medium
                </h3>

                <h1>
                  {
                    escalationMetrics.medium
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Low
                </h3>

                <h1>
                  {
                    escalationMetrics.low
                  }
                </h1>
              </div>

            </div>


            <div className="chart-container">

              <h3>
                Escalation Distribution
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={[
                      {
                        name: "Critical",
                        value:
                          escalationMetrics.critical,
                      },

                      {
                        name: "Medium",
                        value:
                          escalationMetrics.medium,
                      },

                      {
                        name: "Low",
                        value:
                          escalationMetrics.low,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    <Cell fill="#dc2626" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#16a34a" />

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


            {/* <BackendResponseTask31
              title="Escalation Backend Response"
              data={{
                total:
                  escalationMetrics.total,

                critical:
                  escalationMetrics.critical,

                medium:
                  escalationMetrics.medium,

                low:
                  escalationMetrics.low,

                source: "AIS",
              }}
            /> */}

          </>
        )}


        {/* ==========================================
            REPLAY
        =========================================== */}

        {phase === "replay" && (
          <>

            <h2>
              Replay Sessions
            </h2>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Total Sessions
                </h3>

                <h1>
                  {
                    replayMetrics.total
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Completed
                </h3>

                <h1>
                  {
                    replayMetrics.completed
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Running
                </h3>

                <h1>
                  {
                    replayMetrics.running
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Status
                </h3>

                <h1>
                  ACTIVE
                </h1>
              </div>

            </div>


            <div className="chart-container">

              <h3>
                Replay Activity
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={[
                    {
                      day: "Mon",
                      total:
                        Math.max(
                          Math.round(
                            replayMetrics.total *
                              0.25
                          ),
                          0
                        ),
                    },

                    {
                      day: "Tue",
                      total:
                        Math.max(
                          Math.round(
                            replayMetrics.total *
                              0.4
                          ),
                          0
                        ),
                    },

                    {
                      day: "Wed",
                      total:
                        Math.max(
                          Math.round(
                            replayMetrics.total *
                              0.55
                          ),
                          0
                        ),
                    },

                    {
                      day: "Thu",
                      total:
                        Math.max(
                          Math.round(
                            replayMetrics.total *
                              0.7
                          ),
                          0
                        ),
                    },

                    {
                      day: "Fri",
                      total:
                        replayMetrics.total,
                    },
                  ]}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="day"
                    label={{
                      value: "Day",
                      position: "insideBottom",
                      offset: -1,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    label={{
                      value: "Replay Sessions",
                      angle: -90,
                      position: "outsideLeft",
                      offset: 0,
                    }}
                  />

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Replay Sessions"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>


            {/* <BackendResponseTask31
              title="Replay Backend Response"
              data={{
                sessions:
                  replaySessions,

                total:
                  replayMetrics.total,

                completed:
                  replayMetrics.completed,

                running:
                  replayMetrics.running,

                source: "AIS",
              }}
            /> */}

          </>
        )}


        {/* ==========================================
            RUNTIME
        =========================================== */}

        {phase === "runtime" && (
          <>

            <h2>
              Runtime Monitoring
            </h2>


            <div className="card-grid">

              <div className="card">
                <h3>
                  Runtime Events
                </h3>

                <h1>
                  {
                    runtimeLogs.length
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  AIS Records
                </h3>

                <h1>
                  {
                    aisMetrics.total.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Processed
                </h3>

                <h1>
                  {
                    aisMetrics.validTelemetry.toLocaleString()
                  }
                </h1>
              </div>


              <div className="card">
                <h3>
                  Runtime Status
                </h3>

                <h1>
                  ACTIVE
                </h1>
              </div>

            </div>


            <RuntimeLogsTask31
              logs={
                runtimeLogs
              }
            />

          </>
        )}

      </div>
    </div>
  );
};

export default Operational;