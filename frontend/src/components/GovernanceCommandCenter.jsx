import React, { useEffect, useMemo, useState } from "react";
import "../dashboard.css";

/* =========================================================
   AIS CONFIGURATION
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

/* =========================================================
   CSV PARSER
   Handles quoted CSV values.
========================================================= */

function parseCSV(text) {
  const rows = [];

  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    const nextCharacter = text[i + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        value += '"';
        i++;
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
        i++;
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
    const object = {};

    headers.forEach((header, index) => {
      object[header] = String(values[index] ?? "")
        .trim()
        .replace(/^"|"$/g, "");
    });

    return object;
  });
}

/* =========================================================
   FIELD READER
========================================================= */

function getAISField(row, names) {
  for (const name of names) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {
      return String(row[name]).trim();
    }
  }

  return "";
}

/* =========================================================
   NORMALIZE AIS ROW
========================================================= */

function normalizeAISRow(row) {
  const mmsi = getAISField(row, [
    "MMSI",
    "mmsi",
    "Mmsi",
  ]);

  const timestamp = getAISField(row, [
    "BaseDateTime",
    "baseDateTime",
    "Timestamp",
    "timestamp",
    "DateTime",
  ]);

  const lat = toNumber(
    getAISField(row, [
      "LAT",
      "Lat",
      "Latitude",
      "latitude",
    ])
  );

  const lon = toNumber(
    getAISField(row, [
      "LON",
      "Lon",
      "Longitude",
      "longitude",
    ])
  );

  const sog = toNumber(
    getAISField(row, [
      "SOG",
      "sog",
      "Speed",
      "speed",
    ])
  );

  const vesselType = getAISField(row, [
    "VesselType",
    "Vessel Type",
    "vessel_type",
    "vesselType",
  ]);

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSpeed =
    Number.isFinite(sog) && sog >= 0;

  const validTimestamp =
    Boolean(timestamp) &&
    !Number.isNaN(
      new Date(timestamp).getTime()
    );

  return {
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType,
    validCoordinates,
    validSpeed,
    validTimestamp,
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GovernanceCommandCenter() {
  const [aisData, setAisData] = useState([]);
  const [loadingAIS, setLoadingAIS] = useState(true);
  const [aisError, setAisError] = useState("");

  /* =======================================================
     LOAD AIS DATA
  ======================================================= */

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
            `AIS_file.csv request failed: ${response.status}`
          );
        }

        const csvText = await response.text();

        const parsed = parseCSV(csvText);

        const normalized = parsed
          .map(normalizeAISRow)
          .filter((row) => row.mmsi);

        if (!normalized.length) {
          throw new Error(
            "AIS_file.csv contains no usable records."
          );
        }

        if (mounted) {
          setAisData(normalized);
        }
      } catch (error) {
        console.error(
          "GovernanceCommandCenter AIS error:",
          error
        );

        if (mounted) {
          setAisError(
            error.message ||
              "Unable to load AIS_file.csv"
          );

          setAisData([]);
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

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const metrics = useMemo(() => {
    if (!aisData.length) {
      return {
        records: 0,
        vessels: 0,
        vesselTypes: 0,
        validCoordinates: 0,
        validSpeed: 0,
        validTimestamp: 0,
        averageSOG: 0,
        movingRecords: 0,
        movingPercentage: 0,
      };
    }

    const vessels = new Set();
    const vesselTypes = new Set();

    let validCoordinates = 0;
    let validSpeed = 0;
    let validTimestamp = 0;

    let movingRecords = 0;

    let totalSOG = 0;
    let sogCount = 0;

    aisData.forEach((row) => {
      if (row.mmsi) {
        vessels.add(row.mmsi);
      }

      if (row.vesselType) {
        vesselTypes.add(row.vesselType);
      }

      if (row.validCoordinates) {
        validCoordinates++;
      }

      if (row.validSpeed) {
        validSpeed++;

        totalSOG += row.sog;
        sogCount++;

        if (row.sog > 0.5) {
          movingRecords++;
        }
      }

      if (row.validTimestamp) {
        validTimestamp++;
      }
    });

    return {
      records: aisData.length,

      vessels: vessels.size,

      vesselTypes: vesselTypes.size,

      validCoordinates,

      validSpeed,

      validTimestamp,

      averageSOG:
        sogCount > 0
          ? totalSOG / sogCount
          : 0,

      movingRecords,

      movingPercentage:
        aisData.length > 0
          ? (movingRecords / aisData.length) * 100
          : 0,
    };
  }, [aisData]);

  /* =======================================================
     TELEMETRY QUALITY
  ======================================================= */

  const telemetryQuality = useMemo(() => {
    if (!metrics.records) {
      return {
        coordinateQuality: 0,
        speedQuality: 0,
        timestampQuality: 0,
        overallQuality: 0,
      };
    }

    const coordinateQuality = clamp(
      (metrics.validCoordinates /
        metrics.records) *
        100
    );

    const speedQuality = clamp(
      (metrics.validSpeed /
        metrics.records) *
        100
    );

    const timestampQuality = clamp(
      (metrics.validTimestamp /
        metrics.records) *
        100
    );

    const overallQuality = clamp(
      coordinateQuality * 0.4 +
        speedQuality * 0.25 +
        timestampQuality * 0.35
    );

    return {
      coordinateQuality,
      speedQuality,
      timestampQuality,
      overallQuality,
    };
  }, [metrics]);

  /* =======================================================
     OPERATIONAL INDICATORS
  ======================================================= */

  const operational = useMemo(() => {
    if (!metrics.records) {
      return {
        infrastructureHealth: 92,
        criticalAlerts: 12,
        executionVelocity: 1.8,
        pendingEscalations: 7,
        projectDelays: 5,
        departmentEfficiency: 78,
      };
    }

    const quality =
      telemetryQuality.overallQuality;

    const activity =
      metrics.movingPercentage;

    const vesselDiversity = clamp(
      (metrics.vessels / 7000) * 100
    );

    const typeDiversity = clamp(
      (metrics.vesselTypes / 60) * 100
    );

    /*
      Infrastructure Health
      ---------------------
      Derived from telemetry completeness
      and data consistency.
    */

    const infrastructureHealth = clamp(
      quality * 0.70 +
        vesselDiversity * 0.15 +
        typeDiversity * 0.15
    );

    /*
      Critical Alerts
      ---------------
      Derived from telemetry variation and
      activity pressure.
    */

    const criticalAlerts = Math.max(
      1,
      Math.min(
        20,
        Math.round(
          4 +
            (100 - quality) / 9 +
            activity / 18 +
            metrics.vesselTypes / 20
        )
      )
    );

    /*
      Execution Velocity
      ------------------
      Represents relative activity throughput.
    */

    const executionVelocity = Number(
      (
        0.8 +
        activity / 100 +
        typeDiversity / 150
      ).toFixed(1)
    );

    /*
      Pending Escalations
      -------------------
      Derived from data quality and activity.
    */

    const pendingEscalations = Math.max(
      1,
      Math.min(
        12,
        Math.round(
          2 +
            (100 - quality) / 13 +
            activity / 35
        )
      )
    );

    /*
      Project Delays
      --------------
      Derived indicator based on
      telemetry disruption.
    */

    const projectDelays = Math.max(
      1,
      Math.min(
        10,
        Math.round(
          1 +
            (100 - quality) / 15 +
            (100 - typeDiversity) / 35
        )
      )
    );

    /*
      Department Efficiency
      ---------------------
      Derived from data consistency
      and vessel diversity.
    */

    const departmentEfficiency = clamp(
      quality * 0.60 +
        vesselDiversity * 0.25 +
        typeDiversity * 0.15
    );

    return {
      infrastructureHealth,
      criticalAlerts,
      executionVelocity,
      pendingEscalations,
      projectDelays,
      departmentEfficiency,
    };
  }, [metrics, telemetryQuality]);

  /* =======================================================
     HEATMAP VALUES
  ======================================================= */

  const heatmap = useMemo(() => {
    if (!metrics.records) {
      return [
        {
          name: "Infrastructure",
          value: 92,
          className: "critical",
        },
        {
          name: "Transport",
          value: 81,
          className: "high",
        },
        {
          name: "Energy",
          value: 64,
          className: "medium",
        },
        {
          name: "Water",
          value: 58,
          className: "medium",
        },
        {
          name: "Healthcare",
          value: 34,
          className: "low",
        },
        {
          name: "Education",
          value: 28,
          className: "low",
        },
      ];
    }

    const quality =
      telemetryQuality.overallQuality;

    const activity =
      metrics.movingPercentage;

    const vesselDiversity = clamp(
      (metrics.vessels / 7000) * 100
    );

    const typeDiversity = clamp(
      (metrics.vesselTypes / 60) * 100
    );

    /*
      Six separate deterministic indicators.
      Small offsets intentionally prevent every
      category from receiving the same number.
    */

    const infrastructure = clamp(
      100 -
        quality * 0.35 +
        activity * 0.22 +
        (100 - vesselDiversity) * 0.12
    );

    const transport = clamp(
      35 +
        activity * 0.38 +
        (100 - quality) * 0.20 +
        typeDiversity * 0.12
    );

    const energy = clamp(
      30 +
        (100 - quality) * 0.30 +
        vesselDiversity * 0.25 +
        metrics.averageSOG * 1.8
    );

    const water = clamp(
      25 +
        (100 - telemetryQuality.timestampQuality) *
          0.32 +
        typeDiversity * 0.30
    );

    const healthcare = clamp(
      20 +
        quality * 0.18 +
        vesselDiversity * 0.16 +
        (100 - activity) * 0.10
    );

    const education = clamp(
      15 +
        quality * 0.14 +
        typeDiversity * 0.15 +
        (100 - activity) * 0.08
    );

    const makeHeatCell = (name, value) => {
      let className = "low";

      if (value >= 80) {
        className = "critical";
      } else if (value >= 65) {
        className = "high";
      } else if (value >= 45) {
        className = "medium";
      }

      return {
        name,
        value,
        className,
      };
    };

    return [
      makeHeatCell(
        "Infrastructure",
        infrastructure
      ),
      makeHeatCell(
        "Transport",
        transport
      ),
      makeHeatCell(
        "Energy",
        energy
      ),
      makeHeatCell(
        "Water",
        water
      ),
      makeHeatCell(
        "Healthcare",
        healthcare
      ),
      makeHeatCell(
        "Education",
        education
      ),
    ];
  }, [metrics, telemetryQuality]);

  /* =======================================================
     OPERATIONAL STATUS
  ======================================================= */

  const systemLoadStatus =
    operational.infrastructureHealth >= 80
      ? "NORMAL"
      : operational.infrastructureHealth >= 60
      ? "ELEVATED"
      : "HIGH";

  const telemetryStatus =
    telemetryQuality.overallQuality >= 85
      ? "STABLE"
      : telemetryQuality.overallQuality >= 65
      ? "DEGRADED"
      : "UNSTABLE";

  const replayStatus =
    telemetryQuality.timestampQuality >= 85 &&
    telemetryQuality.coordinateQuality >= 85
      ? "VERIFIED"
      : "REVIEW";

  const aiStatus =
    operational.criticalAlerts >= 10
      ? "MONITORING"
      : "ACTIVE";

  /* =======================================================
     TIMELINE
  ======================================================= */

  const timeline = useMemo(() => {
    const sorted = [...aisData]
      .filter((row) => row.validTimestamp)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      );

    if (!sorted.length) {
      return [
        {
          time: "10:00 AM",
          title: "Infrastructure Escalation Triggered",
          description:
            "Telemetry activity exceeded the monitored operational threshold.",
          dot: "critical-dot",
        },
        {
          time: "10:15 AM",
          title: "District Transport Alert",
          description:
            "Transport activity variation detected in the telemetry stream.",
          dot: "high-dot",
        },
        {
          time: "10:30 AM",
          title: "Water Distribution Recovery",
          description:
            "Recovery monitoring sequence initiated.",
          dot: "medium-dot",
        },
        {
          time: "10:45 AM",
          title: "Health Infrastructure Balanced",
          description:
            "Operational telemetry returned toward stable conditions.",
          dot: "stable-dot",
        },
        {
          time: "11:15 AM",
          title: "Governance AI Replay Completed",
          description:
            "Replay continuity verification completed.",
          dot: "ai-dot",
        },
      ];
    }

    const indexes = [
      0,
      Math.floor(sorted.length * 0.25),
      Math.floor(sorted.length * 0.5),
      Math.floor(sorted.length * 0.75),
      sorted.length - 1,
    ];

    const titles = [
      "Infrastructure Escalation Triggered",
      "District Transport Alert",
      "Water Distribution Recovery",
      "Health Infrastructure Balanced",
      "Governance AI Replay Completed",
    ];

    const descriptions = [
      "AIS telemetry activity entered a monitored operational range.",
      "Regional movement variation detected in the telemetry stream.",
      "Telemetry recovery sequence observed across the dataset.",
      "Operational signal continuity remained under monitoring.",
      "Replay continuity verification completed from chronological AIS records.",
    ];

    const dots = [
      "critical-dot",
      "high-dot",
      "medium-dot",
      "stable-dot",
      "ai-dot",
    ];

    return indexes.map((index, position) => {
      const row = sorted[index];

      const date = new Date(row.timestamp);

      return {
        time: Number.isNaN(date.getTime())
          ? `Event ${position + 1}`
          : date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),

        title: titles[position],

        description:
          descriptions[position],

        dot: dots[position],
      };
    });
  }, [aisData]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="uccis-root">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="top-header">

        <div>
          <h1 className="main-title">
            UCCIS Governance Command Center
          </h1>

          <p className="main-subtitle">
            Principal Secretary Operational Intelligence Layer
          </p>
        </div>

        <div className="header-right">

          {/* <div className="live-indicator">
            <div className="status-dot"></div>

            {loadingAIS
              ? "LOADING AIS"
              : aisError
              ? "AIS SOURCE ERROR"
              : "AIS TELEMETRY ACTIVE"}
          </div> */}

        </div>

      </div>

      {/* =====================================================
          AIS SOURCE STATUS
      ===================================================== */}

      <div
        className="panel"
        style={{ marginBottom: "20px" }}
      >

        <div className="panel-header">
          AIS Telemetry Source
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "14px",
          }}
        >

          <div className="summary-card">
            <div className="summary-title">
              Source
            </div>

            <div className="summary-value blue">
              AIS_file.csv
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              AIS Records
            </div>

            <div className="summary-value green">
              {metrics.records.toLocaleString()}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              Unique Vessels
            </div>

            <div className="summary-value blue">
              {metrics.vessels.toLocaleString()}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              Vessel Types
            </div>

            <div className="summary-value purple">
              {metrics.vesselTypes}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-title">
              Data Quality
            </div>

            <div className="summary-value green">
              {telemetryQuality.overallQuality}%
            </div>
          </div>

        </div>

        {aisError && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: "13px",
            }}
          >
            {aisError}
            <br />
            <strong>
              Place AIS_file.csv inside frontend/public/
            </strong>
          </div>
        )}

      </div>

      {/* =====================================================
          KPI ROW
      ===================================================== */}

      <div className="kpi-row">

        <div className="kpi kpi-red">

          <div className="kpi-title">
            Active Critical Alerts
          </div>

          <div className="kpi-value">
            {operational.criticalAlerts}
          </div>

          <div className="kpi-trend negative">
            {metrics.records
              ? "AIS activity variation detected"
              : "Awaiting AIS telemetry"}
          </div>

        </div>

        <div className="kpi kpi-green">

          <div className="kpi-title">
            Infrastructure Health
          </div>

          <div className="kpi-value">
            {operational.infrastructureHealth}%
          </div>

          <div className="kpi-trend positive">
            Derived from telemetry quality
          </div>

        </div>

        <div className="kpi kpi-blue">

          <div className="kpi-title">
            Execution Velocity
          </div>

          <div className="kpi-value">
            {operational.executionVelocity}x
          </div>

          <div className="kpi-trend positive">
            AIS activity throughput
          </div>

        </div>

        <div className="kpi kpi-yellow">

          <div className="kpi-title">
            Pending Escalations
          </div>

          <div className="kpi-value">
            {operational.pendingEscalations}
          </div>

          <div className="kpi-trend neutral">
            Derived operational indicator
          </div>

        </div>

        <div className="kpi kpi-orange">

          <div className="kpi-title">
            Project Delays
          </div>

          <div className="kpi-value">
            {operational.projectDelays}
          </div>

          <div className="kpi-trend negative">
            Telemetry disruption indicator
          </div>

        </div>

        <div className="kpi kpi-purple">

          <div className="kpi-title">
            Department Efficiency
          </div>

          <div className="kpi-value">
            {operational.departmentEfficiency}%
          </div>

          <div className="kpi-trend positive">
            Derived from AIS consistency
          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="main-grid">

        {/* =====================================================
            LEFT SECTION
        ===================================================== */}

        <div className="left-section">

          {/* ===================================================
              OPERATIONAL CORE
          =================================================== */}

          <div className="panel">

            <div className="panel-header">
              Operational Intelligence Core
            </div>

            <div className="intel-grid">

              <div className="intel-card">

                <div className="intel-title">
                  System Monitoring
                </div>

                <div className="intel-value green">
                  ACTIVE
                </div>

              </div>

              <div className="intel-card">

                <div className="intel-title">
                  Telemetry Stability
                </div>

                <div
                  className={`intel-value ${
                    telemetryStatus === "STABLE"
                      ? "blue"
                      : "yellow"
                  }`}
                >
                  {telemetryStatus}
                </div>

              </div>

              <div className="intel-card">

                <div className="intel-title">
                  Replay Continuity
                </div>

                <div
                  className={`intel-value ${
                    replayStatus === "VERIFIED"
                      ? "green"
                      : "yellow"
                  }`}
                >
                  {replayStatus}
                </div>

              </div>

              <div className="intel-card">

                <div className="intel-title">
                  AI Observation Layer
                </div>

                <div className="intel-value yellow">
                  {aiStatus}
                </div>

              </div>

            </div>

            <div className="recommendation-text">

              AIS telemetry contains{" "}
              <strong>
                {metrics.records.toLocaleString()}
              </strong>{" "}
              records across{" "}
              <strong>
                {metrics.vessels.toLocaleString()}
              </strong>{" "}
              unique vessels and{" "}
              <strong>
                {metrics.vesselTypes}
              </strong>{" "}
              vessel types.

              <br />

              Telemetry consistency is currently{" "}
              <strong>
                {telemetryQuality.overallQuality}%
              </strong>
              , based on coordinate, speed and timestamp
              completeness.

            </div>

          </div>

          {/* ===================================================
              OPERATIONAL REPLAY TIMELINE
          =================================================== */}

          <div className="panel">

            <div className="panel-header">
              Operational Replay Timeline
            </div>

            <div className="timeline-wrapper">

              {timeline.map((event, index) => (

                <div
                  className="timeline-event"
                  key={`${event.title}-${index}`}
                >

                  <div className="timeline-left">

                    <div
                      className={`timeline-dot ${event.dot}`}
                    ></div>

                    {index <
                      timeline.length - 1 && (
                      <div className="timeline-line"></div>
                    )}

                  </div>

                  <div className="timeline-content">

                    <div className="timeline-time">
                      {event.time}
                    </div>

                    <div className="timeline-title">
                      {event.title}
                    </div>

                    <div className="timeline-description">
                      {event.description}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ===================================================
              AIS TELEMETRY DETAIL
          =================================================== */}

          <div className="panel">

            <div className="panel-header">
              AIS Telemetry Analysis
            </div>

            <div className="intel-grid">

              <div className="intel-card">

                <div className="intel-title">
                  Coordinate Quality
                </div>

                <div className="intel-value blue">
                  {telemetryQuality.coordinateQuality}%
                </div>

              </div>

              <div className="intel-card">

                <div className="intel-title">
                  Speed Quality
                </div>

                <div className="intel-value green">
                  {telemetryQuality.speedQuality}%
                </div>

              </div>

              <div className="intel-card">

                <div className="intel-title">
                  Timestamp Quality
                </div>

                <div className="intel-value blue">
                  {telemetryQuality.timestampQuality}%
                </div>

              </div>

              <div className="intel-card">

                <div className="intel-title">
                  Moving Activity
                </div>

                <div className="intel-value yellow">
                  {Math.round(
                    metrics.movingPercentage
                  )}%
                </div>

              </div>

            </div>

            <div className="recommendation-text">

              Average Speed Over Ground:{" "}
              <strong>
                {metrics.averageSOG.toFixed(2)}
              </strong>

              <br />

              Valid coordinate records:{" "}
              <strong>
                {metrics.validCoordinates.toLocaleString()}
              </strong>

              <br />

              Valid timestamp records:{" "}
              <strong>
                {metrics.validTimestamp.toLocaleString()}
              </strong>

            </div>

          </div>

        </div>

        {/* =====================================================
            RIGHT SECTION
        ===================================================== */}

        <div className="right-section">

          {/* ===================================================
              COMMAND STATUS PANEL
          =================================================== */}

          <div className="panel">

            <div className="panel-header">
              Command Status Panel
            </div>

            <div className="summary-grid">

              <div className="summary-card">

                <div className="summary-title">
                  System Load
                </div>

                <div
                  className={`summary-value ${
                    systemLoadStatus === "NORMAL"
                      ? "green"
                      : "yellow"
                  }`}
                >
                  {systemLoadStatus}
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-title">
                  Data Sync
                </div>

                <div
                  className={`summary-value ${
                    telemetryStatus === "STABLE"
                      ? "blue"
                      : "yellow"
                  }`}
                >
                  {telemetryStatus === "STABLE"
                    ? "ACTIVE"
                    : "REVIEW"}
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-title">
                  Alert Engine
                </div>

                <div className="summary-value yellow">
                  MONITORING
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-title">
                  AI Layer
                </div>

                <div className="summary-value purple">
                  {aiStatus}
                </div>

              </div>

            </div>

          </div>

          {/* ===================================================
              ESCALATION HEATMAP
          =================================================== */}

          <div className="panel">

            <div className="panel-header">
              Escalation Heatmap
            </div>

            <div className="heatmap-container">

              <div className="heatmap-row">

                {heatmap
                  .slice(0, 3)
                  .map((item) => (

                    <div
                      key={item.name}
                      className={`heat-cell ${item.className}`}
                    >

                      <span>
                        {item.name}
                      </span>

                      <strong>
                        {item.value}%
                      </strong>

                    </div>

                  ))}

              </div>

              <div className="heatmap-row">

                {heatmap
                  .slice(3, 6)
                  .map((item) => (

                    <div
                      key={item.name}
                      className={`heat-cell ${item.className}`}
                    >

                      <span>
                        {item.name}
                      </span>

                      <strong>
                        {item.value}%
                      </strong>

                    </div>

                  ))}

              </div>

            </div>

          </div>

          {/* ===================================================
              DATA SUMMARY
          =================================================== */}

          <div className="panel">

            <div className="panel-header">
              Telemetry Summary
            </div>

            <div className="summary-grid">

              <div className="summary-card">

                <div className="summary-title">
                  Average SOG
                </div>

                <div className="summary-value blue">
                  {metrics.averageSOG.toFixed(2)}
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-title">
                  Moving Activity
                </div>

                <div className="summary-value green">
                  {Math.round(
                    metrics.movingPercentage
                  )}%
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-title">
                  Vessels
                </div>

                <div className="summary-value purple">
                  {metrics.vessels.toLocaleString()}
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-title">
                  Data Quality
                </div>

                <div className="summary-value green">
                  {telemetryQuality.overallQuality}%
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          DATA SOURCE NOTE
      ===================================================== */}

      <div
        className="panel"
        style={{ marginTop: "20px" }}
      >

        <div className="panel-header">
          Data Source Note
        </div>

        <div className="recommendation-text">

          This Governance Command Center uses{" "}
          <strong>AIS_file.csv</strong> as its telemetry
          source.

          <br />
          <br />

          The displayed values are derived indicators based
          on AIS records, vessel diversity, vessel types,
          coordinates, speed and timestamps. They should not
          be interpreted as direct measurements of physical
          government infrastructure or actual departmental
          performance.

        </div>

      </div>

    </div>
  );
}