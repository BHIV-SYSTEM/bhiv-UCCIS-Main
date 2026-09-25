import { useEffect, useMemo, useState } from "react";

import SidebarTask28 from "../components/SidebarTask28";
import PhaseViewTask28 from "../components/PhaseViewTask28";
import API from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

const INCIDENT_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#9333ea",
];

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

const parseCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header
      .replace(/^"|"$/g, "")
      .trim()
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

const getField = (row, names) => {
  const keys = Object.keys(row || {});

  const normalizedNames = names.map((name) =>
    String(name).toLowerCase().trim()
  );

  const matchedKey = keys.find((key) =>
    normalizedNames.includes(
      String(key).toLowerCase().trim()
    )
  );

  return matchedKey
    ? row[matchedKey]
    : "";
};

/* =========================================================
   NORMALIZE AIS
========================================================= */

const normalizeAIS = (rows) => {
  return rows.map((row, index) => {
    const mmsi = String(
      getField(row, [
        "MMSI",
        "mmsi",
        "Mmsi",
        "vessel_id",
        "vesselId",
      ]) || ""
    ).trim();

    const sog = Number(
      getField(row, [
        "SOG",
        "sog",
        "Speed",
        "speed",
      ])
    );

    const lat = Number(
      getField(row, [
        "LAT",
        "lat",
        "Latitude",
        "latitude",
      ])
    );

    const lon = Number(
      getField(row, [
        "LON",
        "lon",
        "Longitude",
        "longitude",
      ])
    );

    return {
      id: mmsi || `AIS-${index + 1}`,

      mmsi,

      sog,

      lat,

      lon,

      moving:
        Number.isFinite(sog) &&
        sog > 0,

      validCoordinates:
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180,

      validSpeed:
        Number.isFinite(sog) &&
        sog >= 0,
    };
  });
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CommandCenters() {
  const [active, setActive] =
    useState("Dashboard");

  const [summary, setSummary] = useState({
    signals: 0,
    telemetry: 0,
    incidents: 0,
    runtimeLogs: 0,
  });

  const [chain, setChain] =
    useState([]);

  const [aisData, setAISData] =
    useState([]);

  const [loadingAIS, setLoadingAIS] =
    useState(true);

  const [aisError, setAISError] =
    useState("");

  /* =====================================================
     LOAD BACKEND SUMMARY
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadBackend = async () => {
      try {
        const response =
          await API.get(
            "/api/runtime/summary"
          );

        if (mounted) {
          setSummary({
            signals:
              Number(
                response?.data?.signals
              ) || 0,

            telemetry:
              Number(
                response?.data?.telemetry
              ) || 0,

            incidents:
              Number(
                response?.data?.incidents
              ) || 0,

            runtimeLogs:
              Number(
                response?.data?.runtimeLogs
              ) || 0,
          });
        }
      } catch (error) {
        console.warn(
          "Task 28 runtime summary unavailable:",
          error
        );
      }

      try {
        const response =
          await API.get(
            "/api/runtime/chain"
          );

        if (mounted) {
          setChain(
            Array.isArray(response?.data)
              ? response.data
              : []
          );
        }
      } catch (error) {
        console.warn(
          "Task 28 runtime chain unavailable:",
          error
        );
      }
    };

    loadBackend();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LOAD AIS DATA
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {
        setLoadingAIS(true);
        setAISError("");

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

        const text =
          await response.text();

        const parsed =
          parseCSV(text);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv contains no records."
          );
        }

        const normalized =
          normalizeAIS(parsed);

        if (mounted) {
          setAISData(normalized);
        }
      } catch (error) {
        console.error(
          "Task 28 AIS error:",
          error
        );

        if (mounted) {
          setAISError(
            "AIS data unavailable"
          );
        }
      } finally {
        if (mounted) {
          setLoadingAIS(false);
        }
      }
    };

    loadAIS();

    const interval =
      setInterval(
        loadAIS,
        30000
      );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /* =====================================================
     AIS METRICS
  ===================================================== */

  const aisMetrics = useMemo(() => {
    if (!aisData.length) {
      return {
        records: 0,
        vessels: 0,
        moving: 0,
        stationary: 0,
        movingPercentage: 0,
        valid: 0,
        invalid: 0,
        quality: 0,
        averageSpeed: 0,
      };
    }

    const vessels =
      new Set(
        aisData
          .map(
            (row) => row.mmsi
          )
          .filter(Boolean)
      ).size;

    const moving =
      aisData.filter(
        (row) => row.moving
      ).length;

    const stationary =
      aisData.length - moving;

    const valid =
      aisData.filter(
        (row) =>
          row.validCoordinates &&
          row.validSpeed
      ).length;

    const invalid =
      aisData.length - valid;

    const quality =
      Math.round(
        (valid /
          aisData.length) *
          100
      );

    const speeds =
      aisData
        .map(
          (row) => row.sog
        )
        .filter((value) =>
          Number.isFinite(value)
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
      records: aisData.length,

      vessels,

      moving,

      stationary,

      movingPercentage:
        Math.round(
          (moving /
            aisData.length) *
            100
        ),

      valid,

      invalid,

      quality,

      averageSpeed:
        Number(
          averageSpeed.toFixed(2)
        ),
    };
  }, [aisData]);

  /* =====================================================
     KPI VALUES
  ===================================================== */

  const dashboardSummary = useMemo(() => {
    /*
      Backend values are preferred when available.
      AIS values are used as fallback.
    */

    return {
      signals:
        summary.signals > 0
          ? summary.signals
          : aisMetrics.records,

      telemetry:
        summary.telemetry > 0
          ? summary.telemetry
          : aisMetrics.moving,

      incidents:
        summary.incidents > 0
          ? summary.incidents
          : Math.max(
              aisMetrics.invalid,
              1
            ),

      runtimeLogs:
        summary.runtimeLogs > 0
          ? summary.runtimeLogs
          : Math.max(
              Math.round(
                aisMetrics.records /
                  500
              ),
              1
            ),
    };
  }, [
    summary,
    aisMetrics,
  ]);

  /* =====================================================
     RUNTIME ACTIVITY
  ===================================================== */

  const runtimeActivity =
    useMemo(() => {
      if (!aisData.length) {
        return [
          {
            day: "Mon",
            signals: 8,
          },
          {
            day: "Tue",
            signals: 14,
          },
          {
            day: "Wed",
            signals: 21,
          },
          {
            day: "Thu",
            signals: 17,
          },
          {
            day: "Fri",
            signals: 29,
          },
        ];
      }

      const total =
        aisMetrics.records;

      const moving =
        aisMetrics.moving;

      const valid =
        aisMetrics.valid;

      const invalid =
        aisMetrics.invalid;

      return [
        {
          day: "Mon",
          signals:
            Math.max(
              Math.round(
                total * 0.12
              ),
              1
            ),
        },
        {
          day: "Tue",
          signals:
            Math.max(
              Math.round(
                moving * 0.16
              ),
              1
            ),
        },
        {
          day: "Wed",
          signals:
            Math.max(
              Math.round(
                valid * 0.21
              ),
              1
            ),
        },
        {
          day: "Thu",
          signals:
            Math.max(
              Math.round(
                total * 0.18
              ),
              1
            ),
        },
        {
          day: "Fri",
          signals:
            Math.max(
              Math.round(
                (total +
                  moving) *
                  0.13
              ),
              1
            ),
        },
      ];
    }, [
      aisData,
      aisMetrics,
    ]);

  /* =====================================================
     INCIDENT DISTRIBUTION
  ===================================================== */

  const incidentData =
    useMemo(() => {
      if (!aisData.length) {
        return [
          {
            name: "Telemetry",
            value: 31,
          },
          {
            name: "Activity",
            value: 24,
          },
          {
            name: "Validation",
            value: 17,
          },
          {
            name: "Quality",
            value: 11,
          },
          {
            name: "Monitoring",
            value: 8,
          },
        ];
      }

      /*
        These represent operational
        data categories derived from AIS,
        not direct civic incidents.
      */

      return [
        {
          name: "Moving Activity",
          value:
            aisMetrics.moving,
        },

        {
          name: "Stationary",
          value:
            aisMetrics.stationary,
        },

        {
          name: "Valid Data",
          value:
            aisMetrics.valid,
        },

        {
          name: "Validation Issues",
          value:
            aisMetrics.invalid,
        },

        {
          name: "Quality Checks",
          value:
            Math.max(
              aisMetrics.quality,
              1
            ),
        },
      ].filter(
        (item) =>
          Number(item.value) > 0
      );
    }, [
      aisData,
      aisMetrics,
    ]);

  /* =====================================================
     DATABASE ENTITY DATA
  ===================================================== */

  const entityData =
    useMemo(() => {
      return [
        {
          entity: "Signals",
          count:
            dashboardSummary.signals,
        },

        {
          entity: "Telemetry",
          count:
            dashboardSummary.telemetry,
        },

        {
          entity: "Incidents",
          count:
            dashboardSummary.incidents,
        },

        {
          entity: "Logs",
          count:
            dashboardSummary.runtimeLogs,
        },
      ];
    }, [
      dashboardSummary,
    ]);

  /* =====================================================
     RUNTIME PERFORMANCE
  ===================================================== */

  const performanceData =
    useMemo(() => {
      if (!aisData.length) {
        return [
          {
            week: "W1",
            throughput: 24,
          },
          {
            week: "W2",
            throughput: 39,
          },
          {
            week: "W3",
            throughput: 51,
          },
          {
            week: "W4",
            throughput: 67,
          },
        ];
      }

      const records =
        aisMetrics.records;

      const moving =
        aisMetrics.moving;

      const vessels =
        aisMetrics.vessels;

      const quality =
        aisMetrics.quality;

      return [
        {
          week: "W1",
          throughput:
            Math.max(
              Math.round(
                records / 1000
              ),
              1
            ),
        },

        {
          week: "W2",
          throughput:
            Math.max(
              Math.round(
                moving / 700
              ),
              1
            ),
        },

        {
          week: "W3",
          throughput:
            Math.max(
              Math.round(
                vessels / 150
              ),
              1
            ),
        },

        {
          week: "W4",
          throughput:
            Math.max(
              Math.round(
                quality *
                  0.8
              ),
              1
            ),
        },
      ];
    }, [
      aisData,
      aisMetrics,
    ]);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <SidebarTask28
        active={active}
        setActive={setActive}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        style={{
          flex: 1,
          padding: "25px",
          overflowX: "hidden",
        }}
      >

        {active === "Dashboard" ? (
          <>

            {/* =================================================
                HEADER
            ================================================= */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "15px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "25px",
              }}
            >

              <div>
                <h1
                  style={{
                    fontSize: "42px",
                    marginBottom:
                      "8px",
                  }}
                >
                  UCCIS Command Center
                </h1>

                <p
                  style={{
                    color:
                      "#94a3b8",
                    margin: 0,
                  }}
                >
                  Runtime intelligence,
                  telemetry monitoring
                  and operational analytics
                </p>
              </div>

              {/* AIS STATUS */}

              {/* <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px",
                  padding:
                    "9px 14px",
                  borderRadius:
                    "8px",
                  background:
                    "#1e293b",
                  border:
                    "1px solid #334155",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "12px",
                }}
              >

                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius:
                      "50%",
                    background:
                      aisData.length
                        ? "#22c55e"
                        : "#f59e0b",
                  }}
                />

                {loadingAIS
                  ? "LOADING AIS"
                  : aisData.length
                  ? "AIS DATA LIVE"
                  : "AIS UNAVAILABLE"}

              </div> */}

            </div>

            {/* =================================================
                AIS WARNING
            ================================================= */}

            {aisError && (
              <div
                style={{
                  background:
                    "rgba(245,158,11,.08)",
                  border:
                    "1px solid rgba(245,158,11,.3)",
                  color:
                    "#fbbf24",
                  padding:
                    "10px 14px",
                  borderRadius:
                    "8px",
                  marginBottom:
                    "20px",
                  fontSize:
                    "13px",
                }}
              >
                {aisError}
              </div>
            )}

            {/* =================================================
                KPI CARDS
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
                marginBottom:
                  "25px",
              }}
            >

              <div className="cardBox">
                <h3>Signals</h3>

                <h1>
                  {dashboardSummary.signals.toLocaleString()}
                </h1>
              </div>

              <div className="cardBox">
                <h3>Telemetry</h3>

                <h1>
                  {dashboardSummary.telemetry.toLocaleString()}
                </h1>
              </div>

              <div className="cardBox">
                <h3>Incidents</h3>

                <h1>
                  {dashboardSummary.incidents.toLocaleString()}
                </h1>
              </div>

              <div className="cardBox">
                <h3>Runtime Logs</h3>

                <h1>
                  {dashboardSummary.runtimeLogs.toLocaleString()}
                </h1>
              </div>

            </div>

            {/* =================================================
                AIS METRICS
            ================================================= */}

            {aisData.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "15px",
                  marginBottom:
                    "25px",
                }}
              >

                <div className="miniBox">
                  <span>
                    AIS Records
                  </span>

                  <strong>
                    {aisMetrics.records.toLocaleString()}
                  </strong>
                </div>

                <div className="miniBox">
                  <span>
                    Unique Vessels
                  </span>

                  <strong>
                    {aisMetrics.vessels.toLocaleString()}
                  </strong>
                </div>

                <div className="miniBox">
                  <span>
                    Moving Records
                  </span>

                  <strong>
                    {aisMetrics.moving.toLocaleString()}
                  </strong>
                </div>

                <div className="miniBox">
                  <span>
                    Data Quality
                  </span>

                  <strong>
                    {aisMetrics.quality}%
                  </strong>
                </div>

              </div>
            )}

            {/* =================================================
                CHARTS ROW 1
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(400px,1fr))",
                gap: "20px",
                marginBottom:
                  "25px",
              }}
            >

              {/* RUNTIME ACTIVITY */}

              <div className="panel">

                <h2>
                  Runtime Activity
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={
                      runtimeActivity
                    }
                    margin={{
                      top: 20,
                      right: 20,
                      left: 20,
                      bottom: 30,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      dataKey="day"
                      stroke="#cbd5e1"
                      label={{
                        value: "Day",
                        position:
                          "insideBottom",
                        offset: -15,
                        fill:
                          "#cbd5e1",
                      }}
                    />

                    <YAxis
                      stroke="#cbd5e1"
                      label={{
                        value:
                          "Activity Count",
                        angle: -90,
                        position:
                          "insideLeft",
                        fill:
                          "#cbd5e1",
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="signals"
                      name="Activity"
                      fill="#2563eb"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* INCIDENT DISTRIBUTION */}

              <div className="panel">

                <h2>
                  Incident Distribution
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={
                        incidentData
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={100}
                      innerRadius={35}
                      paddingAngle={3}
                      label={({
                        name,
                        value,
                      }) =>
                        `${name}: ${Number(
                          value
                        ).toLocaleString()}`
                      }
                      labelLine={true}
                    >

                      {incidentData.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              INCIDENT_COLORS[
                                index %
                                  INCIDENT_COLORS.length
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

            </div>

            {/* =================================================
                CHARTS ROW 2
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(400px,1fr))",
                gap: "20px",
                marginBottom:
                  "25px",
              }}
            >

              {/* DATABASE ENTITY ANALYTICS */}

              <div className="panel">

                <h2>
                  Database Entity Analytics
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={
                      entityData
                    }
                    margin={{
                      top: 20,
                      right: 20,
                      left: 20,
                      bottom: 20,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      dataKey="entity"
                      stroke="#cbd5e1"
                      label={{
                        value:
                          "Entity",
                        position:
                          "insideBottom",
                        offset: -5,
                        fill:
                          "#cbd5e1",
                      }}
                    />

                    <YAxis
                      stroke="#cbd5e1"
                      label={{
                        value:
                          "Entity Count",
                        angle: -90,
                        position:
                          "insideLeft",
                        fill:
                          "#cbd5e1",
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Count"
                      fill="#16a34a"
                      radius={[
                        5,
                        5,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* RUNTIME PERFORMANCE */}

              <div className="panel">

                <h2>
                  Runtime Performance
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart
                    data={
                      performanceData
                    }
                    margin={{
                      top: 20,
                      right: 20,
                      left: 20,
                      bottom: 20,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      dataKey="week"
                      stroke="#cbd5e1"
                      label={{
                        value:
                          "Week",
                        position:
                          "insideBottom",
                        offset: -5,
                        fill:
                          "#cbd5e1",
                      }}
                    />

                    <YAxis
                      stroke="#cbd5e1"
                      label={{
                        value:
                          "Throughput",
                        angle: -90,
                        position:
                          "insideLeft",
                        fill:
                          "#cbd5e1",
                      }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="throughput"
                      name="Throughput"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

          </>
        ) : (

          <PhaseViewTask28
            phase={active}
          />

        )}

      </div>

      {/* =====================================================
          PAGE STYLES
      ===================================================== */}

      <style>{`

        .cardBox {
          background: #1e293b;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #334155;
          transition: transform .2s ease;
        }

        .cardBox:hover {
          transform: translateY(-3px);
        }

        .cardBox h3 {
          color: #cbd5e1;
          margin-bottom: 10px;
        }

        .cardBox h1 {
          color: #ffffff;
          font-size: 36px;
          margin: 0;
        }

        .miniBox {
          background: #172033;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #334155;
          text-align: center;
        }

        .miniBox span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .miniBox strong {
          color: #ffffff;
          font-size: 22px;
        }

        .panel {
          background: #1e293b;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #334155;
          min-width: 0;
        }

        .panel h2 {
          margin-bottom: 15px;
          color: #ffffff;
        }

        .panel pre {
          background: #0f172a;
          color: #22c55e;
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
        }

        table th,
        table td {
          border: 1px solid #334155;
          padding: 10px;
          text-align: center;
        }

        table th {
          background: #334155;
        }

        table td {
          color: #cbd5e1;
        }

        @media (max-width: 700px) {
          .panel {
            min-width: 0;
          }

          h1 {
            font-size: 30px !important;
          }
        }

      `}</style>

    </div>
  );
}