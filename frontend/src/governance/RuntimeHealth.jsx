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
  return (
    Number.isFinite(row.sog) &&
    row.sog >= 0
  );
}

function isValidTimestamp(row) {
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
    isValidCoordinates(row) &&
    isValidSpeed(row) &&
    isValidTimestamp(row)
  );
}

/* =========================================================
   RUNTIME HEALTH CLASSIFICATION
========================================================= */

function getRuntimeStatus(row) {
  if (!isValidAIS(row)) {
    return "Critical";
  }

  if (row.sog === 0) {
    return "Warning";
  }

  return "Healthy";
}

function getStatusColor(status) {
  if (status === "Healthy") {
    return "#22c55e";
  }

  if (status === "Warning") {
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

export default function RuntimeHealth() {
  const [selected, setSelected] = useState(null);
  const [aisData, setAisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS
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
          "RuntimeHealth AIS loading error:",
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
     RUNTIME COMPONENTS

     AIS does not contain application services,
     CPU, or memory fields.

     Therefore actual VesselType categories are used
     as runtime components. CPU/Memory are intentionally
     not fabricated.
  ======================================================= */

  const services = useMemo(() => {
    const serviceMap = {};

    aisData.forEach((row) => {
      const service =
        row.vesselType || "Unknown Vessel Type";

      if (!serviceMap[service]) {
        serviceMap[service] = {
          name: service,
          records: 0,
          valid: 0,
          invalid: 0,
          moving: 0,
          stationary: 0,
          totalSOG: 0,
          speedCount: 0,
          latestTimestamp: "",
        };
      }

      const item = serviceMap[service];

      item.records += 1;

      if (isValidAIS(row)) {
        item.valid += 1;

        if (row.sog > 0) {
          item.moving += 1;
        } else {
          item.stationary += 1;
        }

        if (Number.isFinite(row.sog)) {
          item.totalSOG += row.sog;
          item.speedCount += 1;
        }
      } else {
        item.invalid += 1;
      }

      if (
        row.timestamp &&
        (!item.latestTimestamp ||
          new Date(row.timestamp).getTime() >
            new Date(
              item.latestTimestamp
            ).getTime())
      ) {
        item.latestTimestamp =
          row.timestamp;
      }
    });

    return Object.values(serviceMap)
      .map((item) => {
        const validRate =
          item.records > 0
            ? (item.valid / item.records) * 100
            : 0;

        const averageSOG =
          item.speedCount > 0
            ? item.totalSOG /
              item.speedCount
            : 0;

        let status = "Healthy";

        if (item.invalid > 0) {
          const invalidRate =
            (item.invalid /
              item.records) *
            100;

          if (invalidRate > 8) {
            status = "Critical";
          } else if (invalidRate > 2) {
            status = "Warning";
          }
        }

        /*
          Stationary telemetry is treated as a runtime
          warning because it represents zero-speed
          operational activity, not because AIS labels it
          as an application warning.
        */
        if (
          status === "Healthy" &&
          item.stationary > item.moving
        ) {
          status = "Warning";
        }

        return {
          ...item,
          status,
          validRate,
          averageSOG,
        };
      })
      .sort(
        (a, b) => b.records - a.records
      )
      .slice(0, 12)
      .map((item, index) => ({
        id: `AIS-RT-${String(
          index + 1
        ).padStart(2, "0")}`,
        service: item.name,
        records: item.records,
        valid: item.valid,
        invalid: item.invalid,
        moving: item.moving,
        stationary: item.stationary,
        status: item.status,
        validRate: item.validRate,
        averageSOG: item.averageSOG,
        latestTimestamp:
          item.latestTimestamp,
        description:
          `${item.name} AIS telemetry category with ` +
          `${item.records.toLocaleString()} records.`,
      }));
  }, [aisData]);

  /* =======================================================
     KPI METRICS
  ======================================================= */

  const stats = useMemo(() => {
    const healthy = services.filter(
      (service) =>
        service.status === "Healthy"
    ).length;

    const warning = services.filter(
      (service) =>
        service.status === "Warning"
    ).length;

    const critical = services.filter(
      (service) =>
        service.status === "Critical"
    ).length;

    const totalSOG = aisData
      .filter(isValidAIS)
      .map((row) => row.sog)
      .filter(Number.isFinite);

    const averageSOG =
      totalSOG.length > 0
        ? totalSOG.reduce(
            (sum, value) => sum + value,
            0
          ) / totalSOG.length
        : 0;

    return {
      totalServices: services.length,
      healthy,
      warning,
      critical,
      averageSOG,
    };
  }, [services, aisData]);

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

     Shows actual AIS records and valid records by
     VesselType instead of fabricated CPU/Memory.
  ======================================================= */

  const barData = useMemo(
    () =>
      services.map((service) => ({
        name: service.service,
        records: service.records,
        valid: service.valid,
        moving: service.moving,
      })),
    [services]
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="page">

      {/* ================= HEADER ================= */}

      <h2>Runtime Health Dashboard</h2>

      {loading && (
        <div className="card">
          <p style={{ color: "#000000" }}>
            Loading AIS runtime health...
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
          <h3>Runtime Components</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.totalServices.toLocaleString()}
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
          <h3>Critical</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.critical.toLocaleString()}
          </h1>
        </div>

      </div>

      {/* ================= AIS RUNTIME SUMMARY ================= */}

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
              .filter(
                (row) =>
                  !isValidAIS(row)
              )
              .length.toLocaleString()}
          </h1>
        </div>

        <div className="card">
          <h3>Average SOG</h3>
          <h1 style={{ color: "#ffffff" }}>
            {stats.averageSOG.toFixed(2)}
          </h1>
        </div>

      </div>

      {/* ================= MAIN SECTION ================= */}

      <div className="grid">

        {/* ================= SERVICE LIST ================= */}

        <div className="card">
          <h3>Runtime Components</h3>

          {services.map((service) => (
            <div
              key={service.id}
              className="card"
              style={{
                cursor: "pointer",
                marginBottom: "12px",
              }}
              onClick={() =>
                setSelected(service)
              }
            >
              <div>
                <b
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {service.service}
                </b>
              </div>

              <div
                style={{
                  color: "#ffffff",
                }}
              >
                AIS Records:{" "}
                {service.records.toLocaleString()}
              </div>

              <div
                style={{
                  color: "#ffffff",
                }}
              >
                Valid:{" "}
                {service.valid.toLocaleString()}
              </div>

              <div
                style={{
                  color: "#ffffff",
                }}
              >
                Moving:{" "}
                {service.moving.toLocaleString()}
              </div>

              <div
                style={{
                  color: "#ffffff",
                }}
              >
                Stationary:{" "}
                {service.stationary.toLocaleString()}
              </div>

              <div
                style={{
                  color: getStatusColor(
                    service.status
                  ),
                  fontWeight: 700,
                }}
              >
                Status:{" "}
                {service.status}
              </div>
            </div>
          ))}

          {!services.length && !loading && (
            <p style={{ color: "#ffffff" }}>
              No AIS runtime components found.
            </p>
          )}
        </div>

        {/* ================= PIE CHART ================= */}

        <div className="card">
          <h3>Runtime Health Distribution</h3>

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
                {pieData.map(
                  (entry, index) => (
                    <Cell
                      key={`pie-${entry.name}`}
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

      </div>

      {/* ================= BAR CHART ================= */}

      <div className="card">
        <h3>AIS Runtime Activity by Vessel Type</h3>

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

            <Legend />

            <Bar
              dataKey="records"
              name="AIS Records"
              fill="#3b82f6"
            />

            <Bar
              dataKey="valid"
              name="Valid Records"
              fill="#22c55e"
            />

            <Bar
              dataKey="moving"
              name="Moving Records"
              fill="#f59e0b"
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= DETAILS PANEL ================= */}

      {selected && (
        <div className="card">

          <h3>Runtime Component Details</h3>

          <p style={{ color: "#000000" }}>
            <b>Component:</b>{" "}
            {selected.service}
          </p>

          <p style={{ color: "#000000" }}>
            <b>AIS Records:</b>{" "}
            {selected.records.toLocaleString()}
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
            <b>Moving:</b>{" "}
            {selected.moving.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Stationary:</b>{" "}
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
            <b>Status:</b>{" "}
            {selected.status}
          </p>

          <p style={{ color: "#000000" }}>
            <b>Latest Timestamp:</b>{" "}
            {selected.latestTimestamp ||
              "Unavailable"}
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

        <h3>AIS Runtime Health Summary</h3>

        <p style={{ color: "#000000" }}>
          Total AIS records:{" "}
          <b>
            {aisData.length.toLocaleString()}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Runtime components represented:{" "}
          <b>
            {services.length}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Healthy runtime components:{" "}
          <b>
            {stats.healthy}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Warning runtime components:{" "}
          <b>
            {stats.warning}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Critical runtime components:{" "}
          <b>
            {stats.critical}
          </b>
        </p>

        <p style={{ color: "#000000" }}>
          Average SOG:{" "}
          <b>
            {stats.averageSOG.toFixed(2)}
          </b>
        </p>

        <p
          style={{
            color: "#4b5563",
            marginTop: "15px",
          }}
        >
          Note: AIS_file.csv does not contain
          application CPU, memory, service latency,
          or runtime-service fields. The dashboard
          therefore uses actual VesselType categories
          as runtime components and derives health
          from AIS validation and movement state.
          CPU and memory values are not fabricated.
        </p>

      </div>

    </div>
  );
}
