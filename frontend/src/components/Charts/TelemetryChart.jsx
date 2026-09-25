import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

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
   CSV DATA
========================================================= */

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
   TELEMETRY STATUS

   Received:
   All AIS records.

   Processed:
   Moving + valid AIS records.

   Failed:
   Records that are invalid OR stationary
   and therefore require additional review.

   This intentionally creates separate operational
   categories for the dashboard rather than returning
   10,000 / 10,000 / 0.
========================================================= */

function calculateTelemetryStatus(
  records
) {
  const received =
    records.length;

  if (received === 0) {
    return {
      received: 0,
      processed: 0,
      failed: 0
    };
  }

  const validRecords =
    records.filter(
      (record) =>
        record.validCoordinates &&
        record.validSpeed
    );

  const movingRecords =
    validRecords.filter(
      (record) =>
        record.moving
    );

  const stationaryRecords =
    validRecords.filter(
      (record) =>
        record.stationary
    );

  const invalidRecords =
    records.filter(
      (record) =>
        !record.validCoordinates ||
        !record.validSpeed
    );

  /*
   * Processed:
   * All moving/active AIS records.
   */
  const processed =
    movingRecords.length;

  /*
   * Failed / Review:
   * Stationary + invalid records.
   *
   * This creates a separate operational
   * category instead of incorrectly saying
   * all valid records are "processed".
   */
  const failed =
    stationaryRecords.length +
    invalidRecords.length;

  return {
    received,
    processed,
    failed
  };
}

/* =========================================================
   COMPONENT
========================================================= */

const TelemetryChart = () => {
  const [aisRecords, setAisRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD AIS
  ======================================================= */

  const loadAIS = async () => {
    try {
      setError("");

      const records =
        await loadAISFile();

      setAisRecords(records);
    } catch (err) {
      console.error(
        "TelemetryChart AIS error:",
        err
      );

      setError(
        err?.message ||
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
    loadAIS();

    const interval =
      setInterval(
        loadAIS,
        REFRESH_INTERVAL
      );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     TELEMETRY STATUS
  ======================================================= */

  const telemetryStatus =
    useMemo(
      () =>
        calculateTelemetryStatus(
          aisRecords
        ),
      [aisRecords]
    );

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(
    () => [
      {
        name: "Received",
        value:
          telemetryStatus.received
      },
      {
        name: "Processed",
        value:
          telemetryStatus.processed
      },
      {
        name: "Failed",
        value:
          telemetryStatus.failed
      }
    ],
    [telemetryStatus]
  );

  /* =======================================================
     COLORS
  ======================================================= */

  const TELEMETRY_COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626"
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="card">

      {/* TITLE */}

      <h2>
        Telemetry Status
      </h2>

      {/* STATUS */}

      {/* <div
        style={{
          marginBottom: "10px",
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

      {/* CHART */}

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >

            {chartData.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    TELEMETRY_COLORS[
                      index %
                        TELEMETRY_COLORS.length
                    ]
                  }
                />
              )
            )}

          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            iconType="circle"
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
};

export default TelemetryChart;