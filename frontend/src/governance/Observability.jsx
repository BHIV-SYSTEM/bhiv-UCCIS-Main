import React, { useEffect, useMemo, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
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

function getServiceStatus(invalidRate) {
  if (invalidRate <= 2) {
    return "Healthy";
  }

  if (invalidRate <= 8) {
    return "Degraded";
  }

  return "Critical";
}

function getStatusColor(status) {
  if (status === "Healthy") {
    return "#22c55e";
  }

  if (status === "Degraded") {
    return "#f59e0b";
  }

  return "#ef4444";
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
   MAIN COMPONENT
========================================================= */

export default function Observability() {
  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS DATA
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
          "Observability AIS loading error:",
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
     GLOBAL AIS METRICS
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

    const vesselTypes = new Set(
      aisData
        .map(
          (row) =>
            row.vesselType || "Unknown"
        )
        .filter(Boolean)
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

    const healthPercentage =
      total > 0
        ? (valid.length / total) * 100
        : 0;

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      moving: moving.length,
      stationary: stationary.length,
      vesselTypes: vesselTypes.size,
      vessels: vesselSet.size,
      averageSOG,
      healthPercentage,
    };
  }, [aisData]);

  /* =======================================================
     SERVICE DATA

     AIS does not contain application services.
     Therefore each VesselType is represented as an
     operational telemetry service/category.

     Only the top 12 categories are displayed to keep
     the dashboard readable.
  ======================================================= */

  const services = useMemo(() => {
    const map = {};

    aisData.forEach((row) => {
      const service =
        row.vesselType || "Unknown Vessel Type";

      if (!map[service]) {
        map[service] = {
          name: service,
          records: 0,
          valid: 0,
          invalid: 0,
          moving: 0,
          stationary: 0,
          totalSOG: 0,
          speedCount: 0,
        };
      }

      map[service].records += 1;

      if (isValidAIS(row)) {
        map[service].valid += 1;

        if (row.sog > 0) {
          map[service].moving += 1;
        } else {
          map[service].stationary += 1;
        }

        if (Number.isFinite(row.sog)) {
          map[service].totalSOG += row.sog;
          map[service].speedCount += 1;
        }
      } else {
        map[service].invalid += 1;
      }
    });

    return Object.values(map)
      .map((service) => {
        const errorRate =
          service.records > 0
            ? (service.invalid /
                service.records) *
              100
            : 0;

        const validRate =
          service.records > 0
            ? (service.valid /
                service.records) *
              100
            : 0;

        const averageSOG =
          service.speedCount > 0
            ? service.totalSOG /
              service.speedCount
            : 0;

        return {
          ...service,
          status: getServiceStatus(
            errorRate
          ),
          errorRate,
          validRate,
          averageSOG,
        };
      })
      .sort((a, b) => b.records - a.records)
      .slice(0, 12);
  }, [aisData]);

  /* =======================================================
     PIE CHART
  ======================================================= */

  const pieData = useMemo(() => {
    const counts = {
      Healthy: 0,
      Degraded: 0,
      Critical: 0,
    };

    services.forEach((service) => {
      counts[service.status] += 1;
    });

    return [
      {
        name: "Healthy",
        value: counts.Healthy,
      },
      {
        name: "Degraded",
        value: counts.Degraded,
      },
      {
        name: "Critical",
        value: counts.Critical,
      },
    ].filter((item) => item.value > 0);
  }, [services]);

  const pieColors = [
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  /* =======================================================
     BAR CHART

     Actual AIS records by VesselType.
  ======================================================= */

  const barData = useMemo(() => {
    return services.map((service) => ({
      name: service.name,
      value: service.records,
    }));
  }, [services]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="page">

      {/* ================= HEADER ================= */}

      <h2>Observability Dashboard</h2>

      {loading && (
        <div className="card">
          <p style={{ color: "#000000" }}>
            Loading AIS observability data...
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
          <h3>Total Vessel Types</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.vesselTypes.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Healthy Data</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.valid.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Validation Exceptions</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.invalid.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Active Vessel Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.moving.toLocaleString()}
          </h1>
        </div>

      </div>

      {/* ================= AIS SUMMARY ================= */}

      <div className="grid">

        <div className="card">
          <h3>Total AIS Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.total.toLocaleString()}
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

        <div className="card">
          <h3>Average SOG</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.averageSOG.toFixed(2)}
          </h1>
        </div>

      </div>

      <div className="grid">

        {/* ================= SERVICE LIST ================= */}

        <div className="card">
          <h3>Vessel Type Observability</h3>

          {services.map((service) => (
            <div
              key={service.name}
              className="card"
              style={{
                marginBottom: "12px",
              }}
            >
              <b style={{ color: "#000000" }}>
                {service.name}
              </b>

              <p style={{ color: "#000000" }}>
                Status:{" "}
                <strong>
                  {service.status}
                </strong>
              </p>

              <p style={{ color: "#000000" }}>
                AIS Records:{" "}
                {service.records.toLocaleString()}
              </p>

              <p style={{ color: "#000000" }}>
                Valid Records:{" "}
                {service.valid.toLocaleString()}
              </p>

              <p style={{ color: "#000000" }}>
                Validation Exceptions:{" "}
                {service.invalid.toLocaleString()}
              </p>

              <p style={{ color: "#000000" }}>
                Error Rate:{" "}
                {service.errorRate.toFixed(2)}%
              </p>

              <p style={{ color: "#000000" }}>
                Validity Rate:{" "}
                {service.validRate.toFixed(2)}%
              </p>

              <p style={{ color: "#000000" }}>
                Moving:{" "}
                {service.moving.toLocaleString()}
              </p>

              <p style={{ color: "#000000" }}>
                Stationary:{" "}
                {service.stationary.toLocaleString()}
              </p>

              <p style={{ color: "#000000" }}>
                Average SOG:{" "}
                {service.averageSOG.toFixed(2)}
              </p>
            </div>
          ))}

          {!services.length && !loading && (
            <p style={{ color: "#000000" }}>
              No AIS observability records found.
            </p>
          )}
        </div>

        {/* ================= PIE CHART ================= */}

        <div className="card">
          <h3>System Health Distribution</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`pie-${entry.name}`}
                    fill={pieColors[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
              />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= BAR CHART ================= */}

      <div className="card">
        <h3>AIS Record Distribution by Vessel Type</h3>

        <ResponsiveContainer
          width="100%"
          height={380}
        >
          <BarChart
            data={barData}
            margin={{
              top: 20,
              right: 20,
              left: 60,
              bottom: 80,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              height={90}
              interval={0}
              label={{
                value: "Vessel Type",
                position: "insideBottom",
                offset: -65,
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

            <Bar
              dataKey="value"
              name="AIS Records"
              fill="#3b82f6"
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= OBSERVABILITY SUMMARY ================= */}

      <div className="card">

        <h3>AIS Observability Summary</h3>

        <p style={{ color: "#000000" }}>
          Total AIS records:{" "}
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
          Validation exceptions:{" "}
          <b>
            {metrics.invalid.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Moving vessel records:{" "}
          <b>
            {metrics.moving.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Stationary vessel records:{" "}
          <b>
            {metrics.stationary.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Unique vessels:{" "}
          <b>
            {metrics.vessels.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Overall AIS data health:{" "}
          <b>
            {metrics.healthPercentage.toFixed(1)}%
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
          application-service health, latency,
          error-rate, or uptime fields. Therefore
          this dashboard represents VesselType
          categories as operational telemetry
          services, and derives health from AIS
          validation quality. Latency and uptime are
          not fabricated from AIS data.
        </p>

      </div>

    </div>
  );
}
