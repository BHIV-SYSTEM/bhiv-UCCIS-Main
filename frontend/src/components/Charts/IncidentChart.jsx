import React, { useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   SEVERITY COLORS
========================================================= */

const SEVERITY_COLORS = [
  "#16a34a", // LOW
  "#eab308", // MEDIUM
  "#f97316", // HIGH
  "#dc2626", // CRITICAL
];

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const rows = [];

  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    /* -------------------------------------------------------
       QUOTES
    ------------------------------------------------------- */

    if (char === '"') {
      if (insideQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    }

    /* -------------------------------------------------------
       COMMA
    ------------------------------------------------------- */

    else if (
      char === "," &&
      !insideQuotes
    ) {
      row.push(cell.trim());
      cell = "";
    }

    /* -------------------------------------------------------
       NEW LINE
    ------------------------------------------------------- */

    else if (
      (char === "\n" || char === "\r") &&
      !insideQuotes
    ) {
      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }

      row.push(cell.trim());

      if (
        row.some(
          (value) =>
            value !== ""
        )
      ) {
        rows.push(row);
      }

      row = [];
      cell = "";
    }

    /* -------------------------------------------------------
       NORMAL CHARACTER
    ------------------------------------------------------- */

    else {
      cell += char;
    }
  }

  /* ---------------------------------------------------------
     LAST ROW
  --------------------------------------------------------- */

  if (
    cell !== "" ||
    row.length > 0
  ) {
    row.push(cell.trim());

    if (
      row.some(
        (value) =>
          value !== ""
      )
    ) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  /* ---------------------------------------------------------
     HEADERS
  --------------------------------------------------------- */

  const headers = rows[0].map(
    (header) =>
      String(header)
        .trim()
        .replace(/^"|"$/g, "")
  );

  /* ---------------------------------------------------------
     OBJECT RECORDS
  --------------------------------------------------------- */

  return rows
    .slice(1)
    .map((values) => {
      const record = {};

      headers.forEach(
        (header, index) => {
          record[header] =
            values[index] ?? "";
        }
      );

      return record;
    });
}

/* =========================================================
   AIS FIELD HELPER
========================================================= */

function getAISField(
  row,
  names
) {
  for (const name of names) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(
        row[name]
      ).trim() !== ""
    ) {
      return String(
        row[name]
      ).trim();
    }
  }

  return "";
}

/* =========================================================
   NORMALIZE AIS RECORD
========================================================= */

function normalizeAISRow(
  row,
  index
) {
  /* -------------------------------------------------------
     MMSI
  ------------------------------------------------------- */

  const mmsi =
    getAISField(row, [
      "MMSI",
      "mmsi",
      "Mmsi",
      "MMSI Number",
    ]);

  /* -------------------------------------------------------
     LATITUDE
  ------------------------------------------------------- */

  const latRaw =
    getAISField(row, [
      "LAT",
      "Lat",
      "Latitude",
      "latitude",
    ]);

  /* -------------------------------------------------------
     LONGITUDE
  ------------------------------------------------------- */

  const lonRaw =
    getAISField(row, [
      "LON",
      "Lon",
      "Longitude",
      "longitude",
    ]);

  /* -------------------------------------------------------
     SPEED OVER GROUND
  ------------------------------------------------------- */

  const sogRaw =
    getAISField(row, [
      "SOG",
      "Sog",
      "Speed",
      "speed",
      "Speed Over Ground",
    ]);

  const lat =
    Number(latRaw);

  const lon =
    Number(lonRaw);

  const sog =
    Number(sogRaw);

  /* -------------------------------------------------------
     VALID COORDINATES
  ------------------------------------------------------- */

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  /* -------------------------------------------------------
     VALID SOG
  ------------------------------------------------------- */

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  /* -------------------------------------------------------
     VALID TELEMETRY
  ------------------------------------------------------- */

  const validTelemetry =
    validCoordinates &&
    validSOG;

  /* -------------------------------------------------------
     VESSEL STATUS
  ------------------------------------------------------- */

  let status =
    "INVALID";

  if (validTelemetry) {
    if (sog > 0) {
      status = "MOVING";
    } else {
      status = "STATIONARY";
    }
  }

  return {
    id: index + 1,

    mmsi:
      mmsi ||
      `AIS-${index + 1}`,

    lat,
    lon,
    sog,

    validCoordinates,
    validSOG,
    validTelemetry,

    status,
  };
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const value =
    Number(
      payload[0].value || 0
    );

  return (
    <div
      style={{
        backgroundColor:
          "#ffffff",

        border:
          "2px solid #d1d5db",

        borderRadius:
          "8px",

        padding:
          "12px 16px",

        boxShadow:
          "0 6px 18px rgba(0, 0, 0, 0.25)",

        minWidth:
          "190px",

        zIndex: 9999,
      }}
    >
      {/* =================================================
          SEVERITY
      ================================================= */}

      <div
        style={{
          color:
            "#111827",

          fontSize:
            "14px",

          fontWeight:
            "700",

          marginBottom:
            "6px",
        }}
      >
        Severity: {label}
      </div>

      {/* =================================================
          INCIDENT COUNT
      ================================================= */}

      <div
        style={{
          color:
            "#111827",

          fontSize:
            "14px",

          fontWeight:
            "500",
        }}
      >
        Number of Incidents:{" "}

        <strong
          style={{
            color:
              "#000000",

            fontWeight:
              "700",
          }}
        >
          {value.toLocaleString()}
        </strong>
      </div>

      {/* =================================================
          SOURCE
      ================================================= */}

      <div
        style={{
          color:
            "#6b7280",

          fontSize:
            "12px",

          marginTop:
            "6px",
        }}
      >
        Derived from AIS telemetry
      </div>
    </div>
  );
};

/* =========================================================
   INCIDENT CHART
========================================================= */

const IncidentChart =
  () => {
    const [
      aisData,
      setAisData,
    ] = useState([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      error,
      setError,
    ] = useState("");

    /* =======================================================
       LOAD AIS FILE
    ======================================================= */

    useEffect(() => {
      let mounted =
        true;

      async function loadAISData() {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              AIS_FILE,
              {
                cache:
                  "no-store",
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `Failed to load AIS_file.csv (${response.status})`
            );
          }

          const csvText =
            await response.text();

          const parsedRows =
            parseCSV(
              csvText
            );

          const normalizedRows =
            parsedRows.map(
              (
                row,
                index
              ) =>
                normalizeAISRow(
                  row,
                  index
                )
            );

          if (mounted) {
            setAisData(
              normalizedRows
            );
          }
        } catch (err) {
          console.error(
            "IncidentChart AIS error:",
            err
          );

          if (mounted) {
            setError(
              err.message ||
                "Failed to load AIS data"
            );

            setAisData([]);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }

      loadAISData();

      return () => {
        mounted = false;
      };
    }, []);

    /* =======================================================
       CALCULATE SEVERITY
       
       AIS-derived severity model:
       
       LOW
       SOG 0 - 5
       
       MEDIUM
       SOG > 5 - 10
       
       HIGH
       SOG > 10 - 20
       OR stationary vessel
       
       CRITICAL
       SOG > 20
       OR invalid AIS telemetry
    ======================================================= */

    const data =
      useMemo(() => {
        let low = 0;
        let medium = 0;
        let high = 0;
        let critical = 0;

        aisData.forEach(
          (record) => {
            /* ---------------------------------------------
               INVALID TELEMETRY
               
               Invalid coordinates or invalid SOG
               are treated as CRITICAL validation
               exceptions.
            --------------------------------------------- */

            if (
              !record.validTelemetry
            ) {
              critical++;
              return;
            }

            /* ---------------------------------------------
               STATIONARY VESSEL
               
               Stationary records are treated as HIGH.
            --------------------------------------------- */

            if (
              record.status ===
              "STATIONARY"
            ) {
              high++;
              return;
            }

            /* ---------------------------------------------
               VERY HIGH SPEED
               
               SOG > 20
               --------------------------------------------- */

            if (
              record.sog > 20
            ) {
              critical++;
              return;
            }

            /* ---------------------------------------------
               HIGH SPEED
               
               SOG > 10 and <= 20
            --------------------------------------------- */

            if (
              record.sog > 10 &&
              record.sog <= 20
            ) {
              high++;
              return;
            }

            /* ---------------------------------------------
               MEDIUM SPEED
               
               SOG > 5 and <= 10
            --------------------------------------------- */

            if (
              record.sog > 5 &&
              record.sog <= 10
            ) {
              medium++;
              return;
            }

            /* ---------------------------------------------
               LOW SPEED
               
               SOG > 0 and <= 5
            --------------------------------------------- */

            if (
              record.sog > 0 &&
              record.sog <= 5
            ) {
              low++;
              return;
            }

            /* ---------------------------------------------
               FALLBACK
               
               Valid SOG = 0 is already handled as
               stationary, but this protects the chart
               from unexpected values.
            --------------------------------------------- */

            low++;
          }
        );

        return [
          {
            severity:
              "LOW",

            count:
              low,
          },

          {
            severity:
              "MEDIUM",

            count:
              medium,
          },

          {
            severity:
              "HIGH",

            count:
              high,
          },

          {
            severity:
              "CRITICAL",

            count:
              critical,
          },
        ];
      }, [aisData]);

    /* =======================================================
       TOTAL
    ======================================================= */

    const totalIncidents =
      useMemo(() => {
        return data.reduce(
          (
            total,
            item
          ) =>
            total +
            item.count,
          0
        );
      }, [data]);

    /* =======================================================
       LOADING STATE
    ======================================================= */

    if (loading) {
      return (
        <div className="card">
          <h2>
            Incident Severity
          </h2>

          <p
            style={{
              color:
                "#6b7280",
            }}
          >
            Loading AIS
            telemetry...
          </p>
        </div>
      );
    }

    /* =======================================================
       ERROR STATE
    ======================================================= */

    if (error) {
      return (
        <div className="card">
          <h2>
            Incident Severity
          </h2>

          <p
            style={{
              color:
                "#dc2626",
            }}
          >
            {error}
          </p>
        </div>
      );
    }

    /* =======================================================
       CHART
    ======================================================= */

    return (
      <div className="card">

        {/* =================================================
            TITLE
        ================================================= */}

        <h2>
          Incident Severity
        </h2>

        {/* =================================================
            CHART
        ================================================= */}

        <ResponsiveContainer
          width="100%"
          height={330}
        >
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 45,
              bottom: 50,
            }}
          >

            {/* =============================================
                X AXIS
            ============================================= */}

            <XAxis
              dataKey="severity"
              stroke="#9ca3af"
              tick={{
                fill:
                  "#9ca3af",

                fontSize:
                  14,
              }}
              label={{
                value:
                  "Severity Level",

                position:
                  "insideBottom",

                offset:
                  -15,

                fill:
                  "#9ca3af",
              }}
            />

            {/* =============================================
                Y AXIS
            ============================================= */}

            <YAxis
              stroke="#9ca3af"
              tick={{
                fill:
                  "#9ca3af",

                fontSize:
                  14,
              }}
              allowDecimals={
                false
              }
              label={{
                value:
                  "Number of Incidents",

                angle:
                  -90,

                position:
                  "insideLeft",

                offset:
                  -5,

                fill:
                  "#9ca3af",
              }}
            />

            {/* =============================================
                TOOLTIP
            ============================================= */}

            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                fill:
                  "rgba(255,255,255,0.05)",
              }}
            />

            {/* =============================================
                BARS
            ============================================= */}

            <Bar
              dataKey="count"
              name="Incidents"
              radius={[
                4,
                4,
                0,
                0,
              ]}
            >
              {data.map(
                (
                  entry,
                  index
                ) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      SEVERITY_COLORS[
                        index %
                          SEVERITY_COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(4, 1fr)",

            gap:
              "10px",

            marginTop:
              "10px",
          }}
        >

          {data.map(
            (
              item,
              index
            ) => (
              <div
                key={
                  item.severity
                }
                style={{
                  textAlign:
                    "center",

                  padding:
                    "8px",

                  borderRadius:
                    "6px",

                  background:
                    "rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    color:
                      SEVERITY_COLORS[
                        index
                      ],

                    fontSize:
                      "12px",

                    fontWeight:
                      "700",
                  }}
                >
                  {
                    item.severity
                  }
                </div>

                <div
                  style={{
                    color:
                      "#ffffff",

                    fontSize:
                      "18px",

                    fontWeight:
                      "700",

                    marginTop:
                      "3px",
                  }}
                >
                  {item.count.toLocaleString()}
                </div>
              </div>
            )
          )}

        </div>

        {/* =================================================
            TOTAL
        ================================================= */}

        <div
          style={{
            textAlign:
              "center",

            marginTop:
              "12px",

            fontSize:
              "12px",

            color:
              "#6b7280",
          }}
        >
          Total AIS-derived
          records:{" "}
          <strong
            style={{
              color:
                "#ffffff",
            }}
          >
            {totalIncidents.toLocaleString()}
          </strong>
        </div>

        {/* =================================================
            DATA SOURCE NOTE
        ================================================= */}

        <div
          style={{
            marginTop:
              "8px",

            fontSize:
              "12px",

            color:
              "#6b7280",

            textAlign:
              "center",
          }}
        >
          Severity is derived
          from AIS SOG,
          vessel activity,
          and telemetry
          validation.
        </div>

      </div>
    );
  };

export default IncidentChart;