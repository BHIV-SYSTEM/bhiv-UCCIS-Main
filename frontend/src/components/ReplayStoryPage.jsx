import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import ReplayStoryView from "../governance/components/replay/ReplayStoryView";

import { replayStoryAdapter } from "../governance/replay/replayStoryAdapter";
import { replayTimelineBuilder } from "../governance/replay/replayTimelineBuilder";

// --------------------------------------------------
// COLORS
// --------------------------------------------------

const COLORS = {
  background: "#f1f5f9",
  card: "#ffffff",
  heading: "#0f172a",
  text: "#334155",
  muted: "#64748b",
  border: "#e2e8f0",
  blue: "#2563eb",
  cyan: "#0891b2",
  green: "#16a34a",
  orange: "#ea580c",
  red: "#dc2626",
  purple: "#7c3aed",
  grid: "#e2e8f0",
};

const CHART_COLORS = [
  "#2563eb",
  "#0891b2",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
  "#db2777",
  "#ca8a04",
  "#475569",
];

// --------------------------------------------------
// INLINE STYLES
// No separate CSS file required
// --------------------------------------------------

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: COLORS.background,
    color: COLORS.heading,
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  header: {
    padding: "26px",
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "18px",
    marginBottom: "28px",
  },

  eyebrow: {
    color: "#67e8f9",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "clamp(25px, 4vw, 36px)",
    fontWeight: 800,
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  button: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    background: "#0284c7",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },

  section: {
    marginBottom: "30px",
    minWidth: 0,
  },

  sectionTitle: {
    color: COLORS.heading,
    fontSize: "23px",
    fontWeight: 800,
    margin: "0 0 8px",
  },

  sectionDescription: {
    color: COLORS.muted,
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "0 0 20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: "16px",
  },

  metricCard: {
    padding: "22px",
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "13px",
    boxShadow: "0 3px 10px rgba(15,23,42,0.04)",
    minWidth: 0,
  },

  metricLabel: {
    margin: 0,
    color: COLORS.muted,
    fontSize: "13px",
    fontWeight: 600,
  },

  metricValue: {
    margin: "12px 0 8px",
    color: COLORS.heading,
    fontSize: "29px",
    fontWeight: 800,
    overflowWrap: "anywhere",
  },

  metricDescription: {
    margin: 0,
    color: COLORS.muted,
    fontSize: "12px",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
    gap: "20px",
  },

  chartCard: {
    minWidth: 0,
    padding: "20px",
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "13px",
    boxShadow: "0 3px 10px rgba(15,23,42,0.04)",
  },

  chartTitle: {
    margin: "0 0 6px",
    color: COLORS.heading,
    fontSize: "17px",
    fontWeight: 750,
  },

  chartDescription: {
    margin: "0 0 18px",
    color: COLORS.muted,
    fontSize: "12px",
    lineHeight: 1.5,
  },

  chart: {
    width: "100%",
    height: "310px",
    minWidth: 0,
  },

  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "13px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(15,23,42,0.04)",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
    padding: "18px",
    borderBottom: `1px solid ${COLORS.border}`,
  },

  input: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
    minWidth: "220px",
    maxWidth: "100%",
  },

  tableWrapper: {
    width: "100%",
    maxHeight: "500px",
    overflow: "auto",
  },

  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },

  th: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    padding: "14px",
    background: "#e2e8f0",
    color: "#0f172a",
    fontWeight: 700,
    whiteSpace: "nowrap",
    borderBottom: "1px solid #cbd5e1",
  },

  td: {
    padding: "13px 14px",
    background: "#ffffff",
    color: "#000000",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
  },

  alert: {
    marginBottom: "20px",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  status: {
    padding: "18px",
    borderRadius: "10px",
    background: "#ffffff",
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
  },
};

// --------------------------------------------------
// CSV PARSER
// Supports quoted fields containing commas
// --------------------------------------------------

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
}

function normalizeHeader(header) {
  return header
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

  if (lines.length < 2) {
    return [];
  }

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

        if (value !== undefined && value !== "") {
          return value;
        }
      }

      return "";
    };

    const mmsi = getValue("MMSI", "VesselID", "ShipID", "Vessel");
    const latitude = getValue("LAT", "Latitude");
    const longitude = getValue("LON", "Longitude", "LONG");
    const speed = getValue("SOG", "SpeedOverGround", "Speed");
    const vesselType = getValue(
      "VesselType",
      "ShipType",
      "VesselCategory",
      "Type"
    );
    const timestamp = getValue(
      "Timestamp",
      "BaseDateTime",
      "DateTime",
      "Time",
      "Date"
    );

    const toNumber = (value) => {
      if (value === "") return null;

      const number = Number(value);

      return Number.isFinite(number) ? number : null;
    };

    return {
      id: `${mmsi || "vessel"}-${index}`,
      mmsi: mmsi || "N/A",
      latitude: toNumber(latitude),
      longitude: toNumber(longitude),
      sog: toNumber(speed),
      vesselType: vesselType || "Unknown",
      timestamp: timestamp || "N/A",
    };
  });
}

// --------------------------------------------------
// REPLAY EVENTS
// Original event sequence preserved
// --------------------------------------------------

const rawEvents = [
  {
    time: "10:12 AM",
    message: "Flooding alert detected near Kurla.",
  },
  {
    time: "10:14 AM",
    message: "Escalation routed to regional operations.",
  },
  {
    time: "10:18 AM",
    message: "Field drainage unit assigned.",
  },
  {
    time: "10:31 AM",
    message: "Field acknowledgement received.",
  },
  {
    time: "10:47 AM",
    message: "Water levels normalized.",
  },
  {
    time: "10:52 AM",
    message: "Incident resolved.",
  },
];

// --------------------------------------------------
// KPI CARD
// --------------------------------------------------

function MetricCard({ label, value, description }) {
  return (
    <div style={styles.metricCard}>
      <p style={styles.metricLabel}>{label}</p>
      <p style={styles.metricValue}>{value}</p>
      <p style={styles.metricDescription}>{description}</p>
    </div>
  );
}

// --------------------------------------------------
// CHART TOOLTIP
// --------------------------------------------------

const tooltipStyle = {
 backgroundColor: "#0f172a",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "13px",
  padding: "10px",
};

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

export default function ReplayStoryPage() {
  const [aisRecords, setAisRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // Existing replay adapters
  const story = useMemo(() => {
    const structured = replayStoryAdapter(rawEvents);
    return replayTimelineBuilder(structured);
  }, []);

  // Load AIS CSV
  const loadAIS = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/AIS_file.csv", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Could not load AIS_file.csv (HTTP ${response.status}).`
        );
      }

      const csvText = await response.text();
      const records = parseAISCSV(csvText);

      if (!records.length) {
        throw new Error(
          "No AIS data rows were found. Check the CSV headers and contents."
        );
      }

      setAisRecords(records);
    } catch (err) {
      setAisRecords([]);
      setError(
        err.message || "Unable to load AIS data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAIS();
  }, [loadAIS, refreshCount]);

  // Calculate metrics
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
      vesselTypes: types.size,
    };
  }, [aisRecords]);

  // Group records by vessel type
  const vesselTypeData = useMemo(() => {
    const counts = {};

    aisRecords.forEach((record) => {
      const type = record.vesselType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, records]) => ({ name, records }))
      .sort((a, b) => b.records - a.records)
      .slice(0, 10);
  }, [aisRecords]);

  // Group records by speed range
  const speedData = useMemo(() => {
    const groups = [
      { name: "0 kn", min: 0, max: 0, count: 0 },
      { name: "0–5 kn", min: 0, max: 5, count: 0 },
      { name: "5–10 kn", min: 5, max: 10, count: 0 },
      { name: "10–20 kn", min: 10, max: 20, count: 0 },
      { name: "20+ kn", min: 20, max: Infinity, count: 0 },
    ];

    aisRecords.forEach((record) => {
      const speed = record.sog;

      if (speed === null || speed < 0) return;

      if (speed === 0) {
        groups[0].count++;
      } else if (speed <= 5) {
        groups[1].count++;
      } else if (speed <= 10) {
        groups[2].count++;
      } else if (speed <= 20) {
        groups[3].count++;
      } else {
        groups[4].count++;
      }
    });

    return groups.map(({ name, count }) => ({ name, count }));
  }, [aisRecords]);

  // Filter table
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return aisRecords;

    return aisRecords.filter((record) =>
      [
        record.mmsi,
        record.vesselType,
        record.latitude,
        record.longitude,
        record.timestamp,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [aisRecords, search]);

  return (
    <main style={styles.page}>
      {/* HEADER */}

      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Operational Intelligence</p>

          <h1 style={styles.pageTitle}>
            Replay Story & AIS Intelligence
          </h1>

          <p style={styles.subtitle}>
            Incident reconstruction, vessel activity, and AIS record analysis.
          </p>
        </div>

        {/* <button
          type="button"
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
          disabled={loading}
          onClick={() => setRefreshCount((count) => count + 1)}
        >
          {loading ? "Loading AIS..." : "Refresh AIS Data"}
        </button> */}
      </header>

      {/* AIS OVERVIEW */}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>AIS Activity Overview</h2>

        <p style={styles.sectionDescription}>
          Summary metrics calculated from AIS_file.csv.
        </p>

        {error && (
          <div role="alert" style={styles.alert}>
            <strong>AIS data could not be loaded.</strong>
            <p>{error}</p>
            <p>
              Make sure your file is located at{" "}
              <code>public/AIS_file.csv</code>.
            </p>
          </div>
        )}

        {loading && (
          <div role="status" style={styles.status}>
            Loading AIS records...
          </div>
        )}

        {!loading && !error && (
          <div style={styles.grid}>
            <MetricCard
              label="Total AIS Records"
              value={metrics.records.toLocaleString()}
              description="Records read from CSV"
            />

            <MetricCard
              label="Unique Vessels"
              value={metrics.vessels.toLocaleString()}
              description="Distinct vessel identifiers"
            />

            <MetricCard
              label="Average SOG"
              value={
                metrics.averageSpeed === null
                  ? "N/A"
                  : `${metrics.averageSpeed.toFixed(2)} kn`
              }
              description="Speed over ground"
            />

            <MetricCard
              label="Vessel Types"
              value={metrics.vesselTypes.toLocaleString()}
              description="Distinct known vessel types"
            />
          </div>
        )}
      </section>

      {/* AIS CHARTS */}

      {!loading && !error && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>AIS Visual Analytics</h2>

          <p style={styles.sectionDescription}>
            Explore the vessel-type breakdown and distribution of recorded
            speeds.
          </p>

          <div style={styles.chartGrid}>
            {/* CHART 1: VESSEL TYPE */}

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                AIS Records by Vessel Type
              </h3>

              <p style={styles.chartDescription}>
                Top 10 vessel types by number of CSV records.
              </p>

              <div style={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vesselTypeData}
                    margin={{
                      top: 10,
                      right: 15,
                      left: 0,
                      bottom: 55,
                    }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={75}
                      tick={{ fill: COLORS.text, fontSize: 10 }}
                      axisLine={{ stroke: "#94a3b8" }}
                      tickLine={{ stroke: "#94a3b8" }}
                      label={{
                        value: "Vessel Type",
                        position: "insideBottom",
                        offset: -8,
                        fill: COLORS.heading,
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      width={50}
                      tick={{ fill: COLORS.text, fontSize: 11 }}
                      axisLine={{ stroke: "#94a3b8" }}
                      tickLine={{ stroke: "#94a3b8" }}
                      label={{
                        value: "AIS Record Count",
                        angle: -90,
                        position: "insideLeft",
                        offset: 5,
                        fill: COLORS.heading,
                        fontSize: 11,
                        style: { textAnchor: "middle" },
                      }}
                    />

                    <Tooltip contentStyle={tooltipStyle} 
                    labelStyle={{ color: "#ffffff", fontWeight: 700 }}
  itemStyle={{ color: "#ffffff" }}
  cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
                    />
                    <Legend verticalAlign="top" height={30} />

                    <Bar
                      dataKey="records"
                      name="AIS Records"
                      fill={COLORS.blue}
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 2: SPEED DISTRIBUTION */}

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                Vessel Speed Distribution
              </h3>

              <p style={styles.chartDescription}>
                Number of records in each speed-over-ground range.
              </p>

              <div style={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={speedData.filter((item) => item.count > 0)}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="47%"
                      outerRadius="68%"
                      innerRadius="38%"
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={{ stroke: "#94a3b8" }}
                    >
                      {speedData
                        .filter((item) => item.count > 0)
                        .map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={
                              CHART_COLORS[
                                speedData.findIndex(
                                  (item) => item.name === entry.name
                                ) % CHART_COLORS.length
                              ]
                            }
                          />
                        ))}
                    </Pie>

                    
<Tooltip
  contentStyle={{
    backgroundColor: "#0f172a",
    border: "1px solid #475569",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "13px",
    padding: "10px",
  }}
  labelStyle={{
    color: "#ffffff",
    fontWeight: 700,
  }}
  itemStyle={{
    color: "#ffffff",
  }}
  cursor={{
    fill: "rgba(148, 163, 184, 0.15)",
  }}
/>
                    <Legend verticalAlign="bottom" height={30} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHART 3: SPEED RANGE COUNTS */}

            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                Records by Speed Range
              </h3>

              <p style={styles.chartDescription}>
                Compare the number of AIS records across speed bands.
              </p>

              <div style={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={speedData}
                    margin={{
                      top: 15,
                      right: 15,
                      left: 10,
                      bottom: 35,
                    }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grid}
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fill: COLORS.text, fontSize: 10 }}
                      axisLine={{ stroke: "#94a3b8" }}
                      tickLine={{ stroke: "#94a3b8" }}
                      label={{
                        value: "Speed Range (kn)",
                        position: "insideBottom",
                        offset: -18,
                        fill: COLORS.heading,
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: COLORS.text, fontSize: 11 }}
                      axisLine={{ stroke: "#94a3b8" }}
                      tickLine={{ stroke: "#94a3b8" }}
                      label={{
                        value: "Record Count",
                        angle: -90,
                        position: "insideLeft",
                        offset: 5,
                        fill: COLORS.heading,
                        fontSize: 12,
                        style: { textAnchor: "middle" },
                      }}
                    />

                    <Tooltip contentStyle={tooltipStyle} />

                    <Bar
                      dataKey="count"
                      name="AIS Records"
                      fill={COLORS.cyan}
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EXISTING REPLAY STORY */}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Replay Story Reconstruction
        </h2>

        <p style={styles.sectionDescription}>
          The existing incident narrative, built using your replay adapters.
        </p>

        {/* <div style={styles.card}>
          <div style={{ padding: "20px" }}>
            <ReplayStoryView story={story} />
          </div>
        </div> */}
      </section>

      {/* AIS TABLE */}

      {!loading && !error && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>AIS Vessel Records</h2>

          <p style={styles.sectionDescription}>
            Search the CSV records by vessel identifier, vessel type,
            coordinates, or timestamp.
          </p>

          <div style={styles.card}>
            <div style={styles.toolbar}>
              <div>
                <h3
                  style={{
                    color: COLORS.heading,
                    margin: "0 0 6px",
                    fontSize: "17px",
                  }}
                >
                  Vessel Data Explorer
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: COLORS.muted,
                    fontSize: "12px",
                  }}
                >
                  {filteredRecords.length.toLocaleString()} matching records
                </p>
              </div>

              <input
                type="search"
                aria-label="Search AIS vessel records"
                placeholder="Search AIS records..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.tableWrapper}>
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

                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                        }}
                      >
                        {record.latitude === null
                          ? "N/A"
                          : record.latitude.toFixed(5)}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                        }}
                      >
                        {record.longitude === null
                          ? "N/A"
                          : record.longitude.toFixed(5)}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                        }}
                      >
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
                          padding: "30px",
                          textAlign: "center",
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
                  margin: 0,
                  padding: "12px 16px",
                  borderTop: `1px solid ${COLORS.border}`,
                  color: COLORS.muted,
                  fontSize: "12px",
                }}
              >
                Showing the first 500 matching records. Refine your search to
                narrow the results.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
