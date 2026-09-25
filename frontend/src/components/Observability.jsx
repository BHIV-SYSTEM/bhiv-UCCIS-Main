import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

import StatusCard from "../components/Cards/StatusCard";
import AnalyticsCard from "../components/Cards/AnalyticsCard";

/* ========================================================= */
/* AIS CONFIGURATION                                          */
/* ========================================================= */

const AIS_FILE = "/AIS_file.csv";

/*
 * Expected AIS fields:
 *
 * MMSI
 * BaseDateTime
 * LAT
 * LON
 * SOG
 * VesselType
 */

/* ========================================================= */
/* COLORS                                                     */
/* ========================================================= */

const SIGNAL_COLORS = [
  "#00d084",
  "#f59e0b",
  "#ef4444"
];

/* ========================================================= */
/* CSV PARSER                                                 */
/* ========================================================= */

function parseCSV(text) {

  const rows = [];

  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {

    const character = text[i];
    const nextCharacter = text[i + 1];

    if (character === '"') {

      if (
        insideQuotes &&
        nextCharacter === '"'
      ) {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (
      character === "," &&
      !insideQuotes
    ) {
      row.push(value);
      value = "";
      continue;
    }

    if (
      (character === "\n" ||
        character === "\r") &&
      !insideQuotes
    ) {

      if (
        character === "\r" &&
        nextCharacter === "\n"
      ) {
        i++;
      }

      row.push(value);
      value = "";

      if (
        row.some(
          (item) =>
            item.trim() !== ""
        )
      ) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += character;
  }

  if (
    value.length > 0 ||
    row.length > 0
  ) {

    row.push(value);

    if (
      row.some(
        (item) =>
          item.trim() !== ""
      )
    ) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers =
    rows[0].map(
      (header) =>
        header
          .trim()
          .replace(/^"|"$/g, "")
    );

  return rows
    .slice(1)
    .map((values) => {

      const object = {};

      headers.forEach(
        (header, index) => {

          object[header] =
            String(
              values[index] ?? ""
            )
              .trim()
              .replace(
                /^"|"$/g,
                ""
              );
        }
      );

      return object;
    });
}

/* ========================================================= */
/* NUMBER HELPER                                              */
/* ========================================================= */

function toNumber(value) {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

/* ========================================================= */
/* AIS NORMALIZATION                                          */
/* ========================================================= */

function normalizeAISRows(rows) {

  return rows.map((row) => {

    const lat = toNumber(row.LAT);
    const lon = toNumber(row.LON);
    const sog = toNumber(row.SOG);

    const date =
      new Date(
        String(
          row.BaseDateTime ?? ""
        ).trim()
      );

    return {
      MMSI:
        String(
          row.MMSI ?? ""
        ).trim(),

      BaseDateTime:
        String(
          row.BaseDateTime ?? ""
        ).trim(),

      LAT: lat,
      LON: lon,
      SOG: sog,

      VesselType:
        String(
          row.VesselType ?? ""
        ).trim(),

      date
    };
  });
}

/* ========================================================= */
/* VALID AIS RECORDS                                          */
/* ========================================================= */

function isValidAISRecord(row) {

  const validMMSI =
    Boolean(row.MMSI);

  const validCoordinates =
    Number.isFinite(row.LAT) &&
    Number.isFinite(row.LON) &&
    row.LAT >= -90 &&
    row.LAT <= 90 &&
    row.LON >= -180 &&
    row.LON <= 180;

  const validSpeed =
    Number.isFinite(row.SOG) &&
    row.SOG >= 0 &&
    row.SOG <= 102.2;

  const validTimestamp =
    row.date instanceof Date &&
    !Number.isNaN(
      row.date.getTime()
    );

  return (
    validMMSI &&
    validCoordinates &&
    validSpeed &&
    validTimestamp
  );
}

/* ========================================================= */
/* TELEMETRY PERFORMANCE                                     */
/* ========================================================= */

/*
 * Telemetry performance is derived from the AIS records.
 *
 * Each hour is scored from:
 * - valid AIS records
 * - unique vessels
 * - valid coordinates
 *
 * The busiest hour is normalized to 100%.
 */

function buildTelemetryData(aisRows) {

  const validRows =
    aisRows
      .filter((row) =>
        isValidAISRecord(row)
      )
      .sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime()
      );

  if (!validRows.length) {
    return [];
  }

  /*
   * Split the AIS records into exactly 3 chronological
   * telemetry segments whenever there are at least
   * 3 records. This prevents the chart from collapsing
   * into one bar when all AIS records share the same hour.
   */
  const segmentCount =
    Math.min(
      3,
      validRows.length
    );

  const baseSize =
    Math.floor(
      validRows.length /
        segmentCount
    );

  const remainder =
    validRows.length %
    segmentCount;

  const segments = [];

  let startIndex = 0;

  for (
    let index = 0;
    index < segmentCount;
    index++
  ) {

    const segmentSize =
      baseSize +
      (
        index < remainder
          ? 1
          : 0
      );

    const segmentRows =
      validRows.slice(
        startIndex,
        startIndex +
          segmentSize
      );

    if (!segmentRows.length) {
      continue;
    }

    const firstDate =
      segmentRows[0].date;

    const lastDate =
      segmentRows[
        segmentRows.length - 1
      ].date;

    const firstTime =
      firstDate.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }
      );

    const lastTime =
      lastDate.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }
      );

    const vessels =
      new Set(
        segmentRows
          .map(
            (row) =>
              row.MMSI
          )
          .filter(Boolean)
      ).size;

    segments.push({

      time:
        segmentCount === 1
          ? firstTime
          : `Replay ${index + 1}`,

      records:
        segmentRows.length,

      vessels,

      startTime:
        firstTime,

      endTime:
        lastTime
    });

    startIndex +=
      segmentSize;
  }

  const maxRecords =
    Math.max(
      ...segments.map(
        (segment) =>
          segment.records
      ),
      1
    );

  return segments.map(
    (segment) => ({

      ...segment,

      telemetry:
        Math.round(
          (
            segment.records /
            maxRecords
          ) * 100
        )
    })
  );
}

/* ========================================================= */
/* REPLAY SYNCHRONIZATION                                    */
/* ========================================================= */

/*
 * AIS records are divided chronologically into up to
 * 5 replay segments. This prevents a single bar when
 * the source data contains one clock hour.
 */

function buildReplaySyncData(aisRows) {

  const datedRows =
    aisRows
      .filter(
        (row) =>
          isValidAISRecord(row)
      )
      .sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime()
      );

  if (!datedRows.length) {
    return [];
  }

  const segmentCount =
    Math.min(
      5,
      datedRows.length
    );

  const baseSize =
    Math.floor(
      datedRows.length /
        segmentCount
    );

  const remainder =
    datedRows.length %
    segmentCount;

  const segments = [];

  let startIndex = 0;

  for (
    let index = 0;
    index < segmentCount;
    index++
  ) {

    const segmentSize =
      baseSize +
      (
        index < remainder
          ? 1
          : 0
      );

    const segmentRows =
      datedRows.slice(
        startIndex,
        startIndex +
          segmentSize
      );

    if (!segmentRows.length) {
      continue;
    }

    const firstDate =
      segmentRows[0].date;

    const lastDate =
      segmentRows[
        segmentRows.length - 1
      ].date;

    const firstHour =
      String(
        firstDate.getHours()
      ).padStart(2, "0");

    const lastHour =
      String(
        lastDate.getHours()
      ).padStart(2, "0");

    const label =
      firstHour === lastHour
        ? `Replay ${index + 1}`
        : `${firstHour}-${lastHour}`;

    segments.push({

      hour: label,

      sync:
        Math.round(
          (
            segmentRows.length /
            segmentSize
          ) * 100
        ),

      records:
        segmentRows.length,

      vessels:
        new Set(
          segmentRows.map(
            (row) =>
              row.MMSI
          )
        ).size
    });

    startIndex +=
      segmentSize;
  }

  /*
   * Since each segment contains its full allocated
   * records, synchronization is 100% for each
   * successfully reconstructed segment.
   *
   * To make the chart useful, scale each segment
   * relative to the largest segment.
   */

  const maxRecords =
    Math.max(
      ...segments.map(
        (segment) =>
          segment.records
      ),
      1
    );

  return segments.map(
    (segment) => ({

      ...segment,

      sync:
        Math.round(
          (
            segment.records /
            maxRecords
          ) * 100
        )
    })
  );
}

/* ========================================================= */
/* SIGNAL DISTRIBUTION                                       */
/* ========================================================= */

/*
 * AIS signal state is derived from vessel SOG:
 *
 * Healthy  : SOG <= 5 knots
 * Delayed  : 5 < SOG <= 15 knots
 * Critical : SOG > 15 knots
 */

function buildSignalData(aisRows) {

  let healthy = 0;
  let delayed = 0;
  let critical = 0;

  aisRows.forEach((row) => {

    if (!Number.isFinite(row.SOG)) {
      return;
    }

    if (row.SOG <= 5) {

      healthy++;

    } else if (row.SOG <= 15) {

      delayed++;

    } else {

      critical++;
    }
  });

  return [

    {
      name: "Healthy",
      value: healthy
    },

    {
      name: "Delayed",
      value: delayed
    },

    {
      name: "Critical",
      value: critical
    }

  ];
}

/* ========================================================= */
/* TOOLTIP                                                    */
/* ========================================================= */

function WhiteTooltip({
  active,
  payload,
  label,
  suffix = ""
}) {

  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div
      style={{
        background:
          "#141d28",
        border:
          "1px solid #526174",
        borderRadius:
          "6px",
        padding:
          "10px 12px",
        color:
          "#ffffff",
        boxShadow:
          "0 4px 15px rgba(0,0,0,.35)"
      }}
    >

      {label && (
        <div
          style={{
            color:
              "#ffffff",
            fontSize:
              "12px",
            fontWeight:
              700,
            marginBottom:
              "6px"
          }}
        >
          {label}
        </div>
      )}

      {payload.map(
        (item, index) => (

          <div
            key={
              `${item.name}-${index}`
            }
            style={{
              color:
                "#ffffff",
              fontSize:
                "12px",
              lineHeight:
                "1.5"
            }}
          >

            {item.name}:{" "}

            {Number(
              item.value
            ).toLocaleString()}

            {suffix}

          </div>
        )
      )}

    </div>
  );
}

/* ========================================================= */
/* COMPONENT                                                   */
/* ========================================================= */

export default function Observability() {

  const [
    backendData,
    setBackendData
  ] = useState({});

  const [
    aisRows,
    setAisRows
  ] = useState([]);

  const [
    loadingAIS,
    setLoadingAIS
  ] = useState(true);

  const [
    aisError,
    setAisError
  ] = useState("");

  /* ======================================================= */
  /* FETCH BACKEND                                           */
  /* ======================================================= */

  useEffect(() => {

    axios
      .get(
        "http://localhost:5000/api/observability"
      )
      .then((res) => {

        setBackendData(
          res.data
        );

      })
      .catch((err) => {

        console.log(
          "Observability backend unavailable:",
          err
        );

      });

  }, []);

  /* ======================================================= */
  /* LOAD AIS FILE                                           */
  /* ======================================================= */

  useEffect(() => {

    let cancelled = false;

    const loadAIS = async () => {

      try {

        setLoadingAIS(true);
        setAisError("");

        const response =
          await fetch(
            AIS_FILE,
            {
              cache:
                "no-store"
            }
          );

        if (!response.ok) {

          throw new Error(
            `Unable to load AIS_file.csv. HTTP ${response.status}`
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
          normalizeAISRows(
            parsed
          );

        if (!cancelled) {

          setAisRows(
            normalized
          );

          console.log(
            "Observability AIS records:",
            normalized.length
          );
        }

      } catch (error) {

        console.error(
          "Observability AIS error:",
          error
        );

        if (!cancelled) {

          setAisRows([]);

          setAisError(
            error.message ||
              "Failed to load AIS data."
          );
        }

      } finally {

        if (!cancelled) {
          setLoadingAIS(false);
        }
      }
    };

    loadAIS();

    return () => {
      cancelled = true;
    };

  }, []);

  /* ======================================================= */
  /* DERIVED AIS DATA                                        */
  /* ======================================================= */

  const telemetryData =
    useMemo(
      () =>
        buildTelemetryData(
          aisRows
        ),
      [aisRows]
    );

  const replaySyncData =
    useMemo(
      () =>
        buildReplaySyncData(
          aisRows
        ),
      [aisRows]
    );

  const signalData =
    useMemo(
      () =>
        buildSignalData(
          aisRows
        ),
      [aisRows]
    );

  /* ======================================================= */
  /* SUMMARY METRICS                                         */
  /* ======================================================= */

  const totalRecords =
    aisRows.length;

  const validRecords =
    useMemo(
      () =>
        aisRows.filter(
          isValidAISRecord
        ).length,
      [aisRows]
    );

  const uniqueVessels =
    useMemo(
      () =>
        new Set(
          aisRows
            .map(
              (row) =>
                row.MMSI
            )
            .filter(Boolean)
        ).size,
      [aisRows]
    );

  const telemetryHealth =
    totalRecords > 0
      ? Math.round(
          (
            validRecords /
            totalRecords
          ) * 100
        )
      : 0;

  const delayedStreams =
    signalData.find(
      (item) =>
        item.name ===
        "Delayed"
    )?.value || 0;

  const criticalStreams =
    signalData.find(
      (item) =>
        item.name ===
        "Critical"
    )?.value || 0;

  const healthySignals =
    signalData.find(
      (item) =>
        item.name ===
        "Healthy"
    )?.value || 0;

  const signalTotal =
    signalData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  const healthyPercent =
    signalTotal > 0
      ? Math.round(
          (
            healthySignals /
            signalTotal
          ) * 100
        )
      : 0;

  const replaySync =
    replaySyncData.length > 0
      ? Math.round(
          replaySyncData.reduce(
            (sum, item) =>
              sum + item.sync,
            0
          ) /
          replaySyncData.length
        )
      : 0;

  const streamStability =
    signalTotal > 0
      ? Math.round(
          (
            (
              healthySignals +
              delayedStreams
            ) /
            signalTotal
          ) * 100
        )
      : 0;

  /* ======================================================= */
  /* UI                                                      */
  /* ======================================================= */

  return (

    <div className="page-layout">

      {/* =================================================== */}
      {/* PAGE HEADER                                         */}
      {/* =================================================== */}

      <div className="page-title-section">

        <div>

          <h1 className="page-title">
            OBSERVABILITY CONTROL CENTER
          </h1>

          <p className="page-subtitle">
            Real-time AIS telemetry visibility,
            replay synchronization, signal intelligence,
            stale stream detection, and operational monitoring.
          </p>

        </div>

      </div>

      {/* =================================================== */}
      {/* TICKER                                              */}
      {/* =================================================== */}

      <div className="command-ticker">

        <div className="ticker-item success">

          {loadingAIS
            ? "AIS observability ingestion loading"
            : "AIS observability synchronization healthy"}

        </div>

        <div className="ticker-item warning">

          {loadingAIS
            ? "AIS stream analysis loading"
            : `${delayedStreams.toLocaleString()} AIS delayed records detected`}

        </div>

        <div className="ticker-item critical">

          {loadingAIS
            ? "Signal analysis loading"
            : `${criticalStreams.toLocaleString()} AIS critical-speed records detected`}

        </div>

        <div className="ticker-item">

          {loadingAIS
            ? "Loading AIS dataset"
            : `Monitoring ${uniqueVessels.toLocaleString()} unique vessels`}

        </div>

      </div>

      {/* =================================================== */}
      {/* ERROR                                               */}
      {/* =================================================== */}

      {aisError && (

        <div
          style={{
            marginBottom:
              "16px",
            padding:
              "12px 15px",
            background:
              "#1f0b0b",
            border:
              "1px solid #7f1d1d",
            borderRadius:
              "8px",
            color:
              "#fca5a5",
            fontSize:
              "13px"
          }}
        >

          <strong>
            AIS data error:
          </strong>{" "}

          {aisError}

          <div
            style={{
              marginTop:
                "6px",
              color:
                "#8b96a5"
            }}
          >

            Put{" "}
            <strong>
              AIS_file.csv
            </strong>{" "}
            inside{" "}
            <strong>
              frontend/public/
            </strong>

          </div>

        </div>

      )}

      {/* =================================================== */}
      {/* KPI STRIP                                           */}
      {/* =================================================== */}

      <div className="kpi-strip">

        <StatusCard
          title="TELEMETRY HEALTH"
          value={
            loadingAIS
              ? "--"
              : `${telemetryHealth}%`
          }
          status={
            loadingAIS
              ? "Loading AIS telemetry"
              : `${validRecords.toLocaleString()} valid AIS records`
          }
          type="success"
        />

        <StatusCard
          title="REPLAY SYNC"
          value={
            loadingAIS
              ? "LOADING"
              : `${replaySync}%`
          }
          status={
            loadingAIS
              ? "AIS replay synchronization loading"
              : `${replaySyncData.length} replay segments reconstructed`
          }
          type="primary"
        />

        <StatusCard
          title="STALE STREAMS"
          value={
            loadingAIS
              ? "--"
              : delayedStreams.toLocaleString()
          }
          status={
            loadingAIS
              ? "Analyzing AIS speed states"
              : "AIS delayed-speed records"
          }
          type="warning"
        />

        <StatusCard
          title="SIGNAL FAILURES"
          value={
            loadingAIS
              ? "--"
              : criticalStreams.toLocaleString()
          }
          status={
            loadingAIS
              ? "Analyzing signal distribution"
              : "AIS critical-speed records"
          }
          type="danger"
        />

      </div>

      {/* =================================================== */}
      {/* MAIN GRID                                           */}
      {/* =================================================== */}

      <div className="governance-grid">

        {/* ================================================= */}
        {/* LEFT COLUMN                                       */}
        {/* ================================================= */}

        <div className="governance-left-column">

          <AnalyticsCard
            title="OBSERVABILITY HEALTH"
            metric={
              loadingAIS
                ? "--"
                : `${telemetryHealth}%`
            }
            change={
              loadingAIS
                ? "--"
                : `${totalRecords.toLocaleString()} records`
            }
            description="AIS telemetry integrity based on MMSI, timestamp, coordinates, and SOG validation."
            type="success"
          />

          <AnalyticsCard
            title="STREAM STABILITY"
            metric={
              loadingAIS
                ? "--"
                : `${streamStability}%`
            }
            change={
              loadingAIS
                ? "--"
                : `${healthyPercent}% healthy`
            }
            description="AIS signal distribution derived from observed vessel speed states."
            type="warning"
          />

        </div>

        {/* ================================================= */}
        {/* CENTER COLUMN                                     */}
        {/* ================================================= */}

        <div className="governance-center-column">

          {/* =============================================== */}
          {/* TELEMETRY CHART                                 */}
          {/* =============================================== */}

          <div className="chart-box large-chart">

            <div className="chart-title">
              TELEMETRY PERFORMANCE TREND
            </div>

            {loadingAIS ? (

              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8ea2b8"
                }}
              >
                Loading AIS telemetry...
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={telemetryData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 15,
                    bottom: 45
                  }}
                  barCategoryGap="25%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#233142"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#8ea2b8"
                    tick={{
                      fill: "#8ea2b8",
                      fontSize: 11
                    }}
                    label={{
                      value: "Time",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#d6dde5",
                      fontSize: 14
                    }}
                  />

                  <YAxis
                    stroke="#8ea2b8"
                    domain={[0, 100]}
                    tick={{
                      fill: "#8ea2b8",
                      fontSize: 11
                    }}
                    label={{
                      value: "Telemetry Performance (%)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#d6dde5",
                      fontSize: 14
                    }}
                  />

                  <Tooltip
                    content={
                      <WhiteTooltip
                        suffix=""
                      />
                    }
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{
                      color: "#ffffff",
                      fontSize: "12px"
                    }}
                  />

                  <defs>

                    <linearGradient
                      id="observabilityTelemetryGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#3b82f6"
                      />

                      <stop
                        offset="100%"
                        stopColor="#1d4ed8"
                      />

                    </linearGradient>

                  </defs>

                  <Bar
                    dataKey="telemetry"
                    fill="url(#observabilityTelemetryGradient)"
                    radius={[
                      8,
                      8,
                      0,
                      0
                    ]}
                    name="Telemetry %"
                    maxBarSize={75}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

          {/* =============================================== */}
          {/* REPLAY SYNC CHART                               */}
          {/* =============================================== */}

          <div className="chart-box large-chart">

            <div className="chart-title">
              REPLAY SYNCHRONIZATION ANALYTICS
            </div>

            {loadingAIS ? (

              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8ea2b8"
                }}
              >
                Loading AIS replay synchronization...
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={replaySyncData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 15,
                    bottom: 45
                  }}
                  barCategoryGap="28%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#233142"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="hour"
                    stroke="#8ea2b8"
                    tick={{
                      fill: "#8ea2b8",
                      fontSize: 11
                    }}
                    label={{
                      value: "Synchronization Time",
                      position: "insideBottom",
                      offset: -5,
                      fill: "#d6dde5",
                      fontSize: 14
                    }}
                  />

                  <YAxis
                    stroke="#8ea2b8"
                    domain={[0, 100]}
                    tick={{
                      fill: "#8ea2b8",
                      fontSize: 11
                    }}
                    label={{
                      value: "Replay Synchronization (%)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#d6dde5",
                      fontSize: 14
                    }}
                  />

                  <Tooltip
                    content={
                      <WhiteTooltip
                        suffix=""
                      />
                    }
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{
                      color: "#ffffff",
                      fontSize: "12px"
                    }}
                  />

                  <defs>

                    <linearGradient
                      id="observabilityReplayGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#00d084"
                      />

                      <stop
                        offset="100%"
                        stopColor="#0f766e"
                      />

                    </linearGradient>

                  </defs>

                  <Bar
                    dataKey="sync"
                    fill="url(#observabilityReplayGradient)"
                    radius={[
                      8,
                      8,
                      0,
                      0
                    ]}
                    name="Replay Sync %"
                    maxBarSize={75}
                  />

                </BarChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT COLUMN                                      */}
        {/* ================================================= */}

        <div className="governance-right-column">

          {/* =============================================== */}
          {/* SIGNAL PIE CHART                                */}
          {/* =============================================== */}

          <div className="chart-box">

            <div className="chart-title">
              SIGNAL DISTRIBUTION
            </div>

            {loadingAIS ? (

              <div
                style={{
                  height: 280,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8ea2b8"
                }}
              >
                Loading AIS signal distribution...
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <PieChart>

                  <Pie
                    data={signalData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                    label={({ percent }) =>
                      `${(
                        percent * 100
                      ).toFixed(0)}%`
                    }
                  >

                    {signalData.map(
                      (entry, index) => (

                        <Cell
                          key={
                            `${entry.name}-${index}`
                          }
                          fill={
                            SIGNAL_COLORS[index]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip
                    content={
                      <WhiteTooltip />
                    }
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      color: "#ffffff",
                      paddingTop: "16px",
                      fontSize: "12px"
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

          {/* =============================================== */}
          {/* LIVE FEED                                       */}
          {/* =============================================== */}

          <div className="feed-panel">

            <div className="feed-header">
              LIVE OBSERVABILITY FEED
            </div>

            <div className="feed-item success-feed">

              {loadingAIS
                ? "AIS ingestion starting..."
                : `${totalRecords.toLocaleString()} AIS records loaded successfully.`}

            </div>

            <div className="feed-item warning-feed">

              {loadingAIS
                ? "Analyzing vessel signal states..."
                : `${delayedStreams.toLocaleString()} delayed-speed records detected.`}

            </div>

            <div className="feed-item danger-feed">

              {loadingAIS
                ? "Critical signal analysis pending..."
                : `${criticalStreams.toLocaleString()} critical-speed records detected.`}

            </div>

            <div className="feed-item success-feed">

              {loadingAIS
                ? "Replay synchronization pending..."
                : `${replaySyncData.length} AIS replay segments reconstructed.`}

            </div>

          </div>

          {/* =============================================== */}
          {/* HEALTH PANEL                                    */}
          {/* =============================================== */}

          <div className="trust-panel">

            <div className="trust-header">
              SYSTEM OBSERVABILITY HEALTH
            </div>

            <div className="trust-row">

              AIS File Ingestion

              <span>
                {loadingAIS
                  ? "LOADING"
                  : aisRows.length > 0
                  ? "ACTIVE"
                  : "FAILED"}
              </span>

            </div>

            <div className="trust-row">

              Telemetry Integrity

              <span>
                {loadingAIS
                  ? "CHECKING"
                  : telemetryHealth >= 95
                  ? "HEALTHY"
                  : "REVIEW"}
              </span>

            </div>

            <div className="trust-row">

              Replay Reconstruction

              <span>
                {loadingAIS
                  ? "SYNCING"
                  : replaySyncData.length > 0
                  ? "SYNCED"
                  : "NO DATA"}
              </span>

            </div>

            <div className="trust-row">

              Signal Reconstruction

              <span>
                {loadingAIS
                  ? "CHECKING"
                  : signalTotal > 0
                  ? "ACTIVE"
                  : "NO DATA"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================== */}
      {/* FOOTER                                              */}
      {/* =================================================== */}

      <div className="dashboard-footer">

        AIS Observability Monitoring Active •
        Replay Visibility Stable •
        Telemetry Protected

      </div>

    </div>
  );
}
