import React, { useEffect, useMemo, useState } from "react";
import RebuildSprint from "../../layout/RebuildSprint";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

const COLORS = [
  "#22c55e",
  "#2563eb",
  "#dc2626",
  "#f59e0b"
];

/* ---------------------------------
   CSV parser
---------------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if (
      (char === "\n" || char === "\r") &&
      !quoted
    ) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value.trim());
      value = "";

      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value.trim());

    if (row.some((cell) => cell !== "")) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) =>
    String(header || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
  );

  return rows.slice(1).map((cells) => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = cells[index] ?? "";
    });

    return item;
  });
}

/* ---------------------------------
   AIS field helper
---------------------------------- */
function getField(row, names) {
  for (const name of names) {
    const key = name.toLowerCase();

    if (
      row[key] !== undefined &&
      row[key] !== null &&
      row[key] !== ""
    ) {
      return row[key];
    }
  }

  return "";
}

/* ---------------------------------
   Normalize AIS row
---------------------------------- */
function normalizeAISRow(row, index) {
  const mmsi = getField(row, [
    "mmsi"
  ]);

  const timestamp = getField(row, [
    "basedatetime",
    "base_datetime",
    "base date time",
    "timestamp",
    "datetime",
    "time"
  ]);

  const latRaw = getField(row, [
    "lat",
    "latitude"
  ]);

  const lonRaw = getField(row, [
    "lon",
    "lng",
    "longitude"
  ]);

  const sogRaw = getField(row, [
    "sog",
    "speed over ground",
    "speed"
  ]);

  const vesselType = getField(row, [
    "vesseltype",
    "vessel type",
    "shiptype",
    "ship type",
    "type"
  ]);

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  const sog = Number(sogRaw);

  const validMMSI =
    String(mmsi).trim() !== "";

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  const parsedDate =
    timestamp !== ""
      ? new Date(timestamp)
      : null;

  const validTimestamp =
    parsedDate &&
    !Number.isNaN(
      parsedDate.getTime()
    );

  const valid =
    validMMSI &&
    validCoordinates &&
    validSOG &&
    validTimestamp;

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(
      mmsi || "Unknown"
    ),
    timestamp:
      timestamp || "Unknown",
    date: validTimestamp
      ? parsedDate
      : null,
    lat,
    lon,
    sog,
    vesselType: String(
      vesselType || "Unknown"
    ),
    validMMSI,
    validCoordinates,
    validSOG,
    validTimestamp: Boolean(
      validTimestamp
    ),
    valid
  };
}

/* ---------------------------------
   AIS operational state

   AIS_file.csv does not contain an
   operation status/recovery field.

   Therefore the chart uses mutually
   exclusive AIS-derived states:
     Completed = valid + moving
     Archived  = valid + stationary
     Failed    = invalid
     Recovered = 0 (not present in AIS)
---------------------------------- */
function getOperationState(row) {
  if (!row.valid) {
    return "Failed";
  }

  if (row.sog === 0) {
    return "Archived";
  }

  return "Completed";
}

/* ---------------------------------
   Date formatting
---------------------------------- */
function formatDate(value) {
  if (!value || value === "Unknown") {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

/* ---------------------------------
   Tooltip
---------------------------------- */
function CustomTooltip({
  active,
  payload,
  label
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
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "6px",
        padding: "10px 12px",
        color: "#ffffff"
      }}
    >
      {label && (
        <div
          style={{
            color: "#ffffff",
            marginBottom: "5px",
            fontWeight: 600
          }}
        >
          {label}
        </div>
      )}

      {payload.map((item, index) => (
        <div
          key={index}
          style={{
            color: "#ffffff",
            marginBottom: "2px"
          }}
        >
          {item.name}:{" "}
          {typeof item.value === "number"
            ? item.value.toLocaleString()
            : item.value}
        </div>
      ))}
    </div>
  );
}

export default function HistoricalOpsView() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------------------------
     Load AIS data
  ---------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          AIS_FILE,
          {
            cache: "no-store"
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load AIS_file.csv (${response.status})`
          );
        }

        const csvText =
          await response.text();

        const parsed =
          parseCSV(csvText);

        const normalized =
          parsed.map(
            normalizeAISRow
          );

        if (!cancelled) {
          setAisRows(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Failed to load AIS data."
          );
          setAisRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------------
     Historical AIS metrics
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total =
      aisRows.length;

    const completed =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      ).length;

    const archived =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      ).length;

    const failed =
      aisRows.filter(
        (row) => !row.valid
      ).length;

    // AIS_file.csv does not contain a recovery field.
    const recovered = 0;

    const valid =
      completed + archived;

    const uniqueVessels =
      new Set(
        aisRows
          .map((row) => row.mmsi)
          .filter(
            (mmsi) =>
              mmsi &&
              mmsi !== "Unknown"
          )
      ).size;

    const averageSOG =
      valid > 0
        ? aisRows
            .filter(
              (row) => row.valid
            )
            .reduce(
              (sum, row) =>
                sum + row.sog,
              0
            ) / valid
        : 0;

    return {
      total,
      completed,
      archived,
      failed,
      recovered,
      valid,
      uniqueVessels,
      averageSOG
    };
  }, [aisRows]);

  /* ---------------------------------
     Operation state distribution
  ---------------------------------- */
  const operationStatus = useMemo(
    () => [
      {
        name: "Completed",
        value: metrics.completed
      },
      {
        name: "Archived",
        value: metrics.archived
      },
      {
        name: "Failed",
        value: metrics.failed
      },
      {
        name: "Recovered",
        value: metrics.recovered
      }
    ],
    [metrics]
  );

  /* ---------------------------------
     Adaptive historical volume

     Uses actual AIS timestamps:
       multiple months -> Month
       one month       -> Week
       one week        -> Day
       one day         -> Hour
  ---------------------------------- */
  const historicalVolume = useMemo(() => {
    const datedRows =
      aisRows.filter(
        (row) => row.date
      );

    if (!datedRows.length) {
      return {
        granularity: "Month",
        data: []
      };
    }

    const timestamps =
      datedRows.map(
        (row) =>
          row.date.getTime()
      );

    const minTime =
      Math.min(...timestamps);

    const maxTime =
      Math.max(...timestamps);

    const minDate =
      new Date(minTime);

    const maxDate =
      new Date(maxTime);

    const monthSpan =
      (maxDate.getFullYear() -
        minDate.getFullYear()) *
        12 +
      (maxDate.getMonth() -
        minDate.getMonth());

    const daySpan =
      (maxTime - minTime) /
      (1000 * 60 * 60 * 24);

    let granularity = "Month";

    if (monthSpan === 0) {
      if (daySpan <= 1) {
        granularity = "Hour";
      } else if (daySpan <= 7) {
        granularity = "Day";
      } else {
        granularity = "Week";
      }
    }

    const counts = {};

    datedRows.forEach((row) => {
      const date = row.date;
      let key;
      let label;
      let sortTime;

      if (granularity === "Hour") {
        key =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}-${String(
            date.getHours()
          ).padStart(2, "0")}`;

        label =
          `${String(
            date.getHours()
          ).padStart(2, "0")}:00`;

        sortTime =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours()
          ).getTime();
      } else if (
        granularity === "Day"
      ) {
        key =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}`;

        label =
          date.toLocaleDateString(
            undefined,
            {
              weekday: "short",
              month: "short",
              day: "numeric"
            }
          );

        sortTime =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime();
      } else if (
        granularity === "Week"
      ) {
        const weekStart =
          new Date(date);

        const day =
          weekStart.getDay();

        weekStart.setDate(
          weekStart.getDate() - day
        );

        weekStart.setHours(
          0,
          0,
          0,
          0
        );

        key =
          `${weekStart.getFullYear()}-${String(
            weekStart.getMonth() + 1
          ).padStart(2, "0")}-${String(
            weekStart.getDate()
          ).padStart(2, "0")}`;

        const weekEnd =
          new Date(weekStart);

        weekEnd.setDate(
          weekEnd.getDate() + 6
        );

        label =
          `${weekStart.toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric"
            }
          )} - ${weekEnd.toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric"
            }
          )}`;

        sortTime =
          weekStart.getTime();
      } else {
        key =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

        label =
          date.toLocaleString(
            undefined,
            {
              month: "short",
              year: "numeric"
            }
          );

        sortTime =
          new Date(
            date.getFullYear(),
            date.getMonth(),
            1
          ).getTime();
      }

      if (!counts[key]) {
        counts[key] = {
          period: label,
          sortTime,
          count: 0
        };
      }

      counts[key].count += 1;
    });

    return {
      granularity,
      data: Object.values(counts)
        .sort(
          (a, b) =>
            a.sortTime - b.sortTime
        )
        .slice(-12)
        .map((item) => ({
          period: item.period,
          operations: item.count
        }))
    };
  }, [aisRows]);

  /* ---------------------------------
     Historical growth by year

     Uses actual years in AIS timestamps.
  ---------------------------------- */
  const trendData = useMemo(() => {
    const counts = {};

    aisRows.forEach((row) => {
      if (!row.date) {
        return;
      }

      const year =
        row.date.getFullYear();

      counts[year] =
        (counts[year] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(
        ([a], [b]) =>
          Number(a) - Number(b)
      )
      .map(
        ([year, value]) => ({
          year,
          value
        })
      );
  }, [aisRows]);

  /* ---------------------------------
     Recent AIS operation response
  ---------------------------------- */
  const backendResponse =
    useMemo(() => {
      return [...aisRows]
        .sort((a, b) => {
          const aTime =
            a.date
              ? a.date.getTime()
              : -Infinity;

          const bTime =
            b.date
              ? b.date.getTime()
              : -Infinity;

          return bTime - aTime;
        })
        .slice(0, 10)
        .map((row) => ({
          operationId:
            `OPS-${row.id.replace(
              "AIS-",
              ""
            )}`,
          traceId: row.id,
          type:
            row.vesselType,
          status:
            getOperationState(row),
          mmsi: row.mmsi,
          sog: row.sog,
          timestamp:
            row.timestamp
        }));
    }, [aisRows]);

  return (
    <RebuildSprint>

      <h2>
        Historical Operations
      </h2>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border:
              "1px solid #ef4444",
            color: "#991b1b",
            padding:
              "12px 14px",
            borderRadius: "6px",
            marginBottom: "16px"
          }}
        >
          {error}
        </div>
      )}

      {/* ---------------------------------
          KPI CARDS
      ---------------------------------- */}

      <div className="card-grid">

        <div className="kpi-card">
          <h4>
            Total Operations
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.total.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Completed
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.completed.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Archived
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.archived.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Recovered
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.recovered.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ---------------------------------
          STATUS + VOLUME
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>
            AIS Operation State Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>

              <Pie
                data={operationStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {operationStatus.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="card">

          <h3>
            AIS Historical Volume by{" "}
            {historicalVolume.granularity}
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={
                historicalVolume.data
              }
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom:
                  historicalVolume.granularity ===
                  "Month"
                    ? 35
                    : 65
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="period"
                label={{
                  value:
                    historicalVolume.granularity,
                  position:
                    "insideBottom",
                  offset: -20
                }}
                interval={0}
                angle={
                  historicalVolume.granularity ===
                  "Month"
                    ? 0
                    : -25
                }
                textAnchor={
                  historicalVolume.granularity ===
                  "Month"
                    ? "middle"
                    : "end"
                }
              />

              <YAxis
                allowDecimals={false}
                label={{
                  value:
                    "AIS Record Count",
                  angle: -90,
                  position:
                    "insideLeft"
                }}
              />

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />

              <Bar
                dataKey="operations"
                name="AIS Operations"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ---------------------------------
          HISTORICAL GROWTH TREND
      ---------------------------------- */}

      <div className="card">

        <h3>
          Historical AIS Growth Trend
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <LineChart
            data={trendData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 35
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="year"
              label={{
                value: "Year",
                position:
                  "insideBottom",
                offset: -20
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value:
                  "AIS Record Count",
                angle: -90,
                position:
                  "insideLeft"
              }}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

            <Line
              type="monotone"
              dataKey="value"
              name="AIS Records"
              stroke="#22c55e"
              strokeWidth={3}
              dot
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* ---------------------------------
          AIS RESPONSE
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Historical Operations Response
        </h3>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling:
              "touch"
          }}
        >

          <table
            className="uccis-table"
            style={{
              width: "100%",
              minWidth: "980px",
              tableLayout: "fixed",
              borderCollapse:
                "collapse"
            }}
          >

            <colgroup>

              <col
                style={{
                  width: "140px"
                }}
              />

              <col
                style={{
                  width: "110px"
                }}
              />

              <col
                style={{
                  width: "150px"
                }}
              />

              <col
                style={{
                  width: "110px"
                }}
              />

              <col
                style={{
                  width: "120px"
                }}
              />

              <col
                style={{
                  width: "210px"
                }}
              />

            </colgroup>

            <thead>
              <tr>

                <th>Operation ID</th>
                <th>Trace ID</th>
                <th>Vessel Type</th>
                <th>Status</th>
                <th>SOG</th>
                <th>Timestamp</th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px"
                    }}
                  >
                    Loading AIS historical operations...
                  </td>
                </tr>
              ) : backendResponse.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px"
                    }}
                  >
                    No AIS historical operation records found.
                  </td>
                </tr>
              ) : (
                backendResponse.map(
                  (item) => (
                    <tr
                      key={
                        item.traceId
                      }
                    >

                      <td
                        style={{
                          color:
                            "#000000",
                          textAlign:
                            "center",
                          padding:
                            "12px 8px",
                          whiteSpace:
                            "nowrap"
                        }}
                      >
                        {
                          item.operationId
                        }
                      </td>

                      <td
                        style={{
                          color:
                            "#000000",
                          textAlign:
                            "center",
                          padding:
                            "12px 8px",
                          whiteSpace:
                            "nowrap"
                        }}
                      >
                        {
                          item.traceId
                        }
                      </td>

                      <td
                        style={{
                          color:
                            "#000000",
                          textAlign:
                            "center",
                          padding:
                            "12px 8px",
                          whiteSpace:
                            "normal",
                          overflowWrap:
                            "anywhere"
                        }}
                      >
                        {
                          item.type
                        }
                      </td>

                      <td
                        style={{
                          color:
                            "#000000",
                          textAlign:
                            "center",
                          padding:
                            "12px 8px",
                          whiteSpace:
                            "nowrap"
                        }}
                      >
                        {
                          item.status
                        }
                      </td>

                      <td
                        style={{
                          color:
                            "#000000",
                          textAlign:
                            "center",
                          padding:
                            "12px 8px",
                          whiteSpace:
                            "nowrap"
                        }}
                      >
                        {
                          Number.isFinite(
                            item.sog
                          )
                            ? item.sog.toFixed(
                                2
                              )
                            : "Invalid"
                        }
                      </td>

                      <td
                        style={{
                          color:
                            "#000000",
                          textAlign:
                            "center",
                          padding:
                            "12px 8px",
                          whiteSpace:
                            "normal",
                          overflowWrap:
                            "anywhere"
                        }}
                      >
                        {formatDate(
                          item.timestamp
                        )}
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ---------------------------------
          AIS HISTORICAL METRICS
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Historical Metrics
        </h3>

        <div className="card-grid">

          <div className="kpi-card">
            <h4>
              Valid Records
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.valid.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Failed Records
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.failed.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Unique Vessels
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.uniqueVessels.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Average SOG
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.averageSOG.toFixed(2)}
            </h2>
          </div>

        </div>

      </div>

    </RebuildSprint>
  );
}
