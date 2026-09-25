/* =========================================================
UCCIS GOVERNANCE COMMAND CENTER
PHASE 1 → PHASE 5
AIS-DRIVEN OPERATIONAL DASHBOARD
========================================================= */

import React, { useEffect, useMemo, useState } from "react";

import "../styles/Task19.css";

/* =========================================================
COMPONENTS
========================================================= */

import CommandHeader from
"../components/commandCenter/CommandHeader";

import LiveAlertTicker from
"../components/alerts/LiveAlertTicker";

import ExecutiveCard from
"../components/primitives/ExecutiveCard";

import KPIBlock from
"../components/primitives/KPIBlock";

/* =========================================================
AIS CONFIGURATION
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
HELPERS
========================================================= */

const clamp = (value, min = 0, max = 100) => {
  return Math.min(
    max,
    Math.max(
      min,
      Math.round(value)
    )
  );
};

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

/* =========================================================
CSV PARSER
========================================================= */

const parseCSVLine = (line) => {

  const result = [];

  let current = "";

  let insideQuotes = false;

  for (
    let i = 0;
    i < line.length;
    i++
  ) {

    const char = line[i];

    if (char === '"') {

      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {

        current += '"';

        i++;

      } else {

        insideQuotes =
          !insideQuotes;

      }

    } else if (
      char === "," &&
      !insideQuotes
    ) {

      result.push(
        current.trim()
      );

      current = "";

    } else {

      current += char;

    }

  }

  result.push(
    current.trim()
  );

  return result;
};

/* =========================================================
AIS CSV PARSER
========================================================= */

const parseAISCSV = (text) => {

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {

    return [];

  }

  const headers =
    parseCSVLine(lines[0])
      .map((header) =>
        header
          .replace(/^"|"$/g, "")
          .trim()
      );

  return lines
    .slice(1)
    .map((line) => {

      const values =
        parseCSVLine(line);

      const row = {};

      headers.forEach(
        (header, index) => {

          row[header] =
            values[index] ?? "";

        }
      );

      return row;

    });

};

/* =========================================================
AIS FIELD HELPER
========================================================= */

const getAISField = (
  row,
  possibleNames
) => {

  for (
    const name of possibleNames
  ) {

    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {

      return String(
        row[name]
      ).trim();

    }

  }

  return "";

};

/* =========================================================
NORMALIZE AIS DATA
========================================================= */

const normalizeAISRow = (row) => {

  const mmsi =
    getAISField(
      row,
      [
        "MMSI",
        "mmsi",
        "Mmsi"
      ]
    );

  const timestamp =
    getAISField(
      row,
      [
        "BaseDateTime",
        "baseDateTime",
        "Timestamp",
        "timestamp",
        "DateTime"
      ]
    );

  const lat =
    toNumber(
      getAISField(
        row,
        [
          "LAT",
          "Lat",
          "Latitude",
          "latitude"
        ]
      )
    );

  const lon =
    toNumber(
      getAISField(
        row,
        [
          "LON",
          "Lon",
          "Longitude",
          "longitude"
        ]
      )
    );

  const sog =
    toNumber(
      getAISField(
        row,
        [
          "SOG",
          "sog",
          "Speed",
          "speed"
        ]
      )
    );

  const vesselType =
    getAISField(
      row,
      [
        "VesselType",
        "Vessel Type",
        "vessel_type",
        "vesselType"
      ]
    );

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSpeed =
    Number.isFinite(sog) &&
    sog >= 0;

  const validTimestamp =
    timestamp &&
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

    validTimestamp

  };

};

/* =========================================================
COMPONENT
========================================================= */

const OperationalLayer = () => {

  /* =======================================================
  AIS STATE
  ======================================================= */

  const [
    aisData,
    setAISData
  ] = useState([]);

  const [
    loadingAIS,
    setLoadingAIS
  ] = useState(true);

  const [
    aisError,
    setAISError
  ] = useState("");

  /* =======================================================
  LOAD AIS FILE
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    const loadAISData = async () => {

      try {

        setLoadingAIS(true);

        setAISError("");

        const response =
          await fetch(
            AIS_FILE,
            {
              cache: "no-store"
            }
          );

        if (!response.ok) {

          throw new Error(
            `AIS_file.csv returned ${response.status}`
          );

        }

        const csvText =
          await response.text();

        const parsed =
          parseAISCSV(
            csvText
          );

        const normalized =
          parsed
            .map(
              normalizeAISRow
            )
            .filter(
              (row) =>
                row.mmsi
            );

        if (
          !normalized.length
        ) {

          throw new Error(
            "AIS_file.csv contains no usable records."
          );

        }

        if (mounted) {

          setAISData(
            normalized
          );

        }

      } catch (error) {

        console.error(
          "OperationalLayer AIS error:",
          error
        );

        if (mounted) {

          setAISError(
            error.message ||
            "Unable to load AIS_file.csv"
          );

          setAISData([]);

        }

      } finally {

        if (mounted) {

          setLoadingAIS(
            false
          );

        }

      }

    };

    loadAISData();

    return () => {

      mounted = false;

    };

  }, []);

  /* =======================================================
  AIS METRICS
  ======================================================= */

  const aisMetrics =
    useMemo(() => {

      if (!aisData.length) {

        return {

          records: 0,

          vessels: 0,

          vesselTypes: 0,

          validCoordinates: 0,

          validSpeed: 0,

          validTimestamp: 0,

          movingRecords: 0,

          movingPercentage: 0,

          averageSOG: 0

        };

      }

      const vessels =
        new Set();

      const vesselTypes =
        new Set();

      let validCoordinates = 0;

      let validSpeed = 0;

      let validTimestamp = 0;

      let movingRecords = 0;

      let totalSOG = 0;

      let sogCount = 0;

      aisData.forEach(
        (row) => {

          if (row.mmsi) {

            vessels.add(
              row.mmsi
            );

          }

          if (
            row.vesselType
          ) {

            vesselTypes.add(
              row.vesselType
            );

          }

          if (
            row.validCoordinates
          ) {

            validCoordinates++;

          }

          if (
            row.validSpeed
          ) {

            validSpeed++;

            totalSOG +=
              row.sog;

            sogCount++;

            if (
              row.sog > 0.5
            ) {

              movingRecords++;

            }

          }

          if (
            row.validTimestamp
          ) {

            validTimestamp++;

          }

        }
      );

      return {

        records:
          aisData.length,

        vessels:
          vessels.size,

        vesselTypes:
          vesselTypes.size,

        validCoordinates,

        validSpeed,

        validTimestamp,

        movingRecords,

        movingPercentage:
          aisData.length
            ? (
                movingRecords /
                aisData.length
              ) * 100
            : 0,

        averageSOG:
          sogCount
            ? totalSOG /
              sogCount
            : 0

      };

    }, [aisData]);

  /* =======================================================
  TELEMETRY QUALITY
  ======================================================= */

  const telemetry =
    useMemo(() => {

      if (!aisMetrics.records) {

        return {

          coordinateQuality: 0,

          speedQuality: 0,

          timestampQuality: 0,

          overallQuality: 0

        };

      }

      const coordinateQuality =
        (
          aisMetrics.validCoordinates /
          aisMetrics.records
        ) * 100;

      const speedQuality =
        (
          aisMetrics.validSpeed /
          aisMetrics.records
        ) * 100;

      const timestampQuality =
        (
          aisMetrics.validTimestamp /
          aisMetrics.records
        ) * 100;

      const overallQuality =
        coordinateQuality * 0.4 +
        speedQuality * 0.25 +
        timestampQuality * 0.35;

      return {

        coordinateQuality:
          clamp(
            coordinateQuality
          ),

        speedQuality:
          clamp(
            speedQuality
          ),

        timestampQuality:
          clamp(
            timestampQuality
          ),

        overallQuality:
          clamp(
            overallQuality
          )

      };

    }, [aisMetrics]);

  /* =======================================================
  EXECUTIVE METRICS
  ======================================================= */

  const executive =
    useMemo(() => {

      /*
        Fallback values preserve your original
        dashboard when AIS data is unavailable.
      */

      if (!aisMetrics.records) {

        return {

          criticalAlerts: 12,

          operationalHealth: 91,

          replayContinuity: 94,

          fieldReadiness: 87

        };

      }

      const activity =
        aisMetrics.movingPercentage;

      const vesselDiversity =
        clamp(
          (
            aisMetrics.vessels /
            7000
          ) * 100
        );

      const typeDiversity =
        clamp(
          (
            aisMetrics.vesselTypes /
            60
          ) * 100
        );

      const operationalHealth =
        clamp(
          telemetry.overallQuality *
            0.65 +
          vesselDiversity *
            0.20 +
          typeDiversity *
            0.15
        );

      const replayContinuity =
        clamp(
          telemetry.timestampQuality *
            0.40 +
          telemetry.coordinateQuality *
            0.35 +
          telemetry.speedQuality *
            0.25
        );

      const fieldReadiness =
        clamp(
          telemetry.overallQuality *
            0.45 +
          activity *
            0.30 +
          vesselDiversity *
            0.15 +
          typeDiversity *
            0.10
        );

      const criticalAlerts =
        Math.max(
          1,
          Math.min(
            20,
            Math.round(
              3 +
              (
                100 -
                operationalHealth
              ) / 10 +
              activity / 20
            )
          )
        );

      return {

        criticalAlerts,

        operationalHealth,

        replayContinuity,

        fieldReadiness

      };

    }, [
      aisMetrics,
      telemetry
    ]);

  /* =======================================================
  KPI METRICS
  ======================================================= */

  const kpis =
    useMemo(() => {

      if (!aisMetrics.records) {

        return {

          mumbaiRuntime: 92,

          thaneStability: 84,

          mmrDensity: 76,

          escalationLoad: 68

        };

      }

      const activity =
        aisMetrics.movingPercentage;

      const vesselDensity =
        clamp(
          (
            aisMetrics.vessels /
            7000
          ) * 100
        );

      const typeDiversity =
        clamp(
          (
            aisMetrics.vesselTypes /
            60
          ) * 100
        );

      return {

        mumbaiRuntime:
          clamp(
            telemetry.overallQuality *
              0.70 +
            activity *
              0.20 +
            typeDiversity *
              0.10
          ),

        thaneStability:
          clamp(
            telemetry.coordinateQuality *
              0.40 +
            telemetry.timestampQuality *
              0.35 +
            vesselDensity *
              0.25
          ),

        mmrDensity:
          clamp(
            vesselDensity *
              0.60 +
            typeDiversity *
              0.20 +
            activity *
              0.20
          ),

        escalationLoad:
          clamp(
            (
              100 -
              telemetry.overallQuality
            ) * 0.60 +
            activity * 0.40
          )

      };

    }, [
      aisMetrics,
      telemetry
    ]);

  /* =======================================================
  REPLAY METRICS
  ======================================================= */

  const replay =
    useMemo(() => {

      const confidence =
        executive.replayContinuity;

      const entropy =
        clamp(
          100 -
          confidence
        );

      return {

        confidence,

        entropy

      };

    }, [
      executive.replayContinuity
    ]);

  /* =======================================================
  ESCALATION DATA
  ======================================================= */

  const escalation =
    useMemo(() => {

      if (!aisMetrics.records) {

        return {

          mumbai: 84,

          thane: 62

        };

      }

      const activity =
        aisMetrics.movingPercentage;

      const quality =
        telemetry.overallQuality;

      const mumbai =
        clamp(
          35 +
          activity * 0.45 +
          (
            100 -
            quality
          ) * 0.30
        );

      const thane =
        clamp(
          25 +
          telemetry.coordinateQuality *
            0.30 +
          activity *
            0.25
        );

      return {

        mumbai,

        thane

      };

    }, [
      aisMetrics,
      telemetry
    ]);

  /* =======================================================
  HEALTH METRICS
  ======================================================= */

  const health =
    useMemo(() => {

      return {

        overall:
          executive.operationalHealth,

        traffic:
          telemetry.coordinateQuality >= 80
            ? "Stable"
            : "Review",

        replay:
          executive.replayContinuity >= 80
            ? "Verified"
            : "Review",

        governance:
          telemetry.overallQuality >= 75
            ? "Operational"
            : "Monitoring"

      };

    }, [
      executive,
      telemetry
    ]);

  /* =======================================================
  ALERT STATUS
  ======================================================= */

  const alertLevel =
    executive.criticalAlerts >= 10
      ? "Critical"
      : executive.criticalAlerts >= 7
      ? "High"
      : "Medium";

  /* =======================================================
  RENDER
  ======================================================= */

  return (

    <div className="dashboard-layout">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <CommandHeader />

      {/* ================================================= */}
      {/* ALERT TICKER */}
      {/* ================================================= */}

      <LiveAlertTicker />

      {/* ================================================= */}
      {/* AIS SOURCE STATUS */}
      {/* ================================================= */}

      <div
        className="panel-card"
        style={{
          marginBottom: "20px"
        }}
      >

        <h2>
          AIS TELEMETRY SOURCE
        </h2>

        <p>
          Source:
          {" "}
          <strong>
            AIS_file.csv
          </strong>
        </p>

        <p>
          Records:
          {" "}
          <strong>
            {aisMetrics.records.toLocaleString()}
          </strong>

          {" | "}

          Unique Vessels:
          {" "}
          <strong>
            {aisMetrics.vessels.toLocaleString()}
          </strong>

          {" | "}

          Vessel Types:
          {" "}
          <strong>
            {aisMetrics.vesselTypes}
          </strong>
        </p>

        <p>
          Telemetry Quality:
          {" "}
          <strong>
            {telemetry.overallQuality}%
          </strong>
        </p>

        {loadingAIS && (
          <p>
            Loading AIS_file.csv...
          </p>
        )}

        {aisError && (
          <p
            style={{
              color: "#dc2626"
            }}
          >
            {aisError}
            <br />

            Make sure the file exists at:

            <strong>
              frontend/public/AIS_file.csv
            </strong>
          </p>
        )}

      </div>

      {/* ================================================= */}
      {/* EXECUTIVE GRID */}
      {/* ================================================= */}

      <div className="executive-command-grid">

        <ExecutiveCard
          title="Critical Alerts"
          value={
            executive.criticalAlerts
          }
          status={
            alertLevel
          }
        />

        <ExecutiveCard
          title="Operational Health"
          value={`${executive.operationalHealth}%`}
          status={
            executive.operationalHealth >= 80
              ? "Stable"
              : "Monitoring"
          }
        />

        <ExecutiveCard
          title="Replay Continuity"
          value={`${executive.replayContinuity}%`}
          status={
            executive.replayContinuity >= 80
              ? "Verified"
              : "Review"
          }
        />

        <ExecutiveCard
          title="Field Readiness"
          value={`${executive.fieldReadiness}%`}
          status={
            executive.fieldReadiness >= 80
              ? "Active"
              : "Monitoring"
          }
        />

      </div>

      {/* ================================================= */}
      {/* KPI GRID */}
      {/* ================================================= */}

      <div className="kpi-grid">

        <KPIBlock
          label="Mumbai Runtime"
          value={`${kpis.mumbaiRuntime}%`}
        />

        <KPIBlock
          label="Thane Stability"
          value={`${kpis.thaneStability}%`}
        />

        <KPIBlock
          label="MMR Density"
          value={`${kpis.mmrDensity}%`}
        />

        <KPIBlock
          label="Escalation Load"
          value={`${kpis.escalationLoad}%`}
        />

      </div>

      {/* ================================================= */}
      {/* LIVE OPERATIONS */}
      {/* ================================================= */}

      <div className="top-grid">

        {/* ALERT PANEL */}

        <div className="panel-card">

          <h2>
            LIVE ALERTS
          </h2>

          <div className="alert-item">

            <div>

              <h3>
                AIS Activity Variation
              </h3>

              <p>
                Telemetry monitoring layer
              </p>

            </div>

            <span>
              {alertLevel}
            </span>

          </div>

          <div className="alert-item">

            <div>

              <h3>
                Telemetry Quality
              </h3>

              <p>
                Coordinate and timestamp validation
              </p>

            </div>

            <span>
              {telemetry.overallQuality >= 80
                ? "Stable"
                : "High"}
            </span>

          </div>

          <div className="alert-item">

            <div>

              <h3>
                Vessel Activity
              </h3>

              <p>
                Moving AIS records detected
              </p>

            </div>

            <span>
              {Math.round(
                aisMetrics.movingPercentage
              )}%
            </span>

          </div>

        </div>

        {/* TELEMETRY PANEL */}

        <div className="panel-card">

          <h2>
            TELEMETRY STATUS
          </h2>

          <div className="telemetry-row">

            <div>

              <h3>
                Coordinate Grid
              </h3>

              <p>
                AIS Dataset
              </p>

            </div>

            <span>
              {telemetry.coordinateQuality >= 80
                ? "Operational"
                : "Review"}
            </span>

          </div>

          <div className="telemetry-row">

            <div>

              <h3>
                Timestamp Mesh
              </h3>

              <p>
                AIS Timeline
              </p>

            </div>

            <span>
              {telemetry.timestampQuality >= 80
                ? "Stable"
                : "Degraded"}
            </span>

          </div>

          <div className="telemetry-row">

            <div>

              <h3>
                Vessel Coordination
              </h3>

              <p>
                AIS Activity
              </p>

            </div>

            <span>
              {aisMetrics.vessels > 0
                ? "Active"
                : "Unavailable"}
            </span>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* REPLAY + ESCALATION */}
      {/* ================================================= */}

      <div className="triple-grid">

        {/* REPLAY */}

        <div className="panel-card">

          <h2>
            REPLAY ENGINE
          </h2>

          <div className="replay-card">

            <h3>
              AIS Telemetry Reconstruction
            </h3>

            <div className="replay-metrics">

              <span>
                Confidence:
                {" "}
                {replay.confidence}%
              </span>

              <span>
                Entropy:
                {" "}
                {replay.entropy}%
              </span>

            </div>

            <div className="replay-progress">

              <div
                className="replay-fill"
                style={{
                  width:
                    `${replay.confidence}%`
                }}
              />

            </div>

          </div>

        </div>

        {/* ESCALATION */}

        <div className="panel-card">

          <h2>
            ESCALATION INTELLIGENCE
          </h2>

          <div className="escalation-row">

            <div>

              <h3>
                Mumbai
              </h3>

              <p>
                AIS-derived activity indicator
              </p>

            </div>

            <div className="risk-bar-container">

              <div
                className="risk-bar"
                style={{
                  width:
                    `${escalation.mumbai}%`
                }}
              />

            </div>

            <span>
              {escalation.mumbai}%
            </span>

          </div>

          <div className="escalation-row">

            <div>

              <h3>
                Thane
              </h3>

              <p>
                AIS-derived continuity indicator
              </p>

            </div>

            <div className="risk-bar-container">

              <div
                className="risk-bar"
                style={{
                  width:
                    `${escalation.thane}%`
                }}
              />

            </div>

            <span>
              {escalation.thane}%
            </span>

          </div>

        </div>

        {/* HEALTH */}

        <div className="panel-card">

          <h2>
            OPERATIONAL HEALTH
          </h2>

          <div className="health-score">

            {health.overall}%

          </div>

          <div className="health-grid">

            <div className="health-item">

              <span>
                Traffic Grid
              </span>

              <strong>
                {health.traffic}
              </strong>

            </div>

            <div className="health-item">

              <span>
                Replay Engine
              </span>

              <strong>
                {health.replay}
              </strong>

            </div>

            <div className="health-item">

              <span>
                Governance Layer
              </span>

              <strong>
                {health.governance}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* AIS DATA SUMMARY */}
      {/* ================================================= */}

      <div
        className="panel-card"
        style={{
          marginTop: "20px"
        }}
      >

        <h2>
          AIS DATA SUMMARY
        </h2>

        <div className="health-grid">

          <div className="health-item">

            <span>
              AIS Records
            </span>

            <strong>
              {aisMetrics.records.toLocaleString()}
            </strong>

          </div>

          <div className="health-item">

            <span>
              Unique Vessels
            </span>

            <strong>
              {aisMetrics.vessels.toLocaleString()}
            </strong>

          </div>

          <div className="health-item">

            <span>
              Vessel Types
            </span>

            <strong>
              {aisMetrics.vesselTypes}
            </strong>

          </div>

          <div className="health-item">

            <span>
              Average SOG
            </span>

            <strong>
              {aisMetrics.averageSOG.toFixed(2)}
            </strong>

          </div>

          <div className="health-item">

            <span>
              Coordinate Quality
            </span>

            <strong>
              {telemetry.coordinateQuality}%
            </strong>

          </div>

          <div className="health-item">

            <span>
              Timestamp Quality
            </span>

            <strong>
              {telemetry.timestampQuality}%
            </strong>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* DATA SOURCE NOTE */}
      {/* ================================================= */}

      {/* <div
        className="panel-card"
        style={{
          marginTop: "20px"
        }}
      >

        <h2>
          DATA SOURCE
        </h2>

        <p>

          This dashboard uses
          {" "}
          <strong>
            AIS_file.csv
          </strong>
          {" "}
          for telemetry-derived indicators.

        </p>

        <p>

          The displayed values are calculated from
          AIS records, vessel identifiers, vessel types,
          coordinates, timestamps and SOG.

        </p>

        <p>

          These values represent telemetry-derived
          indicators and should not be interpreted as
          direct measurements of actual Mumbai, Thane
          or MMR infrastructure conditions.

        </p>

      </div> */}

    </div>

  );

};

export default OperationalLayer;