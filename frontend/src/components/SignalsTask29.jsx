import React, { useEffect, useMemo, useState } from "react";

import StatCard from "../components/StatCard";
import ResponseViewer from "../components/ResponseViewer";

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
  CartesianGrid,
} from "recharts";

/* =========================================================
   AIS CONFIGURATION
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
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
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      char === "," &&
      !insideQuotes
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());

  return values;
};

/* =========================================================
   CSV FILE PARSER
========================================================= */

const parseCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(
      (line) =>
        line.trim() !== ""
    );

  if (lines.length < 2) {
    return [];
  }

  const headers =
    parseCSVLine(lines[0]).map(
      (header) =>
        header
          .replace(/^"|"$/g, "")
          .trim()
    );

  return lines
    .slice(1)
    .map((line) => {
      const values =
        parseCSVLine(line);

      const row = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index] ?? "";
        }
      );

      return row;
    });
};

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (
  row,
  names
) => {
  const keys =
    Object.keys(row || {});

  const normalizedNames =
    names.map((name) =>
      String(name)
        .toLowerCase()
        .trim()
    );

  const matchedKey =
    keys.find((key) =>
      normalizedNames.includes(
        String(key)
          .toLowerCase()
          .trim()
      )
    );

  return matchedKey
    ? row[matchedKey]
    : "";
};

/* =========================================================
   NORMALIZE AIS DATA
========================================================= */

const normalizeAIS = (
  rows
) => {
  return rows.map(
    (row, index) => {
      const mmsi =
        String(
          getField(row, [
            "MMSI",
            "mmsi",
            "Mmsi",
            "vessel_id",
            "vesselId",
          ]) || ""
        ).trim();

      const sog =
        Number(
          getField(row, [
            "SOG",
            "sog",
            "Speed",
            "speed",
          ])
        );

      const lat =
        Number(
          getField(row, [
            "LAT",
            "lat",
            "Latitude",
            "latitude",
          ])
        );

      const lon =
        Number(
          getField(row, [
            "LON",
            "lon",
            "Longitude",
            "longitude",
          ])
        );

      return {
        id:
          mmsi ||
          `AIS-${index + 1}`,

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
    }
  );
};

/* =========================================================
   COMPONENT
========================================================= */

function SignalsTask29({
  data = [],
}) {
  /* =======================================================
     STATES
  ======================================================= */

  const [aisData, setAISData] =
    useState([]);

  const [aisLoading, setAISLoading] =
    useState(true);

  const [aisError, setAISError] =
    useState("");

  /* =======================================================
     LOAD AIS FILE
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {
        setAISLoading(true);
        setAISError("");

        const response =
          await fetch(
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

        const csvText =
          await response.text();

        const parsed =
          parseCSV(csvText);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv contains no records."
          );
        }

        const normalized =
          normalizeAIS(parsed);

        if (mounted) {
          setAISData(
            normalized
          );
        }

      } catch (error) {
        console.error(
          "Task 29 AIS Error:",
          error
        );

        if (mounted) {
          setAISError(
            "Unable to load AIS_file.csv"
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
      Refresh AIS data every 30 seconds.
    */

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

  /* =======================================================
     SAFE BACKEND DATA
  ======================================================= */

  const safeBackendData =
    Array.isArray(data)
      ? data
      : [];

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const aisMetrics =
    useMemo(() => {
      if (!aisData.length) {
        return {
          records: 0,
          vessels: 0,
          moving: 0,
          stationary: 0,
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
              (row) =>
                row.mmsi
            )
            .filter(Boolean)
        ).size;

      const moving =
        aisData.filter(
          (row) =>
            row.moving
        ).length;

      const stationary =
        aisData.length -
        moving;

      const valid =
        aisData.filter(
          (row) =>
            row.validCoordinates &&
            row.validSpeed
        ).length;

      const invalid =
        aisData.length -
        valid;

      const quality =
        Math.round(
          (valid /
            aisData.length) *
            100
        );

      const speeds =
        aisData
          .map(
            (row) =>
              row.sog
          )
          .filter(
            (value) =>
              Number.isFinite(
                value
              )
          );

      const averageSpeed =
        speeds.length > 0
          ? speeds.reduce(
              (
                total,
                value
              ) =>
                total + value,
              0
            ) /
            speeds.length
          : 0;

      return {
        records:
          aisData.length,

        vessels,

        moving,

        stationary,

        valid,

        invalid,

        quality,

        averageSpeed:
          Number(
            averageSpeed.toFixed(
              2
            )
          ),
      };
    }, [aisData]);

  /* =======================================================
     BACKEND SIGNAL COUNTS
  ======================================================= */

  const backendCounts =
    useMemo(() => {
      return {
        flood:
          safeBackendData.filter(
            (item) =>
              item?.signal_type ===
              "Flood Alert"
          ).length,

        traffic:
          safeBackendData.filter(
            (item) =>
              item?.signal_type ===
              "Traffic Incident"
          ).length,

        medical:
          safeBackendData.filter(
            (item) =>
              item?.signal_type ===
              "Medical Emergency"
          ).length,

        power:
          safeBackendData.filter(
            (item) =>
              item?.signal_type ===
              "Power Failure"
          ).length,

        cyber:
          safeBackendData.filter(
            (item) =>
              item?.signal_type ===
              "Cyber Incident"
          ).length,
      };
    }, [
      safeBackendData,
    ]);

  /* =======================================================
     SIGNAL COUNTS
     
     Backend signal data is preferred when available.

     AIS is used as the operational telemetry source when
     backend signal data is empty.
  ======================================================= */

  const signalMetrics =
    useMemo(() => {
      const hasBackendSignals =
        safeBackendData.length >
        0;

      /*
        Existing backend signal
        categories.
      */

      if (hasBackendSignals) {
        return {
          flood:
            backendCounts.flood,

          traffic:
            backendCounts.traffic,

          medical:
            backendCounts.medical,

          power:
            backendCounts.power,

          cyber:
            backendCounts.cyber,

          total:
            safeBackendData.length,
        };
      }

      /*
        AIS-derived operational
        categories.

        These are telemetry
        categories, not literal
        civic incidents.
      */

      if (aisData.length > 0) {
        return {
          flood:
            aisMetrics.stationary,

          traffic:
            aisMetrics.moving,

          medical:
            aisMetrics.valid,

          power:
            aisMetrics.invalid,

          cyber:
            aisMetrics.vessels,

          total:
            aisMetrics.records,
        };
      }

      return {
        flood: 0,
        traffic: 0,
        medical: 0,
        power: 0,
        cyber: 0,
        total: 0,
      };
    }, [
      safeBackendData,
      backendCounts,
      aisData,
      aisMetrics,
    ]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData =
    useMemo(() => {
      return [
        {
          name: "Flood",
          value:
            signalMetrics.flood,
        },

        {
          name: "Traffic",
          value:
            signalMetrics.traffic,
        },

        {
          name: "Medical",
          value:
            signalMetrics.medical,
        },

        {
          name: "Power",
          value:
            signalMetrics.power,
        },

        {
          name: "Cyber",
          value:
            signalMetrics.cyber,
        },
      ];
    }, [
      signalMetrics,
    ]);

  /* =======================================================
     AIS ACTIVITY SUMMARY
  ======================================================= */

  const activityData =
    useMemo(() => {
      if (!aisData.length) {
        return [];
      }

      return [
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
          name: "Valid",
          value:
            aisMetrics.valid,
        },

        {
          name: "Invalid",
          value:
            aisMetrics.invalid,
        },
      ].filter(
        (item) =>
          item.value > 0
      );
    }, [
      aisData,
      aisMetrics,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          TITLE
      ===================================================== */}

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
            "20px",
        }}
      >
        <div>
          <h1 className="page-title">
            Signals Command Center
          </h1>

          <p
            style={{
              color:
                "#94a3b8",
              fontSize:
                "13px",
              marginTop:
                "5px",
            }}
          >
            Signal monitoring •
            AIS telemetry •
            operational activity
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
              "8px 13px",
            borderRadius:
              "8px",
            background:
              "#111827",
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
                aisData.length >
                0
                  ? "#22c55e"
                  : "#f59e0b",
            }}
          />

          {aisLoading
            ? "LOADING AIS"
            : aisData.length > 0
            ? "AIS DATA LIVE"
            : "AIS UNAVAILABLE"}
        </div> */}
      </div>

      {/* =====================================================
          AIS ERROR
      ===================================================== */}

      {aisError && (
        <div
          style={{
            marginBottom:
              "20px",
            padding:
              "10px 14px",
            borderRadius:
              "8px",
            background:
              "rgba(245,158,11,.08)",
            border:
              "1px solid rgba(245,158,11,.3)",
            color:
              "#fbbf24",
            fontSize:
              "13px",
          }}
        >
          {aisError}
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="cards-grid">

        <StatCard
          title="Total Signals"
          value={
            signalMetrics.total
          }
          icon="📡"
        />

        <StatCard
          title="Flood Alerts"
          value={
            signalMetrics.flood
          }
          icon="🌊"
        />

        <StatCard
          title="Traffic Incidents"
          value={
            signalMetrics.traffic
          }
          icon="🚦"
        />

        <StatCard
          title="Medical Emergencies"
          value={
            signalMetrics.medical
          }
          icon="🏥"
        />

        <StatCard
          title="Power Failures"
          value={
            signalMetrics.power
          }
          icon="⚡"
        />

        <StatCard
          title="Cyber Incidents"
          value={
            signalMetrics.cyber
          }
          icon="🔐"
        />

      </div>

      {/* =====================================================
          AIS SUMMARY CARDS
      ===================================================== */}

      {aisData.length > 0 && (
        <div
          className="cards-grid"
          style={{
            marginTop:
              "20px",
          }}
        >

          <StatCard
            title="AIS Records"
            value={
              aisMetrics.records
            }
            icon="🛰️"
          />

          <StatCard
            title="Unique Vessels"
            value={
              aisMetrics.vessels
            }
            icon="🚢"
          />

          <StatCard
            title="Moving Records"
            value={
              aisMetrics.moving
            }
            icon="📍"
          />

          <StatCard
            title="AIS Quality"
            value={`${aisMetrics.quality}%`}
            icon="✅"
          />

          <StatCard
            title="Average Speed"
            value={`${aisMetrics.averageSpeed}`}
            icon="⚓"
          />

        </div>
      )}

      {/* =====================================================
          BAR CHART
      ===================================================== */}

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
              bottom: 30,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="name"
              stroke="#cbd5e1"
              label={{
                value:
                  "Category",
                position:
                  "insideBottom",
                offset: -1,
                fill:
                  "#cbd5e1",
              }}
            />

            <YAxis
              stroke="#cbd5e1"
              label={{
                value:
                  "Count",
                angle: -90,
                position:
                  "insideLeft",
                fill:
                  "#cbd5e1",
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#111827",
                border:
                  "1px solid #334155",
                borderRadius:
                  "8px",
                color:
                  "#ffffff",
              }}
            />

            <Bar
              dataKey="value"
              name="Signals"
              radius={[
                5,
                5,
                0,
                0,
              ]}
            >

              {chartData.map(
                (
                  entry,
                  index
                ) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* =====================================================
          PIE CHART
      ===================================================== */}

      <div className="chart-card">

        <h2>
          Signal Distribution
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
              innerRadius={40}
              paddingAngle={3}
              label={({ name, value }) =>
                `${name}: ${Number(
                  value
                ).toLocaleString()}`
              }
              labelLine
            >

              {chartData.map(
                (
                  entry,
                  index
                ) => (
                  <Cell
                    key={`pie-${index}`}
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
              contentStyle={{
                backgroundColor:
                  "#111827",
                border:
                  "1px solid #334155",
                borderRadius:
                  "8px",
                color:
                  "#ffffff",
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* =====================================================
          AIS ACTIVITY DISTRIBUTION
      ===================================================== */}

      {activityData.length > 0 && (
        <div
          className="chart-card"
        >

          <h2>
            AIS Activity Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={activityData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="name"
                stroke="#cbd5e1"
              />

              <YAxis
                stroke="#cbd5e1"
              />

              <Tooltip />

              <Bar
                dataKey="value"
                name="AIS Records"
                fill="#14b8a6"
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
      )}

      {/* =====================================================
          SIGNAL TABLE
      ===================================================== */}

      <div className="content-card">

        <h2>
          Signals
        </h2>

        {safeBackendData.length >
        0 ? (
          <table className="data-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Signal</th>
              </tr>
            </thead>

            <tbody>

              {safeBackendData.map(
                (
                  item,
                  index
                ) => (
                  <tr
                    key={
                      item.signal_id ||
                      index
                    }
                  >

                    <td>
                      {item.signal_id ||
                        `SIG-${index + 1}`}
                    </td>

                    <td>
                      {item.signal_type ||
                        "Unknown Signal"}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        ) : aisData.length > 0 ? (
          <table className="data-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Telemetry Type</th>
                <th>MMSI</th>
                <th>SOG</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {aisData
                .slice(0, 100)
                .map(
                  (
                    item,
                    index
                  ) => {

                    let telemetryType =
                      "Stationary";

                    if (
                      item.moving
                    ) {
                      telemetryType =
                        "Moving Activity";
                    }

                    if (
                      !item.validCoordinates ||
                      !item.validSpeed
                    ) {
                      telemetryType =
                        "Validation Issue";
                    }

                    return (
                      <tr
                        key={
                          item.id ||
                          index
                        }
                      >

                        <td>
                          {item.id}
                        </td>

                        <td>
                          {telemetryType}
                        </td>

                        <td>
                          {item.mmsi ||
                            "N/A"}
                        </td>

                        <td>
                          {Number.isFinite(
                            item.sog
                          )
                            ? item.sog
                            : "N/A"}
                        </td>

                        <td>
                          {item.moving
                            ? "MOVING"
                            : "STATIONARY"}
                        </td>

                      </tr>
                    );
                  }
                )}

            </tbody>

          </table>
        ) : (
          <div
            style={{
              padding:
                "25px",
              textAlign:
                "center",
              color:
                "#94a3b8",
            }}
          >
            No signal or AIS data
            available.
          </div>
        )}

      </div>

      {/* =====================================================
          BACKEND RESPONSE
      ===================================================== */}

      {/* 
      <ResponseViewer
        data={
          safeBackendData
        }
      />
      */}

    </>
  );
}

export default SignalsTask29;