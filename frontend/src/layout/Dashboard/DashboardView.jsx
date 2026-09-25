import React, { useEffect, useMemo, useState } from "react";

import RebuildSprint from "../../layout/RebuildSprint";
import KpiCard from "../../components/Cards/KpiCard";
import RuntimeHealthChart from "../../components/Charts/RuntimeHealthChart";
import IncidentTrendChartTask37 from "../../components/Charts/IncidentTrendChartTask37";

const AIS_FILE = "/AIS_file.csv";

/*
=========================================================
TASK 37 - UCCIS EXECUTIVE DASHBOARD
AIS INTEGRATION
=========================================================

Expected AIS columns:
MMSI, BaseDateTime, LAT, LON, SOG, VesselType

All dashboard values below are derived from AIS telemetry.
AIS is maritime telemetry, so these are AIS-derived
operational indicators and are not direct civic incident
measurements.
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

function validCoordinates(row) {
  return (
    Number.isFinite(row.LAT) &&
    Number.isFinite(row.LON) &&
    row.LAT >= -90 &&
    row.LAT <= 90 &&
    row.LON >= -180 &&
    row.LON <= 180
  );
}

function validSpeed(row) {
  return Number.isFinite(row.SOG) && row.SOG >= 0;
}

function validTimestamp(row) {
  return (
    Boolean(row.BaseDateTime) &&
    !Number.isNaN(
      new Date(row.BaseDateTime).getTime()
    )
  );
}

function validAISRecord(row) {
  return (
    Boolean(row.MMSI) &&
    validCoordinates(row) &&
    validSpeed(row) &&
    validTimestamp(row)
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardView() {
  const [aisRows, setAisRows] = useState([]);
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
          "Task 37 AIS records loaded:",
          normalized.length
        );
      } catch (err) {
        console.error(
          "Task 37 AIS loading error:",
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
     AIS METRICS
  ======================================================= */

  const metrics = useMemo(() => {
    const total = aisRows.length;

    const valid = aisRows.filter(validAISRecord);

    const moving = aisRows.filter(
      (row) =>
        validSpeed(row) &&
        row.SOG > 0
    );

    const stationary = aisRows.filter(
      (row) =>
        validSpeed(row) &&
        row.SOG === 0
    );

    const invalid = aisRows.filter(
      (row) => !validAISRecord(row)
    );

    const vessels = new Set(
      aisRows
        .map((row) => row.MMSI)
        .filter(Boolean)
    );

    const speedValues = aisRows
      .map((row) => row.SOG)
      .filter((value) => Number.isFinite(value));

    const averageSOG =
      speedValues.length > 0
        ? speedValues.reduce(
            (sum, value) => sum + value,
            0
          ) / speedValues.length
        : 0;

    const latest = [...valid]
      .sort(
        (a, b) =>
          new Date(b.BaseDateTime).getTime() -
          new Date(a.BaseDateTime).getTime()
      )[0];

    return {
      total,
      valid: valid.length,
      moving: moving.length,
      stationary: stationary.length,
      invalid: invalid.length,
      vessels: vessels.size,
      averageSOG,
      latestTimestamp:
        latest?.BaseDateTime || "",
    };
  }, [aisRows]);

  /* =======================================================
     KPI VALUES

     Runtime Health:
     AIS data quality percentage.

     Open Operations:
     Moving AIS records.

     Resolved Today:
     Valid AIS records that are stationary.

     Critical Incidents:
     AIS validation exceptions.
  ======================================================= */

  const kpis = useMemo(() => {
    const runtimeHealth =
      metrics.total > 0
        ? Math.round(
            (metrics.valid / metrics.total) * 100
          )
        : 0;

    return {
      runtimeHealth,
      openOperations: metrics.moving,
      resolvedToday: metrics.stationary,
      criticalIncidents: metrics.invalid,
    };
  }, [metrics]);

  /* =======================================================
     RECENT AIS ACTIVITY
  ======================================================= */

  const incidents = useMemo(() => {
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
      .slice(0, 5)
      .map((row) => {
        const valid = validAISRecord(row);
        const moving =
          validSpeed(row) && row.SOG > 0;

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
          trace: row.BaseDateTime || "—",
          severity,
          status,
        };
      });
  }, [aisRows]);

  /* =======================================================
     AIS ESCALATIONS

     Escalation priority is a dashboard classification
     derived from AIS activity/validation state.
  ======================================================= */

  const escalations = useMemo(() => {
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
      .filter((row) => {
        return (
          !validAISRecord(row) ||
          (validSpeed(row) && row.SOG === 0)
        );
      })
      .slice(0, 5)
      .map((row) => {
        const invalid = !validAISRecord(row);
        const priority = invalid ? "P1" : "P2";

        return {
          id: row.MMSI,
          priority,
          assigned: invalid
            ? "Telemetry Validation"
            : "Operations Monitoring",
          status: invalid
            ? "Open"
            : "Monitoring",
        };
      });
  }, [aisRows]);

  return (
    <RebuildSprint>
      <h2>UCCIS Executive Dashboard</h2>

      {error && (
        <div
          className="card"
          style={{
            color: "#000000",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <strong>AIS Data Error:</strong> {error}
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
        <KpiCard
          title="Runtime Health"
          value={`${kpis.runtimeHealth}%`}
          color="#22c55e"
          valueColor="#000000"
        />

        <KpiCard
          title="Open Operations"
          value={kpis.openOperations.toLocaleString()}
          color="#2563eb"
          valueColor="#000000"
        />

        <KpiCard
          title="Resolved Today"
          value={kpis.resolvedToday.toLocaleString()}
          color="#f59e0b"
          valueColor="#000000"
        />

        <KpiCard
          title="Critical Incidents"
          value={kpis.criticalIncidents.toLocaleString()}
          color="#dc2626"
          valueColor="#000000"
        />
      </div>

      <div className="dashboard-two-column">
        <RuntimeHealthChart />
        <IncidentTrendChartTask37 />
      </div>

      <div className="card">
        <h3>AIS Runtime Summary</h3>

        <p style={{ color: "#000000" }}>
          Total AIS Records :{" "}
          <strong>
            {metrics.total.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Valid AIS Records :{" "}
          <strong>
            {metrics.valid.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Moving Records :{" "}
          <strong>
            {metrics.moving.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Stationary Records :{" "}
          <strong>
            {metrics.stationary.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Validation Exceptions :{" "}
          <strong>
            {metrics.invalid.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Unique Vessels :{" "}
          <strong>
            {metrics.vessels.toLocaleString()}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Average SOG :{" "}
          <strong>
            {metrics.averageSOG.toFixed(2)}
          </strong>
        </p>

        <p style={{ color: "#000000" }}>
          Latest AIS Timestamp :{" "}
          <strong>
            {metrics.latestTimestamp || "—"}
          </strong>
        </p>
      </div>

      <div className="card">
        <h3>Recent AIS Activity</h3>

        <table
          className="uccis-table"
          style={{ color: "#000000" }}
        >
          <thead>
            <tr>
              <th>MMSI</th>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {incidents.length > 0 ? (
              incidents.map((item) => (
                <tr key={`${item.id}-${item.trace}`}>
                  <td style={{ color: "#000000" }}>
                    {item.id}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.trace}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.severity}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
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
        <h3>Recent AIS Escalations</h3>

        <table
          className="uccis-table"
          style={{ color: "#000000" }}
        >
          <thead>
            <tr>
              <th>MMSI</th>
              <th>Priority</th>
              <th>Assigned</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {escalations.length > 0 ? (
              escalations.map((item) => (
                <tr key={`${item.id}-${item.priority}`}>
                  <td style={{ color: "#000000" }}>
                    {item.id}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.priority}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.assigned}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    color: "#000000",
                    textAlign: "center",
                  }}
                >
                  {loading
                    ? "Loading AIS escalations..."
                    : "No AIS escalations found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </RebuildSprint>
  );
}
