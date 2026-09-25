import React, { useEffect, useMemo, useState } from "react";

const AIS_FILE = "/AIS_file.csv";
const REFRESH_INTERVAL = 30000;

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      char === "," &&
      !insideQuotes
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());

  return values;
}

function parseCSV(text) {
  const lines = text
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
      .trim()
      .toLowerCase()
      .replace(/^"|"$/g, "")
  );

  return lines.slice(1).map((line) => {
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
}

/* =========================================================
   GET FIELD
========================================================= */

function getField(row, names) {
  for (const name of names) {
    const key =
      name.toLowerCase();

    if (
      Object.prototype.hasOwnProperty.call(
        row,
        key
      ) &&
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

/* =========================================================
   NUMBER
========================================================= */

function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(
    String(value)
      .replace(/,/g, "")
      .trim()
  );

  return Number.isFinite(number)
    ? number
    : null;
}

/* =========================================================
   NORMALIZE AIS
========================================================= */

function normalizeAIS(row) {
  const sog = toNumber(
    getField(row, [
      "sog",
      "speed",
      "speed_over_ground",
      "speedoverground",
      "velocity"
    ])
  );

  const lat = toNumber(
    getField(row, [
      "lat",
      "latitude"
    ])
  );

  const lon = toNumber(
    getField(row, [
      "lon",
      "lng",
      "longitude"
    ])
  );

  const validCoordinates =
    lat !== null &&
    lon !== null &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSpeed =
    sog !== null &&
    sog >= 0;

  return {
    ...row,
    sog,
    lat,
    lon,
    validCoordinates,
    validSpeed,
    moving:
      validSpeed && sog > 0,
    stationary:
      validSpeed && sog === 0
  };
}

/* =========================================================
   LOAD AIS
========================================================= */

async function loadAISFile() {
  const response = await fetch(
    `${AIS_FILE}?t=${Date.now()}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load AIS_file.csv (${response.status})`
    );
  }

  const text =
    await response.text();

  return parseCSV(text).map(
    normalizeAIS
  );
}

/* =========================================================
   ESCALATION CALCULATION
========================================================= */

function calculateEscalations(records) {
  if (!records.length) {
    return [];
  }

  const moving = records.filter(
    (record) =>
      record.moving
  ).length;

  const stationary =
    records.filter(
      (record) =>
        record.stationary
    ).length;

  const invalid =
    records.filter(
      (record) =>
        !record.validCoordinates ||
        !record.validSpeed
    ).length;

  const total =
    records.length;

  /*
   * Create meaningful levels from
   * AIS activity volume.
   *
   * These are dashboard-derived
   * escalation indicators, not
   * actual civic emergency events.
   */

  const level1 = Math.max(
    Math.round(
      moving * 0.15
    ),
    1
  );

  const level2 = Math.max(
    Math.round(
      stationary * 0.08
    ),
    1
  );

  const level3 = Math.max(
    invalid +
      Math.round(
        total * 0.02
      ),
    1
  );

  return [
    {
      id: 1,
      level: "LEVEL 1",
      count: level1,
      description:
        "Routine AIS activity requiring monitoring"
    },
    {
      id: 2,
      level: "LEVEL 2",
      count: level2,
      description:
        "Stationary activity requiring review"
    },
    {
      id: 3,
      level: "LEVEL 3",
      count: level3,
      description:
        "Data validation or exception review"
    }
  ];
}

/* =========================================================
   COMPONENT
========================================================= */

const Escalations = () => {
  const [aisRecords, setAisRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setError("");

      const records =
        await loadAISFile();

      setAisRecords(records);
    } catch (err) {
      console.error(
        "Escalations AIS error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load AIS data"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD + REFRESH
  ======================================================= */

  useEffect(() => {
    loadData();

    const interval =
      setInterval(
        loadData,
        REFRESH_INTERVAL
      );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     ESCALATION DATA
  ======================================================= */

  const data = useMemo(
    () =>
      calculateEscalations(
        aisRecords
      ),
    [aisRecords]
  );

  /* =======================================================
     TOTAL ESCALATIONS
  ======================================================= */

  const totalEscalations =
    data.reduce(
      (sum, item) =>
        sum + item.count,
      0
    );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="card">

      <h2>
        Escalations
      </h2>

      {/* STATUS */}

      {/* <div
        style={{
          marginBottom: "15px",
          fontSize: "13px",
          fontWeight: 600,
          color: error
            ? "#dc2626"
            : "#16a34a"
        }}
      >
        {loading
          ? "Loading AIS data..."
          : error
          ? "AIS data unavailable"
          : `AIS connected • ${aisRecords.length.toLocaleString()} records`}
      </div> */}

      {/* SUMMARY */}

      <div
        style={{
          padding: "12px",
          marginBottom: "18px",
          borderRadius: "8px",
          background:
            "#111827",
          color: "#ffffff",
          textAlign: "center"
        }}
      >
        <strong
          style={{
            fontSize: "22px"
          }}
        >
          {totalEscalations}
        </strong>

        <div
          style={{
            fontSize: "13px",
            marginTop: "4px",
            color: "#d1d5db"
          }}
        >
          Total Escalation Indicators
        </div>
      </div>

      {/* ESCALATION LEVELS */}

      {data.map(
        (item) => (
          <div
            key={item.id}
            style={{
              padding:
                "12px",
              marginBottom:
                "10px",
              borderRadius:
                "8px",
              border:
                "1px solid #374151"
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center"
              }}
            >

              <div>

                <p
                  style={{
                    margin:
                      "0 0 5px",
                    fontWeight:
                      "700"
                  }}
                >
                  ID: {item.id}
                </p>

                <p
                  style={{
                    margin:
                      "0 0 5px",
                    fontWeight:
                      "600"
                  }}
                >
                  {item.level}
                </p>

              </div>

              <div
                style={{
                  fontSize:
                    "22px",
                  fontWeight:
                    "700"
                }}
              >
                {item.count}
              </div>

            </div>

            <p
              style={{
                margin:
                  "6px 0 0",
                fontSize:
                  "13px",
                color:
                  "#9ca3af"
              }}
            >
              {item.description}
            </p>

          </div>
        )
      )}

      {/* EMPTY STATE */}

      {!loading &&
        !error &&
        data.length === 0 && (
          <div
            style={{
              textAlign:
                "center",
              padding:
                "20px",
              color:
                "#9ca3af"
            }}
          >
            No escalation
            data available.
          </div>
        )}

    </div>
  );
};

export default Escalations;