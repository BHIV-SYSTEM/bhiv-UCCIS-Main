import { useEffect, useMemo, useState } from "react";
import API from "../api";

import StatCardTask26 from "../components/StatCardTask26.jsx";
import TelemetryChartTask26 from "../components/TelemetryChartTask26.jsx";

/* =========================================================
   AIS CONFIGURATION

   Put the file here:

   public/AIS_file.csv
========================================================= */

const AIS_FILE = "/AIS_file.csv";


/* =========================================================
   CSV PARSER
========================================================= */

const parseCSVLine = (line) => {
  const values = [];

  let current = "";
  let insideQuotes = false;

  for (
    let i = 0;
    i < line.length;
    i += 1
  ) {
    const char = line[i];

    if (char === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i += 1;
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


const parseCSV = (text) => {
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
            values[index] ?? "";
        }
      );

      return row;
    });
};


/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (
  row,
  names
) => {
  const keys =
    Object.keys(row || {});

  const normalizedNames =
    names.map((name) =>
      String(name)
        .toLowerCase()
        .trim()
    );

  const matchingKey =
    keys.find((key) =>
      normalizedNames.includes(
        String(key)
          .toLowerCase()
          .trim()
      )
    );

  return matchingKey
    ? row[matchingKey]
    : "";
};


/* =========================================================
   NORMALIZE AIS RECORD
========================================================= */

const normalizeAISRecord = (
  row,
  index
) => {
  const mmsi = String(
    getField(row, [
      "MMSI",
      "mmsi",
      "Mmsi",
      "vessel_id",
      "vesselId",
    ]) || ""
  ).trim();

  const lat = Number(
    getField(row, [
      "LAT",
      "lat",
      "Latitude",
      "latitude",
    ])
  );

  const lon = Number(
    getField(row, [
      "LON",
      "lon",
      "Longitude",
      "longitude",
    ])
  );

  const sog = Number(
    getField(row, [
      "SOG",
      "sog",
      "Speed",
      "speed",
    ])
  );

  const timestamp = String(
    getField(row, [
      "BaseDateTime",
      "baseDateTime",
      "timestamp",
      "Timestamp",
      "datetime",
      "time",
    ]) || ""
  ).trim();

  return {
    id:
      mmsi ||
      `AIS-${index + 1}`,

    mmsi,

    lat,

    lon,

    sog,

    timestamp,

    validCoordinates:
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180,

    validSpeed:
      Number.isFinite(sog) &&
      sog >= 0,

    moving:
      Number.isFinite(sog) &&
      sog > 0,
  };
};


/* =========================================================
   NORMALIZE BACKEND TELEMETRY
========================================================= */

const normalizeBackendTelemetry = (
  records
) => {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map(
    (item, index) => ({
      ...item,

      id:
        item.id ||
        item._id ||
        item.mmsi ||
        `TELEMETRY-${index + 1}`,

      value:
        Number(
          item.value ??
          item.signal ??
          item.signals ??
          item.strength ??
          item.sog ??
          0
        ),

      timestamp:
        item.timestamp ||
        item.time ||
        item.BaseDateTime ||
        "",
    })
  );
};


/* =========================================================
   COMPONENT
========================================================= */

export default function TelemetryTask26() {

  /* =======================================================
     STATE
  ======================================================= */

  const [data, setData] =
    useState([]);

  const [aisData, setAISData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [aisError, setAISError] =
    useState("");

  const [source, setSource] =
    useState("");


  /* =======================================================
     LOAD TELEMETRY + AIS
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    const fetchTelemetry =
      async () => {

        try {

          console.log(
            "Task 26: Fetching backend telemetry..."
          );

          const res =
            await API.get(
              "/telemetry"
            );

          console.log(
            "Task 26 Telemetry Response:",
            res.data
          );


          let telemetry = [];


          if (
            Array.isArray(
              res.data
            )
          ) {
            telemetry =
              res.data;
          } else if (
            Array.isArray(
              res.data?.data
            )
          ) {
            telemetry =
              res.data.data;
          } else if (
            Array.isArray(
              res.data?.telemetry
            )
          ) {
            telemetry =
              res.data.telemetry;
          }


          const normalized =
            normalizeBackendTelemetry(
              telemetry
            );


          if (
            mounted &&
            normalized.length > 0
          ) {

            setData(
              normalized
            );

            setSource(
              "BACKEND"
            );

            console.log(
              "Task 26: Backend telemetry loaded:",
              normalized.length
            );

          }

        } catch (err) {

          console.warn(
            "Task 26 backend telemetry unavailable:",
            err
          );

        }

      };


    const fetchAIS =
      async () => {

        try {

          console.log(
            "Task 26: Loading AIS_file.csv..."
          );

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
            parseCSV(csvText);


          if (!parsed.length) {

            throw new Error(
              "AIS_file.csv contains no usable records."
            );

          }


          const normalized =
            parsed.map(
              normalizeAISRecord
            );


          if (mounted) {

            setAISData(
              normalized
            );

            console.log(
              "Task 26 AIS records loaded:",
              normalized.length
            );

          }

        } catch (err) {

          console.error(
            "Task 26 AIS Error:",
            err
          );

          if (mounted) {

            setAISError(
              err.message ||
                "Failed to load AIS telemetry."
            );

          }

        }

      };


    const loadAll =
      async () => {

        setLoading(true);
        setError("");

        await Promise.all([
          fetchTelemetry(),
          fetchAIS(),
        ]);

        if (mounted) {
          setLoading(false);
        }

      };


    loadAll();


    const interval =
      setInterval(
        loadAll,
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
    useMemo(() => {

      if (!aisData.length) {

        return {
          records: 0,
          vessels: 0,
          moving: 0,
          movingPercentage: 0,
          averageSOG: 0,
          dataQuality: 0,
        };

      }


      const vessels =
        new Set(
          aisData
            .map(
              (row) =>
                row.mmsi
            )
            .filter(Boolean)
        );


      const moving =
        aisData.filter(
          (row) =>
            row.moving
        ).length;


      const validCoordinates =
        aisData.filter(
          (row) =>
            row.validCoordinates
        ).length;


      const validSpeed =
        aisData.filter(
          (row) =>
            row.validSpeed
        ).length;


      const speedValues =
        aisData.filter(
          (row) =>
            row.validSpeed
        );


      const averageSOG =
        speedValues.length > 0
          ? speedValues.reduce(
              (sum, row) =>
                sum + row.sog,
              0
            ) /
            speedValues.length
          : 0;


      const coordinateQuality =
        (validCoordinates /
          aisData.length) *
        100;


      const speedQuality =
        (validSpeed /
          aisData.length) *
        100;


      const dataQuality =
        (coordinateQuality +
          speedQuality) /
        2;


      return {

        records:
          aisData.length,

        vessels:
          vessels.size,

        moving,

        movingPercentage:
          (moving /
            aisData.length) *
          100,

        averageSOG,

        dataQuality,

      };

    }, [aisData]);


  /* =======================================================
     FINAL TELEMETRY DATA
  ======================================================= */

  const finalData =
    useMemo(() => {

      /*
       * Prefer backend telemetry.
       *
       * If backend does not return
       * usable data, use AIS records.
       */

      if (data.length > 0) {
        return data;
      }


      return aisData.map(
        (row, index) => ({
          id:
            row.id ||
            `AIS-${index + 1}`,

          mmsi:
            row.mmsi,

          timestamp:
            row.timestamp,

          value:
            row.sog,

          sog:
            row.sog,

          lat:
            row.lat,

          lon:
            row.lon,
        })
      );

    }, [
      data,
      aisData,
    ]);


  /* =======================================================
     ACTIVE SYSTEMS
  ======================================================= */

  const activeSystems =
    useMemo(() => {

      /*
       * AIS vessels currently moving.
       */

      if (
        aisMetrics.vessels >
        0
      ) {

        return Math.max(
          1,
          Math.min(
            aisMetrics.vessels,
            aisMetrics.moving
          )
        );

      }


      /*
       * Backend fallback.
       */

      if (
        finalData.length >
        0
      ) {

        return finalData.length;

      }


      return 0;

    }, [
      aisMetrics,
      finalData,
    ]);


  /* =======================================================
     STATUS
  ======================================================= */

  const status =
    loading
      ? "LOADING"
      : finalData.length > 0
      ? source === "BACKEND"
        ? "LIVE"
        : "AIS LIVE"
      : aisError
      ? "ERROR"
      : "NO DATA";


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          gap:
            "15px",
          flexWrap:
            "wrap",
          marginBottom:
            "20px",
        }}
      >

        <div>

          <h1>
            📡 Telemetry Phase
          </h1>

          <p
            style={{
              color:
                "#94a3b8",
              marginTop:
                "5px",
              fontSize:
                "13px",
            }}
          >
            AIS and runtime telemetry
            monitoring
          </p>

        </div>


        {/* AIS STATUS */}

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "8px",
            padding:
              "8px 13px",
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
          }}
        >

          {/* <span
            style={{
              width:
                "8px",
              height:
                "8px",
              borderRadius:
                "50%",
              background:
                loading
                  ? "#f59e0b"
                  : aisError &&
                    !finalData.length
                  ? "#ef4444"
                  : "#22c55e",
            }}
          />

          <span>
            {loading
              ? "LOADING"
              : finalData.length > 0
              ? source === "BACKEND"
                ? "BACKEND + AIS"
                : "AIS TELEMETRY"
              : "NO TELEMETRY"}
          </span> */}

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="card"
          style={{
            padding:
              "15px",
            marginBottom:
              "20px",
            border:
              "1px solid #ff4d4d",
            borderRadius:
              "8px",
          }}
        >

          <h3>
            ⚠️ Telemetry Error
          </h3>

          <p>
            {error}
          </p>

        </div>
      )}


      {/* =================================================
          AIS FALLBACK NOTICE
      ================================================= */}

      {!loading &&
        !data.length &&
        aisData.length > 0 && (
          <div
            className="card"
            style={{
              padding:
                "12px 15px",
              marginBottom:
                "20px",
              border:
                "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius:
                "8px",
              color:
                "#7dd3fc",
            }}
          >
            Backend telemetry is unavailable.
            Dashboard is displaying AIS telemetry
            from <strong>AIS_file.csv</strong>.
          </div>
        )}


      {/* =================================================
          KPI GRID
      ================================================= */}

      <div className="grid">

        <StatCardTask26
          title="Total Signals"
          value={
            aisMetrics.records > 0
              ? aisMetrics.records
              : finalData.length
          }
        />


        <StatCardTask26
          title="Active Systems"
          value={
            activeSystems
          }
        />


        <StatCardTask26
          title="Status"
          value={
            status
          }
        />

      </div>


      {/* =================================================
          AIS DETAILS
      ================================================= */}

      {aisMetrics.records >
        0 && (

        <div
          className="grid"
          style={{
            marginTop:
              "20px",
          }}
        >

          <StatCardTask26
            title="AIS Vessels"
            value={
              aisMetrics.vessels
            }
          />


          <StatCardTask26
            title="Moving Records"
            value={
              aisMetrics.moving
            }
          />


          <StatCardTask26
            title="Data Quality"
            value={`${Math.round(
              aisMetrics.dataQuality
            )}%`}
          />


          <StatCardTask26
            title="Avg SOG"
            value={`${aisMetrics.averageSOG.toFixed(
              2
            )} kn`}
          />

        </div>

      )}


      {/* =================================================
          TELEMETRY CHART
      ================================================= */}

      {!loading &&
        finalData.length > 0 && (

          <TelemetryChartTask26
            data={
              finalData
            }
          />

        )}


      {/* =================================================
          NO DATA
      ================================================= */}

      {!loading &&
        finalData.length === 0 && (

          <div
            className="card"
            style={{
              marginTop:
                "20px",
              padding:
                "20px",
              textAlign:
                "center",
            }}
          >

            <h3>
              No Telemetry Data Found
            </h3>

            <p
              style={{
                color:
                  "#94a3b8",
                marginTop:
                  "8px",
              }}
            >
              Start the backend or make sure
              <strong>
                {" "}public/AIS_file.csv
              </strong>
              {" "}is available.
            </p>

          </div>

        )}

    </div>

  );
}