import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
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
   CSV PARSER
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
   CREATE AIS SIGNAL DATA
========================================================= */

function createAISSignalData(records) {
  if (!records.length) {
    return {
      signals: [],
      byType: {}
    };
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

  const valid =
    records.filter(
      (record) =>
        record.validCoordinates &&
        record.validSpeed
    ).length;

  const invalid =
    Math.max(
      records.length - valid,
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

  /*
   * These are AIS-derived operational
   * categories, not literal civic incidents.
   */

  const byType = {
    "AIS Records":
      records.length,

    "Moving Activity":
      moving,

    "Stationary Activity":
      stationary,

    "Valid Telemetry":
      valid,

    "Validation Issues":
      invalid,

    "Vessel Monitoring":
      uniqueVessels
  };

  const signals =
    records
      .slice(0, 100)
      .map(
        (record, index) => ({
          id:
            index + 1,

          signalType:
            record.moving
              ? "Moving Activity"
              : record.stationary
              ? "Stationary Activity"
              : "AIS Telemetry",

          mmsi:
            record.mmsi,

          sog:
            record.sog,

          latitude:
            record.lat,

          longitude:
            record.lon
        })
      );

  return {
    signals,
    byType
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Signals = () => {
  const [signals, setSignals] =
    useState([]);

  const [byType, setByType] =
    useState({});

  const [aisRecords, setAisRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [source, setSource] =
    useState("Loading");

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH BACKEND SIGNALS
  ======================================================= */

  const fetchBackendSignals =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:5000/api/signals",
            {
              timeout: 10000
            }
          );

        const backendSignals =
          res?.data?.data?.signals ||
          [];

        const backendByType =
          res?.data?.data?.byType ||
          {};

        if (
          backendSignals.length > 0
        ) {
          setSignals(
            backendSignals
          );

          setByType(
            backendByType
          );

          setSource(
            "Backend API"
          );

          return true;
        }

        return false;
      } catch (err) {
        console.log(
          "Backend signals unavailable:",
          err
        );

        return false;
      }
    };

  /* =======================================================
     FETCH AIS
  ======================================================= */

  const fetchAIS = async () => {
    try {
      const records =
        await loadAISFile();

      setAisRecords(records);

      return records;
    } catch (err) {
      console.error(
        "AIS loading error:",
        err
      );

      throw err;
    }
  };

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const fetchSignals =
    async () => {
      setLoading(true);
      setError("");

      try {
        /*
         * Backend is preferred.
         */
        const backendAvailable =
          await fetchBackendSignals();

        /*
         * AIS is always loaded so that
         * AIS metrics are available.
         */
        const records =
          await fetchAIS();

        /*
         * If backend has no signals,
         * use AIS-derived signals.
         */
        if (
          !backendAvailable
        ) {
          const aisData =
            createAISSignalData(
              records
            );

          setSignals(
            aisData.signals
          );

          setByType(
            aisData.byType
          );

          setSource(
            "AIS_file.csv"
          );
        }

      } catch (err) {
        console.error(
          "Signals loading error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load signal data"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     INITIAL LOAD + REFRESH
  ======================================================= */

  useEffect(() => {
    fetchSignals();

    const interval =
      setInterval(
        fetchSignals,
        REFRESH_INTERVAL
      );

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     UNIQUE TYPES
  ======================================================= */

  const uniqueTypes =
    useMemo(() => {
      return [
        ...new Set(
          signals.map(
            (signal) =>
              signal.signalType ||
              signal.signal_type
          )
        )
      ];
    }, [signals]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData =
    useMemo(() => {
      if (
        Object.keys(byType)
          .length > 0
      ) {
        return Object.entries(
          byType
        ).map(
          ([type, count]) => ({
            type,
            count:
              Number(count) || 0
          })
        );
      }

      return [];
    }, [byType]);

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const aisMetrics =
    useMemo(() => {
      const moving =
        aisRecords.filter(
          (record) =>
            record.moving
        ).length;

      const stationary =
        aisRecords.filter(
          (record) =>
            record.stationary
        ).length;

      const valid =
        aisRecords.filter(
          (record) =>
            record.validCoordinates &&
            record.validSpeed
        ).length;

      const vesselSet =
        new Set();

      aisRecords.forEach(
        (record) => {
          if (record.mmsi) {
            vesselSet.add(
              record.mmsi
            );
          }
        }
      );

      return {
        records:
          aisRecords.length,

        moving,

        stationary,

        valid,

        uniqueVessels:
          vesselSet.size
      };
    }, [aisRecords]);

  /* =======================================================
     CHART COLORS
  ======================================================= */

  const CHART_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4"
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      style={{
        padding: "20px"
      }}
    >

      {/* TITLE */}

      <h2>
        📡 Signals Dashboard
      </h2>

      {/* ===================================================
          STATUS BANNER
      =================================================== */}

      {/* <div
        style={{
          padding: "12px",
          borderRadius: "8px",
          margin:
            "10px 0",
          background:
            error
              ? "#fee2e2"
              : loading
              ? "#fef9c3"
              : "#dcfce7",
          color:
            error
              ? "#991b1b"
              : loading
              ? "#92400e"
              : "#166534",
          fontWeight: 600
        }}
      >
        {loading
          ? "🟡 Loading signal data..."
          : error
          ? `🔴 ${error}`
          : source ===
            "Backend API"
          ? "🟢 Live Signals Streaming • Backend API"
          : "🟢 AIS Signals Streaming • AIS_file.csv"}
      </div> */}

      {/* ===================================================
          CARDS
      =================================================== */}

      <div
        style={{
          display:
            "flex",
          gap: "16px",
          marginTop:
            "20px",
          flexWrap:
            "wrap"
        }}
      >

        {/* TOTAL SIGNALS */}

        <div
          style={cardStyle}
        >
          <h3>
            Total Signals
          </h3>

          <p>
            {source ===
            "AIS_file.csv"
              ? aisMetrics.records
              : signals.length}
          </p>
        </div>

        {/* SIGNAL TYPES */}

        <div
          style={cardStyle}
        >
          <h3>
            Signal Types
          </h3>

          <p>
            {uniqueTypes.length}
          </p>
        </div>

        {/* SYSTEM STATUS */}

        <div
          style={cardStyle}
        >
          <h3>
            System Status
          </h3>

          <p>
            {loading
              ? "LOADING"
              : error
              ? "ERROR"
              : "ACTIVE"}
          </p>
        </div>

        {/* AIS VESSELS */}

        <div
          style={cardStyle}
        >
          <h3>
            AIS Vessels
          </h3>

          <p>
            {aisMetrics.uniqueVessels}
          </p>
        </div>

        {/* MOVING */}

        <div
          style={cardStyle}
        >
          <h3>
            Moving Records
          </h3>

          <p>
            {aisMetrics.moving}
          </p>
        </div>

      </div>

      {/* ===================================================
          AIS INFORMATION
      =================================================== */}

      <div
        style={{
          marginTop:
            "20px",
          padding:
            "14px 18px",
          borderRadius:
            "10px",
          background:
            "#111827",
          color:
            "#ffffff"
        }}
      >

        <strong>
          AIS Data:
        </strong>

        <span
          style={{
            marginLeft:
              "10px"
          }}
        >
          {aisMetrics.records.toLocaleString()}
          {" "}records
        </span>

        <span
          style={{
            marginLeft:
              "20px"
          }}
        >
          {aisMetrics.valid.toLocaleString()}
          {" "}valid
        </span>

        <span
          style={{
            marginLeft:
              "20px"
          }}
        >
          {aisMetrics.stationary.toLocaleString()}
          {" "}stationary
        </span>

      </div>

      {/* ===================================================
          CHART
      =================================================== */}

      <div
        style={{
          width:
            "100%",
          height:
            350,
          marginTop:
            30
        }}
      >

        <ResponsiveContainer>

          <BarChart
            data={
              chartData
            }
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 50
            }}
          >

            <XAxis
              dataKey="type"
              tick={{
                fill:
                  "#9ca3af",
                fontSize: 12
              }}
              angle={
                chartData.length >
                4
                  ? -20
                  : 0
              }
              textAnchor={
                chartData.length >
                4
                  ? "end"
                  : "middle"
              }
              interval={0}
            />

            <YAxis
              allowDecimals={
                false
              }
              tick={{
                fill:
                  "#9ca3af"
              }}
            />

            <Tooltip
  contentStyle={{
    backgroundColor: "#111827",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#ffffff"
  }}
  labelStyle={{
    color: "#ffffff",
    fontWeight: 600
  }}
  itemStyle={{
    color: "#ffffff"
  }}
/>

            <Bar
              dataKey="count"
              name="Signals"
              radius={[
                5,
                5,
                0,
                0
              ]}
            >

              {chartData.map(
                (
                  entry,
                  index
                ) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      CHART_COLORS[
                        index %
                          CHART_COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

/* =========================================================
   CARD STYLE
========================================================= */

const cardStyle = {
  flex: "1 1 180px",
  minWidth: "160px",
  background:
    "#111827",
  color:
    "white",
  padding:
    "16px",
  borderRadius:
    "12px",
  textAlign:
    "center"
};

export default Signals;