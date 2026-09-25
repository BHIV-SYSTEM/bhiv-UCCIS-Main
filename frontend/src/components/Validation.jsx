import { useEffect, useMemo, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ========================================================= */
/* AIS CONFIGURATION                                         */
/* ========================================================= */

const AIS_FILE = "/AIS_file.csv";

/*
 * Expected AIS columns:
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
/* NUMBER HELPER                                             */
/* ========================================================= */

function toNumber(value) {

  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

/* ========================================================= */
/* AIS NORMALIZATION                                         */
/* ========================================================= */

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

/*
 * A record passes when:
 *
 * 1. MMSI exists
 * 2. Timestamp is valid
 * 3. Latitude is between -90 and 90
 * 4. Longitude is between -180 and 180
 * 5. SOG is between 0 and 102.2 knots
 *
 * VesselType is allowed to be empty because some AIS
 * records can legitimately have an unavailable vessel type.
 */

function isValidAIS(row) {

  const validMMSI =
    Boolean(row.MMSI);

  const validTimestamp =
    row.date instanceof Date &&
    !Number.isNaN(
      row.date.getTime()
    );

  const validLatitude =
    Number.isFinite(row.LAT) &&
    row.LAT >= -90 &&
    row.LAT <= 90;

  const validLongitude =
    Number.isFinite(row.LON) &&
    row.LON >= -180 &&
    row.LON <= 180;

  const validSOG =
    Number.isFinite(row.SOG) &&
    row.SOG >= 0 &&
    row.SOG <= 102.2;

  return (
    validMMSI &&
    validTimestamp &&
    validLatitude &&
    validLongitude &&
    validSOG
  );
}

/* ========================================================= */
/* VALIDATION DATA                                           */
/* ========================================================= */

function buildValidationData(
  aisRows
) {

  let pass = 0;
  let fail = 0;

  aisRows.forEach((row) => {

    if (
      isValidAIS(row)
    ) {

      pass++;

    } else {

      fail++;

    }

  });

  return [

    {
      name: "PASS",
      value: pass
    },

    {
      name: "FAIL",
      value: fail
    }

  ];

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
              `${item.name || "value"}-${index}`
            }
            style={{
              color:
                "#ffffff",
              fontSize:
                "13px",
              lineHeight:
                1.5
            }}
          >

            {item.name || "Value"}:{" "}

            {Number(
              item.value
            ).toLocaleString()}

          </div>

        )
      )}

    </div>

  );

}

/* ========================================================= */
/* COMPONENT                                                 */
/* ========================================================= */

export default function Validation() {

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
  /* LOAD AIS FILE                                           */
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
          "Validation AIS loading error:",
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
  /* VALIDATION RESULTS                                      */
  /* ======================================================= */

  const validationData =
    useMemo(
      () =>
        buildValidationData(
          aisRows
        ),
      [aisRows]
    );

  const passCount =
    validationData[0]?.value || 0;

  const failCount =
    validationData[1]?.value || 0;

  const totalRecords =
    aisRows.length;

  const passPercentage =
    totalRecords > 0
      ? Math.round(
          (
            passCount /
            totalRecords
          ) * 100
        )
      : 0;

  const failPercentage =
    totalRecords > 0
      ? Math.round(
          (
            failCount /
            totalRecords
          ) * 100
        )
      : 0;

  /* ======================================================= */
  /* RENDER                                                  */
  /* ======================================================= */

  return (

    <div className="page">

      <h1>
        Validation Control Center
      </h1>

      {/* =================================================== */}
      {/* ERROR                                               */}
      {/* =================================================== */}

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

      {/* =================================================== */}
      {/* STATS                                               */}
      {/* =================================================== */}

      <div className="stats-grid">

        <div className="stat-card">

          <p className="stat-title">
            Validation
          </p>

          <h1
            className={
              loading ||
              passCount >= failCount
                ? "green-text"
                : ""
            }
          >

            {loading
              ? "LOADING"
              : passCount >= failCount
              ? "PASS"
              : "REVIEW"}

          </h1>

        </div>

        <div className="stat-card">

          <p className="stat-title">
            Integrity
          </p>

          <h1>
            {loading
              ? "LOADING"
              : `${passPercentage}%`}
          </h1>

        </div>

      </div>

      {/* =================================================== */}
      {/* VALIDATION CHART                                    */}
      {/* =================================================== */}

      <div className="panel">

        <h2>
          Validation Results
        </h2>

        {loading ? (

          <div
            style={{
              height:
                "280px",
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

            Loading AIS validation...

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <PieChart>

              <Pie
                data={
                  validationData
                }
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={100}
                innerRadius={58}
                paddingAngle={3}
                label={({
                  percent
                }) =>
                  `${(
                    percent * 100
                  ).toFixed(0)}%`
                }
              >

                <Cell
                  fill="#00ff90"
                />

                <Cell
                  fill="#ff4444"
                />

              </Pie>

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{
                  color:
                    "#ffffff",
                  paddingTop:
                    "15px",
                  fontSize:
                    "12px"
                }}
              />

              <Tooltip
                content={
                  <WhiteTooltip />
                }
              />

            </PieChart>

          </ResponsiveContainer>

        )}

      </div>

      {/* =================================================== */}
      {/* AIS VALIDATION SUMMARY                              */}
      {/* =================================================== */}

      {!loading &&
        !error &&
        totalRecords > 0 && (

        <div
          className="panel"
          style={{
            marginTop:
              "16px"
          }}
        >

          <h2>
            AIS Validation Summary
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
                Total AIS Records
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

                {totalRecords.toLocaleString()}

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
                PASS
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

                {passCount.toLocaleString()}

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
                FAIL
              </p>

              <strong
                style={{
                  display:
                    "block",
                  marginTop:
                    "5px",
                  color:
                    "#ff4444",
                  fontSize:
                    "20px"
                }}
              >

                {failCount.toLocaleString()}

              </strong>

            </div>

          </div>

          <div
            style={{
              marginTop:
                "14px",
              color:
                "#8b96a5",
              fontSize:
                "12px"
            }}
          >

            PASS: {passPercentage}%{" "}
            •{" "}
            FAIL: {failPercentage}%

          </div>

        </div>

      )}

    </div>

  );

}
