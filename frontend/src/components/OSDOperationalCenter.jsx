import React, { useCallback, useEffect, useMemo, useState } from "react";

import { osdAdapter } from "../governance/adapters/osdAdapter";

import AssignmentQueuePanel from "../components/governance/AssignmentQueuePanel";
import ExecutionDependencyPanel from "../components/governance/ExecutionDependencyPanel";
import EscalationRoutingPanel from "../components/governance/EscalationRoutingPanel";
import OperationalDelayPanel from "../components/governance/OperationalDelayPanel";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f1f5f9",
    color: "#0f172a",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "24px",
    borderRadius: "14px",
    marginBottom: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "clamp(25px, 4vw, 36px)",
    fontWeight: 700,
  },
  subtitle: {
    color: "#cbd5e1",
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.6,
  },
  button: {
    padding: "12px 18px",
    background: "#0284c7",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: 700,
    margin: "0 0 8px",
  },
  description: {
    color: "#475569",
    fontSize: "14px",
    marginBottom: "20px",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  metric: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
    minWidth: 0,
  },
  metricTitle: {
    color: "#475569",
    fontSize: "14px",
    margin: 0,
  },
  metricValue: {
    color: "#0f172a",
    fontSize: "28px",
    fontWeight: 700,
    margin: "12px 0",
    overflowWrap: "anywhere",
  },
  metricDescription: {
    color: "#64748b",
    fontSize: "12px",
    margin: 0,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
  },
  toolbar: {
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
    borderBottom: "1px solid #e2e8f0",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    minWidth: "200px",
    maxWidth: "100%",
  },
  tableContainer: {
    maxHeight: "520px",
    overflow: "auto",
    width: "100%",
  },
  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  th: {
    padding: "14px",
    background: "#e2e8f0",
    color: "#0f172a",
    fontWeight: 700,
    borderBottom: "1px solid #cbd5e1",
    position: "sticky",
    top: 0,
    zIndex: 1,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 14px",
    color: "#000000",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  error: {
    padding: "16px",
    marginBottom: "18px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "10px",
  },
  loading: {
    padding: "24px",
    background: "#ffffff",
    color: "#334155",
    borderRadius: "10px",
  },
  governanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
    gap: "24px",
  },
};

function parseCSVLine(line) {
  const values = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value.trim());
  return values;
}

function normalizeHeader(value) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseAISCSV(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(normalizeHeader);

  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, columnIndex) => {
      row[header] = values[columnIndex] ?? "";
    });

    const getValue = (...names) => {
      for (const name of names) {
        const value = row[normalizeHeader(name)];

        if (value !== undefined && value !== "") return value;
      }

      return "";
    };

    const mmsi = getValue("MMSI", "VesselID", "ShipID", "Vessel");
    const lat = getValue("LAT", "Latitude");
    const lon = getValue("LON", "Longitude", "LONG");
    const sog = getValue("SOG", "SpeedOverGround", "Speed");
    const type = getValue("VesselType", "ShipType", "Type");
    const timestamp = getValue(
      "Timestamp",
      "BaseDateTime",
      "DateTime",
      "Time",
      "Date"
    );

    const numberOrNull = (value) => {
      if (value === "") return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    };

    return {
      id: `${mmsi || "vessel"}-${index}`,
      mmsi: mmsi || "N/A",
      latitude: numberOrNull(lat),
      longitude: numberOrNull(lon),
      sog: numberOrNull(sog),
      vesselType: type || "Unknown",
      timestamp: timestamp || "N/A",
    };
  });
}

function MetricCard({ title, value, description }) {
  return (
    <div style={styles.metric}>
      <p style={styles.metricTitle}>{title}</p>
      <p style={styles.metricValue}>{value}</p>
      <p style={styles.metricDescription}>{description}</p>
    </div>
  );
}

export default function OSDOperationalCenter() {
  const data = useMemo(() => osdAdapter(), []);

  const [aisRecords, setAisRecords] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  const loadAISData = useCallback(async () => {
    setLoadingAIS(true);
    setAisError("");

    try {
      const response = await fetch("/AIS_file.csv", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load AIS_file.csv (HTTP ${response.status}).`
        );
      }

      const csvText = await response.text();
      const records = parseAISCSV(csvText);

      if (records.length === 0) {
        throw new Error(
          "No AIS data rows found. Check the CSV file and its headers."
        );
      }

      setAisRecords(records);
    } catch (error) {
      setAisRecords([]);
      setAisError(
        error.message || "Unable to load AIS data."
      );
    } finally {
      setLoadingAIS(false);
    }
  }, []);

  useEffect(() => {
    loadAISData();
  }, [loadAISData, refreshCount]);

  const metrics = useMemo(() => {
    const vessels = new Set(
      aisRecords
        .filter((record) => record.mmsi !== "N/A")
        .map((record) => record.mmsi)
    );

    const speeds = aisRecords
      .map((record) => record.sog)
      .filter((speed) => speed !== null && speed >= 0);

    const types = new Set(
      aisRecords
        .map((record) => record.vesselType)
        .filter((type) => type !== "Unknown")
    );

    return {
      records: aisRecords.length,
      vessels: vessels.size,
      averageSpeed: speeds.length
        ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length
        : null,
      types: types.size,
    };
  }, [aisRecords]);

  const availableTypes = useMemo(
    () => [...new Set(aisRecords.map((record) => record.vesselType))].sort(),
    [aisRecords]
  );

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return aisRecords.filter((record) => {
      const matchesQuery =
        !query ||
        record.mmsi.toLowerCase().includes(query) ||
        record.vesselType.toLowerCase().includes(query) ||
        String(record.latitude ?? "").includes(query) ||
        String(record.longitude ?? "").includes(query);

      const matchesType =
        selectedType === "ALL" || record.vesselType === selectedType;

      return matchesQuery && matchesType;
    });
  }, [aisRecords, searchTerm, selectedType]);

  return (
    <main style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>OSD Operational Center</h1>
          <p style={styles.subtitle}>
            AIS activity, assignments, execution dependencies, escalation
            routing, and operational delays.
          </p>
        </div>

        {/* <button
          type="button"
          style={{
            ...styles.button,
            opacity: loadingAIS ? 0.6 : 1,
          }}
          disabled={loadingAIS}
          onClick={() => setRefreshCount((count) => count + 1)}
        >
          {loadingAIS ? "Loading AIS..." : "Refresh AIS Data"}
        </button> */}
      </header>

      {/* AIS OVERVIEW */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>AIS Activity Overview</h2>
        {/* <p style={styles.description}>
          Vessel information loaded from AIS_file.csv.
        </p> */}

        {aisError && (
          <div role="alert" style={styles.error}>
            <strong>AIS data could not be loaded.</strong>
            <p>{aisError}</p>
            <p>
              Place the file at <code>public/AIS_file.csv</code> in your
              React project.
            </p>
          </div>
        )}

        {loadingAIS && (
          <div role="status" style={styles.loading}>
            Loading AIS records...
          </div>
        )}

        {!loadingAIS && !aisError && (
          <>
            <div style={styles.metrics}>
              <MetricCard
                title="Total AIS Records"
                value={metrics.records.toLocaleString()}
                description="Rows loaded from the CSV"
              />

              <MetricCard
                title="Unique Vessels"
                value={metrics.vessels.toLocaleString()}
                description="Distinct vessel identifiers"
              />

              <MetricCard
                title="Average SOG"
                value={
                  metrics.averageSpeed === null
                    ? "N/A"
                    : `${metrics.averageSpeed.toFixed(2)} kn`
                }
                description="Average speed over ground"
              />

              <MetricCard
                title="Vessel Types"
                value={metrics.types.toLocaleString()}
                description="Distinct known vessel types"
              />
            </div>

            {/* AIS TABLE */}
            <div style={styles.card}>
              <div style={styles.toolbar}>
                <div>
                  <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>
                    AIS Vessel Records
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                    Showing {filteredRecords.length.toLocaleString()} of{" "}
                    {aisRecords.length.toLocaleString()} records
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <input
                    type="search"
                    aria-label="Search AIS records"
                    placeholder="Search vessel or location"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    style={styles.input}
                  />

                  <select
                    aria-label="Filter vessel type"
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                    style={styles.input}
                  >
                    <option value="ALL">All vessel types</option>
                    {availableTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {[
                        "#",
                        "MMSI / Vessel ID",
                        "Vessel Type",
                        "Latitude",
                        "Longitude",
                        "SOG (kn)",
                        "Timestamp",
                      ].map((heading) => (
                        <th key={heading} style={styles.th}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.slice(0, 500).map((record, index) => (
                      <tr key={record.id}>
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>{record.mmsi}</td>
                        <td style={styles.td}>{record.vesselType}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {record.latitude === null
                            ? "N/A"
                            : record.latitude.toFixed(5)}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {record.longitude === null
                            ? "N/A"
                            : record.longitude.toFixed(5)}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {record.sog === null
                            ? "N/A"
                            : record.sog.toFixed(2)}
                        </td>
                        <td style={styles.td}>{record.timestamp}</td>
                      </tr>
                    ))}

                    {filteredRecords.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            ...styles.td,
                            textAlign: "center",
                            padding: "30px",
                          }}
                        >
                          No AIS records match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredRecords.length > 500 && (
                <p
                  style={{
                    padding: "12px 16px",
                    margin: 0,
                    color: "#475569",
                    fontSize: "12px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  Showing the first 500 matching records. Use search or the
                  vessel-type filter to narrow the results.
                </p>
              )}
            </div>
          </>
        )}
      </section>

      {/* EXISTING GOVERNANCE PANELS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Operational Governance</h2>
        <p style={styles.description}>
          Assignment queues, execution dependencies, escalation routes, and
          operational delays.
        </p>

        <div style={styles.governanceGrid}>
          <AssignmentQueuePanel queues={data.assignmentQueues} />

          <ExecutionDependencyPanel
            dependencies={data.executionDependencies}
          />

          <EscalationRoutingPanel routes={data.escalationRouting} />

          <OperationalDelayPanel delays={data.operationalDelays} />
        </div>
      </section>
    </main>
  );
}
