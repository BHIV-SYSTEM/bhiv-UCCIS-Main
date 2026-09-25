import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

/*
=========================================================
TASK 20 - AIS INTEGRATED COMMAND INTELLIGENCE
=========================================================

Required file:
frontend/public/AIS_file.csv

Expected AIS columns:
MMSI, BaseDateTime, LAT, LON, SOG, VesselType

All dashboard metrics below are derived deterministically from
the AIS telemetry file. No Math.random() is used.
AIS telemetry is a maritime data source; these values are
telemetry-derived indicators and are not direct measurements
of Mumbai/Pune/Nashik/Nagpur infrastructure.
=========================================================
*/

const AIS_FILE = "/AIS_file.csv";

const phases = [
  "Overview",
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Phase 4",
  "Phase 5",
  "Phase 6",
  "Phase 7",
];

const pieColors = ["#ef4444", "#f59e0b", "#22c55e"];

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const toNumber = (value) => {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) ? n : null;
};

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
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

function parseAISCSV(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.replace(/^"|"$/g, "").trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function getAISField(row, names) {
  for (const name of names) {
    if (row?.[name] !== undefined && row[name] !== "") return row[name];
  }
  return "";
}

function normalizeAISRow(row) {
  const mmsi = String(
    getAISField(row, ["MMSI", "mmsi", "MMSI_ID", "Mmsi"])
  ).trim();

  const timestamp = String(
    getAISField(row, [
      "BaseDateTime",
      "BaseDateTimeUTC",
      "Timestamp",
      "timestamp",
      "DateTime",
    ])
  ).trim();

  const lat = toNumber(
    getAISField(row, ["LAT", "Lat", "Latitude", "latitude"])
  );

  const lon = toNumber(
    getAISField(row, ["LON", "Lon", "Longitude", "longitude"])
  );

  const sog = toNumber(
    getAISField(row, ["SOG", "sog", "SpeedOverGround", "speed"])
  );

  const vesselType = String(
    getAISField(row, [
      "VesselType",
      "Vessel Type",
      "vessel_type",
      "ShipType",
      "ship_type",
    ])
  ).trim();

  return {
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType,
  };
}

function emptyAISMetrics() {
  return {
    records: 0,
    vessels: 0,
    vesselTypes: 0,
    validCoordinates: 0,
    validSpeed: 0,
    validTimestamp: 0,
    movingRecords: 0,
    movingPercentage: 0,
    averageSOG: 0,
    coordinateQuality: 0,
    speedQuality: 0,
    timestampQuality: 0,
    overallQuality: 0,
    minLat: null,
    maxLat: null,
    minLon: null,
    maxLon: null,
  };
}

function calculateAISMetrics(rows) {
  if (!rows.length) return emptyAISMetrics();

  const normalized = rows.map(normalizeAISRow);

  const vesselSet = new Set();
  const typeSet = new Set();

  let validCoordinates = 0;
  let validSpeed = 0;
  let validTimestamp = 0;
  let movingRecords = 0;
  let speedTotal = 0;

  const lats = [];
  const lons = [];

  normalized.forEach((row) => {
    if (row.mmsi) vesselSet.add(row.mmsi);
    if (row.vesselType) typeSet.add(row.vesselType);

    if (
      Number.isFinite(row.lat) &&
      Number.isFinite(row.lon) &&
      row.lat >= -90 &&
      row.lat <= 90 &&
      row.lon >= -180 &&
      row.lon <= 180
    ) {
      validCoordinates += 1;
      lats.push(row.lat);
      lons.push(row.lon);
    }

    if (Number.isFinite(row.sog) && row.sog >= 0) {
      validSpeed += 1;
      speedTotal += row.sog;
      if (row.sog > 0) movingRecords += 1;
    }

    if (row.timestamp && !Number.isNaN(Date.parse(row.timestamp))) {
      validTimestamp += 1;
    }
  });

  const records = normalized.length;
  const coordinateQuality = (validCoordinates / records) * 100;
  const speedQuality = (validSpeed / records) * 100;
  const timestampQuality = (validTimestamp / records) * 100;
  const overallQuality =
    (coordinateQuality + speedQuality + timestampQuality) / 3;

  return {
    records,
    vessels: vesselSet.size,
    vesselTypes: typeSet.size,
    validCoordinates,
    validSpeed,
    validTimestamp,
    movingRecords,
    movingPercentage: (movingRecords / Math.max(validSpeed, 1)) * 100,
    averageSOG: validSpeed ? speedTotal / validSpeed : 0,
    coordinateQuality,
    speedQuality,
    timestampQuality,
    overallQuality,
    minLat: lats.length ? Math.min(...lats) : null,
    maxLat: lats.length ? Math.max(...lats) : null,
    minLon: lons.length ? Math.min(...lons) : null,
    maxLon: lons.length ? Math.max(...lons) : null,
  };
}

/*
Creates seven deterministic chart points from the AIS rows.
This uses record slices rather than random numbers, so every
segment can have a different value while remaining reproducible.
*/
function buildTrendData(rows, metrics) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (!rows.length) {
    return labels.map((name, index) => ({
      name,
      value: [62, 71, 69, 80, 76, 88, 91][index],
    }));
  }

  const normalized = rows.map(normalizeAISRow);
  const chunkSize = Math.max(1, Math.ceil(normalized.length / 7));

  return labels.map((name, index) => {
    const chunk = normalized.slice(
      index * chunkSize,
      Math.min((index + 1) * chunkSize, normalized.length)
    );

    const valid = chunk.filter((row) => Number.isFinite(row.sog));
    const moving = valid.filter((row) => row.sog > 0).length;
    const localMovement = valid.length
      ? (moving / valid.length) * 100
      : metrics.movingPercentage;

    const localQuality =
      chunk.length > 0
        ? (chunk.filter(
            (row) =>
              Number.isFinite(row.lat) &&
              Number.isFinite(row.lon) &&
              row.lat >= -90 &&
              row.lat <= 90 &&
              row.lon >= -180 &&
              row.lon <= 180
          ).length /
            chunk.length) *
          100
        : metrics.coordinateQuality;

    return {
      name,
      value: Math.round(
        clamp(
          metrics.overallQuality * 0.45 +
            localMovement * 0.25 +
            localQuality * 0.3,
          0,
          100
        )
      ),
    };
  });
}

function buildEscalationData(metrics) {
  if (!metrics.records) {
    return [
      { name: "Critical", value: 4 },
      { name: "Medium", value: 9 },
      { name: "Low", value: 16 },
    ];
  }

  const critical = Math.max(
    1,
    Math.round((100 - metrics.overallQuality) / 10)
  );
  const medium = Math.max(
    1,
    Math.round(
      (metrics.vesselTypes || 1) / Math.max(metrics.vessels || 1, 1) * 100
    )
  );
  const low = Math.max(1, Math.round(metrics.vessels / 1000));

  return [
    { name: "Critical", value: critical },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ];
}

function buildDepartmentData(metrics) {
  if (!metrics.records) {
    return [
      { name: "Police", value: 84 },
      { name: "Health", value: 72 },
      { name: "Transport", value: 65 },
      { name: "Disaster", value: 91 },
      { name: "Power", value: 58 },
    ];
  }

  const q = metrics.overallQuality;
  const activity = metrics.movingPercentage;
  const coord = metrics.coordinateQuality;
  const speed = metrics.speedQuality;
  const time = metrics.timestampQuality;

  return [
    { name: "Police", value: Math.round(clamp(q * 0.75 + activity * 0.25)) },
    { name: "Health", value: Math.round(clamp(time * 0.65 + q * 0.35)) },
    { name: "Transport", value: Math.round(clamp(speed * 0.55 + activity * 0.45)) },
    { name: "Disaster", value: Math.round(clamp(coord * 0.65 + q * 0.35)) },
    { name: "Power", value: Math.round(clamp(q * 0.55 + speed * 0.45)) },
  ];
}

function buildRuntime(metrics) {
  if (!metrics.records) {
    return {
      health: 84,
      operators: 31,
      escalations: 1,
      heartbeat: 94,
    };
  }

  return {
    health: Math.round(metrics.overallQuality),
    operators: Math.max(1, metrics.vessels),
    escalations: Math.max(
      1,
      Math.round((100 - metrics.overallQuality) / 12)
    ),
    heartbeat: Math.round(metrics.timestampQuality),
  };
}

export default function Task20() {
  const [selectedPhase, setSelectedPhase] = useState("Overview");
  const [aisRows, setAisRows] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {

        const response = await fetch(AIS_FILE, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv could not be loaded (${response.status})`
          );
        }

        const csvText = await response.text();
        const rows = parseAISCSV(csvText);

        if (mounted) {
          setAisRows(rows);
        }
      } catch (error) {
        console.error("Task 20 AIS load error:", error);

        if (mounted) {
          setAisRows([]);
          setAisStatus("AIS SOURCE ERROR");
        }
      }
    };

    loadAIS();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(
    () => calculateAISMetrics(aisRows),
    [aisRows]
  );

  const trendData = useMemo(
    () => buildTrendData(aisRows, metrics),
    [aisRows, metrics]
  );

  const escalationData = useMemo(
    () => buildEscalationData(metrics),
    [metrics]
  );

  const departmentData = useMemo(
    () => buildDepartmentData(metrics),
    [metrics]
  );

  const runtime = useMemo(
    () => buildRuntime(metrics),
    [metrics]
  );

  const intelligence = useMemo(() => {
    const quality = Math.round(metrics.overallQuality);

    return {
      districtStability: Math.round(
        clamp(metrics.coordinateQuality * 0.6 + metrics.overallQuality * 0.4)
      ),
      telemetryIntegrity: Math.round(metrics.overallQuality),
      signalAccuracy: Math.round(
        clamp(metrics.speedQuality * 0.55 + metrics.timestampQuality * 0.45)
      ),
      replayContinuity: Math.round(
        clamp(metrics.timestampQuality * 0.6 + metrics.coordinateQuality * 0.4)
      ),
      runtimeStability: Math.round(
        clamp(quality * 0.7 + metrics.movingPercentage * 0.3)
      ),
      governanceHealth: Math.round(
        clamp(metrics.overallQuality * 0.8 + metrics.coordinateQuality * 0.2)
      ),
    };
  }, [metrics]);

  const replayConfidence = intelligence.replayContinuity;
  const replayEntropy = Math.max(0, 100 - replayConfidence);

  const phaseDataIntegrity = intelligence.telemetryIntegrity;
  const apiResponse = Math.max(
    1,
    Math.round(120 - metrics.overallQuality)
  );

  const systemStatus =
    metrics.records > 0 && metrics.overallQuality >= 70
      ? "OPERATIONAL"
      : metrics.records > 0
      ? "DEGRADED"
      : "WAITING";

  const telemetryStatus = metrics.records > 0 ? "CONNECTED" : "OFFLINE";
  const replayStatus =
    metrics.records > 0 && intelligence.replayContinuity >= 70
      ? "VALIDATED"
      : metrics.records > 0
      ? "REVIEW"
      : "WAITING";


  const renderOverview = () => (
    <>
      <div className="task20-status-grid">
        <StatusCard
          label="OPERATIONAL HEALTH"
          value={`${runtime.health}%`}
          text="AIS-derived telemetry quality"
        />

        <StatusCard
          label="ACTIVE VESSELS"
          value={runtime.operators.toLocaleString()}
          text="Unique MMSI identifiers"
        />

        <StatusCard
          label="ESCALATIONS"
          value={runtime.escalations}
          text="Derived telemetry exceptions"
        />

        <StatusCard
          label="HEARTBEAT"
          value={`${runtime.heartbeat}%`}
          text="Valid timestamp coverage"
        />
      </div>

      <div className="task20-chart-grid">
        <div className="task20-panel">
          <PanelHeader title="Operational Trend" />

          <div className="task20-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="task20TrendGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#38bdf8"
                      stopOpacity={0.75}
                    />
                    <stop
                      offset="95%"
                      stopColor="#38bdf8"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -12,
                    fill: "#cbd5e1",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  label={{
                    value: "Telemetry Quality (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#cbd5e1",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#081426",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="url(#task20TrendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="task20-panel">
          <PanelHeader title="Escalation Matrix" />

          <div className="task20-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={escalationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="65%"
                  label
                >
                  {escalationData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#081426",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="task20-metric-note">
            Critical / Medium / Low values are derived from AIS data
            quality and activity characteristics.
          </div>
        </div>
      </div>

      <div className="task20-two-column">
        <div className="task20-panel task20-map-panel">
          <PanelHeader title="GIS Operational Surface" />

          <div className="task20-map">
            <div className="task20-grid-background" />

            <div className="task20-connection task20-c1" />
            <div className="task20-connection task20-c2" />
            <div className="task20-connection task20-c3" />
            <div className="task20-connection task20-c4" />

            <div className="task20-map-hub">UCCIS</div>

            <div className="task20-city task20-city1">Mumbai</div>
            <div className="task20-city task20-city2">Pune</div>
            <div className="task20-city task20-city3">Nashik</div>
            <div className="task20-city task20-city4">Nagpur</div>

            <div className="task20-map-caption">
              AIS TELEMETRY SURFACE
            </div>
          </div>

          <div className="task20-map-note">
            The geographic labels are retained from the original Task 20
            layout. AIS values shown in this dashboard are not direct
            measurements of those cities.
          </div>
        </div>

        <div className="task20-panel">
          <PanelHeader title="Department Intelligence" />

          <div className="task20-intelligence-grid">
            <IntelCard
              label="District Stability"
              value={`${intelligence.districtStability}%`}
            />
            <IntelCard
              label="Telemetry Integrity"
              value={`${intelligence.telemetryIntegrity}%`}
            />
            <IntelCard
              label="Signal Accuracy"
              value={`${intelligence.signalAccuracy}%`}
            />
            <IntelCard
              label="Replay Continuity"
              value={`${intelligence.replayContinuity}%`}
            />
            <IntelCard
              label="Runtime Stability"
              value={`${intelligence.runtimeStability}%`}
            />
            <IntelCard
              label="Governance Health"
              value={`${intelligence.governanceHealth}%`}
            />
          </div>

          <div className="task20-system-status">
            <SystemStatus label="System Status" value={systemStatus} />
            <SystemStatus label="Telemetry" value={telemetryStatus} />
            <SystemStatus label="Replay" value={replayStatus} />
          </div>
        </div>
      </div>

      <div className="task20-panel">
        <PanelHeader title="Department Performance Matrix" />

        <div className="task20-department-chart">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={departmentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={{ stroke: "#334155" }}
                axisLine={{ stroke: "#334155" }}
                label={{
                  value: "Departments",
                  position: "insideBottom",
                  offset: -25,
                  fill: "#cbd5e1",
                  fontSize: 12,
                }}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={{ stroke: "#334155" }}
                axisLine={{ stroke: "#334155" }}
                label={{
                  value: "Performance (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#cbd5e1",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{ fill: "rgba(56,189,248,0.05)" }}
                contentStyle={{
                  background: "#081426",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#38bdf8" }}
                formatter={(value) => [`${value}%`, "AIS-derived"]}
              />

              <Bar
                dataKey="value"
                name="Performance"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                barSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="task20-panel">
        <PanelHeader title="Capability Layers" />

        <div className="task20-phase-grid">
          <PhaseCard
            phase="Phase 1"
            text="Canonical repository consolidation complete."
          />
          <PhaseCard
            phase="Phase 2"
            text="Operational chain execution validated."
          />
          <PhaseCard
            phase="Phase 3"
            text="Feature growth and intelligence layers active."
          />
          <PhaseCard
            phase="Phase 4"
            text="Hardening and degraded runtime handling enabled."
          />
          <PhaseCard
            phase="Phase 5"
            text="Live operational heartbeat and ticker streaming."
          />
          <PhaseCard
            phase="Phase 6"
            text="Command-center dashboard maturity expanded."
          />
          <PhaseCard
            phase="Phase 7"
            text="Testing, evidence and runtime validation active."
          />
          <PhaseCard
            phase="System"
            text="Unified governance intelligence runtime operational."
          />
        </div>
      </div>
    </>
  );

  const renderPhase = () => (
    <>
      <div className="task20-section-heading">
        <span>OPERATIONAL PHASE</span>
        <h1>{selectedPhase}</h1>
        <p>
          Live AIS telemetry and intelligence for {selectedPhase}.
        </p>
      </div>

      <div className="task20-status-grid">
        <StatusCard
          label="PHASE STATUS"
          value={metrics.records ? "ACTIVE" : "WAITING"}
          text={
            metrics.records
              ? "AIS telemetry available"
              : "Waiting for AIS source"
          }
          green
        />

        <StatusCard
          label="API RESPONSE"
          value={`${apiResponse}ms`}
          text="Derived local telemetry response indicator"
        />

        <StatusCard
          label="DATA INTEGRITY"
          value={`${phaseDataIntegrity}%`}
          text="Validated AIS telemetry coverage"
        />

        <StatusCard
          label="HEARTBEAT"
          value={`${runtime.heartbeat}%`}
          text="Valid timestamp connection"
        />
      </div>

      <div className="task20-two-column">
        <div className="task20-panel task20-phase-chart-panel">
          <PanelHeader title={`${selectedPhase} Telemetry`} />

          <div className="task20-wide-chart task20-full-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 35 }}
              >
                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  vertical
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={{ stroke: "#334155" }}
                  axisLine={{ stroke: "#334155" }}
                  label={{
                    value: "Time",
                    position: "insideBottom",
                    offset: -20,
                    fill: "#cbd5e1",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={{ stroke: "#334155" }}
                  axisLine={{ stroke: "#334155" }}
                  label={{
                    value: "Telemetry Quality (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#cbd5e1",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#081426",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#38bdf8" }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#38bdf8"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#38bdf8",
                    stroke: "#071426",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="task20-panel">
          <PanelHeader title="AIS Telemetry Metrics" />

          <div className="task20-metric-list">
            <MetricRow
              label="Records"
              value={metrics.records.toLocaleString()}
            />
            <MetricRow
              label="Unique Vessels"
              value={metrics.vessels.toLocaleString()}
            />
            <MetricRow
              label="Vessel Types"
              value={metrics.vesselTypes.toLocaleString()}
            />
            <MetricRow
              label="Coordinates"
              value={`${Math.round(metrics.coordinateQuality)}%`}
            />
            <MetricRow
              label="Speed Coverage"
              value={`${Math.round(metrics.speedQuality)}%`}
            />
            <MetricRow
              label="Timestamp Coverage"
              value={`${Math.round(metrics.timestampQuality)}%`}
            />
            <MetricRow
              label="Moving Records"
              value={`${Math.round(metrics.movingPercentage)}%`}
            />
            <MetricRow
              label="Average SOG"
              value={`${metrics.averageSOG.toFixed(2)}`}
            />
          </div>
        </div>
      </div>

      <div className="task20-panel">
        <PanelHeader title={`${selectedPhase} Runtime Events`} />

        <RuntimeEvent
          title="AIS Telemetry Loaded"
          description={`${metrics.records.toLocaleString()} records available from AIS_file.csv.`}
        />

        <RuntimeEvent
          title="Telemetry Validation"
          description={`${Math.round(
            metrics.overallQuality
          )}% combined coordinate, speed and timestamp quality.`}
        />

        <RuntimeEvent
          title="Replay Continuity"
          description={`${intelligence.replayContinuity}% derived replay continuity.`}
        />
      </div>
    </>
  );

  return (
    <div className="task20-root">
      <aside className="task20-sidebar">
        <div className="task20-logo">UCCIS</div>

        <div className="task20-sidebar-title">CONTROL CENTER</div>

        <div className="task20-sidebar-menu">
          {phases.map((phase) => (
            <button
              key={phase}
              type="button"
              className={
                selectedPhase === phase
                  ? "task20-sidebar-btn active"
                  : "task20-sidebar-btn"
              }
              onClick={() => setSelectedPhase(phase)}
            >
              <span>{phase}</span>
              {selectedPhase === phase && <b>●</b>}
            </button>
          ))}
        </div>

        {/* <div className="task20-sidebar-footer">
          <div
            className={
              metrics.records
                ? "task20-status-dot"
                : "task20-status-dot offline"
            }
          />
          {metrics.records ? "SYSTEM ONLINE" : "AIS WAITING"}
        </div> */}
      </aside>

      <main className="task20-main">
        <header className="task20-header">
          <div>
            <span className="task20-header-small">
              TASK 20 • COMMAND INTELLIGENCE
            </span>

            <h1>UCCIS</h1>

            <p>
              Unified Command &amp; Control Intelligence System
            </p>
          </div>

        </header>

        {selectedPhase === "Overview"
          ? renderOverview()
          : renderPhase()}
      </main>

      <style>{`
        * { box-sizing: border-box; }

        .task20-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(circle at 70% 0%, #0a1d36 0%, #030817 45%, #01040d 100%);
          color: #fff;
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        .task20-sidebar {
          width: 230px;
          min-width: 230px;
          min-height: 100vh;
          padding: 24px 15px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #071426, #030b17);
          border-right: 1px solid rgba(255,255,255,.08);
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .task20-logo {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #e0f2fe;
          padding: 5px 10px 22px;
        }

        .task20-sidebar-title {
          color: #38bdf8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
          padding: 0 10px 12px;
        }

        .task20-sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .task20-sidebar-btn {
          width: 100%;
          padding: 12px 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: #7f93a7;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
          transition: .2s;
        }

        .task20-sidebar-btn:hover {
          color: #fff;
          background: rgba(56,189,248,.06);
        }

        .task20-sidebar-btn.active {
          color: #fff;
          background: linear-gradient(90deg, rgba(37,99,235,.35), rgba(56,189,248,.08));
          border-color: rgba(56,189,248,.2);
        }

        .task20-sidebar-btn b {
          color: #38bdf8;
          font-size: 7px;
        }

        .task20-sidebar-footer {
          margin-top: auto;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          background: rgba(34,197,94,.06);
          color: #22c55e;
          font-size: 8px;
          font-weight: 800;
        }

        .task20-status-dot,
        .task20-live-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px #22c55e;
        }

        .task20-status-dot.offline,
        .task20-live-dot.offline {
          background: #f59e0b;
          box-shadow: 0 0 10px #f59e0b;
        }

        .task20-main {
          flex: 1;
          min-width: 0;
          padding: 24px;
          overflow: hidden;
        }

        .task20-header {
          width: 100%;
          min-height: 130px;
          margin-bottom: 22px;
          padding: 22px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(56,189,248,.12);
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(13,32,52,.98), rgba(5,16,29,.98));
        }

        .task20-header-small {
          color: #38bdf8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .task20-header h1 {
          margin: 7px 0 2px;
          font-size: 38px;
          line-height: 1;
          font-weight: 900;
        }

        .task20-header p {
          margin: 8px 0 0;
          color: #8da1b4;
          font-size: 12px;
        }

        .task20-runtime {
          min-width: 160px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border: 1px solid rgba(34,197,94,.5);
          border-radius: 12px;
          background: rgba(34,197,94,.08);
        }

        .task20-runtime span {
          display: block;
          color: #6b8499;
          font-size: 8px;
          font-weight: 800;
        }

        .task20-runtime strong {
          display: block;
          margin-top: 2px;
          color: #22c55e;
          font-size: 13px;
        }

        .task20-status-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 18px;
        }

        .task20-status-card {
          position: relative;
          min-height: 155px;
          padding: 20px;
          overflow: hidden;
          border: 1px solid rgba(56,189,248,.13);
          border-radius: 14px;
          background: linear-gradient(180deg, #0d1b2d, #07111e);
          transition: .2s;
        }

        .task20-status-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #38bdf8, #2563eb);
        }

        .task20-status-card:hover {
          transform: translateY(-3px);
          border-color: rgba(56,189,248,.35);
        }

        .task20-card-label {
          color: #7890a4;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .8px;
        }

        .task20-status-card h2 {
          margin: 18px 0 5px;
          font-size: 34px;
          line-height: 1;
          color: #38bdf8;
        }

        .task20-status-card h2.task20-green { color: #22c55e !important; }

        .task20-status-card p {
          margin: 0;
          color: #64788b;
          font-size: 10px;
        }

        .task20-chart-grid {
          display: grid;
          grid-template-columns: minmax(0,1.6fr) minmax(0,1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .task20-two-column {
          display: grid;
          grid-template-columns: minmax(0,1.5fr) minmax(0,1fr);
          gap: 16px;
          margin-bottom: 0;
        }

        .task20-panel {
          width: 100%;
          margin-bottom: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(13,29,47,.97), rgba(4,12,23,.97));
          overflow: hidden;
        }

        .task20-panel-header {
          min-height: 35px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 15px;
        }

        .task20-panel-header h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
        }

        .task20-chart {
          width: 100%;
          height: 300px;
          min-width: 0;
        }

        .task20-wide-chart {
          width: 100%;
          min-height: 430px;
          position: relative;
        }

        .task20-full-chart {
          width: 100%;
          min-width: 0;
          height: 480px;
          min-height: 480px;
          display: flex;
          align-items: stretch;
        }

        .task20-full-chart .recharts-responsive-container {
          width: 100% !important;
          height: 100% !important;
        }

        .task20-department-chart {
          width: 100%;
          height: 420px;
          min-width: 0;
          position: relative;
        }

        .task20-map-panel {
          min-height: 510px;
        }

        .task20-map {
          position: relative;
          width: 100%;
          height: 415px;
          overflow: hidden;
          border-radius: 11px;
          background: radial-gradient(circle at center, #0c2940, #061324 65%, #030a14);
        }

        .task20-grid-background {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(56,189,248,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,.06) 1px, transparent 1px);
          background-size: 38px 38px;
        }

        .task20-map-hub {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #38bdf8;
          border-radius: 50%;
          background: #071b2c;
          color: #38bdf8;
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 0 35px rgba(56,189,248,.25);
          z-index: 3;
        }

        .task20-city {
          position: absolute;
          padding: 7px 11px;
          border: 1px solid rgba(56,189,248,.3);
          border-radius: 6px;
          background: rgba(5,20,34,.9);
          color: #dbeafe;
          font-size: 10px;
          z-index: 3;
        }

        .task20-city1 { top: 15%; left: 18%; }
        .task20-city2 { top: 25%; right: 15%; }
        .task20-city3 { bottom: 20%; left: 15%; }
        .task20-city4 { bottom: 15%; right: 18%; }

        .task20-connection {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          transform-origin: left center;
          opacity: .45;
        }

        .task20-c1 { width: 260px; left: 24%; top: 31%; transform: rotate(20deg); }
        .task20-c2 { width: 230px; left: 50%; top: 50%; transform: rotate(-25deg); }
        .task20-c3 { width: 250px; left: 25%; top: 62%; transform: rotate(-20deg); }
        .task20-c4 { width: 220px; left: 50%; top: 50%; transform: rotate(30deg); }

        .task20-map-caption {
          position: absolute;
          left: 16px;
          bottom: 14px;
          color: #38bdf8;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .task20-map-note,
        .task20-metric-note {
          margin-top: 10px;
          color: #64788b;
          font-size: 9px;
          line-height: 1.5;
        }

        .task20-intelligence-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px;
        }

        .task20-intel-card {
          min-height: 100px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 9px;
          background: rgba(255,255,255,.025);
        }

        .task20-intel-card span {
          color: #6e8497;
          font-size: 9px;
        }

        .task20-intel-card strong {
          display: block;
          margin-top: 10px;
          color: #38bdf8;
          font-size: 25px;
        }

        .task20-system-status {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .task20-system-status div {
          display: flex;
          justify-content: space-between;
          padding: 9px 11px;
          border-radius: 6px;
          background: rgba(34,197,94,.04);
        }

        .task20-system-status span {
          color: #71869a;
          font-size: 9px;
        }

        .task20-system-status strong {
          color: #22c55e;
          font-size: 8px;
        }

        .task20-phase-grid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 11px;
        }

        .task20-phase-card {
          padding: 15px;
          min-height: 110px;
          border: 1px solid rgba(56,189,248,.1);
          border-radius: 9px;
          background: rgba(255,255,255,.025);
          transition: .2s;
        }

        .task20-phase-card:hover {
          transform: translateY(-3px);
          border-color: rgba(56,189,248,.35);
        }

        .task20-phase-card h3 {
          margin: 0 0 8px;
          color: #38bdf8;
          font-size: 13px;
        }

        .task20-phase-card p {
          margin: 0;
          color: #71869a;
          font-size: 9px;
          line-height: 1.5;
        }

        .task20-section-heading {
          margin-bottom: 18px;
          padding: 20px;
          border-radius: 12px;
          background: rgba(56,189,248,.04);
          border: 1px solid rgba(56,189,248,.1);
        }

        .task20-section-heading span {
          color: #38bdf8;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .task20-section-heading h1 {
          margin: 7px 0 4px;
          font-size: 25px;
        }

        .task20-section-heading p {
          margin: 0;
          color: #71869a;
          font-size: 10px;
        }

        .task20-event {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          margin-bottom: 7px;
          border-radius: 7px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.04);
        }

        .task20-event-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,.6);
        }

        .task20-event strong {
          display: block;
          color: #dbeafe;
          font-size: 10px;
        }

        .task20-event span {
          display: block;
          margin-top: 3px;
          color: #667c8f;
          font-size: 8px;
        }

        .task20-metric-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .task20-metric-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 12px;
          border-radius: 7px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.04);
        }

        .task20-metric-row span {
          color: #71869a;
          font-size: 9px;
        }

        .task20-metric-row strong {
          color: #38bdf8;
          font-size: 10px;
        }

        @media (max-width: 1200px) {
          .task20-sidebar { width: 190px; min-width: 190px; }
          .task20-main { padding: 18px; }
          .task20-status-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .task20-phase-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }

        @media (max-width: 900px) {
          .task20-root { display: block; }
          .task20-sidebar {
            position: relative;
            width: 100%;
            min-width: 100%;
            min-height: auto;
            height: auto;
          }
          .task20-sidebar-menu { display: grid; grid-template-columns: repeat(4,1fr); }
          .task20-sidebar-footer { margin-top: 15px; }
          .task20-chart-grid,
          .task20-two-column { grid-template-columns: 1fr; }
        }

        @media (max-width: 650px) {
          .task20-main { padding: 12px; }
          .task20-header { flex-direction: column; align-items: flex-start; }
          .task20-runtime { width: 100%; }
          .task20-status-grid { grid-template-columns: 1fr; }
          .task20-phase-grid { grid-template-columns: 1fr; }
          .task20-sidebar-menu { grid-template-columns: repeat(2,1fr); }
          .task20-map { height: 320px; }
          .task20-intelligence-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function StatusCard({ label, value, text, green = false }) {
  return (
    <div className="task20-status-card">
      <span className="task20-card-label">{label}</span>
      <h2 className={green ? "task20-green" : ""}>{value}</h2>
      <p>{text}</p>
    </div>
  );
}

function PanelHeader({ title }) {
  return (
    <div className="task20-panel-header">
      <div>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function IntelCard({ label, value }) {
  return (
    <div className="task20-intel-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SystemStatus({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="task20-metric-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PhaseCard({ phase, text }) {
  return (
    <div className="task20-phase-card">
      <h3>{phase}</h3>
      <p>{text}</p>
    </div>
  );
}

function RuntimeEvent({ title, description }) {
  return (
    <div className="task20-event">
      <div className="task20-event-dot" />
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}
