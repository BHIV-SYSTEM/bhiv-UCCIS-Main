import { useEffect, useMemo, useState } from "react";
import API from "../api";

import RuntimeLogs from "../components/RuntimeLogs";
import RuntimeChart from "../components/RuntimeChart";
import StatCardTask26 from "../components/StatCardTask26";


/* =========================================================
   AIS CONFIGURATION
   Put AIS_file.csv inside:

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
   AIS FIELD HELPER
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

  const matchedKey =
    keys.find((key) =>
      normalizedNames.includes(
        String(key)
          .toLowerCase()
          .trim()
      )
    );

  return matchedKey
    ? row[matchedKey]
    : "";
};


/* =========================================================
   NORMALIZE AIS DATA
========================================================= */

const normalizeAIS = (
  rows
) => {
  return rows.map(
    (row, index) => {

      const mmsi =
        String(
          getField(row, [
            "MMSI",
            "mmsi",
            "Mmsi",
            "vessel_id",
            "vesselId",
          ]) || ""
        ).trim();


      const sog =
        Number(
          getField(row, [
            "SOG",
            "sog",
            "Speed",
            "speed",
          ])
        );


      const lat =
        Number(
          getField(row, [
            "LAT",
            "lat",
            "Latitude",
            "latitude",
          ])
        );


      const lon =
        Number(
          getField(row, [
            "LON",
            "lon",
            "Longitude",
            "longitude",
          ])
        );


      return {
        id:
          mmsi ||
          `AIS-${index + 1}`,

        mmsi,

        sog,

        lat,

        lon,

        moving:
          Number.isFinite(sog) &&
          sog > 0,

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
      };

    }
  );
};


/* =========================================================
   BUILD AIS RUNTIME LOGS
========================================================= */

const buildAISRuntimeLogs = (
  aisData
) => {

  if (!aisData.length) {
    return [];
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


  const invalidCoordinates =
    aisData.filter(
      (row) =>
        !row.validCoordinates
    ).length;


  const invalidSpeed =
    aisData.filter(
      (row) =>
        !row.validSpeed
    ).length;


  const movingPercentage =
    aisData.length > 0
      ? (moving /
          aisData.length) *
        100
      : 0;


  const quality =
    aisData.length > 0
      ? (
          (
            aisData.filter(
              (row) =>
                row.validCoordinates
            ).length /
            aisData.length
          ) *
          100 +
          (
            aisData.filter(
              (row) =>
                row.validSpeed
            ).length /
            aisData.length
          ) *
          100
        ) /
        2
      : 0;


  const logs = [];


  /* -----------------------------------------------
     TELEMETRY MODULE
  ------------------------------------------------ */

  logs.push({
    id: "ais-runtime-telemetry",
    module: "Telemetry",
    level:
      quality >= 90
        ? "INFO"
        : "WARN",
    message:
      `AIS telemetry synchronized: ${aisData.length.toLocaleString()} records`,
    timestamp:
      new Date().toISOString(),
  });


  /* -----------------------------------------------
     VESSEL MODULE
  ------------------------------------------------ */

  logs.push({
    id: "ais-runtime-vessels",
    module: "Vessel Monitoring",
    level: "INFO",
    message:
      `${vessels.size.toLocaleString()} unique vessels detected`,
    timestamp:
      new Date().toISOString(),
  });


  /* -----------------------------------------------
     ACTIVITY MODULE
  ------------------------------------------------ */

  logs.push({
    id: "ais-runtime-activity",
    module: "Activity Engine",
    level:
      movingPercentage >= 40
        ? "INFO"
        : "WARN",
    message:
      `${moving.toLocaleString()} moving AIS records (${Math.round(
        movingPercentage
      )}%)`,
    timestamp:
      new Date().toISOString(),
  });


  /* -----------------------------------------------
     DATA QUALITY MODULE
  ------------------------------------------------ */

  logs.push({
    id: "ais-runtime-quality",
    module: "Data Quality",
    level:
      quality >= 90
        ? "INFO"
        : quality >= 70
        ? "WARN"
        : "ERROR",
    message:
      `AIS data quality ${Math.round(
        quality
      )}%`,
    timestamp:
      new Date().toISOString(),
  });


  /* -----------------------------------------------
     VALIDATION MODULE
  ------------------------------------------------ */

  logs.push({
    id: "ais-runtime-validation",
    module: "Validation",
    level:
      invalidCoordinates +
        invalidSpeed >
      0
        ? "WARN"
        : "INFO",
    message:
      `${invalidCoordinates.toLocaleString()} invalid coordinates and ${invalidSpeed.toLocaleString()} invalid speed records`,
    timestamp:
      new Date().toISOString(),
  });


  return logs;
};


/* =========================================================
   COMPONENT
========================================================= */

export default function RuntimeTask26() {

  const [logs, setLogs] =
    useState([]);

  const [
    backendResponse,
    setBackendResponse,
  ] = useState([]);

  const [
    aisData,
    setAISData,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    source,
    setSource,
  ] = useState("");


  /* =======================================================
     LOAD BACKEND + AIS
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    const fetchRuntime =
      async () => {

        try {

          console.log(
            "Task 26: Fetching runtime..."
          );


          const res =
            await API.get(
              "/runtime"
            );


          console.log(
            "Runtime Response:",
            res.data
          );


          if (!mounted) {
            return;
          }


          setBackendResponse(
            res.data
          );


          let backendLogs =
            [];


          if (
            Array.isArray(
              res.data
            )
          ) {

            backendLogs =
              res.data;

          } else if (
            Array.isArray(
              res.data?.logs
            )
          ) {

            backendLogs =
              res.data.logs;

          } else if (
            Array.isArray(
              res.data?.data
            )
          ) {

            backendLogs =
              res.data.data;

          }


          if (
            backendLogs.length >
            0
          ) {

            setLogs(
              backendLogs
            );

            setSource(
              "BACKEND"
            );

          }


        } catch (err) {

          console.warn(
            "Task 26 Runtime backend unavailable:",
            err
          );

          setError(
            "Backend runtime unavailable. Using AIS runtime data."
          );

        }

      };


    const fetchAIS =
      async () => {

        try {

          console.log(
            "Task 26: Loading AIS runtime data..."
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
            parseCSV(
              csvText
            );


          if (!parsed.length) {

            throw new Error(
              "AIS_file.csv contains no records."
            );

          }


          const normalized =
            normalizeAIS(
              parsed
            );


          if (!mounted) {
            return;
          }


          setAISData(
            normalized
          );


          /*
           * Use AIS only when backend
           * does not provide runtime logs.
           */

          if (
            !logs.length
          ) {

            const aisLogs =
              buildAISRuntimeLogs(
                normalized
              );


            setLogs(
              aisLogs
            );

            setSource(
              "AIS"
            );

          }


          console.log(
            "Task 26 AIS runtime records:",
            normalized.length
          );


        } catch (err) {

          console.error(
            "Task 26 AIS Runtime Error:",
            err
          );

        }

      };


    const loadData =
      async () => {

        setLoading(
          true
        );

        await Promise.all([
          fetchRuntime(),
          fetchAIS(),
        ]);

        if (mounted) {

          setLoading(
            false
          );

        }

      };


    loadData();


    const interval =
      setInterval(
        loadData,
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
     CREATE FINAL LOG DATA
  ======================================================= */

  const finalLogs =
    useMemo(() => {

      if (
        logs.length >
        0
      ) {
        return logs;
      }


      if (
        aisData.length >
        0
      ) {
        return buildAISRuntimeLogs(
          aisData
        );
      }


      return [];

    }, [
      logs,
      aisData,
    ]);


  /* =======================================================
     STATISTICS
  ======================================================= */

  const total =
    finalLogs.length;


  const errors =
    finalLogs.filter(
      (log) =>
        String(
          log.level || ""
        )
          .toUpperCase() ===
        "ERROR"
    ).length;


  const warnings =
    finalLogs.filter(
      (log) =>
        ["WARN", "WARNING"].includes(
          String(
            log.level || ""
          )
            .toUpperCase()
        )
    ).length;


  const info =
    finalLogs.filter(
      (log) =>
        String(
          log.level || ""
        )
          .toUpperCase() ===
        "INFO"
    ).length;


  /* =======================================================
     CHART DATA
     Different AIS-derived values for each runtime module
  ======================================================= */

  const chartData =
    useMemo(() => {

      if (!aisData.length) {
        // If AIS is not available, keep the backend runtime chart.
        const grouped =
          finalLogs.reduce(
            (acc, log) => {

              const moduleName =
                log.module ||
                log.service ||
                log.component ||
                "Unknown";

              if (!acc[moduleName]) {
                acc[moduleName] = {
                  module: moduleName,
                  count: 0,
                };
              }

              acc[moduleName].count += 1;
              return acc;
            },
            {}
          );

        return Object.values(grouped);
      }

      const totalRecords = aisData.length;

      const uniqueVessels =
        new Set(
          aisData
            .map((row) => row.mmsi)
            .filter(Boolean)
        ).size;

      const movingRecords =
        aisData.filter(
          (row) => row.moving
        ).length;

      const validRecords =
        aisData.filter(
          (row) =>
            row.validCoordinates &&
            row.validSpeed
        ).length;

      const invalidRecords =
        aisData.filter(
          (row) =>
            !row.validCoordinates ||
            !row.validSpeed
        ).length;

      // Convert the raw AIS counts into readable chart values.
      // This keeps the bars visually distinct instead of every
      // module having a count of 1.
      const telemetryValue =
        Math.max(1, Math.round(totalRecords / 1000));

      const vesselValue =
        Math.max(1, Math.round(uniqueVessels / 1000));

      const activityValue =
        totalRecords > 0
          ? Math.max(1, Math.round(
              (movingRecords / totalRecords) * 100
            ))
          : 0;

      const qualityValue =
        totalRecords > 0
          ? Math.max(1, Math.round(
              (validRecords / totalRecords) * 100
            ))
          : 0;

      const validationValue =
        totalRecords > 0
          ? Math.max(0, Math.round(
              (invalidRecords / totalRecords) * 100
            ))
          : 0;

      return [
        {
          module: "Telemetry",
          count: telemetryValue,
        },
        {
          module: "Vessel Monitoring",
          count: vesselValue,
        },
        {
          module: "Activity Engine",
          count: activityValue,
        },
        {
          module: "Data Quality",
          count: qualityValue,
        },
        {
          module: "Validation",
          count: validationValue,
        },
      ];

    }, [aisData, finalLogs]);


  /* =======================================================
     AIS SUMMARY
  ======================================================= */

  const aisVessels =
    useMemo(() => {

      return new Set(
        aisData
          .map(
            (row) =>
              row.mmsi
          )
          .filter(Boolean)
      ).size;

    }, [aisData]);


  const aisMoving =
    useMemo(() => {

      return aisData.filter(
        (row) =>
          row.moving
      ).length;

    }, [aisData]);


  const aisQuality =
    useMemo(() => {

      if (!aisData.length) {
        return 0;
      }


      const coordinates =
        aisData.filter(
          (row) =>
            row.validCoordinates
        ).length;


      const speed =
        aisData.filter(
          (row) =>
            row.validSpeed
        ).length;


      return Math.round(
        (
          (coordinates /
            aisData.length) *
            100 +
          (speed /
            aisData.length) *
            100
        ) /
          2
      );

    }, [aisData]);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <div className="page">

        <h2>
          Loading Runtime...
        </h2>

        <p
          style={{
            color:
              "#94a3b8",
          }}
        >
          Loading backend runtime
          and AIS telemetry...
        </p>

      </div>

    );

  }


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
          justifyContent:
            "space-between",
          alignItems:
            "center",
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
            🧾 Runtime Phase
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
            Runtime logs,
            operational activity
            and AIS telemetry
          </p>

        </div>


        {/* SOURCE STATUS */}

        {/* <div
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

          <span
            style={{
              width:
                "8px",
              height:
                "8px",
              borderRadius:
                "50%",
              background:
                source ===
                "BACKEND"
                  ? "#22c55e"
                  : source ===
                    "AIS"
                  ? "#38bdf8"
                  : "#f59e0b",
            }}
          />

          <span>
            {source ===
            "BACKEND"
              ? "BACKEND RUNTIME"
              : source ===
                "AIS"
              ? "AIS RUNTIME"
              : "RUNTIME"}
          </span>

        </div> */}

      </div>


      {/* =================================================
          WARNING
      ================================================= */}

      {error && (
        <div
          className="card"
          style={{
            padding:
              "12px 15px",
            marginBottom:
              "20px",
            border:
              "1px solid rgba(245,158,11,.35)",
            borderRadius:
              "8px",
            color:
              "#fbbf24",
          }}
        >
          {error}
        </div>
      )}


      {/* =================================================
          RUNTIME KPI
      ================================================= */}

      <div className="grid">

        <StatCardTask26
          title="Total Logs"
          value={
            total
          }
        />


        <StatCardTask26
          title="Errors"
          value={
            errors
          }
        />


        <StatCardTask26
          title="Warnings"
          value={
            warnings
          }
        />


        <StatCardTask26
          title="Info"
          value={
            info
          }
        />

      </div>


      {/* =================================================
          AIS KPI
      ================================================= */}

      {aisData.length >
        0 && (

        <div
          className="grid"
          style={{
            marginTop:
              "20px",
          }}
        >

          <StatCardTask26
            title="AIS Records"
            value={
              aisData.length
            }
          />


          <StatCardTask26
            title="AIS Vessels"
            value={
              aisVessels
            }
          />


          <StatCardTask26
            title="Moving Records"
            value={
              aisMoving
            }
          />


          <StatCardTask26
            title="AIS Quality"
            value={`${aisQuality}%`}
          />

        </div>

      )}


      {/* =================================================
          RUNTIME CHART
      ================================================= */}

      <RuntimeChart
        data={
          chartData
        }
      />


      {/* =================================================
          RUNTIME LOGS
      ================================================= */}

      <RuntimeLogs
        data={
          finalLogs
        }
      />

    </div>

  );
}