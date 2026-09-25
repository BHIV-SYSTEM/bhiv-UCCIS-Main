import React, { useEffect, useMemo, useState } from "react";

import RebuildSprint from "../../layout/RebuildSprint";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

/*
=========================================================
TASK 37 - SIGNALS MANAGEMENT
AIS INTEGRATION
=========================================================

Expected AIS columns:
MMSI, BaseDateTime, LAT, LON, SOG, VesselType

The dashboard values are derived from AIS telemetry.
AIS is maritime telemetry, so the displayed categories
are AIS-derived operational indicators, not literal
business domains such as Payments or Claims.
=========================================================
*/

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    const nextCharacter = text[i + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        value += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if (
      (character === "\n" || character === "\r") &&
      !insideQuotes
    ) {
      if (character === "\r" && nextCharacter === "\n") {
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

    value += character;
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
    header.trim().replace(/^"|"$/g, "")
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

function toNumber(value) {
  const number = Number(String(value ?? "").trim());
  return Number.isFinite(number) ? number : null;
}

function normalizeAISRows(rows) {
  return rows.map((row) => ({
    MMSI: String(row.MMSI ?? "").trim(),
    BaseDateTime: String(row.BaseDateTime ?? "").trim(),
    LAT: toNumber(row.LAT),
    LON: toNumber(row.LON),
    SOG: toNumber(row.SOG),
    VesselType: String(row.VesselType ?? "").trim(),
  }));
}

function isValidCoordinates(row) {
  return (
    Number.isFinite(row.LAT) &&
    Number.isFinite(row.LON) &&
    row.LAT >= -90 &&
    row.LAT <= 90 &&
    row.LON >= -180 &&
    row.LON <= 180
  );
}

function isValidSpeed(row) {
  return Number.isFinite(row.SOG) && row.SOG >= 0;
}

function isValidTimestamp(row) {
  return (
    Boolean(row.BaseDateTime) &&
    !Number.isNaN(
      new Date(row.BaseDateTime).getTime()
    )
  );
}

function isValidAISRecord(row) {
  return (
    Boolean(row.MMSI) &&
    isValidCoordinates(row) &&
    isValidSpeed(row) &&
    isValidTimestamp(row)
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SignalsView() {
  const [aisRows, setAisRows] = useState([]);
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

        const csvText = await response.text();
        const parsed = parseCSV(csvText);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv contains no data records."
          );
        }

        const normalized = normalizeAISRows(parsed);

        if (mounted) {
          setAisRows(normalized);
        }

        console.log(
          "SignalsView AIS records loaded:",
          normalized.length
        );
      } catch (err) {
        console.error(
          "SignalsView AIS loading error:",
          err
        );

        if (mounted) {
          setAisRows([]);
          setError(
            err.message || "Failed to load AIS data."
          );
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
     AIS STATUS DATA

     Processed = valid AIS records
     Pending = stationary records
     Failed = invalid AIS records
     Escalated = moving records requiring operational
                 monitoring
  ======================================================= */

  const statusData = useMemo(() => {
    const processed = aisRows.filter(
      isValidAISRecord
    ).length;

    const pending = aisRows.filter(
      (row) =>
        isValidSpeed(row) &&
        row.SOG === 0
    ).length;

    const failed = aisRows.filter(
      (row) => !isValidAISRecord(row)
    ).length;

    const escalated = aisRows.filter(
      (row) =>
        isValidSpeed(row) &&
        row.SOG > 0
    ).length;

    return [
      {
        name: "Processed",
        value: processed,
      },
      {
        name: "Pending",
        value: pending,
      },
      {
        name: "Failed",
        value: failed,
      },
      {
        name: "Escalated",
        value: escalated,
      },
    ];
  }, [aisRows]);

  /* =======================================================
     AIS ACTIVITY DATA

     Instead of fake business domains, group records by
     AIS VesselType.
  ======================================================= */

  const domainData = useMemo(() => {
    const counts = {};

    aisRows.forEach((row) => {
      const type =
        row.VesselType || "Unknown";

      counts[type] =
        (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([domain, count]) => ({
        domain,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [aisRows]);

  /* =======================================================
     BACKEND RESPONSE

     Uses actual recent AIS records instead of fake
     SIG/TRACE IDs.
  ======================================================= */

  const backendResponse = useMemo(() => {
    return [...aisRows]
      .filter((row) => row.MMSI)
      .sort((a, b) => {
        const aTime = new Date(
          a.BaseDateTime
        ).getTime();

        const bTime = new Date(
          b.BaseDateTime
        ).getTime();

        return (
          (Number.isNaN(bTime) ? 0 : bTime) -
          (Number.isNaN(aTime) ? 0 : aTime)
        );
      })
      .slice(0, 8)
      .map((row, index) => {
        let status = "Processed";

        if (!isValidAISRecord(row)) {
          status = "Failed";
        } else if (
          isValidSpeed(row) &&
          row.SOG === 0
        ) {
          status = "Pending";
        } else if (
          isValidSpeed(row) &&
          row.SOG > 0
        ) {
          status = "Escalated";
        }

        return {
          signalId:
            row.MMSI ||
            `AIS-${index + 1}`,
          traceId:
            row.BaseDateTime ||
            "—",
          domain:
            row.VesselType ||
            "Unknown",
          status,
        };
      });
  }, [aisRows]);

  const totalSignals = aisRows.length;

  const processedSignals = statusData.find(
    (item) => item.name === "Processed"
  )?.value || 0;

  const pendingSignals = statusData.find(
    (item) => item.name === "Pending"
  )?.value || 0;

  const failedSignals = statusData.find(
    (item) => item.name === "Failed"
  )?.value || 0;

  const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#dc2626",
    "#2563eb"
  ];

  return (
    <RebuildSprint>
      <h2>Signals Management</h2>

      {error && (
        <div
          className="card"
          style={{
            color: "#000000",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <strong>AIS Data Error:</strong>{" "}
          {error}
        </div>
      )}

      {loading && (
        <div
          className="card"
          style={{ color: "#000000" }}
        >
          Loading AIS telemetry...
        </div>
      )}

      <div className="card-grid">
        <div className="kpi-card">
          <h4>Total Signals</h4>
          <h2 style={{ color: "#ffffff" }}>
            {totalSignals.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Processed</h4>
          <h2 style={{ color: "#ffffff" }}>
            {processedSignals.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Pending</h4>
          <h2 style={{ color: "#ffffff" }}>
            {pendingSignals.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>Failed</h4>
          <h2 style={{ color: "#ffffff" }}>
            {failedSignals.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="dashboard-two-column">
        <div className="card">
          <h3>Signal Status Distribution</h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {statusData.map(
                  (entry, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={COLORS[index]}
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>AIS Activity By Vessel Type</h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={domainData}
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
                dataKey="domain"
                label={{
                  value: "Vessel Type",
                  position: "insideBottom",
                  offset: -10,
                }}
              />

              <YAxis
                allowDecimals={false}
                label={{
                  value: "AIS Signal Count",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Bar
                dataKey="count"
                name="AIS Signals"
                fill="#2563eb"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Recent AIS Telemetry</h3>

        <table className="uccis-table">
          <thead>
            <tr>
              <th>MMSI</th>
              <th>Timestamp</th>
              <th>Vessel Type</th>
              <th>SOG</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {backendResponse.length > 0 ? (
              backendResponse.map((item) => (
                <tr
                  key={`${item.signalId}-${item.traceId}`}
                >
                  <td style={{ color: "#000000" }}>
                    {item.signalId}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.traceId}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.domain}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {(() => {
                      const row =
                        aisRows.find(
                          (ais) =>
                            ais.MMSI ===
                            item.signalId &&
                            ais.BaseDateTime ===
                            item.traceId
                        );

                      return Number.isFinite(
                        row?.SOG
                      )
                        ? row.SOG.toFixed(2)
                        : "—";
                    })()}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    color: "#000000",
                    textAlign: "center",
                  }}
                >
                  {loading
                    ? "Loading AIS records..."
                    : "No AIS records available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>AIS Signal Metrics</h3>

        <p style={{ color: "#000000" }}>
          Total AIS Signals :{" "}
          <strong>
            {totalSignals.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Valid / Processed :{" "}
          <strong>
            {processedSignals.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Stationary / Pending :{" "}
          <strong>
            {pendingSignals.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Validation Failures :{" "}
          <strong>
            {failedSignals.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Moving / Escalated :{" "}
          <strong>
            {(
              totalSignals -
              pendingSignals -
              failedSignals
            ).toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Unique Vessels :{" "}
          <strong>
            {new Set(
              aisRows
                .map((row) => row.MMSI)
                .filter(Boolean)
            ).size.toLocaleString()}
          </strong>
        </p>
      </div>
    </RebuildSprint>
  );
}
