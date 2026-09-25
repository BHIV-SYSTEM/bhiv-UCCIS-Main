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
  "#dc2626",
  "#6b7280"
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
    validCoordinates,
    validSOG,
    validTimestamp: Boolean(
      validTimestamp
    ),
    valid
  };
}

/* ---------------------------------
   Domain status derived from AIS

   AIS has no literal domain-status
   field, so statuses are based on
   telemetry state:

     Active     = valid + moving
     Monitoring = valid + stationary
     Critical   = invalid records
     Offline    = 0 (not available in AIS)
---------------------------------- */
function getDomainState(row) {
  if (!row.valid) {
    return "Critical";
  }

  if (row.sog === 0) {
    return "Monitoring";
  }

  return "Active";
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

export default function DomainsView() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------------------------
     Load AIS CSV
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
     Overall metrics
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total =
      aisRows.length;

    const active =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      ).length;

    const monitoring =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      ).length;

    const critical =
      aisRows.filter(
        (row) => !row.valid
      ).length;

    const offline = 0;

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

    const valid =
      aisRows.filter(
        (row) => row.valid
      ).length;

    const health =
      total > 0
        ? (valid / total) * 100
        : 0;

    const moving =
      active;

    return {
      total,
      active,
      monitoring,
      critical,
      offline,
      uniqueVessels,
      health,
      moving
    };
  }, [aisRows]);

  /* ---------------------------------
     Domain status distribution
  ---------------------------------- */
  const domainStatus = useMemo(
    () => [
      {
        name: "Active",
        value: metrics.active
      },
      {
        name: "Monitoring",
        value: metrics.monitoring
      },
      {
        name: "Critical",
        value: metrics.critical
      },
      {
        name: "Offline",
        value: metrics.offline
      }
    ],
    [metrics]
  );

  /* ---------------------------------
     Domain traffic

     Vessel Type is used as the domain
     because AIS_file.csv does not contain
     Payments/Claims/Orders/etc.
  ---------------------------------- */
  const domainTraffic = useMemo(() => {
    const counts = {};

    aisRows.forEach((row) => {
      const domain =
        row.vesselType ||
        "Unknown";

      counts[domain] =
        (counts[domain] || 0) + 1;
    });

    return Object.entries(counts)
      .map(
        ([domain, traffic]) => ({
          domain,
          traffic
        })
      )
      .sort(
        (a, b) =>
          b.traffic - a.traffic
      )
      .slice(0, 10);
  }, [aisRows]);

  /* ---------------------------------
     Performance trend

     Calculate valid-data percentage
     for each available month.
  ---------------------------------- */
  const performanceTrend =
    useMemo(() => {
      const groups = {};

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

        if (!groups[key]) {
          groups[key] = {
            year,
            month,
            total: 0,
            valid: 0
          };
        }

        groups[key].total += 1;

        if (row.valid) {
          groups[key].valid += 1;
        }
      });

      return Object.values(groups)
        .sort(
          (a, b) =>
            new Date(
              a.year,
              a.month,
              1
            ).getTime() -
            new Date(
              b.year,
              b.month,
              1
            ).getTime()
        )
        .slice(-12)
        .map((item) => ({
          month:
            new Date(
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
          value:
            item.total > 0
              ? Number(
                  (
                    (item.valid /
                      item.total) *
                    100
                  ).toFixed(2)
                )
              : 0
        }));
    }, [aisRows]);

  /* ---------------------------------
     AIS domain response

     One row per top vessel type.
  ---------------------------------- */
  const backendResponse =
    useMemo(() => {
      const groups = {};

      aisRows.forEach((row) => {
        const domain =
          row.vesselType ||
          "Unknown";

        if (!groups[domain]) {
          groups[domain] = {
            domain,
            total: 0,
            valid: 0,
            moving: 0,
            stationary: 0,
            invalid: 0,
            latestTimestamp: null
          };
        }

        const group =
          groups[domain];

        group.total += 1;

        if (row.valid) {
          group.valid += 1;

          if (row.sog > 0) {
            group.moving += 1;
          } else {
            group.stationary += 1;
          }
        } else {
          group.invalid += 1;
        }

        if (row.date) {
          if (
            !group.latestTimestamp ||
            row.date >
              group.latestTimestamp
          ) {
            group.latestTimestamp =
              row.date;
          }
        }
      });

      return Object.values(groups)
        .sort(
          (a, b) =>
            b.total - a.total
        )
        .slice(0, 10)
        .map((item, index) => ({
          domainId:
            `DOM-AIS-${String(
              index + 1
            ).padStart(3, "0")}`,
          domain:
            item.domain,
          status:
            item.invalid > 0
              ? "Critical"
              : item.stationary >
                item.moving
              ? "Monitoring"
              : "Active",
          health:
            item.total > 0
              ? `${(
                  (item.valid /
                    item.total) *
                  100
                ).toFixed(1)}%`
              : "0%",
          traffic:
            item.total,
          moving:
            item.moving,
          stationary:
            item.stationary,
          invalid:
            item.invalid,
          latestTimestamp:
            item.latestTimestamp
        }));
    }, [aisRows]);

  return (
    <RebuildSprint>

      <h2>
        Domain Management Center
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
            Total Domains
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : new Set(
                  aisRows.map(
                    (row) =>
                      row.vesselType ||
                      "Unknown"
                  )
                ).size.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Active Domains
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : new Set(
                  aisRows
                    .filter(
                      (row) =>
                        row.valid &&
                        row.sog > 0
                    )
                    .map(
                      (row) =>
                        row.vesselType ||
                        "Unknown"
                    )
                ).size.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Monitoring
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : new Set(
                  aisRows
                    .filter(
                      (row) =>
                        row.valid &&
                        row.sog === 0
                    )
                    .map(
                      (row) =>
                        row.vesselType ||
                        "Unknown"
                    )
                ).size.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Critical
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : new Set(
                  aisRows
                    .filter(
                      (row) =>
                        !row.valid
                    )
                    .map(
                      (row) =>
                        row.vesselType ||
                        "Unknown"
                    )
                ).size.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ---------------------------------
          STATUS + TRAFFIC
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>
            AIS Domain Status Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>

              <Pie
                data={domainStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {domainStatus.map(
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
            AIS Domain Traffic Volume
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={domainTraffic}
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
                dataKey="domain"
                label={{
                  value:
                    "Vessel Type",
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
                dataKey="traffic"
                name="AIS Records"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ---------------------------------
          PERFORMANCE TREND
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Domain Data Quality Trend
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <LineChart
            data={
              performanceTrend
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
              domain={[
                0,
                100
              ]}
              label={{
                value:
                  "Valid AIS Data (%)",
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
              name="Data Quality"
              stroke="#22c55e"
              strokeWidth={3}
              dot
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* ---------------------------------
          AIS DOMAIN RESPONSE
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Domain Response
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
              minWidth: "1050px",
              tableLayout: "fixed",
              borderCollapse:
                "collapse"
            }}
          >

            <colgroup>

              <col
                style={{
                  width: "145px"
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
                  width: "100px"
                }}
              />

              <col
                style={{
                  width: "110px"
                }}
              />

              <col
                style={{
                  width: "110px"
                }}
              />

              <col
                style={{
                  width: "110px"
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

                <th>
                  Domain ID
                </th>

                <th>
                  Vessel Type
                </th>

                <th>
                  Status
                </th>

                <th>
                  Health
                </th>

                <th>
                  AIS Records
                </th>

                <th>
                  Moving
                </th>

                <th>
                  Stationary
                </th>

                <th>
                  Latest Timestamp
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px"
                    }}
                  >
                    Loading AIS domain data...
                  </td>
                </tr>
              ) : backendResponse.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      color:
                        "#000000",
                      textAlign:
                        "center",
                      padding:
                        "18px"
                    }}
                  >
                    No AIS domain records found.
                  </td>
                </tr>
              ) : (
                backendResponse.map(
                  (item) => (
                    <tr
                      key={
                        item.domainId
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
                          item.domainId
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
                          item.domain
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
                          item.health
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
                          item.traffic.toLocaleString()
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
                          item.moving.toLocaleString()
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
                          item.stationary.toLocaleString()
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
                          item.latestTimestamp
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
          AIS DOMAIN METRICS
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Domain Metrics
        </h3>

        <div className="card-grid">

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
              Data Quality
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.health.toFixed(
                1
              )}%
            </h2>
          </div>

          <div className="kpi-card">
            <h4>
              Moving AIS Records
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
              Critical Records
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.critical.toLocaleString()}
            </h2>
          </div>

        </div>

      </div>

    </RebuildSprint>
  );
}
