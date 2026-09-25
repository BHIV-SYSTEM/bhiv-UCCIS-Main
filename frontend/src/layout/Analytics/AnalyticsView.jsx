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
  "#f59e0b",
  "#dc2626"
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
    mmsi: String(mmsi || "Unknown"),
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

export default function AnalyticsView() {
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
     Analytics metrics
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total =
      aisRows.length;

    const valid =
      aisRows.filter(
        (row) => row.valid
      );

    const invalid =
      aisRows.filter(
        (row) => !row.valid
      );

    const moving =
      valid.filter(
        (row) => row.sog > 0
      );

    const stationary =
      valid.filter(
        (row) => row.sog === 0
      );

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

    const validRate =
      total > 0
        ? (valid.length / total) * 100
        : 0;

    const latestTimestamp = aisRows
      .filter((row) => row.date)
      .reduce(
        (latest, row) =>
          !latest ||
          row.date > latest
            ? row.date
            : latest,
        null
      );

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      moving: moving.length,
      stationary: stationary.length,
      uniqueVessels,
      validRate,
      latestTimestamp
    };
  }, [aisRows]);

  /* ---------------------------------
     Platform health analytics

     These are AIS data-quality states,
     not application/platform health.
  ---------------------------------- */
  const analyticsStatus = useMemo(
    () => {
      const total =
        aisRows.length;

      const healthy =
        aisRows.filter(
          (row) =>
            row.valid &&
            row.sog > 0
        ).length;

      const warning =
        aisRows.filter(
          (row) =>
            row.valid &&
            row.sog === 0
        ).length;

      const critical =
        aisRows.filter(
          (row) => !row.valid
        ).length;

      if (total === 0) {
        return [
          {
            name: "Healthy",
            value: 0
          },
          {
            name: "Warning",
            value: 0
          },
          {
            name: "Critical",
            value: 0
          }
        ];
      }

      return [
        {
          name: "Healthy",
          value: healthy
        },
        {
          name: "Warning",
          value: warning
        },
        {
          name: "Critical",
          value: critical
        }
      ];
    },
    [aisRows]
  );

  /* ---------------------------------
     Monthly AIS volume
  ---------------------------------- */
  const analyticsVolume = useMemo(() => {
    const counts = {};

    aisRows.forEach((row) => {
      if (!row.date) {
        return;
      }

      const year =
        row.date.getFullYear();

      const month =
        row.date.getMonth();

      const key =
        `${year}-${String(
          month + 1
        ).padStart(2, "0")}`;

      if (!counts[key]) {
        counts[key] = {
          year,
          month,
          count: 0
        };
      }

      counts[key].count += 1;
    });

    return Object.entries(counts)
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .slice(-12)
      .map(([key, item]) => ({
        month: new Date(
          item.year,
          item.month,
          1
        ).toLocaleString(
          undefined,
          {
            month: "short",
            year: "numeric"
          }
        ),
        count: item.count
      }));
  }, [aisRows]);

  /* ---------------------------------
     Last 7 available calendar dates

     Uses dates actually present in AIS.
  ---------------------------------- */
  const trendData = useMemo(() => {
    const counts = {};

    aisRows.forEach((row) => {
      if (!row.date) {
        return;
      }

      const key =
        `${row.date.getFullYear()}-${String(
          row.date.getMonth() + 1
        ).padStart(2, "0")}-${String(
          row.date.getDate()
        ).padStart(2, "0")}`;

      counts[key] =
        (counts[key] || 0) + 1;
    });

    const keys = Object.keys(
      counts
    )
      .sort()
      .slice(-7);

    return keys.map((key) => {
      const date =
        new Date(`${key}T00:00:00`);

      return {
        day: date.toLocaleDateString(
          undefined,
          {
            weekday: "short",
            month: "short",
            day: "numeric"
          }
        ),
        value: counts[key]
      };
    });
  }, [aisRows]);

  /* ---------------------------------
     AIS analytics response
  ---------------------------------- */
  const backendResponse =
    useMemo(() => {
      return [
        {
          reportId: "AIS-ANALYTICS-01",
          category:
            "AIS Telemetry Analytics",
          generated:
            metrics.total > 0
              ? "Success"
              : "No Data",
          records:
            metrics.total
        },
        {
          reportId: "AIS-ANALYTICS-02",
          category:
            "AIS Validation Analytics",
          generated:
            metrics.total > 0
              ? "Success"
              : "No Data",
          records:
            metrics.valid
        },
        {
          reportId: "AIS-ANALYTICS-03",
          category:
            "Vessel Activity Analytics",
          generated:
            metrics.total > 0
              ? "Success"
              : "No Data",
          records:
            metrics.moving
        },
        {
          reportId: "AIS-ANALYTICS-04",
          category:
            "AIS Exception Analytics",
          generated:
            metrics.total > 0
              ? "Success"
              : "No Data",
          records:
            metrics.invalid
        }
      ];
    }, [metrics]);

  return (
    <RebuildSprint>

      <h2>
        Analytics Center
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
            Total AIS Records
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
            Valid Records
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.valid.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Data Quality
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : `${metrics.validRate.toFixed(
                  1
                )}%`}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Unique Vessels
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.uniqueVessels.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ---------------------------------
          CHARTS
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>
            AIS Data Quality Analytics
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>

              <Pie
                data={analyticsStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {analyticsStatus.map(
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
            Monthly AIS Analytics Volume
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={
                analyticsVolume
              }
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
                dataKey="month"
                label={{
                  value: "Month",
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

              <Bar
                dataKey="count"
                name="AIS Records"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ---------------------------------
          PERFORMANCE / ACTIVITY TREND
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Activity Trend
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
              dataKey="day"
              label={{
                value:
                  "AIS Date",
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
          AIS ANALYTICS RESPONSE
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Analytics Response
        </h3>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling:
              "touch",
            borderRadius: "6px"
          }}
        >

          <table
            className="uccis-table"
            style={{
              width: "100%",
              minWidth: "760px",
              tableLayout: "fixed",
              borderCollapse:
                "collapse"
            }}
          >

            <colgroup>
              <col
                style={{
                  width: "180px"
                }}
              />

              <col
                style={{
                  width: "270px"
                }}
              />

              <col
                style={{
                  width: "130px"
                }}
              />

              <col
                style={{
                  width: "130px"
                }}
              />
            </colgroup>

            <thead>
              <tr>

                <th
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "12px 8px",
                    whiteSpace:
                      "nowrap"
                  }}
                >
                  Report ID
                </th>

                <th
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "12px 8px",
                    whiteSpace:
                      "normal"
                  }}
                >
                  Category
                </th>

                <th
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "12px 8px",
                    whiteSpace:
                      "nowrap"
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "12px 8px",
                    whiteSpace:
                      "nowrap"
                  }}
                >
                  Records
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px"
                    }}
                  >
                    Loading AIS analytics...
                  </td>
                </tr>
              ) : (
                backendResponse.map(
                  (item) => (
                    <tr
                      key={
                        item.reportId
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
                          item.reportId
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
                          item.category
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
                          item.generated
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
                          item.records.toLocaleString()
                        }
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
          AIS ANALYTICS METRICS
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Analytics Metrics
        </h3>

        <div className="card-grid">

          <div className="kpi-card">
            <h4>
              Moving Activity
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.moving.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Stationary Activity
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.stationary.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Validation Failures
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.invalid.toLocaleString()}
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Latest AIS Timestamp
            </h4>

            <h2
              style={{
                color:
                  "#000000",
                fontSize:
                  "18px"
              }}
            >
              {metrics.latestTimestamp
                ? metrics.latestTimestamp.toLocaleString()
                : "No Data"}
            </h2>
          </div>

        </div>

      </div>

    </RebuildSprint>
  );
}
