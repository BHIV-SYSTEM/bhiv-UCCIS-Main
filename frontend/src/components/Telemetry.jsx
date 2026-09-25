import { useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

/* ========================================================= */
/* AIS CONFIGURATION                                         */
/* ========================================================= */

const AIS_FILE = "/AIS_file.csv";

/*
 * Expected CSV columns:
 *
 * MMSI
 * BaseDateTime
 * LAT
 * LON
 * SOG
 * VesselType
 */

/* ========================================================= */
/* CSV PARSER                                                */
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

        insideQuotes =
          !insideQuotes;

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

      const record = {};

      headers.forEach(
        (header, index) => {

          record[header] =
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

      return record;

    });
}

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function toNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function normalizeAISRows(rows) {

  return rows.map((row) => {

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

      LAT:
        toNumber(row.LAT),

      LON:
        toNumber(row.LON),

      SOG:
        toNumber(row.SOG),

      VesselType:
        String(
          row.VesselType ?? ""
        ).trim(),

      date

    };

  });

}

/* ========================================================= */
/* AIS VALIDATION                                            */
/* ========================================================= */

function isValidAIS(row) {

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
/* TELEMETRY DATA                                            */
/* ========================================================= */

/*
 * The AIS data is split into 3 chronological telemetry
 * segments so the chart always displays multiple bars.
 *
 * Telemetry score is based on the percentage of valid
 * AIS records in each segment.
 */

function buildTelemetryData(aisRows) {

  const rows =
    aisRows
      .slice()
      .sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime()
      );

  if (!rows.length) {

    return [
      {
        time: "Telemetry 1",
        telemetry: 0,
        records: 0
      },
      {
        time: "Telemetry 2",
        telemetry: 0,
        records: 0
      },
      {
        time: "Telemetry 3",
        telemetry: 0,
        records: 0
      }
    ];

  }

  const segmentCount =
    Math.min(
      3,
      rows.length
    );

  const baseSize =
    Math.floor(
      rows.length /
      segmentCount
    );

  const remainder =
    rows.length %
    segmentCount;

  const segments = [];

  let start = 0;

  for (
    let index = 0;
    index < segmentCount;
    index++
  ) {

    const size =
      baseSize +
      (
        index < remainder
          ? 1
          : 0
      );

    const segment =
      rows.slice(
        start,
        start + size
      );

    segments.push(
      segment
    );

    start += size;

  }

  return segments.map(
    (segment, index) => {

      const validCount =
        segment.filter(
          isValidAIS
        ).length;

      const telemetry =
        segment.length > 0
          ? Math.round(
              (
                validCount /
                segment.length
              ) * 100
            )
          : 0;

      return {

        time:
          `Telemetry ${index + 1}`,

        telemetry,

        records:
          segment.length,

        validRecords:
          validCount,

        vessels:
          new Set(
            segment
              .map(
                (row) =>
                  row.MMSI
              )
              .filter(Boolean)
          ).size

      };

    }
  );
}

/* ========================================================= */
/* WHITE TOOLTIP                                             */
/* ========================================================= */

function WhiteTooltip({
  active,
  payload,
  label
}) {

  if (
    !active ||
    !payload ||
    payload.length === 0
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
          "0 4px 15px rgba(0,0,0,0.35)"
      }}
    >

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

      {payload.map(
        (item, index) => (

          <div
            key={
              `${item.name || "value"}-${index}`
            }
            style={{
              color:
                "#ffffff",
              fontSize:
                "12px",
              lineHeight:
                1.5
            }}
          >

            {item.name || "Telemetry"}:{" "}

            {Number(
              item.value
            ).toLocaleString()}

            {item.dataKey ===
              "telemetry" &&
              "%"}

          </div>

        )
      )}

    </div>

  );

}

/* ========================================================= */
/* COMPONENT                                                 */
/* ========================================================= */

export default function Telemetry() {

  const [
    aisRows,
    setAisRows
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  /* ======================================================= */
  /* LOAD AIS CSV                                            */
  /* ======================================================= */

  useEffect(() => {

    let cancelled = false;

    const loadAIS = async () => {

      try {

        setLoading(true);
        setError("");

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
            "AIS_file.csv does not contain any records."
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

        }

      } catch (loadError) {

        console.error(
          "Telemetry AIS loading error:",
          loadError
        );

        if (!cancelled) {

          setAisRows([]);

          setError(
            loadError.message ||
              "Failed to load AIS data."
          );

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };

    loadAIS();

    return () => {

      cancelled = true;

    };

  }, []);

  /* ======================================================= */
  /* TELEMETRY DATA                                          */
  /* ======================================================= */

  const telemetry =
    useMemo(
      () =>
        buildTelemetryData(
          aisRows
        ),
      [aisRows]
    );

  /* ======================================================= */
  /* SUMMARY METRICS                                         */
  /* ======================================================= */

  const validRecords =
    useMemo(
      () =>
        aisRows.filter(
          isValidAIS
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
    aisRows.length > 0
      ? Math.round(
          (
            validRecords /
            aisRows.length
          ) * 100
        )
      : 0;

  /*
   * Average SOG from the actual AIS dataset.
   */

  const averageSOG =
    useMemo(() => {

      const speeds =
        aisRows
          .map(
            (row) =>
              row.SOG
          )
          .filter(
            Number.isFinite
          );

      if (!speeds.length) {
        return 0;
      }

      return (
        speeds.reduce(
          (sum, speed) =>
            sum + speed,
          0
        ) /
        speeds.length
      );

    }, [aisRows]);

  return (

    <div className="page">

      <h1>
        Telemetry Monitoring Center
      </h1>

      {/* ================================================= */}
      {/* ERROR                                             */}
      {/* ================================================= */}

      {error && (

        <div
          style={{
            marginBottom:
              "16px",
            padding:
              "12px 14px",
            borderRadius:
              "6px",
            border:
              "1px solid #7f1d1d",
            background:
              "#1f0b0b",
            color:
              "#fca5a5",
            fontSize:
              "13px"
          }}
        >

          <strong>
            AIS data error:
          </strong>{" "}

          {error}

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

      {/* ================================================= */}
      {/* STATS                                             */}
      {/* ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <p className="stat-title">
            AIS Telemetry Health
          </p>

          <h1 className="green-text">

            {loading
              ? "--"
              : `${telemetryHealth}%`}

          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Unique Vessels
          </p>

          <h1>

            {loading
              ? "--"
              : uniqueVessels.toLocaleString()}

          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Telemetry Status
          </p>

          <h1 className="green-text">

            {loading
              ? "LOADING"
              : aisRows.length > 0
              ? "ACTIVE"
              : "NO DATA"}

          </h1>

        </div>

      </div>

      {/* ================================================= */}
      {/* LIVE TELEMETRY                                    */}
      {/* ================================================= */}

      <div className="panel">

        <h2>
          Live AIS Telemetry
        </h2>

        {loading ? (

          <div
            style={{
              height:
                "300px",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              color:
                "#8b96a5"
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
              data={telemetry}
              margin={{
                top: 20,
                right: 20,
                left: 15,
                bottom: 45
              }}
              barCategoryGap="28%"
            >

              <CartesianGrid
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fill:
                    "#8b96a5",
                  fontSize:
                    11
                }}
                tickMargin={8}
                axisLine={{
                  stroke:
                    "#273344"
                }}
                label={{
                  value:
                    "Telemetry Segments",
                  position:
                    "insideBottom",
                  offset:
                    -30,
                  fill:
                    "#d6dde5",
                  fontSize:
                    13
                }}
              />

              <YAxis
                domain={[
                  0,
                  100
                ]}
                stroke="#6b7785"
                tick={{
                  fill:
                    "#8b96a5",
                  fontSize:
                    11
                }}
                width={55}
                label={{
                  value:
                    "Telemetry Health (%)",
                  angle:
                    -90,
                  position:
                    "insideLeft",
                  offset:
                    5,
                  fill:
                    "#d6dde5",
                  fontSize:
                    13
                }}
              />

              <Tooltip
                content={
                  <WhiteTooltip />
                }
              />

              <Bar
                dataKey="telemetry"
                name="Telemetry Health"
                fill="#00ff90"
                radius={[
                  5,
                  5,
                  0,
                  0
                ]}
                maxBarSize={90}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

      {/* ================================================= */}
      {/* AIS SUMMARY                                       */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        aisRows.length > 0 && (

        <div
          className="panel"
          style={{
            marginTop:
              "16px"
          }}
        >

          <h2>
            AIS Telemetry Summary
          </h2>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap:
                "16px"
            }}
          >

            <div>

              <p
                style={{
                  margin: 0,
                  color:
                    "#8b96a5",
                  fontSize:
                    "12px"
                }}
              >
                AIS Records
              </p>

              <strong
                style={{
                  display:
                    "block",
                  marginTop:
                    "5px",
                  color:
                    "#ffffff",
                  fontSize:
                    "20px"
                }}
              >
                {aisRows.length.toLocaleString()}
              </strong>

            </div>

            <div>

              <p
                style={{
                  margin: 0,
                  color:
                    "#8b96a5",
                  fontSize:
                    "12px"
                }}
              >
                Valid Records
              </p>

              <strong
                style={{
                  display:
                    "block",
                  marginTop:
                    "5px",
                  color:
                    "#00ff90",
                  fontSize:
                    "20px"
                }}
              >
                {validRecords.toLocaleString()}
              </strong>

            </div>

            <div>

              <p
                style={{
                  margin: 0,
                  color:
                    "#8b96a5",
                  fontSize:
                    "12px"
                }}
              >
                Average SOG
              </p>

              <strong
                style={{
                  display:
                    "block",
                  marginTop:
                    "5px",
                  color:
                    "#ffffff",
                  fontSize:
                    "20px"
                }}
              >
                {averageSOG.toFixed(2)}
              </strong>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
