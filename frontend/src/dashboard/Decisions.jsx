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
   GENERATE DECISIONS
========================================================= */

function generateDecisions(records) {
  if (!records.length) {
    return [];
  }

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

  const invalid =
    records.filter(
      (record) =>
        !record.validCoordinates ||
        !record.validSpeed
    ).length;

  const decisions = [];

  /*
   * Decision 1
   * Generated when there is active/moving
   * AIS activity.
   */

  if (moving > 0) {
    decisions.push({
      id: 1,
      decision:
        "Monitor Active Vessel Movement",
      status: "ACTIVE",
      reason:
        `${moving.toLocaleString()} moving AIS records detected.`,
      count: moving
    });
  }

  /*
   * Decision 2
   * Generated when stationary activity
   * exists.
   */

  if (stationary > 0) {
    decisions.push({
      id: 2,
      decision:
        "Review Stationary Activity",
      status: "REVIEW",
      reason:
        `${stationary.toLocaleString()} stationary AIS records detected.`,
      count: stationary
    });
  }

  /*
   * Decision 3
   * Generated when invalid telemetry
   * exists.
   */

  if (invalid > 0) {
    decisions.push({
      id: 3,
      decision:
        "Validate Telemetry Exceptions",
      status: "ATTENTION",
      reason:
        `${invalid.toLocaleString()} AIS records require validation.`,
      count: invalid
    });
  }

  /*
   * Fallback if no decision condition
   * was triggered.
   */

  if (decisions.length === 0) {
    decisions.push({
      id: 1,
      decision:
        "Continue Telemetry Monitoring",
      status: "NORMAL",
      reason:
        "No immediate AIS activity requiring escalation.",
      count: records.length
    });
  }

  return decisions;
}

/* =========================================================
   COMPONENT
========================================================= */

const Decisions = () => {
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
        "Decisions AIS error:",
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
     DECISIONS
  ======================================================= */

  const decisions = useMemo(
    () =>
      generateDecisions(
        aisRecords
      ),
    [aisRecords]
  );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="card">

      <h2>
        Decisions
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

      {/* DECISIONS */}

      {decisions.map(
        (item) => (
          <div
            key={item.id}
            style={{
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "10px",
              border:
                "1px solid #374151",
              background:
                "#111827",
              color: "#ffffff"
            }}
          >

            {/* HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "10px"
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginBottom: "4px"
                  }}
                >
                  DECISION {item.id}
                </div>

                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700
                  }}
                >
                  {item.decision}
                </div>

              </div>

              {/* STATUS */}

              <span
                style={{
                  padding:
                    "5px 10px",
                  borderRadius:
                    "999px",
                  fontSize:
                    "11px",
                  fontWeight:
                    700,
                  background:
                    item.status ===
                    "ACTIVE"
                      ? "#14532d"
                      : item.status ===
                        "REVIEW"
                      ? "#854d0e"
                      : item.status ===
                        "ATTENTION"
                      ? "#991b1b"
                      : "#1e3a8a",
                  color:
                    "#ffffff"
                }}
              >
                {item.status}
              </span>

            </div>

            {/* REASON */}

            <p
              style={{
                margin:
                  "10px 0 0",
                fontSize:
                  "13px",
                color:
                  "#d1d5db",
                lineHeight:
                  "1.5"
              }}
            >
              {item.reason}
            </p>

            {/* COUNT */}

            <div
              style={{
                marginTop:
                  "10px",
                fontSize:
                  "12px",
                color:
                  "#9ca3af"
              }}
            >
              Related records:{" "}
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
        decisions.length ===
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
            No decisions available.
          </div>
        )}

    </div>
  );
};

export default Decisions;