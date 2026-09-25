import { useEffect, useMemo, useState } from "react";

/* =========================================================
   AIS CONFIGURATION
   Put the file here:

   frontend/public/AIS_file.csv

   Expected columns:
   MMSI
   BaseDateTime
   LAT
   LON
   SOG
   VesselType
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   CSV PARSER
========================================================= */

const parseCSVLine = (line) => {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];

    if (character === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      character === "," &&
      !insideQuotes
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current.trim());

  return values;
};

const parseAISCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(
      (line) => line.trim() !== ""
    );

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(
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

      const record = {};

      headers.forEach(
        (header, index) => {
          record[header] =
            values[index] ?? "";
        }
      );

      return record;
    });
};

/* =========================================================
   AIS FIELD HELPER
========================================================= */

const getAISField = (
  row,
  names
) => {
  const keys = Object.keys(
    row || {}
  );

  const wanted = names.map(
    (name) =>
      String(name)
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

  return matchedKey
    ? row[matchedKey]
    : "";
};

/* =========================================================
   NORMALIZE AIS RECORD
========================================================= */

const normalizeAISRow = (row) => {
  const mmsi = String(
    getAISField(row, [
      "MMSI",
      "mmsi",
      "Mmsi",
      "vessel_id",
      "vesselId",
    ]) || ""
  ).trim();

  const timestamp = String(
    getAISField(row, [
      "BaseDateTime",
      "baseDateTime",
      "Timestamp",
      "timestamp",
      "DateTime",
      "datetime",
    ]) || ""
  ).trim();

  const lat = Number(
    getAISField(row, [
      "LAT",
      "lat",
      "Latitude",
      "latitude",
    ])
  );

  const lon = Number(
    getAISField(row, [
      "LON",
      "lon",
      "Longitude",
      "longitude",
    ])
  );

  const sog = Number(
    getAISField(row, [
      "SOG",
      "sog",
      "Speed",
      "speed",
    ])
  );

  const vesselType =
    String(
      getAISField(row, [
        "VesselType",
        "vessel_type",
        "vesselType",
        "Vessel Type",
        "type",
      ]) || "Unknown"
    ).trim();

  return {
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType,
  };
};

/* =========================================================
   SUMMARY CARDS TASK 35
========================================================= */

export default function SummaryCardsTask35() {
  const [aisRows, setAISRows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD AIS DATA
  ======================================================= */

  const loadAISData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          AIS_FILE,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          `AIS_file.csv returned HTTP ${response.status}`
        );
      }

      const csvText =
        await response.text();

      const parsedRows =
        parseAISCSV(csvText);

      const normalizedRows =
        parsedRows.map(
          normalizeAISRow
        );

      setAISRows(
        normalizedRows
      );

      console.log(
        "Task 35 AIS records loaded:",
        normalizedRows.length
      );
    } catch (err) {
      console.error(
        "Task 35 AIS loading error:",
        err
      );

      setAISRows([]);

      setError(
        "Unable to load AIS_file.csv"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD + AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    loadAISData();

    const interval =
      setInterval(
        loadAISData,
        30000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, []);

  /* =======================================================
     CALCULATE AIS SUMMARY
  ======================================================= */

  const stats =
    useMemo(() => {
      const totalSignals =
        aisRows.length;

      let incidents = 0;
      let escalations = 0;

      const traceIds =
        new Set();

      aisRows.forEach(
        (row) => {
          /* ---------------------------------------------
             UNIQUE TRACE / MMSI
          --------------------------------------------- */

          if (row.mmsi) {
            traceIds.add(
              row.mmsi
            );
          }

          /* ---------------------------------------------
             VALID COORDINATES
          --------------------------------------------- */

          const validLatitude =
            Number.isFinite(
              row.lat
            ) &&
            row.lat >= -90 &&
            row.lat <= 90;

          const validLongitude =
            Number.isFinite(
              row.lon
            ) &&
            row.lon >= -180 &&
            row.lon <= 180;

          /* ---------------------------------------------
             VALID SOG
          --------------------------------------------- */

          const validSOG =
            Number.isFinite(
              row.sog
            ) &&
            row.sog >= 0;

          /* ---------------------------------------------
             INCIDENT
             Stationary AIS activity
             SOG = 0
          --------------------------------------------- */

          if (
            validSOG &&
            row.sog === 0
          ) {
            incidents += 1;
          }

          /* ---------------------------------------------
             ESCALATION
             Invalid AIS telemetry
          --------------------------------------------- */

          if (
            !validSOG ||
            !validLatitude ||
            !validLongitude
          ) {
            escalations += 1;
          }
        }
      );

      return {
        activeSignals:
          totalSignals,

        incidents,

        escalations,

        traces:
          traceIds.size,
      };
    }, [aisRows]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div
        className="cards"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        {[
          "Signals",
          "Incidents",
          "Escalations",
          "Trace IDs",
        ].map((title) => (
          <div
            key={title}
            className="card"
            style={{
              background:
                "#111827",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3>{title}</h3>

            <h1
              style={{
                margin: 0,
                marginTop: "8px",
              }}
            >
              ...
            </h1>
          </div>
        ))}
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {/* =================================================
          AIS ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "10px 14px",
            background:
              "#fff7ed",
            border:
              "1px solid #fed7aa",
            borderRadius: "8px",
            color: "#c2410c",
            fontSize: "13px",
          }}
        >
          {error}

          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
            }}
          >
            Make sure AIS_file.csv
            exists inside:
            <strong>
              {" "}
              frontend/public/AIS_file.csv
            </strong>
          </div>
        </div>
      )}

      {/* =================================================
          AIS STATUS
      ================================================= */}

      {/* <div
        style={{
          marginBottom: "12px",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        Data Source:{" "}
        <strong>
          AIS_file.csv
        </strong>
        {" • "}
        {aisRows.length.toLocaleString()}
        {" AIS records"}
      </div> */}

      {/* =================================================
          CARDS
      ================================================= */}

      <div className="cards">

        {/* =================================================
            SIGNALS
        ================================================= */}

        <div
          className="card"
          style={{
            background:
              "#2563EB",
            color: "white",
          }}
        >
          <h3>
            Signals
          </h3>

          <h1 style={{ color: "black" }}>
            {stats.activeSignals.toLocaleString()}
          </h1>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.85,
            }}
          >
            Total AIS Records
          </span>
        </div>

        {/* =================================================
            INCIDENTS
        ================================================= */}

        <div
          className="card"
          style={{
            background:
              "#F59E0B",
            color: "white",
          }}
        >
          <h3>
            Incidents
          </h3>

          <h1>
            {stats.incidents.toLocaleString()}
          </h1>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.85,
            }}
          >
            Stationary AIS Activity
          </span>
        </div>

        {/* =================================================
            ESCALATIONS
        ================================================= */}

        <div
          className="card"
          style={{
            background:
              "#DC2626",
            color: "white",
          }}
        >
          <h3>
            Escalations
          </h3>

          <h1>
            {stats.escalations.toLocaleString()}
          </h1>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.85,
            }}
          >
            AIS Telemetry Exceptions
          </span>
        </div>

        {/* =================================================
            TRACE IDs
        ================================================= */}

        <div
          className="card"
          style={{
            background:
              "#8B5CF6",
            color: "white",
          }}
        >
          <h3>
            Trace IDs
          </h3>

          <h1>
            {stats.traces.toLocaleString()}
          </h1>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.85,
            }}
          >
            Unique MMSI / Vessels
          </span>
        </div>

      </div>
    </div>
  );
}