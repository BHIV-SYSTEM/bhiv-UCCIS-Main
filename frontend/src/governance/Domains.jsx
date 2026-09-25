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

function isValidCoordinates(row) {
  return (
    Number.isFinite(row.lat) &&
    Number.isFinite(row.lon) &&
    row.lat >= -90 &&
    row.lat <= 90 &&
    row.lon >= -180 &&
    row.lon <= 180
  );
}

function isValidSpeed(row) {
  return Number.isFinite(row.sog) && row.sog >= 0;
}

function isValidTimestamp(row) {
  return (
    Boolean(row.timestamp) &&
    !Number.isNaN(new Date(row.timestamp).getTime())
  );
}

function isValidAIS(row) {
  return (
    Boolean(row.mmsi) &&
    isValidCoordinates(row) &&
    isValidSpeed(row) &&
    isValidTimestamp(row)
  );
}

function getDomainStatus(invalidRate, stationaryRate) {
  if (invalidRate > 8) {
    return "Critical";
  }

  if (invalidRate > 2 || stationaryRate > 60) {
    return "Warning";
  }

  return "Healthy";
}

function getStatusColor(status) {
  if (status === "Healthy") return "#22c55e";
  if (status === "Warning") return "#f59e0b";
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

export default function Domains() {
  const [selected, setSelected] = useState(null);
  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS FILE
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
        console.error("Domains AIS loading error:", err);

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
     DOMAIN DATA

     AIS does not contain business domains such as API,
     Authentication, Database, or Telemetry. Therefore
     actual VesselType categories are used as operational
     domains.
  ======================================================= */

  const domains = useMemo(() => {
    const map = {};

    aisData.forEach((row) => {
      const name = row.vesselType || "Unknown Vessel Type";

      if (!map[name]) {
        map[name] = {
          name,
          records: 0,
          valid: 0,
          invalid: 0,
          moving: 0,
          stationary: 0,
          vessels: new Set(),
          totalSOG: 0,
          speedCount: 0,
        };
      }

      const domain = map[name];

      domain.records += 1;

      if (row.mmsi) {
        domain.vessels.add(row.mmsi);
      }

      if (isValidAIS(row)) {
        domain.valid += 1;

        if (row.sog > 0) {
          domain.moving += 1;
        } else {
          domain.stationary += 1;
        }

        domain.totalSOG += row.sog;
        domain.speedCount += 1;
      } else {
        domain.invalid += 1;
      }
    });

    return Object.values(map)
      .map((domain, index) => {
        const invalidRate =
          domain.records > 0
            ? (domain.invalid / domain.records) * 100
            : 0;

        const stationaryRate =
          domain.valid > 0
            ? (domain.stationary / domain.valid) * 100
            : 0;

        const validRate =
          domain.records > 0
            ? (domain.valid / domain.records) * 100
            : 0;

        const load =
          domain.records > 0
            ? Math.round(
                (domain.records / aisData.length) * 100
              )
            : 0;

        const averageSOG =
          domain.speedCount > 0
            ? domain.totalSOG / domain.speedCount
            : 0;

        return {
          id: `AIS-DOM-${String(index + 1).padStart(2, "0")}`,
          name: domain.name,
          owner: "AIS Operations",
          status: getDomainStatus(
            invalidRate,
            stationaryRate
          ),
          load,
          services: domain.vessels.size,
          records: domain.records,
          valid: domain.valid,
          invalid: domain.invalid,
          moving: domain.moving,
          stationary: domain.stationary,
          validRate,
          invalidRate,
          stationaryRate,
          averageSOG,
          description:
            `${domain.name} vessel-type domain containing ` +
            `${domain.records.toLocaleString()} AIS records.`,
        };
      })
      .sort((a, b) => b.records - a.records)
      .slice(0, 15);
  }, [aisData]);

  /* =======================================================
     KPI CARDS
  ======================================================= */

  const stats = useMemo(() => {
    const healthy = domains.filter(
      (domain) => domain.status === "Healthy"
    ).length;

    const warning = domains.filter(
      (domain) => domain.status === "Warning"
    ).length;

    const critical = domains.filter(
      (domain) => domain.status === "Critical"
    ).length;

    const avgLoad =
      domains.length > 0
        ? Math.round(
            domains.reduce(
              (sum, domain) => sum + domain.load,
              0
            ) / domains.length
          )
        : 0;

    return {
      totalDomains: domains.length,
      healthy,
      warning,
      critical,
      avgLoad,
    };
  }, [domains]);

  /* =======================================================
     PIE CHART
  ======================================================= */

  const pieData = useMemo(
    () =>
      [
        {
          name: "Healthy",
          value: stats.healthy,
        },
        {
          name: "Warning",
          value: stats.warning,
        },
        {
          name: "Critical",
          value: stats.critical,
        },
      ].filter((item) => item.value > 0),
    [stats]
  );

  const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  /* =======================================================
     BAR CHART

     Domain load is based on each VesselType's share of
     total AIS records.
  ======================================================= */

  const barData = useMemo(
    () =>
      domains.map((domain) => ({
        name: domain.name,
        load: domain.load,
        records: domain.records,
      })),
    [domains]
  );

  return (
    <div className="page">

      {/* ================= HEADER ================= */}

      <h2>Domain Overview</h2>

      {loading && (
        <div className="card">
          <p style={{ color: "#000000" }}>
            Loading AIS domain data...
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
            Make sure <b>AIS_file.csv</b> is inside{" "}
            <b>frontend/public/</b>.
          </p>
        </div>
      )}

      {/* ================= KPI CARDS ================= */}

      <div className="grid">
        <div className="card">
          <h3>Total Domains</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.totalDomains.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Healthy</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.healthy.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Warning</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.warning.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Avg Load</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.avgLoad}%
          </h1>
        </div>
      </div>

      {/* ================= AIS SUMMARY ================= */}

      <div className="grid">
        <div className="card">
          <h3>Total AIS Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {aisData.length.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Moving Records</h3>
          <h1 style={{ color: "#ffffff" }}>
            {aisData
              .filter(
                (row) =>
                  isValidAIS(row) &&
                  row.sog > 0
              )
              .length.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Validation Exceptions</h3>
          <h1 style={{ color: "#ffffff" }}>
            {aisData
              .filter((row) => !isValidAIS(row))
              .length.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Unique Vessels</h3>
          <h1 style={{ color: "#ffffff" }}>
            {
              new Set(
                aisData
                  .map((row) => row.mmsi)
                  .filter(Boolean)
              ).size
            }
          </h1>
        </div>
      </div>

      {/* ================= MAIN SECTION ================= */}

      <div className="grid">

        {/* ================= DOMAIN LIST ================= */}

        <div className="card">
          <h3>System Domains</h3>

          {domains.map((domain) => (
            <div
              key={domain.id}
              className="card"
              style={{
                cursor: "pointer",
                marginBottom: "12px",
              }}
              onClick={() => setSelected(domain)}
            >
              <div>
                <b style={{ color: "#ffffff" }}>
                  {domain.name}
                </b>
              </div>

              <div style={{ color: "#ffffff" }}>
                Records:{" "}
                {domain.records.toLocaleString()}
              </div>

              <div style={{ color: "#ffffff" }}>
                Vessels:{" "}
                {domain.services.toLocaleString()}
              </div>

              <div
                style={{
                  color: getStatusColor(
                    domain.status
                  ),
                  fontWeight: 700,
                }}
              >
                Status: {domain.status}
              </div>

              <div style={{ color: "#ffffff" }}>
                Load: {domain.load}%
              </div>
            </div>
          ))}

          {!domains.length && !loading && (
            <p style={{ color: "#ffffff" }}>
              No AIS domains found.
            </p>
          )}
        </div>

        {/* ================= PIE CHART ================= */}

        <div className="card">
          <h3>Domain Health Distribution</h3>

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
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
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
        <h3>Domain Load Distribution</h3>

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
                value: "Vessel Type Domain",
                position: "insideBottom",
                offset: -65,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "AIS Load (%)",
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
              dataKey="load"
              name="AIS Load %"
              fill="#3b82f6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= DETAILS PANEL ================= */}

      {selected && (
        <div className="card">
          <h3>Domain Details</h3>

          <p style={{ color: "#000000" }}>
            <b>ID:</b> {selected.id}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Name:</b> {selected.name}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Owner:</b> {selected.owner}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Status:</b> {selected.status}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Load:</b> {selected.load}%
          </p>

          <p style={{ color: "#000000" }}>
            <b>AIS Records:</b>{" "}
            {selected.records.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Unique Vessels:</b>{" "}
            {selected.services.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Valid Records:</b>{" "}
            {selected.valid.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Validation Exceptions:</b>{" "}
            {selected.invalid.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Moving Records:</b>{" "}
            {selected.moving.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Stationary Records:</b>{" "}
            {selected.stationary.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Validity Rate:</b>{" "}
            {selected.validRate.toFixed(2)}%
          </p>

          <p style={{ color: "#000000" }}>
            <b>Average SOG:</b>{" "}
            {selected.averageSOG.toFixed(2)}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Description:</b>{" "}
            {selected.description}
          </p>

          <button
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      <div className="card">
        <h3>AIS Domain Summary</h3>

        <p style={{ color: "#000000" }}>
          Total AIS records:{" "}
          <b>{aisData.length.toLocaleString()}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Vessel-type domains displayed:{" "}
          <b>{domains.length}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Moving records:{" "}
          <b>
            {aisData
              .filter(
                (row) =>
                  isValidAIS(row) &&
                  row.sog > 0
              )
              .length.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Validation exceptions:{" "}
          <b>
            {aisData
              .filter((row) => !isValidAIS(row))
              .length.toLocaleString()}
          </b>
        </p>

        <p
          style={{
            color: "#4b5563",
            marginTop: "15px",
          }}
        >
          Note: AIS_file.csv does not contain
          application domains, owners, service counts,
          or load fields. The dashboard therefore uses
          actual VesselType categories as operational
          domains and derives load and health from AIS
          record distribution and telemetry quality.
        </p>
      </div>
    </div>
  );
}
