import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ========================================================= */
/* AIS CONFIGURATION                                         */
/* ========================================================= */

/*
 * Put the CSV file here:
 *
 * frontend/public/AIS_file.csv
 *
 * Expected columns:
 * MMSI, BaseDateTime, LAT, LON, SOG, VesselType
 */

const AIS_FILE = "/AIS_file.csv";

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
      if (insideQuotes && nextCharacter === '"') {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if (
      (character === "\n" || character === "\r") &&
      !insideQuotes
    ) {
      if (character === "\r" && nextCharacter === "\n") {
        i++;
      }

      row.push(value);
      value = "";

      if (row.some((item) => item.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += character;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);

    if (row.some((item) => item.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) =>
    header.trim().replace(/^"|"$/g, "")
  );

  return rows.slice(1).map((values) => {
    const record = {};

    headers.forEach((header, index) => {
      record[header] = String(values[index] ?? "")
        .trim()
        .replace(/^"|"$/g, "");
    });

    return record;
  });
}

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function normalizeAISRows(rows) {
  return rows.map((row) => {
    const date = new Date(
      String(row.BaseDateTime ?? "").trim()
    );

    return {
      MMSI: String(row.MMSI ?? "").trim(),

      BaseDateTime: String(
        row.BaseDateTime ?? ""
      ).trim(),

      LAT: toNumber(row.LAT),

      LON: toNumber(row.LON),

      SOG: toNumber(row.SOG),

      VesselType: String(
        row.VesselType ?? ""
      ).trim(),

      date,
    };
  });
}

function isValidAISRecord(row) {
  const validMMSI = Boolean(row.MMSI);

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
    !Number.isNaN(row.date.getTime());

  return (
    validMMSI &&
    validCoordinates &&
    validSpeed &&
    validTimestamp
  );
}

/* ========================================================= */
/* REPLAY RECONSTRUCTION                                     */
/* ========================================================= */

/*
 * Uses the actual AIS dataset.
 *
 * The records are split into 3 chronological replay
 * segments so the chart never collapses into one bar
 * simply because all records share the same hour.
 */

function buildReplayData(aisRows) {
  const validRows = aisRows
    .filter(isValidAISRecord)
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );

  if (!validRows.length) {
    return [
      {
        phase: "Replay 1",
        value: 0,
      },
      {
        phase: "Replay 2",
        value: 0,
      },
      {
        phase: "Replay 3",
        value: 0,
      },
    ];
  }

  const segmentCount = Math.min(
    3,
    validRows.length
  );

  const baseSize = Math.floor(
    validRows.length / segmentCount
  );

  const remainder =
    validRows.length % segmentCount;

  const result = [];

  let start = 0;

  for (
    let index = 0;
    index < segmentCount;
    index++
  ) {
    const segmentSize =
      baseSize +
      (index < remainder ? 1 : 0);

    const segment = validRows.slice(
      start,
      start + segmentSize
    );

    result.push({
      phase: `Replay ${index + 1}`,
      value: segment.length,
      vessels: new Set(
        segment.map((row) => row.MMSI)
      ).size,
    });

    start += segmentSize;
  }

  return result;
}

/* ========================================================= */
/* REPLAY CONTINUITY                                         */
/* ========================================================= */

/*
 * Continuity is calculated from the same three
 * chronological AIS segments.
 *
 * The segment with the highest record count is 100.
 * Other segments are shown relative to it.
 */

function buildContinuityData(aisRows) {
  const validRows = aisRows
    .filter(isValidAISRecord)
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );

  if (!validRows.length) {
    return [
      {
        time: "Replay 1",
        continuity: 0,
        records: 0,
      },
      {
        time: "Replay 2",
        continuity: 0,
        records: 0,
      },
      {
        time: "Replay 3",
        continuity: 0,
        records: 0,
      },
    ];
  }

  const segmentCount = Math.min(
    3,
    validRows.length
  );

  const baseSize = Math.floor(
    validRows.length / segmentCount
  );

  const remainder =
    validRows.length % segmentCount;

  const segments = [];

  let start = 0;

  for (
    let index = 0;
    index < segmentCount;
    index++
  ) {
    const segmentSize =
      baseSize +
      (index < remainder ? 1 : 0);

    const segment = validRows.slice(
      start,
      start + segmentSize
    );

    segments.push(segment);

    start += segmentSize;
  }

  return segments.map(
    (segment, index) => {

      const currentVessels =
        new Set(
          segment.map(
            (row) => row.MMSI
          )
        );

      /*
       * Replay 1 is the baseline.
       *
       * Replay 2 and Replay 3 are scored by how many
       * vessels continue from the previous replay segment.
       * This gives the chart a real continuity meaning
       * instead of comparing segment sizes.
       */
      if (index === 0) {
        return {
          time: "Replay 1",
          continuity: 100,
          records: segment.length,
          vessels: currentVessels.size,
        };
      }

      const previousSegment =
        segments[index - 1];

      const previousVessels =
        new Set(
          previousSegment.map(
            (row) => row.MMSI
          )
        );

      let continuingVessels = 0;

      currentVessels.forEach(
        (mmsi) => {
          if (
            previousVessels.has(mmsi)
          ) {
            continuingVessels++;
          }
        }
      );

      const continuity =
        currentVessels.size > 0
          ? Math.round(
              (
                continuingVessels /
                currentVessels.size
              ) * 100
            )
          : 0;

      return {
        time: `Replay ${index + 1}`,
        continuity,
        records: segment.length,
        vessels: currentVessels.size,
        continuingVessels,
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
  label,
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
        background: "#141d28",
        border: "1px solid #526174",
        borderRadius: "6px",
        padding: "10px 12px",
        color: "#ffffff",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.35)",
      }}
    >
      {label && (
        <div
          style={{
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          {label}
        </div>
      )}

      {payload.map((item, index) => (
        <div
          key={`${item.name || "value"}-${index}`}
          style={{
            color: "#ffffff",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          {item.name || "Value"}:{" "}
          {Number(item.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

/* ========================================================= */
/* COMPONENT                                                 */
/* ========================================================= */

export default function ReplayTask15() {
  const [aisRows, setAisRows] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ======================================================= */
  /* LOAD AIS CSV                                            */
  /* ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadAIS = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          AIS_FILE,
          {
            cache: "no-store",
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
          parseCSV(csvText);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv does not contain any records."
          );
        }

        const normalized =
          normalizeAISRows(parsed);

        if (!cancelled) {
          setAisRows(normalized);
        }
      } catch (loadError) {
        console.error(
          "ReplayTask15 AIS error:",
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
  /* DERIVED DATA                                            */
  /* ======================================================= */

  const replayData = useMemo(
    () =>
      buildReplayData(aisRows),
    [aisRows]
  );

  const continuity = useMemo(
    () =>
      buildContinuityData(aisRows),
    [aisRows]
  );

  const validRecords = useMemo(
    () =>
      aisRows.filter(
        isValidAISRecord
      ).length,
    [aisRows]
  );

  const uniqueVessels = useMemo(
    () =>
      new Set(
        aisRows
          .map(
            (row) => row.MMSI
          )
          .filter(Boolean)
      ).size,
    [aisRows]
  );

  const confidence =
    aisRows.length > 0
      ? Math.round(
          (validRecords /
            aisRows.length) *
            100
        )
      : 0;

  /* ======================================================= */
  /* RENDER                                                  */
  /* ======================================================= */

  return (
    <div className="page">

      <h1>
        Replay Reconstruction Center
      </h1>

      {/* =================================================== */}
      {/* ERROR                                               */}
      {/* =================================================== */}

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 6,
            border:
              "1px solid #7f1d1d",
            background:
              "#1f0b0b",
            color:
              "#fca5a5",
            fontSize: 13,
          }}
        >
          <strong>
            AIS data error:
          </strong>{" "}
          {error}

          <div
            style={{
              marginTop: 5,
              color: "#8b96a5",
            }}
          >
            Make sure{" "}
            <strong>
              AIS_file.csv
            </strong>{" "}
            is inside{" "}
            <strong>
              frontend/public/
            </strong>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* STAT CARDS                                           */}
      {/* =================================================== */}

      <div className="stats-grid">

        <div className="stat-card">

          <p className="stat-title">
            Replay Confidence
          </p>

          <h1 className="green-text">
            {loading
              ? "--"
              : `${confidence}%`}
          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Recovery Status
          </p>

          <h1>
            {loading
              ? "LOADING"
              : aisRows.length > 0
              ? "STABLE"
              : "NO DATA"}
          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Replay Events
          </p>

          <h1>
            {loading
              ? "--"
              : aisRows.length.toLocaleString()}
          </h1>

        </div>

      </div>

      {/* =================================================== */}
      {/* CHART GRID                                           */}
      {/* =================================================== */}

      <div className="chart-grid">

        {/* ================================================= */}
        {/* REPLAY RECONSTRUCTION                             */}
        {/* ================================================= */}

        <div className="panel">

          <h2>
            Replay Reconstruction
          </h2>

          {loading ? (

            <div
              style={{
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b96a5",
              }}
            >
              Loading AIS replay data...
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart
                data={replayData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 15,
                  bottom: 45,
                }}
                barCategoryGap="28%"
              >

                <CartesianGrid
                  stroke="#1e293b"
                  vertical={false}
                />

                <XAxis
                  dataKey="phase"
                  tick={{
                    fill: "#8b96a5",
                    fontSize: 11,
                  }}
                  tickMargin={8}
                  axisLine={{
                    stroke: "#273344",
                  }}
                  label={{
                    value:
                      "Replay Segments",
                    position:
                      "insideBottom",
                    offset: -30,
                    fill: "#d6dde5",
                    fontSize: 14,
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#8b96a5",
                    fontSize: 11,
                  }}
                  width={55}
                  axisLine={{
                    stroke: "#273344",
                  }}
                  label={{
                    value:
                      "AIS Replay Events",
                    angle: -90,
                    position:
                      "insideLeft",
                    offset: 5,
                    fill: "#d6dde5",
                    fontSize: 14,
                  }}
                />

                <Tooltip
                  content={
                    <WhiteTooltip />
                  }
                />

                <Bar
                  dataKey="value"
                  name="AIS Events"
                  fill="#00ff90"
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                  maxBarSize={90}
                />

              </BarChart>

            </ResponsiveContainer>

          )}

        </div>

        {/* ================================================= */}
        {/* REPLAY CONTINUITY                                 */}
        {/* ================================================= */}

        <div className="panel">

          <h2>
            Replay Continuity
          </h2>

          {loading ? (

            <div
              style={{
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b96a5",
              }}
            >
              Loading AIS continuity...
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart
                data={continuity}
                margin={{
                  top: 20,
                  right: 20,
                  left: 15,
                  bottom: 45,
                }}
                barCategoryGap="30%"
              >

                <CartesianGrid
                  stroke="#1e293b"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#8b96a5",
                    fontSize: 11,
                  }}
                  tickMargin={8}
                  axisLine={{
                    stroke: "#273344",
                  }}
                  label={{
                    value:
                      "Replay Segments",
                    position:
                      "insideBottom",
                    offset: -30,
                    fill: "#d6dde5",
                    fontSize: 14,
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#8b96a5",
                    fontSize: 11,
                  }}
                  width={55}
                  domain={[0, 100]}
                  axisLine={{
                    stroke: "#273344",
                  }}
                  label={{
                    value:
                      "Continuity Score (%)",
                    angle: -90,
                    position:
                      "insideLeft",
                    offset: 5,
                    fill: "#d6dde5",
                    fontSize: 14,
                  }}
                />

                <Tooltip
                  content={
                    <WhiteTooltip />
                  }
                />

                <Bar
                  dataKey="continuity"
                  name="Continuity"
                  fill="#00ff90"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  maxBarSize={85}
                />

              </BarChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>

      {/* =================================================== */}
      {/* AIS SOURCE INFO                                      */}
      {/* =================================================== */}

      {!loading &&
        !error &&
        aisRows.length > 0 && (

          <div
            className="panel"
            style={{
              marginTop: 16,
            }}
          >

            <h2>
              AIS Replay Source
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
            >

              <div>

                <p
                  style={{
                    margin: 0,
                    color: "#8b96a5",
                    fontSize: 12,
                  }}
                >
                  AIS Records
                </p>

                <strong
                  style={{
                    display: "block",
                    marginTop: 5,
                    color: "#ffffff",
                    fontSize: 20,
                  }}
                >
                  {aisRows.length.toLocaleString()}
                </strong>

              </div>

              <div>

                <p
                  style={{
                    margin: 0,
                    color: "#8b96a5",
                    fontSize: 12,
                  }}
                >
                  Unique Vessels
                </p>

                <strong
                  style={{
                    display: "block",
                    marginTop: 5,
                    color: "#ffffff",
                    fontSize: 20,
                  }}
                >
                  {uniqueVessels.toLocaleString()}
                </strong>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}
