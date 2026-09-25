import React, { useEffect, useMemo, useState } from "react";
import RebuildSprint from "../../layout/RebuildSprint";

const AIS_FILE = "/AIS_file.csv";

/* ---------------------------------
   CSV parser
---------------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value.trim());
      value = "";

      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value.trim());

    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) =>
    String(header || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
  );

  return rows.slice(1).map((cells) => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = cells[index] ?? "";
    });

    return item;
  });
}

/* ---------------------------------
   AIS field helper
---------------------------------- */
function getField(row, names) {
  for (const name of names) {
    const key = name.toLowerCase();

    if (
      row[key] !== undefined &&
      row[key] !== null &&
      row[key] !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

/* ---------------------------------
   Normalize AIS row
---------------------------------- */
function normalizeAISRow(row, index) {
  const mmsi = getField(row, ["mmsi"]);

  const timestamp = getField(row, [
    "basedatetime",
    "base_datetime",
    "base date time",
    "timestamp",
    "datetime",
    "time"
  ]);

  const lat = Number(
    getField(row, ["lat", "latitude"])
  );

  const lon = Number(
    getField(row, ["lon", "lng", "longitude"])
  );

  const sog = Number(
    getField(row, [
      "sog",
      "speed over ground",
      "speed"
    ])
  );

  const vesselType = getField(row, [
    "vesseltype",
    "vessel type",
    "shiptype",
    "ship type",
    "type"
  ]);

  const validMMSI = String(mmsi).trim() !== "";

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  const parsedDate =
    timestamp !== "" ? new Date(timestamp) : null;

  const validTimestamp =
    parsedDate &&
    !Number.isNaN(parsedDate.getTime());

  const valid =
    validMMSI &&
    validCoordinates &&
    validSOG &&
    validTimestamp;

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(mmsi || "Unknown"),
    timestamp: timestamp || "Unknown",
    date: validTimestamp ? parsedDate : null,
    lat,
    lon,
    sog,
    vesselType: String(vesselType || "Unknown"),
    valid,
    validCoordinates,
    validSOG,
    validTimestamp: Boolean(validTimestamp)
  };
}

/* ---------------------------------
   Date formatter
---------------------------------- */
function formatDate(value) {
  if (!value || value === "Unknown") {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

/* ---------------------------------
   Runtime status from AIS
---------------------------------- */
function getAISStatus(row) {
  if (!row.valid) {
    return "Critical";
  }

  if (row.sog > 0) {
    return "Running";
  }

  return "Monitoring";
}

export default function SettingsView() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv (${response.status})`
          );
        }

        const csvText = await response.text();
        const parsed = parseCSV(csvText);

        const normalized = parsed.map(normalizeAISRow);

        if (!cancelled) {
          setAisRows(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Failed to load AIS data."
          );
          setAisRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------------
     AIS metrics
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total = aisRows.length;

    const valid = aisRows.filter(
      (row) => row.valid
    ).length;

    const invalid = aisRows.filter(
      (row) => !row.valid
    ).length;

    const moving = aisRows.filter(
      (row) =>
        row.valid &&
        row.sog > 0
    ).length;

    const stationary = aisRows.filter(
      (row) =>
        row.valid &&
        row.sog === 0
    ).length;

    const uniqueVessels = new Set(
      aisRows
        .map((row) => row.mmsi)
        .filter(
          (mmsi) =>
            mmsi &&
            mmsi !== "Unknown"
        )
    ).size;

    const uniqueVesselTypes = new Set(
      aisRows
        .map((row) => row.vesselType)
        .filter(
          (type) =>
            type &&
            type !== "Unknown"
        )
    ).size;

    const health =
      total > 0
        ? (valid / total) * 100
        : 0;

    const latest = aisRows
      .filter((row) => row.date)
      .sort(
        (a, b) =>
          b.date.getTime() -
          a.date.getTime()
      )[0];

    const averageSOG =
      valid > 0
        ? aisRows
            .filter((row) => row.valid)
            .reduce(
              (sum, row) => sum + row.sog,
              0
            ) / valid
        : 0;

    return {
      total,
      valid,
      invalid,
      moving,
      stationary,
      uniqueVessels,
      uniqueVesselTypes,
      health,
      averageSOG,
      latestTimestamp:
        latest?.timestamp || "Unknown"
    };
  }, [aisRows]);

  /* ---------------------------------
     AIS service health
  ---------------------------------- */
  const serviceData = useMemo(() => {
    const groups = {};

    aisRows.forEach((row) => {
      const service =
        row.vesselType || "Unknown";

      if (!groups[service]) {
        groups[service] = {
          service,
          total: 0,
          valid: 0,
          moving: 0,
          stationary: 0,
          invalid: 0,
          latestTimestamp: null
        };
      }

      const group = groups[service];

      group.total += 1;

      if (row.valid) {
        group.valid += 1;

        if (row.sog > 0) {
          group.moving += 1;
        } else {
          group.stationary += 1;
        }
      } else {
        group.invalid += 1;
      }

      if (row.date) {
        if (
          !group.latestTimestamp ||
          row.date > group.latestTimestamp
        ) {
          group.latestTimestamp = row.date;
        }
      }
    });

    return Object.values(groups)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((item, index) => {
        const health =
          item.total > 0
            ? Number(
                (
                  (item.valid / item.total) * 70 +
                  (item.moving / item.total) * 20 +
                  (item.stationary / item.total) * 10 -
                  (item.invalid / item.total) * 20
                ).toFixed(1)
              )
            : 0;

        return {
          service: item.service,
          status:
            item.invalid > 0
              ? "Critical"
              : item.stationary > item.moving
              ? "Monitoring"
              : "Running",
          health: Math.max(
            0,
            Math.min(100, health)
          ),
          records: item.total,
          moving: item.moving,
          stationary: item.stationary,
          invalid: item.invalid,
          latestTimestamp:
            item.latestTimestamp
        };
      });
  }, [aisRows]);

  /* ---------------------------------
     Latest AIS response rows
  ---------------------------------- */
  const systemHealth = useMemo(() => {
    return serviceData.map(
      (item, index) => ({
        service: `AIS Vessel Type ${item.service}`,
        status: item.status,
        health: `${item.health.toFixed(1)}%`,
        records: item.records,
        uptime:
          item.latestTimestamp
            ? formatDate(item.latestTimestamp)
            : "Unknown",
        runtimeId:
          `AIS-RUN-${String(index + 1).padStart(3, "0")}`
      })
    );
  }, [serviceData]);

  return (
    <RebuildSprint>

      <h2>
        System Settings & Configuration Center
      </h2>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #ef4444",
            color: "#991b1b",
            padding: "12px 14px",
            borderRadius: "6px",
            marginBottom: "16px"
          }}
        >
          {error}
        </div>
      )}

      {/* ---------------------------------
          KPI CARDS
      ---------------------------------- */}

      <div className="card-grid">

        <div className="kpi-card">
          <h4>Environment</h4>
          <h2
            style={{
              color: "#ffffff",
              fontSize: "20px"
            }}
          >
            AIS
          </h2>
        </div>

        <div className="kpi-card">
          <h4>AIS Records</h4>
          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.total.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Vessel Types</h4>
          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.uniqueVesselTypes.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Data Health</h4>
          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : `${metrics.health.toFixed(1)}%`}
          </h2>
        </div>

      </div>

      {/* ---------------------------------
          PLATFORM INFORMATION
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>AIS Platform Information</h3>

          <p style={{ color: "#000000" }}>
            <strong>Platform :</strong> UCCIS
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Data Source :</strong> AIS_file.csv
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Total AIS Records :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.total.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Unique Vessels :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.uniqueVessels.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Vessel Types :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.uniqueVesselTypes.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Status :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.valid > 0
              ? "Running"
              : "No Valid AIS Data"}
          </p>

        </div>

        <div className="card">

          <h3>AIS Runtime Configuration</h3>

          <p style={{ color: "#000000" }}>
            <strong>Valid Records :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.valid.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Invalid Records :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.invalid.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Moving Records :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.moving.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Stationary Records :</strong>{" "}
            {loading
              ? "Loading..."
              : metrics.stationary.toLocaleString()}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Average SOG :</strong>{" "}
            {loading
              ? "Loading..."
              : `${metrics.averageSOG.toFixed(2)} knots`}
          </p>

          <p style={{ color: "#000000" }}>
            <strong>Latest AIS Timestamp :</strong>{" "}
            {loading
              ? "Loading..."
              : formatDate(
                  metrics.latestTimestamp
                )}
          </p>

        </div>

      </div>

      {/* ---------------------------------
          AIS FEATURE STATUS
      ---------------------------------- */}

      <div className="card">

        <h3>AIS Feature Status</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginTop: "15px"
          }}
        >

          <div
            style={{
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff"
            }}
          >
            <strong>Telemetry Processing</strong>
            <br />
            {metrics.valid.toLocaleString()} valid records
          </div>

          <div
            style={{
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff"
            }}
          >
            <strong>Vessel Monitoring</strong>
            <br />
            {metrics.uniqueVessels.toLocaleString()} vessels
          </div>

          <div
            style={{
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff"
            }}
          >
            <strong>Movement Monitoring</strong>
            <br />
            {metrics.moving.toLocaleString()} moving records
          </div>

          <div
            style={{
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              color: "#ffffff"
            }}
          >
            <strong>Validation Monitoring</strong>
            <br />
            {metrics.invalid.toLocaleString()} invalid records
          </div>

        </div>

      </div>

      {/* ---------------------------------
          AIS SYSTEM HEALTH OVERVIEW
      ---------------------------------- */}

      <div className="card">

        <h3>AIS System Health Overview</h3>

        <div
          style={{
            width: "100%",
            overflowX: "auto"
          }}
        >

          <table
            className="uccis-table"
            style={{
              minWidth: "900px",
              width: "100%"
            }}
          >

            <thead>
              <tr>
                <th>Runtime ID</th>
                <th>Vessel Type</th>
                <th>Status</th>
                <th>Health</th>
                <th>AIS Records</th>
                <th>Latest Timestamp</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                      padding: "18px"
                    }}
                  >
                    Loading AIS system health...
                  </td>
                </tr>
              ) : systemHealth.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                      padding: "18px"
                    }}
                  >
                    No AIS service data found.
                  </td>
                </tr>
              ) : (
                systemHealth.map((item) => (
                  <tr key={item.runtimeId}>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center"
                      }}
                    >
                      {item.runtimeId}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center"
                      }}
                    >
                      {item.service.replace(
                        "AIS Vessel Type ",
                        ""
                      )}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center"
                      }}
                    >
                      {item.status}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center"
                      }}
                    >
                      {item.health}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center"
                      }}
                    >
                      {item.records.toLocaleString()}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        textAlign: "center"
                      }}
                    >
                      {item.uptime}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ---------------------------------
          AIS CONFIGURATION SUMMARY
      ---------------------------------- */}

      <div className="card">

        <h3>AIS Configuration Summary</h3>

        <div className="dashboard-two-column">

          <div>

            <p style={{ color: "#000000" }}>
              <strong>Moving AIS Records :</strong>{" "}
              {metrics.moving.toLocaleString()}
            </p>

            <p style={{ color: "#000000" }}>
              <strong>Stationary AIS Records :</strong>{" "}
              {metrics.stationary.toLocaleString()}
            </p>

            <p style={{ color: "#000000" }}>
              <strong>Invalid AIS Records :</strong>{" "}
              {metrics.invalid.toLocaleString()}
            </p>

          </div>

          <div>

            <p style={{ color: "#000000" }}>
              <strong>Average Speed Over Ground :</strong>{" "}
              {metrics.averageSOG.toFixed(2)} knots
            </p>

            <p style={{ color: "#000000" }}>
              <strong>Unique Vessels :</strong>{" "}
              {metrics.uniqueVessels.toLocaleString()}
            </p>

            <p style={{ color: "#000000" }}>
              <strong>Data Health :</strong>{" "}
              {metrics.health.toFixed(1)}%
            </p>

          </div>

        </div>

      </div>

    </RebuildSprint>
  );
}
