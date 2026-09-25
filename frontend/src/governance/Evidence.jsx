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
   HELPERS
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

function hasValidCoordinates(row) {
  return (
    Number.isFinite(row.lat) &&
    Number.isFinite(row.lon) &&
    row.lat >= -90 &&
    row.lat <= 90 &&
    row.lon >= -180 &&
    row.lon <= 180
  );
}

function hasValidSpeed(row) {
  return Number.isFinite(row.sog) && row.sog >= 0;
}

function hasValidMMSI(row) {
  return Boolean(row.mmsi);
}

function hasValidTimestamp(row) {
  if (!row.timestamp) return false;
  return !Number.isNaN(new Date(row.timestamp).getTime());
}

function isValidAIS(row) {
  return (
    hasValidMMSI(row) &&
    hasValidCoordinates(row) &&
    hasValidSpeed(row) &&
    hasValidTimestamp(row)
  );
}

function getAISStatus(row) {
  if (!isValidAIS(row)) {
    return "Invalid";
  }

  if (row.sog > 0) {
    return "Moving";
  }

  return "Stationary";
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
          <strong>{Number(item.value).toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Evidence() {
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
          .filter((row) => row.mmsi || row.timestamp);

        if (!normalized.length) {
          throw new Error(
            "AIS_file.csv contains no usable records."
          );
        }

        if (mounted) {
          setAisData(normalized);
        }
      } catch (err) {
        console.error("Evidence AIS loading error:", err);

        if (mounted) {
          setError(
            err.message || "Failed to load AIS_file.csv."
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

    const highConfidence = valid.filter(
      (row) =>
        hasValidCoordinates(row) &&
        hasValidSpeed(row) &&
        hasValidTimestamp(row)
    );

    const vesselSet = new Set(
      aisData
        .map((row) => row.mmsi)
        .filter(Boolean)
    );

    const typeMap = {};

    aisData.forEach((row) => {
      const type =
        row.vesselType || "Unknown";

      typeMap[type] =
        (typeMap[type] || 0) + 1;
    });

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      moving: moving.length,
      stationary: stationary.length,
      highConfidence: highConfidence.length,
      vessels: vesselSet.size,
      typeMap,
    };
  }, [aisData]);

  /* =======================================================
     EVIDENCE STORE
     AIS itself does not contain an "evidence" field.
     Therefore each AIS record is presented as an
     operational telemetry evidence item.
  ======================================================= */

  const evidence = useMemo(() => {
    return aisData
      .slice(-100)
      .reverse()
      .map((row) => {
        const status = getAISStatus(row);

        return {
          id: `AIS-${String(row.index).padStart(5, "0")}`,
          type: "AIS Telemetry",
          source: "AIS_file.csv",
          confidence: isValidAIS(row)
            ? "High"
            : "Review",
          severity:
            status === "Invalid"
              ? "Critical"
              : status === "Stationary"
              ? "Warning"
              : "Info",
          timestamp:
            row.timestamp || "Unavailable",
          message:
            status === "Invalid"
              ? "AIS record requires validation"
              : status === "Stationary"
              ? "Vessel telemetry reports zero speed"
              : "Active vessel telemetry received",
          domain:
            row.vesselType || "Unknown Vessel Type",
          mmsi: row.mmsi || "Unavailable",
          lat: row.lat,
          lon: row.lon,
          sog: row.sog,
          status,
        };
      });
  }, [aisData]);

  /* =======================================================
     PIE CHART
     Mutually exclusive AIS states.
  ======================================================= */

  const pieData = useMemo(
    () => [
      {
        name: "Critical / Invalid",
        value: metrics.invalid,
      },
      {
        name: "Warning / Stationary",
        value: metrics.stationary,
      },
      {
        name: "Info / Moving",
        value: metrics.moving,
      },
    ],
    [metrics]
  );

  const pieColors = [
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
  ];

  /* =======================================================
     BAR CHART
     VesselType is an actual AIS field.
     Show top 15 vessel types.
  ======================================================= */

  const barData = useMemo(() => {
    return Object.entries(metrics.typeMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [metrics.typeMap]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="page">

      <h2>Evidence Intelligence</h2>

      {loading && (
        <div className="card">
          <p style={{ color: "#000000" }}>
            Loading AIS evidence data...
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
            Make sure <b>AIS_file.csv</b> is inside
            <b> frontend/public/</b>.
          </p>
        </div>
      )}

      {/* ================= KPI CARDS ================= */}

      <div className="grid">

        <div className="card">
          <h3>Total Evidence</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.total.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Critical / Invalid</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.invalid.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Warning / Stationary</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.stationary.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>High Confidence</h3>
          <h1 style={{ color: "#ffffff" }}>
            {metrics.highConfidence.toLocaleString()}
          </h1>
        </div>

      </div>

      {/* ================= AIS SUMMARY ================= */}

      <div className="grid">

        <div className="card">
          <h3>Unique Vessels</h3>
          <h1 style={{ color: "#000000" }}>
            {metrics.vessels.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Moving Records</h3>
          <h1 style={{ color: "#000000" }}>
            {metrics.moving.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Stationary Records</h3>
          <h1 style={{ color: "#000000" }}>
            {metrics.stationary.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Valid AIS Records</h3>
          <h1 style={{ color: "#000000" }}>
            {metrics.valid.toLocaleString()}
          </h1>
        </div>

      </div>

      <div className="grid">

        {/* ================= EVIDENCE LIST ================= */}

        <div className="card">
          <h3>AIS Evidence Store</h3>

          {!evidence.length && !loading && (
            <p style={{ color: "#000000" }}>
              No AIS records available.
            </p>
          )}

          {evidence.map((e) => (
            <div
              key={e.id}
              className="card"
              style={{
                marginBottom: "12px",
              }}
            >
              <b style={{ color: "#000000" }}>
                {e.id}
              </b>

              <p style={{ color: "#000000" }}>
                Type: {e.type}
              </p>

              <p style={{ color: "#000000" }}>
                Source: {e.source}
              </p>

              <p style={{ color: "#000000" }}>
                MMSI: {e.mmsi}
              </p>

              <p style={{ color: "#000000" }}>
                Vessel Type: {e.domain}
              </p>

              <p style={{ color: "#000000" }}>
                Severity: {e.severity}
              </p>

              <p style={{ color: "#000000" }}>
                Confidence: {e.confidence}
              </p>

              <p style={{ color: "#000000" }}>
                Status: {e.status}
              </p>

              <p style={{ color: "#000000" }}>
                SOG:{" "}
                {Number.isFinite(e.sog)
                  ? e.sog
                  : "Unavailable"}
              </p>

              <p style={{ color: "#000000" }}>
                Latitude:{" "}
                {Number.isFinite(e.lat)
                  ? e.lat
                  : "Unavailable"}
              </p>

              <p style={{ color: "#000000" }}>
                Longitude:{" "}
                {Number.isFinite(e.lon)
                  ? e.lon
                  : "Unavailable"}
              </p>

              <p style={{ color: "#000000" }}>
                Message: {e.message}
              </p>

              <p style={{ color: "#000000" }}>
                Timestamp: {e.timestamp}
              </p>
            </div>
          ))}

        </div>

        {/* ================= PIE CHART ================= */}

        <div className="card">
          <h3>AIS Evidence Status Distribution</h3>

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
                {pieData.map((_, index) => (
                  <Cell
                    key={`pie-${index}`}
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
        <h3>Evidence Type Distribution</h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={barData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 55,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              height={70}
              label={{
                value: "Vessel Type",
                position: "insideBottom",
                offset: -45,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "AIS Evidence Count",
                angle: -90,
                position: "insideLeft",
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

      {/* ================= DATA SUMMARY ================= */}

      <div className="card">
        <h3>AIS Evidence Data Summary</h3>

        <p style={{ color: "#000000" }}>
          Total AIS records:{" "}
          <b>{metrics.total.toLocaleString()}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Valid AIS records:{" "}
          <b>{metrics.valid.toLocaleString()}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Invalid AIS records:{" "}
          <b>{metrics.invalid.toLocaleString()}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Moving AIS records:{" "}
          <b>{metrics.moving.toLocaleString()}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Stationary AIS records:{" "}
          <b>{metrics.stationary.toLocaleString()}</b>
        </p>

        <p style={{ color: "#000000" }}>
          Unique vessels:{" "}
          <b>{metrics.vessels.toLocaleString()}</b>
        </p>

        <p
          style={{
            color: "#4b5563",
            marginTop: "15px",
          }}
        >
          Note: AIS_file.csv does not contain a
          literal "evidence", "severity", or
          "confidence" field. Those labels above are
          dashboard-derived classifications from AIS
          telemetry state and validation quality.
        </p>
      </div>

    </div>
  );
}
