import React, {
  useEffect,
  useMemo,
  useState
} from "react";

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

/* =========================================================
   PARSE CSV
========================================================= */

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(
      (line) =>
        line.trim() !== ""
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
      "latitude",
      "y"
    ])
  );

  const lon = toNumber(
    getField(row, [
      "lon",
      "lng",
      "longitude",
      "x"
    ])
  );

  const mmsi = String(
    getField(row, [
      "mmsi",
      "vessel_id",
      "vesselid",
      "ship_id",
      "shipid",
      "imo"
    ])
  ).trim();

  const timestamp = String(
    getField(row, [
      "timestamp",
      "time",
      "datetime",
      "date_time",
      "date"
    ])
  ).trim();

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

  const moving =
    validSpeed &&
    sog > 0;

  const stationary =
    validSpeed &&
    sog === 0;

  return {
    ...row,
    mmsi,
    sog,
    lat,
    lon,
    timestamp,
    validCoordinates,
    validSpeed,
    moving,
    stationary
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
   BUILD REPLAY DATA
========================================================= */

function buildReplayData(records) {
  if (!records.length) {
    return [];
  }

  const total =
    records.length;

  const moving =
    records.filter(
      (record) =>
        record.moving
    ).length;

  const stationary =
    records.filter(
      (record) =>
        record.stationary
    ).length;

  const valid =
    records.filter(
      (record) =>
        record.validCoordinates &&
        record.validSpeed
    ).length;

  const invalid =
    Math.max(
      total - valid,
      0
    );

  const vesselSet =
    new Set();

  records.forEach(
    (record) => {
      if (record.mmsi) {
        vesselSet.add(
          record.mmsi
        );
      }
    }
  );

  const uniqueVessels =
    vesselSet.size;

  return [
    {
      id: 1,
      action:
        "AIS Signal Generated",
      count: total,
      description:
        `${total.toLocaleString()} AIS records available for replay.`,
      status: "COMPLETED"
    },

    {
      id: 2,
      action:
        "Telemetry Received",
      count: valid,
      description:
        `${valid.toLocaleString()} records contain valid telemetry.`,
      status: "COMPLETED"
    },

    {
      id: 3,
      action:
        "Vessel Activity Processed",
      count: moving,
      description:
        `${moving.toLocaleString()} moving AIS records processed.`,
      status: "PROCESSED"
    },

    {
      id: 4,
      action:
        "Stationary Activity Detected",
      count: stationary,
      description:
        `${stationary.toLocaleString()} stationary records identified.`,
      status: "REVIEW"
    },

    {
      id: 5,
      action:
        "Telemetry Validation",
      count: invalid,
      description:
        `${invalid.toLocaleString()} records require validation.`,
      status:
        invalid > 0
          ? "REVIEW"
          : "COMPLETED"
    },

    {
      id: 6,
      action:
        "Vessel Monitoring",
      count: uniqueVessels,
      description:
        `${uniqueVessels.toLocaleString()} unique vessels represented in the dataset.`,
      status: "ACTIVE"
    }
  ];
}

/* =========================================================
   COMPONENT
========================================================= */

const Replay = () => {
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
        "Replay AIS error:",
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
     REPLAY DATA
  ======================================================= */

  const replayData =
    useMemo(
      () =>
        buildReplayData(
          aisRecords
        ),
      [aisRecords]
    );

  /* =======================================================
     TOTAL
  ======================================================= */

  const totalReplayEvents =
    replayData.reduce(
      (sum, item) =>
        sum + item.count,
      0
    );

  /* =======================================================
     STATUS COLOR
  ======================================================= */

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "COMPLETED":
        return {
          background:
            "#166534",
          color:
            "#ffffff"
        };

      case "PROCESSED":
        return {
          background:
            "#1d4ed8",
          color:
            "#ffffff"
        };

      case "ACTIVE":
        return {
          background:
            "#047857",
          color:
            "#ffffff"
        };

      case "REVIEW":
        return {
          background:
            "#b45309",
          color:
            "#ffffff"
        };

      default:
        return {
          background:
            "#374151",
          color:
            "#ffffff"
        };
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="card">

      <h2>
        Replay Session
      </h2>

      {/* STATUS */}

      {/* <div
        style={{
          marginBottom:
            "15px",
          fontSize:
            "13px",
          fontWeight:
            600,
          color:
            error
              ? "#dc2626"
              : "#16a34a"
        }}
      >
        {loading
          ? "Loading AIS replay data..."
          : error
          ? "AIS data unavailable"
          : `AIS connected • ${aisRecords.length.toLocaleString()} records`}
      </div> */}

      {/* SUMMARY */}

      <div
        style={{
          padding:
            "14px",
          marginBottom:
            "18px",
          borderRadius:
            "10px",
          background:
            "#111827",
          color:
            "#ffffff",
          textAlign:
            "center"
        }}
      >

        <div
          style={{
            fontSize:
              "24px",
            fontWeight:
              700
          }}
        >
          {replayData.length}
        </div>

        <div
          style={{
            marginTop:
              "4px",
            fontSize:
              "13px",
            color:
              "#d1d5db"
          }}
        >
          Replay Stages
        </div>

        <div
          style={{
            marginTop:
              "8px",
            fontSize:
              "12px",
            color:
              "#9ca3af"
          }}
        >
          {totalReplayEvents.toLocaleString()}
          {" "}related AIS records
        </div>

      </div>

      {/* REPLAY EVENTS */}

      {replayData.map(
        (item) => (
          <div
            key={item.id}
            style={{
              padding:
                "14px",
              marginBottom:
                "12px",
              borderRadius:
                "10px",
              border:
                "1px solid #374151",
              background:
                "#111827",
              color:
                "#ffffff"
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap:
                  "12px"
              }}
            >

              <div>

                <div
                  style={{
                    fontSize:
                      "11px",
                    color:
                      "#9ca3af",
                    marginBottom:
                      "4px"
                  }}
                >
                  REPLAY STEP{" "}
                  {item.id}
                </div>

                <div
                  style={{
                    fontSize:
                      "15px",
                    fontWeight:
                      700
                  }}
                >
                  {item.action}
                </div>

              </div>

              <span
                style={{
                  padding:
                    "5px 10px",
                  borderRadius:
                    "999px",
                  fontSize:
                    "10px",
                  fontWeight:
                    700,
                  whiteSpace:
                    "nowrap",
                  ...getStatusStyle(
                    item.status
                  )
                }}
              >
                {item.status}
              </span>

            </div>

            <p
              style={{
                margin:
                  "9px 0 0",
                fontSize:
                  "13px",
                color:
                  "#d1d5db",
                lineHeight:
                  "1.5"
              }}
            >
              {item.description}
            </p>

            <div
              style={{
                marginTop:
                  "8px",
                fontSize:
                  "12px",
                color:
                  "#9ca3af"
              }}
            >
              Records:{" "}
              <strong
                style={{
                  color:
                    "#ffffff"
                }}
              >
                {item.count.toLocaleString()}
              </strong>
            </div>

          </div>
        )
      )}

      {/* EMPTY STATE */}

      {!loading &&
        !error &&
        replayData.length ===
          0 && (
          <div
            style={{
              padding:
                "20px",
              textAlign:
                "center",
              color:
                "#9ca3af"
            }}
          >
            No replay data
            available.
          </div>
        )}

    </div>
  );
};

export default Replay;