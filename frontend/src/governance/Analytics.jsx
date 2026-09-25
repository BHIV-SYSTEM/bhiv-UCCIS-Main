import React, { useEffect, useMemo, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }

      row.push(value);
      value = "";

      if (row.some((item) => item.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);

    if (row.some((item) => item.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) =>
    String(header || "")
      .replace(/^\uFEFF/, "")
      .replace(/^"|"$/g, "")
      .trim()
  );

  return rows.slice(1).map((values) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = String(values[index] ?? "")
        .trim()
        .replace(/^"|"$/g, "");
    });

    return record;
  });
}

/* =========================================================
   AIS HELPERS
========================================================= */

function getField(row, names) {
  const keys = Object.keys(row || {});

  for (const name of names) {
    const wanted = String(name).toLowerCase().trim();

    const key = keys.find(
      (item) =>
        String(item).toLowerCase().trim() === wanted
    );

    if (
      key !== undefined &&
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

function toNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeAISRow(row, index) {
  return {
    index: index + 1,

    mmsi: String(
      getField(row, ["MMSI", "mmsi", "Mmsi"])
    ).trim(),

    timestamp: String(
      getField(row, [
        "BaseDateTime",
        "baseDateTime",
        "Timestamp",
        "timestamp",
        "DateTime",
        "datetime",
      ])
    ).trim(),

    lat: toNumber(
      getField(row, [
        "LAT",
        "Lat",
        "Latitude",
        "latitude",
      ])
    ),

    lon: toNumber(
      getField(row, [
        "LON",
        "Lon",
        "Longitude",
        "longitude",
      ])
    ),

    sog: toNumber(
      getField(row, [
        "SOG",
        "sog",
        "Speed",
        "speed",
        "SpeedOverGround",
      ])
    ),

    vesselType: String(
      getField(row, [
        "VesselType",
        "Vessel Type",
        "vessel_type",
        "ShipType",
        "ship_type",
      ])
    ).trim(),
  };
}

function validCoordinates(row) {
  return (
    Number.isFinite(row.lat) &&
    Number.isFinite(row.lon) &&
    row.lat >= -90 &&
    row.lat <= 90 &&
    row.lon >= -180 &&
    row.lon <= 180
  );
}

function validSpeed(row) {
  return (
    Number.isFinite(row.sog) &&
    row.sog >= 0
  );
}

function validTimestamp(row) {
  return (
    Boolean(row.timestamp) &&
    !Number.isNaN(
      new Date(row.timestamp).getTime()
    )
  );
}

function isValidAIS(row) {
  return (
    Boolean(row.mmsi) &&
    validCoordinates(row) &&
    validSpeed(row) &&
    validTimestamp(row)
  );
}

/* =========================================================
   TOOLTIP
========================================================= */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "8px",
        padding: "10px 12px",
        color: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      }}
    >
      {label && (
        <p
          style={{
            margin: "0 0 6px",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          {label}
        </p>
      )}

      {payload[0]?.payload?.startLabel && (
        <p
          style={{
            margin: "3px 0",
            color: "#d1d5db",
            fontSize: "12px",
          }}
        >
          {payload[0].payload.startLabel}
          {" → "}
          {payload[0].payload.endLabel}
        </p>
      )}

      {payload.map((item, index) => (
        <p
          key={`${item.dataKey}-${index}`}
          style={{
            margin: "3px 0",
            color: "#ffffff",
          }}
        >
          {item.name || item.dataKey}:{" "}
          <strong>
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
          </strong>
        </p>
      ))}
    </div>
  );
}

/* =========================================================
   MAIN ANALYTICS COMPONENT
========================================================= */

export default function Analytics() {
  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS CSV
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv. HTTP ${response.status}`
          );
        }

        const text = await response.text();

        const parsed = parseCSV(text);

        const normalized = parsed
          .map(normalizeAISRow)
          .filter(
            (row) =>
              row.mmsi ||
              row.timestamp ||
              Number.isFinite(row.sog)
          );

        if (!normalized.length) {
          throw new Error(
            "AIS_file.csv contains no usable records."
          );
        }

        if (mounted) {
          setAisData(normalized);
        }
      } catch (err) {
        console.error(
          "Analytics AIS loading error:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Failed to load AIS_file.csv."
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

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const metrics = useMemo(() => {
    const total = aisData.length;

    const valid = aisData.filter(isValidAIS);

    const invalid = aisData.filter(
      (row) => !isValidAIS(row)
    );

    const moving = valid.filter(
      (row) => row.sog > 0
    );

    const stationary = valid.filter(
      (row) => row.sog === 0
    );

    const vesselSet = new Set(
      aisData
        .map((row) => row.mmsi)
        .filter(Boolean)
    );

    const speedValues = valid
      .map((row) => row.sog)
      .filter(Number.isFinite);

    const averageSOG =
      speedValues.length > 0
        ? speedValues.reduce(
            (sum, value) => sum + value,
            0
          ) / speedValues.length
        : 0;

    /*
      "Incident Rate" is represented here as the
      proportion of invalid AIS records because AIS
      does not contain a literal incident field.
    */
    const incidentRate =
      total > 0
        ? (invalid.length / total) * 100
        : 0;

    /*
      "System Efficiency" is represented as the
      percentage of AIS records that pass validation.
    */
    const systemEfficiency =
      total > 0
        ? (valid.length / total) * 100
        : 0;

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      moving: moving.length,
      stationary: stationary.length,
      vessels: vesselSet.size,
      averageSOG,
      incidentRate,
      systemEfficiency,
    };
  }, [aisData]);

  /* =======================================================
     INCIDENT / STATUS DISTRIBUTION

     AIS does not contain incident states.
     These are mutually exclusive operational states:
     Moving, Stationary, Invalid.
  ======================================================= */

  const incidentTrendData = useMemo(
    () => [
      {
        name: "Moving",
        value: metrics.moving,
      },
      {
        name: "Stationary",
        value: metrics.stationary,
      },
      {
        name: "Invalid",
        value: metrics.invalid,
      },
    ],
    [metrics]
  );

  const COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
  ];

  /* =======================================================
     CHRONOLOGICAL TREND

     Divide the actual AIS dataset into up to 4
     chronological segments. This replaces fake
     Week 1 / Week 2 / Week 3 / Week 4 values.
  ======================================================= */

  const barData = useMemo(() => {
    const timestampedRows = aisData
      .map((row) => ({
        ...row,
        time: new Date(row.timestamp).getTime(),
      }))
      .filter((row) => Number.isFinite(row.time))
      .sort((a, b) => a.time - b.time);

    if (!timestampedRows.length) {
      return [];
    }

    const minTime = timestampedRows[0].time;
    const maxTime =
      timestampedRows[timestampedRows.length - 1].time;

    // If every record has the same timestamp, fall back to
    // the actual record states instead of creating four equal bars.
    if (minTime === maxTime) {
      const validCount = timestampedRows.filter(isValidAIS).length;
      const invalidCount =
        timestampedRows.length - validCount;

      const movingCount = timestampedRows.filter(
        (row) => isValidAIS(row) && row.sog > 0
      ).length;

      const stationaryCount = timestampedRows.filter(
        (row) => isValidAIS(row) && row.sog === 0
      ).length;

      return [
        {
          name: "Available Period",
          records: timestampedRows.length,
          moving: movingCount,
          stationary: stationaryCount,
          invalid: invalidCount,
          valid: validCount,
        },
      ];
    }

    // Divide the REAL timestamp range into four chronological
    // time windows. This produces different values when AIS
    // traffic is distributed unevenly over time.
    const windowCount = 4;
    const windowSize = (maxTime - minTime) / windowCount;

    const windows = Array.from(
      { length: windowCount },
      (_, index) => {
        const startTime =
          minTime + index * windowSize;

        const endTime =
          index === windowCount - 1
            ? maxTime + 1
            : minTime + (index + 1) * windowSize;

        const rows = timestampedRows.filter(
          (row) =>
            row.time >= startTime &&
            row.time < endTime
        );

        const validCount = rows.filter(
          isValidAIS
        ).length;

        const invalidCount =
          rows.length - validCount;

        const movingCount = rows.filter(
          (row) =>
            isValidAIS(row) &&
            row.sog > 0
        ).length;

        const stationaryCount = rows.filter(
          (row) =>
            isValidAIS(row) &&
            row.sog === 0
        ).length;

        return {
          name: `Period ${index + 1}`,
          records: rows.length,
          moving: movingCount,
          stationary: stationaryCount,
          invalid: invalidCount,
          valid: validCount,
          startLabel: new Date(startTime).toLocaleString(),
          endLabel: new Date(
            Math.min(endTime, maxTime)
          ).toLocaleString(),
        };
      }
    );

    return windows;
  }, [aisData]);

  return (
    <div className="page">

      {/* ================= HEADER ================= */}

      <h2>Analytics Dashboard</h2>

      {loading && (
        <div className="card">
          <p style={{ color: "#000000" }}>
            Loading AIS analytics data...
          </p>
        </div>
      )}

      {error && (
        <div
          className="card"
          style={{
            border: "1px solid #dc2626",
          }}
        >
          <p style={{ color: "#dc2626" }}>
            {error}
          </p>

          <p style={{ color: "#000000" }}>
            Make sure{" "}
            <b>AIS_file.csv</b> is inside{" "}
            <b>frontend/public/</b>.
          </p>
        </div>
      )}

      {/* ================= KPI CARDS ================= */}

      <div className="grid">

        <div className="card">
          <h3>Total AIS Events</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.total.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Validation Exception Rate</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.incidentRate.toFixed(1)}%
          </h1>
        </div>

        <div className="card">
          <h3>AIS Data Efficiency</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.systemEfficiency.toFixed(1)}%
          </h1>
        </div>

        <div className="card">
          <h3>Average Speed</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.averageSOG.toFixed(2)}
          </h1>
          <p style={{ color: "#ffffff" }}>
            SOG
          </p>
        </div>

      </div>

      {/* ================= AIS SUMMARY ================= */}

      <div className="grid">

        <div className="card">
          <h3>Valid AIS Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.valid.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Moving Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.moving.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Stationary Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.stationary.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Unique Vessels</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.vessels.toLocaleString()}
          </h1>
        </div>

      </div>

      {/* ================= CHART SECTION ================= */}

      <div className="grid">

        {/* ================= PIE CHART ================= */}

        <div className="card">
          <h3>AIS Activity Distribution</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={incidentTrendData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {incidentTrendData.map(
                  (_, index) => (
                    <Cell
                      key={`cell-${index}`}
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
                content={<CustomTooltip />}
              />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ================= BAR CHART ================= */}

        <div className="card">
          <h3>AIS Activity Trend</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 20,
                left: 60,
                bottom: 55,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                label={{
                  value: "AIS Time Period",
                  position: "insideBottom",
                  offset: -5,
                }}
              />

              <YAxis
                allowDecimals={false}
                label={{
                  value: "AIS Record Count",
                  angle: -90,
                  position: "insideLeft",
                  offset: -45,
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
              />

              <Legend />

              <Bar
                dataKey="records"
                name="AIS Records"
                fill="#3b82f6"
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= ACTIVITY BREAKDOWN ================= */}

      <div className="card">
        <h3>AIS Activity Breakdown</h3>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart
            data={barData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 40,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              label={{
                value: "AIS Time Period",
                position: "insideBottom",
                offset: -20,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "Record Count",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend />

            <Bar
              dataKey="moving"
              name="Moving"
              fill="#3b82f6"
            />

            <Bar
              dataKey="stationary"
              name="Stationary"
              fill="#f59e0b"
            />

            <Bar
              dataKey="invalid"
              name="Invalid"
              fill="#ef4444"
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= ANALYTICS SUMMARY ================= */}

      <div className="card">

        <h3>AIS Analytics Summary</h3>

        <p style={{ color: "#000000" }}>
          Total AIS events:{" "}
          <b>
            {metrics.total.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Valid AIS records:{" "}
          <b>
            {metrics.valid.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Moving records:{" "}
          <b>
            {metrics.moving.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Stationary records:{" "}
          <b>
            {metrics.stationary.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Invalid records:{" "}
          <b>
            {metrics.invalid.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Unique vessels:{" "}
          <b>
            {metrics.vessels.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Average SOG:{" "}
          <b>
            {metrics.averageSOG.toFixed(2)}
          </b>
        </p>

        <p
          style={{
            color: "#4b5563",
            marginTop: "15px",
          }}
        >
          Note: AIS_file.csv does not contain
          literal incident-rate, efficiency, or
          response-time fields. Those analytics
          values are derived from AIS telemetry
          validation and SOG data.
        </p>

      </div>

    </div>
  );
}
