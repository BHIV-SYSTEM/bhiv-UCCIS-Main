import React, { useEffect, useMemo, useState } from "react";

import KPICards from "../components/dashboard/KPICards";
import RuntimeHealth from "../components/dashboard/RuntimeHealth";
import RuntimeTrendChart from "../components/Charts/RuntimeTrendChart";
import IncidentChart from "../components/Charts/IncidentChart";

const AIS_FILE = "/AIS_file.csv";

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

  if (rows.length < 2) return [];

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

function isValidCoordinate(row) {
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
  if (!row.BaseDateTime) return false;
  return !Number.isNaN(new Date(row.BaseDateTime).getTime());
}

function isValidAISRecord(row) {
  return (
    Boolean(row.MMSI) &&
    isValidCoordinate(row) &&
    isValidSpeed(row) &&
    isValidTimestamp(row)
  );
}

function DashboardView() {
  const [aisRows, setAisRows] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAIS() {
      try {
        setLoadingAIS(true);
        setAisError("");

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
            "AIS_file.csv does not contain any data rows."
          );
        }

        const normalized = normalizeAISRows(parsed);

        if (mounted) {
          setAisRows(normalized);
        }

        console.log(
          "UCCIS Executive Dashboard AIS records:",
          normalized.length
        );
      } catch (error) {
        console.error(
          "Executive Dashboard AIS loading error:",
          error
        );

        if (mounted) {
          setAisRows([]);
          setAisError(
            error.message || "Failed to load AIS data."
          );
        }
      } finally {
        if (mounted) {
          setLoadingAIS(false);
        }
      }
    }

    loadAIS();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalRecords = aisRows.length;

    const validRecords = aisRows.filter(isValidAISRecord);

    const movingRecords = aisRows.filter(
      (row) => isValidSpeed(row) && row.SOG > 0
    );

    const stationaryRecords = aisRows.filter(
      (row) => isValidSpeed(row) && row.SOG === 0
    );

    const invalidRecords = aisRows.filter(
      (row) => !isValidAISRecord(row)
    );

    const vesselSet = new Set(
      aisRows.map((row) => row.MMSI).filter(Boolean)
    );

    const validCoordinates = aisRows.filter(isValidCoordinate);

    const speedValues = aisRows
      .map((row) => row.SOG)
      .filter((value) => Number.isFinite(value));

    const averageSpeed =
      speedValues.length > 0
        ? speedValues.reduce((sum, value) => sum + value, 0) /
          speedValues.length
        : 0;

    const latestTimestamp = validRecords.length
      ? [...validRecords].sort(
          (a, b) =>
            new Date(b.BaseDateTime).getTime() -
            new Date(a.BaseDateTime).getTime()
        )[0]?.BaseDateTime
      : "";

    return {
      totalRecords,
      validRecords: validRecords.length,
      movingRecords: movingRecords.length,
      stationaryRecords: stationaryRecords.length,
      invalidRecords: invalidRecords.length,
      uniqueVessels: vesselSet.size,
      validCoordinates: validCoordinates.length,
      averageSpeed,
      latestTimestamp,
    };
  }, [aisRows]);

  const executiveSummary = useMemo(() => {
    const runtimeAvailability =
      metrics.totalRecords > 0
        ? (
            (metrics.validRecords / metrics.totalRecords) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      runtimeAvailability,
      activeTraces: metrics.uniqueVessels,
      signalsProcessed: metrics.totalRecords,
      openIncidents: metrics.stationaryRecords,
      criticalEscalations: metrics.invalidRecords,
      averageResponseTime:
        metrics.validRecords > 0
          ? Math.max(
              1,
              Math.round(
                1000 / Math.max(metrics.averageSpeed, 1)
              )
            )
          : 0,
    };
  }, [metrics]);

  const recentAlerts = useMemo(() => {
    return [...aisRows]
      .filter((row) => row.MMSI)
      .sort((a, b) => {
        const dateA = new Date(a.BaseDateTime).getTime();
        const dateB = new Date(b.BaseDateTime).getTime();

        return (
          (Number.isNaN(dateB) ? 0 : dateB) -
          (Number.isNaN(dateA) ? 0 : dateA)
        );
      })
      .slice(0, 5)
      .map((row) => {
        const valid = isValidAISRecord(row);
        const moving = isValidSpeed(row) && row.SOG > 0;

        let severity = "Medium";
        let status = "Monitoring";

        if (!valid) {
          severity = "Critical";
          status = "Validation Required";
        } else if (!moving) {
          severity = "High";
          status = "Stationary Activity";
        } else {
          severity = "Low";
          status = "Active";
        }

        return {
          id: row.MMSI,
          severity,
          status,
        };
      });
  }, [aisRows]);

  const activeOperations = useMemo(() => {
    return [...aisRows]
      .filter(
        (row) =>
          row.MMSI &&
          isValidSpeed(row) &&
          row.SOG > 0
      )
      .sort((a, b) => {
        const dateA = new Date(a.BaseDateTime).getTime();
        const dateB = new Date(b.BaseDateTime).getTime();

        return (
          (Number.isNaN(dateB) ? 0 : dateB) -
          (Number.isNaN(dateA) ? 0 : dateA)
        );
      })
      .slice(0, 5);
  }, [aisRows]);

  return (
    <div>
      <h1 className="dashboard-title">
        UCCIS Executive Dashboard
      </h1>

      <div className="panel">
        <h2>Platform Overview</h2>

        <p>
          The UCCIS Executive Dashboard is using AIS
          telemetry from <strong>AIS_file.csv</strong> for
          its operational indicators.
        </p>

        <br />

        <p>
          Signals, telemetry activity, stationary activity,
          validation exceptions and vessel identifiers are
          calculated directly from the available AIS records.
        </p>

        {loadingAIS && (
          <p style={{ color: "#2563eb" }}>
            Loading AIS telemetry...
          </p>
        )}

        {aisError && (
          <p style={{ color: "#dc2626" }}>
            {aisError}
          </p>
        )}
      </div>

      <br />

      <KPICards />

      <br />

      <div className="dashboard-grid">
        <RuntimeHealth />

        <div className="panel">
          <h2>Executive Summary</h2>

          <p>
            Runtime Availability :{" "}
            <strong style={{ color: "#000000" }}>
              {executiveSummary.runtimeAvailability}%
            </strong>
          </p>

          <p>
            Active Traces / Vessels :{" "}
            <strong style={{ color: "#000000" }}>
              {executiveSummary.activeTraces.toLocaleString()}
            </strong>
          </p>

          <p>
            Signals Processed :{" "}
            <strong style={{ color: "#000000" }}>
              {executiveSummary.signalsProcessed.toLocaleString()}
            </strong>
          </p>

          <p>
            Open Incidents / Stationary Records :{" "}
            <strong style={{ color: "#000000" }}>
              {executiveSummary.openIncidents.toLocaleString()}
            </strong>
          </p>

          <p>
            Critical Escalations / Validation Exceptions :{" "}
            <strong style={{ color: "#000000" }}>
              {executiveSummary.criticalEscalations.toLocaleString()}
            </strong>
          </p>

          <p>
            Average Response Indicator :{" "}
            <strong style={{ color: "#000000" }}>
              {executiveSummary.averageResponseTime} ms
            </strong>
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <RuntimeTrendChart />
        <IncidentChart />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Recent AIS Activity</h2>

          <table>
            <thead>
              <tr>
                <th>MMSI</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td style={{ color: "#000000" }}>
                      {alert.id}
                    </td>

                    <td style={{ color: "#000000" }}>
                      {alert.severity}
                    </td>

                    <td style={{ color: "#000000" }}>
                      {alert.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                    }}
                  >
                    {loadingAIS
                      ? "Loading AIS records..."
                      : "No AIS records available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Active AIS Operations</h2>

          <table>
            <thead>
              <tr>
                <th>MMSI</th>
                <th>Vessel Type</th>
                <th>SOG</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {activeOperations.length > 0 ? (
                activeOperations.map((operation, index) => (
                  <tr
                    key={`${operation.MMSI}-${operation.BaseDateTime}-${index}`}
                  >
                    <td style={{ color: "#000000" }}>
                      {operation.MMSI}
                    </td>

                    <td style={{ color: "#000000" }}>
                      {operation.VesselType || "Unknown"}
                    </td>

                    <td style={{ color: "#000000" }}>
                      {Number.isFinite(operation.SOG)
                        ? operation.SOG.toFixed(2)
                        : "—"}
                    </td>

                    <td style={{ color: "#000000" }}>
                      {Number.isFinite(operation.LAT)
                        ? operation.LAT.toFixed(5)
                        : "—"}
                    </td>

                    <td style={{ color: "#000000" }}>
                      {Number.isFinite(operation.LON)
                        ? operation.LON.toFixed(5)
                        : "—"}
                    </td>

                    <td style={{ color: "#000000" }}>
                      Running
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      color: "#000000",
                      textAlign: "center",
                    }}
                  >
                    {loadingAIS
                      ? "Loading AIS operations..."
                      : "No active AIS operations found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>AIS Data Summary</h2>

          <p>
            Total AIS Records :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.totalRecords.toLocaleString()}
            </strong>
          </p>

          <p>
            Valid AIS Records :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.validRecords.toLocaleString()}
            </strong>
          </p>

          <p>
            Moving Records :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.movingRecords.toLocaleString()}
            </strong>
          </p>

          <p>
            Stationary Records :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.stationaryRecords.toLocaleString()}
            </strong>
          </p>

          <p>
            Validation Exceptions :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.invalidRecords.toLocaleString()}
            </strong>
          </p>

          <p>
            Unique Vessels / MMSI :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.uniqueVessels.toLocaleString()}
            </strong>
          </p>

          <p>
            Valid Coordinates :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.validCoordinates.toLocaleString()}
            </strong>
          </p>

          <p>
            Average Speed (SOG) :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.averageSpeed.toFixed(2)}
            </strong>
          </p>

          <p>
            Latest AIS Timestamp :{" "}
            <strong style={{ color: "#000000" }}>
              {metrics.latestTimestamp || "—"}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
