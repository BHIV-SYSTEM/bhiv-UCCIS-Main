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
  Legend
} from "recharts";

export default function ReplayCharts({ phase = "replay" }) {


  /* ==========================================
     AIS CONFIGURATION
  ========================================== */

  const AIS_FILE = "/AIS_file.csv";

  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================
     LOAD AIS CSV
  ========================================== */

  useEffect(() => {
    let mounted = true;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE);

        if (!response.ok) {
          throw new Error(
            `AIS file request failed: ${response.status}`
          );
        }

        const csvText = await response.text();

        const lines = csvText
          .replace(/\r/g, "")
          .split("\n")
          .filter((line) => line.trim());

        if (lines.length < 2) {
          throw new Error("AIS_file.csv contains no data rows.");
        }

        const headers = lines[0]
          .split(",")
          .map((header) => header.trim());

        const rows = lines.slice(1).map((line) => {
          const values = line.split(",");
          const row = {};

          headers.forEach((header, index) => {
            row[header] =
              values[index] !== undefined
                ? values[index].trim()
                : "";
          });

          return {
            mmsi: String(row.MMSI || "").trim(),
            timestamp: String(row.BaseDateTime || "").trim(),
            lat: Number(row.LAT),
            lon: Number(row.LON),
            sog: Number(row.SOG),
            vesselType: Number(row.VesselType),
          };
        });

        const validRows = rows.filter((row) => {
          const validTime =
            row.timestamp &&
            !Number.isNaN(
              new Date(row.timestamp).getTime()
            );

          return (
            row.mmsi &&
            validTime &&
            Number.isFinite(row.lat) &&
            row.lat >= -90 &&
            row.lat <= 90 &&
            Number.isFinite(row.lon) &&
            row.lon >= -180 &&
            row.lon <= 180 &&
            Number.isFinite(row.sog) &&
            row.sog >= 0
          );
        });

        if (mounted) {
          setAisData(validRows);
        }
      } catch (err) {
        console.error(
          "ReplayCharts AIS loading error:",
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

  /* ==========================================
     CHRONOLOGICAL AIS PHASES

     Always creates up to 4 bars:
     P1 / P2 / P3 / P4

     Each phase represents an equal chronological
     portion of the AIS dataset.
  ========================================== */

  const phaseData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    const sorted = [...aisData].sort((a, b) => {
      return (
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
      );
    });

    const phaseCount = 4;
    const result = [];

    for (let index = 0; index < phaseCount; index += 1) {
      const startIndex = Math.floor(
        (index * sorted.length) / phaseCount
      );

      const endIndex = Math.floor(
        ((index + 1) * sorted.length) / phaseCount
      );

      const rows = sorted.slice(
        startIndex,
        endIndex
      );

      if (!rows.length) {
        continue;
      }

      const movingCount = rows.filter(
        (row) => row.sog > 0
      ).length;

      const movingPercentage = Math.round(
        (movingCount / rows.length) * 100
      );

      result.push({
        name: `P${index + 1}`,
        value: movingPercentage,
        records: rows.length,
        moving: movingCount,
      });
    }

    return result;
  }, [aisData]);

  /* ==========================================
     DISTRIBUTED REPLAY ACTIVITY

     Uses the same four chronological AIS
     segments and shows moving vs stationary
     observations.
  ========================================== */

  const activityData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    const sorted = [...aisData].sort((a, b) => {
      return (
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
      );
    });

    const result = [];
    const segmentCount = 4;

    for (let index = 0; index < segmentCount; index += 1) {
      const startIndex = Math.floor(
        (index * sorted.length) / segmentCount
      );

      const endIndex = Math.floor(
        ((index + 1) * sorted.length) / segmentCount
      );

      const rows = sorted.slice(
        startIndex,
        endIndex
      );

      if (!rows.length) {
        continue;
      }

      const movingCount = rows.filter(
        (row) => row.sog > 0
      ).length;

      const completed = Math.round(
        (movingCount / rows.length) * 100
      );

      result.push({
        name: `Activity-${index + 1}`,
        completed,
        pending: 100 - completed,
      });
    }

    return result;
  }, [aisData]);

  /* ==========================================
     AIS SPEED DISTRIBUTION
  ========================================== */

  const operationalData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    let stationary = 0;
    let slow = 0;
    let moderate = 0;
    let high = 0;

    aisData.forEach((row) => {
      if (row.sog === 0) {
        stationary += 1;
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
        value: stationary,
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
    ].filter((item) => item.value > 0);
  }, [aisData]);

  /* ==========================================
     AIS SUMMARY METRICS
  ========================================== */

  const totalRecords = aisData.length;

  const uniqueVessels = useMemo(() => {
    return new Set(
      aisData.map((row) => row.mmsi)
    ).size;
  }, [aisData]);

  const movingPercentage = useMemo(() => {
    if (!aisData.length) {
      return 0;
    }

    const moving = aisData.filter(
      (row) => row.sog > 0
    ).length;

    return Math.round(
      (moving / aisData.length) * 100
    );
  }, [aisData]);

  const averageSOG = useMemo(() => {
    if (!aisData.length) {
      return 0;
    }

    return (
      aisData.reduce(
        (sum, row) => sum + row.sog,
        0
      ) / aisData.length
    );
  }, [aisData]);

  const COLORS = [
    "#2563eb",
    "#10b981",
    "#ef4444",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];

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
              marginBottom: "6px",
              color: "#111827",
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
              color: "#111827",
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
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        padding: "25px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box"
      }}
    >

      {/* ==========================================
          MAIN HEADER
      ========================================== */}

      <div
        style={{
          background: "#0f172a",
          padding: "30px",
          borderRadius: "16px",
          border: "1px solid #1e293b",
          marginBottom: "25px"
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "40px",
            fontWeight: "700"
          }}
        >
          Distributed Replay Observability Dashboard
        </h1>

        <p
          style={{
            marginTop: "20px",
            marginBottom: 0,
            color: "#94a3b8",
            fontSize: "20px"
          }}
        >
          Active Phase: {phase.toUpperCase()}
        </p>

      </div>


      {loading && (
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#93c5fd"
          }}
        >
          Loading AIS_file.csv...
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#450a0a",
            border: "1px solid #7f1d1d",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#fecaca"
          }}
        >
          {error}
          <div
            style={{
              marginTop: "5px",
              fontSize: "12px"
            }}
          >
            Make sure the file is available at
            <strong> frontend/public/AIS_file.csv </strong>
          </div>
        </div>
      )}

      {!loading && !error && aisData.length > 0 && (
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "10px 16px",
            marginBottom: "20px",
            color: "#94a3b8",
            fontSize: "13px"
          }}
        >
          AIS source connected •{" "}
          {totalRecords.toLocaleString()} valid records •{" "}
          {uniqueVessels.toLocaleString()} unique vessels
        </div>
      )}

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "20px",
          marginBottom: "25px"
        }}
      >

        {/* CARD 1 */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "30px",
            minHeight: "145px",
            boxSizing: "border-box"
          }}
        >

          <div
            style={{
              fontSize: "38px",
              fontWeight: "700",
              color: "#3b82f6",
              marginBottom: "15px"
            }}
          >
            {totalRecords.toLocaleString()}
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#e2e8f0"
            }}
          >
            AIS Records
          </div>

        </div>


        {/* CARD 2 */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "30px",
            minHeight: "145px",
            boxSizing: "border-box"
          }}
        >

          <div
            style={{
              fontSize: "38px",
              fontWeight: "700",
              color: "#3b82f6",
              marginBottom: "15px"
            }}
          >
            {movingPercentage}%
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#e2e8f0"
            }}
          >
            Moving Activity
          </div>

        </div>


        {/* CARD 3 */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "30px",
            minHeight: "145px",
            boxSizing: "border-box"
          }}
        >

          <div
            style={{
              fontSize: "38px",
              fontWeight: "700",
              color: "#3b82f6",
              marginBottom: "15px"
            }}
          >
            {uniqueVessels.toLocaleString()}
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#e2e8f0"
            }}
          >
            Unique Vessels
          </div>

        </div>


        {/* CARD 4 */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "30px",
            minHeight: "145px",
            boxSizing: "border-box"
          }}
        >

          <div
            style={{
              fontSize: "38px",
              fontWeight: "700",
              color: "#3b82f6",
              marginBottom: "15px"
            }}
          >
            {averageSOG.toFixed(2)}
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#e2e8f0"
            }}
          >
            Average SOG
          </div>

        </div>

      </div>


      {/* ==========================================
          REPLAY STABILITY METRICS
      ========================================== */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "25px",
          marginBottom: "20px",
          height: "430px",
          boxSizing: "border-box"
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom: "15px",
            fontSize: "28px"
          }}
        >
          {phase.toUpperCase()} — Replay Stability Metrics
        </h2>

        <ResponsiveContainer
          width="100%"
          height="85%"
        >

          <BarChart data={phaseData}>

            <XAxis
  dataKey="name"
  tick={{ fill: "#94a3b8" }}
  label={{
    value: "Metric",
    position: "insideBottom",
    offset: -1,
    fill: "#94a3b8"
  }}
/>

<YAxis
  domain={[0, 100]}
  tick={{ fill: "#94a3b8" }}
  label={{
    value: "Score (%)",
    angle: -90,
    position: "insideLeft",
    fill: "#94a3b8"
  }}
/>

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* ==========================================
          DISTRIBUTED REPLAY ACTIVITY
      ========================================== */}

      <div
        style={{
    background: "#111827",
    borderRadius: "12px",
    padding: "25px",
    marginTop: "10px",
    height: "500px",
    boxSizing: "border-box",
    width: "100%"
  }}
      >

        <h3
          style={{
      margin: "0 0 20px 0",
      fontSize: "32px",
      fontWeight: "700",
      color: "#ffffff"
    }}
        >
          {phase.toUpperCase()} — Distributed Replay Activity
        </h3>

        <ResponsiveContainer
          width="100%"
          height="88%"
        >

          <BarChart data={activityData}
          margin={{
        top: 10,
        right: 20,
        left: 15,
        bottom: 25
      }}
          >

            <XAxis
  dataKey="name"
  tick={{
    fill: "#64748b",
    fontSize: 9
  }}
  label={{
    value: "Activity",
    position: "insideBottom",
    offset: -5,
    fill: "#ffffff"
  }}
/>

<YAxis
  domain={[0, 100]}
  tick={{
    fill: "#64748b",
    fontSize: 9
  }}
  label={{
    value: "Completion (%)",
    angle: -90,
    position: "insideLeft",
    fill: "#ffffff"
  }}
/>

            <Tooltip
              content={<WhiteTooltip />}
            />

            <Bar
              dataKey="completed"
              stackId="activity"
              fill="#10b981"
              name="Completed"
              barSize={65}
            />

            <Bar
              dataKey="pending"
              stackId="activity"
              fill="#ef4444"
              name="Pending"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* ==========================================
          OPERATIONAL DISTRIBUTION
      ========================================== */}

      <div
        style={{
    background: "#111827",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "10px",
    height: "590px",
    width: "100%",
    boxSizing: "border-box"
  }}
      >

        <h3
          style={{
      margin: "10px 0 0 0",
      fontSize: "34px",
      fontWeight: "700",
      color: "#ffffff"
    }}
        >
          {phase.toUpperCase()} — Operational Distribution
        </h3>

        <div
    style={{
      width: "100%",
      height: "490px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={operationalData}
          dataKey="value"
          nameKey="name"

          cx="50%"
          cy="50%"

          outerRadius={145}

          labelLine={true}

          label={({ value }) => value}

          stroke="#ffffff"
          strokeWidth={1}
            >

              {operationalData.map(
                (entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip
              content={<WhiteTooltip />}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

        </div>

      </div>


      {/* ==========================================
          OPERATIONAL TIMELINE
      ========================================== */}

      <div
        style={{
    background: "#111827",
    borderRadius: "12px",
    padding: "25px",
    marginTop: "25px",
    minHeight: "175px",
    width: "100%",
    boxSizing: "border-box"
  }}
      >

        <h3
          style={{
      margin: "0 0 28px 0",
      fontSize: "32px",
      fontWeight: "700",
      color: "#ffffff"
    }}
        >
          Operational Timeline
        </h3>

        <div
          style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap"
    }}
        >

          {[
            "Signal",
            "Escalation",
            "Concurrent Operators",
            "Replay Reconstruction",
            "Recovery",
            "Validation"
          ].map((item) => (

            <span
              key={item}
              style={{
                background: "#1e293b",
                padding: "12px 24px",
                borderRadius: "15px",
                fontSize: "21px",
                color: "#e2e8f0"
              }}
            >
              {item}
            </span>

          ))}

        </div>

      </div>


      {/* ==========================================
          GOVERNANCE SAFE REPLAY VISIBILITY
      ========================================== */}

      <div
        style={{
    background: "#0f172a",
    borderRadius: "12px",
    padding: "25px",
    marginTop: "25px",
    minHeight: "200px",
    width: "100%",
    boxSizing: "border-box"
  }}
      >

        <h3
          style={{
      margin: "0 0 30px 0",
      fontSize: "32px",
      fontWeight: "700",
      color: "#ffffff"
    }}
        >
          Governance-safe Replay Visibility
        </h3>

        <p
          style={{
      margin: 0,
      fontSize: "21px",
      lineHeight: "1.6",
      color: "#ffffff"
    }}
        >
          Replay visibility remains observational only.
          Operational continuity is visible without execution
          authority delegation.
        </p>

      </div>

    </div>
  );
}