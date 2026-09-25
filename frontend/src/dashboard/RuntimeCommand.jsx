import React, {
  useEffect,
  useState,
} from "react";

import SidebarTask25 from "../components/SidebarTask25";
import TopbarTask25 from "../components/TopbarTask25";

import TelemetryPage from "../phases/TelemetryPage";
import IncidentPage from "../phases/IncidentPage";
import EscalationPage from "../phases/EscalationPage";
import ReplayPage from "../phases/ReplayPage";
import GISPage from "../phases/GISPage";
import DecisionPage from "../phases/DecisionPage";
import OperatorPage from "../phases/OperatorPage";
import AnalyticsPage from "../phases/AnalyticsPage";
import RuntimeLogsPage from "../phases/RuntimeLogsPage";
import SystemHealthPage from "../phases/SystemHealthPage";
import DashboardHome from "../phases/DashboardHome";

import "./Run.css";


/* =========================================================
   AIS CONFIGURATION

   Put AIS_file.csv inside:

   public/AIS_file.csv
========================================================= */

const AIS_FILE = "/AIS_file.csv";


/* =========================================================
   AIS CSV PARSER
========================================================= */

const parseCSVLine = (line) => {
  const values = [];

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
      values.push(
        current.trim()
      );

      current = "";
    } else {
      current += char;
    }
  }

  values.push(
    current.trim()
  );

  return values;
};


const parseAISCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(
      (line) =>
        line.trim() !== ""
    );

  if (lines.length < 2) {
    return [];
  }

  const headers =
    parseCSVLine(
      lines[0]
    ).map((header) =>
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
            values[index] ??
            "";
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
  const keys =
    Object.keys(row || {});

  const wanted =
    possibleNames.map(
      (name) =>
        name
          .toLowerCase()
          .trim()
    );

  const matchedKey =
    keys.find((key) =>
      wanted.includes(
        String(key)
          .toLowerCase()
          .trim()
      )
    );

  if (!matchedKey) {
    return "";
  }

  return String(
    row[matchedKey] ?? ""
  ).trim();
};


/* =========================================================
   AIS METRICS
========================================================= */

const calculateAISMetrics = (
  records
) => {
  if (!records.length) {
    return {
      records: 0,
      vessels: 0,
      movingRecords: 0,
      movingPercentage: 0,
      averageSOG: 0,
      validCoordinates: 0,
      validSpeed: 0,
      dataQuality: 0,
    };
  }

  const vessels =
    new Set();

  let movingRecords = 0;
  let validCoordinates = 0;
  let validSpeed = 0;

  let totalSOG = 0;
  let sogCount = 0;

  records.forEach(
    (row) => {
      const mmsi =
        getAISField(
          row,
          [
            "MMSI",
            "mmsi",
            "Mmsi",
          ]
        );

      if (mmsi) {
        vessels.add(mmsi);
      }

      const lat =
        Number(
          getAISField(
            row,
            [
              "LAT",
              "lat",
              "Latitude",
              "latitude",
            ]
          )
        );

      const lon =
        Number(
          getAISField(
            row,
            [
              "LON",
              "lon",
              "Longitude",
              "longitude",
            ]
          )
        );

      const sog =
        Number(
          getAISField(
            row,
            [
              "SOG",
              "sog",
              "Speed",
              "speed",
            ]
          )
        );

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
      ) {
        validCoordinates++;
      }

      if (
        Number.isFinite(sog) &&
        sog >= 0
      ) {
        validSpeed++;

        totalSOG += sog;
        sogCount++;

        if (sog > 0) {
          movingRecords++;
        }
      }
    }
  );

  const coordinateQuality =
    records.length > 0
      ? (validCoordinates /
          records.length) *
        100
      : 0;

  const speedQuality =
    records.length > 0
      ? (validSpeed /
          records.length) *
        100
      : 0;

  const dataQuality =
    (coordinateQuality +
      speedQuality) /
    2;

  const movingPercentage =
    records.length > 0
      ? (movingRecords /
          records.length) *
        100
      : 0;

  const averageSOG =
    sogCount > 0
      ? totalSOG / sogCount
      : 0;

  return {
    records:
      records.length,

    vessels:
      vessels.size,

    movingRecords,

    movingPercentage,

    averageSOG,

    validCoordinates,

    validSpeed,

    dataQuality,
  };
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

function RuntimeCommand() {

  /* =======================================================
     ACTIVE PHASE
  ======================================================= */

  const [
    activePhase,
    setActivePhase,
  ] = useState(
    "Dashboard"
  );


  /* =======================================================
     AIS STATE
  ======================================================= */

  const [
    aisRecords,
    setAISRecords,
  ] = useState([]);

  const [
    aisLoading,
    setAISLoading,
  ] = useState(true);

  const [
    aisError,
    setAISError,
  ] = useState("");


  /* =======================================================
     LOAD AIS DATA
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    const loadAIS = async () => {

      try {

        setAISLoading(true);
        setAISError("");

        const response =
          await fetch(
            `${AIS_FILE}?t=${Date.now()}`,
            {
              cache:
                "no-store",
            }
          );

        if (!response.ok) {

          throw new Error(
            `AIS_file.csv returned HTTP ${response.status}`
          );

        }

        const csvText =
          await response.text();

        const parsed =
          parseAISCSV(
            csvText
          );

        if (!parsed.length) {

          throw new Error(
            "AIS_file.csv contains no usable records."
          );

        }

        if (mounted) {

          setAISRecords(
            parsed
          );

          console.log(
            "Task 25 AIS records loaded:",
            parsed.length
          );

        }

      } catch (error) {

        console.error(
          "Task 25 AIS loading error:",
          error
        );

        if (mounted) {

          setAISRecords([]);

          setAISError(
            error.message ||
              "Unable to load AIS telemetry."
          );

        }

      } finally {

        if (mounted) {

          setAISLoading(false);

        }

      }

    };


    loadAIS();


    const interval =
      setInterval(
        loadAIS,
        30000
      );


    return () => {

      mounted = false;

      clearInterval(
        interval
      );

    };

  }, []);


  /* =======================================================
     AIS METRICS
  ======================================================= */

  const aisMetrics =
    calculateAISMetrics(
      aisRecords
    );


  /* =======================================================
     PAGE ROUTING
  ======================================================= */

  const renderPage = () => {

    switch (
      activePhase
    ) {

      case "Dashboard":
        return (
          <DashboardHome />
        );


      case "Telemetry":
        return (
          <TelemetryPage />
        );


      case "Incidents":
        return (
          <IncidentPage />
        );


      case "Escalations":
        return (
          <EscalationPage />
        );


      case "Replay":
        return (
          <ReplayPage />
        );


      case "GIS":
        return (
          <GISPage />
        );


      case "Decisions":
        return (
          <DecisionPage />
        );


      case "Operators":
        return (
          <OperatorPage />
        );


      case "Analytics":
        return (
          <AnalyticsPage />
        );


      case "Logs":
        return (
          <RuntimeLogsPage />
        );


      case "System":
        return (
          <SystemHealthPage />
        );


      default:
        return (
          <DashboardHome />
        );

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <SidebarTask25
        activePhase={
          activePhase
        }
        setActivePhase={
          setActivePhase
        }
      />


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="main">

        <TopbarTask25 />


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-header">

          <div>

            <h1>
              UCCIS Runtime Command Center
            </h1>

            <p>
              Unified Civic Command &
              Intelligence System
            </p>

          </div>


          {/* =================================================
              AIS STATUS
          ================================================= */}

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "10px",
              padding:
                "8px 14px",
              borderRadius:
                "8px",
              background:
                "rgba(15, 23, 42, 0.75)",
              border:
                "1px solid rgba(56, 189, 248, 0.25)",
              color:
                "#cbd5e1",
              fontSize:
                "12px",
              whiteSpace:
                "nowrap",
            }}
          >

            <span
              style={{
                width:
                  "9px",
                height:
                  "9px",
                borderRadius:
                  "50%",
                background:
                  aisLoading
                    ? "#f59e0b"
                    : aisError
                    ? "#ef4444"
                    : "#22c55e",
                boxShadow:
                  aisLoading
                    ? "0 0 8px rgba(245,158,11,.7)"
                    : aisError
                    ? "0 0 8px rgba(239,68,68,.7)"
                    : "0 0 8px rgba(34,197,94,.7)",
              }}
            />

            <span>

              {aisLoading
                ? "AIS LOADING"
                : aisError
                ? "AIS OFFLINE"
                : "AIS ACTIVE"}

            </span>

            {!aisLoading &&
              !aisError && (
                <strong
                  style={{
                    color:
                      "#38bdf8",
                  }}
                >
                  {aisMetrics.records.toLocaleString()}
                  {" "}records
                </strong>
              )}

          </div>

        </div>


        {/* =================================================
            ACTIVE PHASE INDICATOR
        ================================================= */}

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap: "15px",
            marginBottom:
              "18px",
            padding:
              "10px 14px",
            borderRadius:
              "8px",
            background:
              "rgba(15, 23, 42, 0.55)",
            border:
              "1px solid rgba(148, 163, 184, 0.15)",
          }}
        >

          <div>

            <span
              style={{
                fontSize:
                  "11px",
                color:
                  "#64748b",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.08em",
              }}
            >
              Current Module
            </span>

            <div
              style={{
                marginTop:
                  "3px",
                color:
                  "#e2e8f0",
                fontSize:
                  "15px",
                fontWeight:
                  600,
              }}
            >
              {activePhase}
            </div>

          </div>


          <div
            style={{
              display:
                "flex",
              gap:
                "20px",
              flexWrap:
                "wrap",
            }}
          >

            <div>

              <span
                style={{
                  color:
                    "#64748b",
                  fontSize:
                    "11px",
                }}
              >
                VESSELS
              </span>

              <strong
                style={{
                  display:
                    "block",
                  color:
                    "#38bdf8",
                  marginTop:
                    "2px",
                }}
              >
                {aisMetrics.vessels.toLocaleString()}
              </strong>

            </div>


            <div>

              <span
                style={{
                  color:
                    "#64748b",
                  fontSize:
                    "11px",
                }}
              >
                MOVING
              </span>

              <strong
                style={{
                  display:
                    "block",
                  color:
                    "#22c55e",
                  marginTop:
                    "2px",
                }}
              >
                {Math.round(
                  aisMetrics.movingPercentage
                )}
                %
              </strong>

            </div>


            <div>

              <span
                style={{
                  color:
                    "#64748b",
                  fontSize:
                    "11px",
                }}
              >
                DATA QUALITY
              </span>

              <strong
                style={{
                  display:
                    "block",
                  color:
                    aisMetrics.dataQuality >=
                    90
                      ? "#22c55e"
                      : aisMetrics.dataQuality >=
                        70
                      ? "#f59e0b"
                      : "#ef4444",
                  marginTop:
                    "2px",
                }}
              >
                {Math.round(
                  aisMetrics.dataQuality
                )}
                %
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTIVE PAGE
        ================================================= */}

        {renderPage()}

      </div>

    </div>

  );
}


export default RuntimeCommand;