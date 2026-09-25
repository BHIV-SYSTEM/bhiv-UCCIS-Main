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
    valid,
    validCoordinates,
    validSOG,
    validTimestamp: Boolean(
      validTimestamp
    )
  };
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
            fontWeight: 600,
            marginBottom: "5px"
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

/* ---------------------------------
   Date formatter
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

export default function RuntimeView() {
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
     Runtime metrics from AIS
  ---------------------------------- */
  const metrics = useMemo(() => {
    const total =
      aisRows.length;

    const valid =
      aisRows.filter(
        (row) => row.valid
      ).length;

    const moving =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      ).length;

    const stationary =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      ).length;

    const invalid =
      aisRows.filter(
        (row) => !row.valid
      ).length;

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

    const uniqueVesselTypes =
      new Set(
        aisRows
          .map(
            (row) =>
              row.vesselType
          )
          .filter(
            (type) =>
              type &&
              type !== "Unknown"
          )
      ).size;

    const health =
      total > 0
        ? (valid / total) * 100
        : 0;

    return {
      total,
      valid,
      moving,
      stationary,
      invalid,
      uniqueVessels,
      uniqueVesselTypes,
      health
    };
  }, [aisRows]);

  /* ---------------------------------
     Runtime status distribution

     AIS does not contain runtime
     health/status fields, so these
     are operational telemetry states:

       Healthy  = valid + moving
       Warning  = valid + stationary
       Critical = invalid
       Offline  = 0 (not present in AIS)
  ---------------------------------- */
  const runtimeStatus = useMemo(
    () => [
      {
        name: "Healthy",
        value: metrics.moving
      },
      {
        name: "Warning",
        value: metrics.stationary
      },
      {
        name: "Critical",
        value: metrics.invalid
      },
      {
        name: "Offline",
        value: 0
      }
    ],
    [metrics]
  );

  /* ---------------------------------
     Service health by vessel type

     AIS has no application-service
     field, so Vessel Type is used as
     the available operational grouping.
  ---------------------------------- */
  const runtimeServices = useMemo(() => {
    const groups = {};

    aisRows.forEach((row) => {
      const service =
        row.vesselType ||
        "Unknown";

      if (!groups[service]) {
        groups[service] = {
          service,
          total: 0,
          valid: 0,
          moving: 0,
          stationary: 0,
          invalid: 0
        };
      }

      groups[service].total += 1;

      if (row.valid) {
        groups[service].valid += 1;

        if (row.sog > 0) {
          groups[service].moving += 1;
        } else {
          groups[service].stationary += 1;
        }
      } else {
        groups[service].invalid += 1;
      }
    });

    return Object.values(groups)
      .sort(
        (a, b) =>
          b.total - a.total
      )
      .slice(0, 10)
      .map((item) => ({
        service:
          item.service,
        /*
         * AIS does not contain a literal application-service
         * health score. To avoid every bar becoming 100% when
         * the AIS coordinates/SOG/timestamp are valid, calculate
         * an operational health score from the actual activity:
         *
         *  - valid telemetry contributes 70%
         *  - moving activity contributes 20%
         *  - stationary activity contributes 10%
         *  - invalid records reduce the score
         *
         * This keeps the values AIS-derived while allowing
         * different vessel types to have different scores.
         */
        value:
          item.total > 0
            ? Number(
                Math.max(
                  0,
                  Math.min(
                    100,
                    (
                      (item.valid /
                        item.total) *
                        70 +
                      (item.moving /
                        item.total) *
                        20 +
                      (item.stationary /
                        item.total) *
                        10 -
                      (item.invalid /
                        item.total) *
                        20
                    )
                  ).toFixed(2)
                )
              )
            : 0,
        records:
          item.total,
        moving:
          item.moving,
        stationary:
          item.stationary,
        invalid:
          item.invalid
      }));
  }, [aisRows]);

  /* ---------------------------------
     Runtime trend

     Use actual AIS timestamps.
     Each point is the valid-data
     health percentage for an
     available time period.

     Multiple months -> Month
     One month       -> Week
     One week        -> Day
     One day         -> Hour
  ---------------------------------- */
  const runtimeTrend = useMemo(() => {
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

    const groups = {};

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

      if (!groups[key]) {
        groups[key] = {
          label,
          sortTime,
          total: 0,
          valid: 0
        };
      }

      groups[key].total += 1;

      if (row.valid) {
        groups[key].valid += 1;
      }
    });

    return {
      granularity,
      data: Object.values(groups)
        .sort(
          (a, b) =>
            a.sortTime - b.sortTime
        )
        .slice(-12)
        .map((item) => ({
          time: item.label,
          health:
            item.total > 0
              ? Number(
                  (
                    (item.valid /
                      item.total) *
                    100
                  ).toFixed(2)
                )
              : 0
        }))
    };
  }, [aisRows]);

  /* ---------------------------------
     Runtime response table
  ---------------------------------- */
  const runtimeData = useMemo(() => {
    const groups = {};

    aisRows.forEach((row) => {
      const service =
        row.vesselType ||
        "Unknown";

      if (!groups[service]) {
        groups[service] = {
          service,
          total: 0,
          valid: 0,
          moving: 0,
          stationary: 0,
          invalid: 0,
          latestTimestamp: null
        };
      }

      const group =
        groups[service];

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
        runtimeId:
          `RUN-AIS-${String(
            index + 1
          ).padStart(3, "0")}`,
        service:
          item.service,
        status:
          item.invalid > 0
            ? "Critical"
            : item.stationary >
              item.moving
            ? "Warning"
            : "Healthy",
        uptime:
          item.total > 0
            ? `${(
                (item.valid /
                  item.total) *
                100
              ).toFixed(1)}%`
            : "0%",
        records:
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
        Runtime Operations Center
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
            Runtime Health
          </h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : `${metrics.health.toFixed(
                  1
                )}%`}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Active Services
          </h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.uniqueVesselTypes.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Active AIS Records
          </h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.moving.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Stationary AIS Records
          </h4>

          <h2
            style={{
              color: "#000000"
            }}
          >
            {loading
              ? "..."
              : metrics.stationary.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ---------------------------------
          STATUS + SERVICE HEALTH
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>
            AIS Runtime Status Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>

              <Pie
                data={runtimeStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {runtimeStatus.map(
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
            AIS Operational Health by Vessel Type
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={runtimeServices}
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
                dataKey="service"
                label={{
                  value:
                    "Vessel Type",
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
                    "Data Health (%)",
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
                dataKey="value"
                name="Operational Health"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

          <p
            style={{
              color: "#000000",
              fontSize: "13px",
              marginTop: "8px",
              lineHeight: 1.5
            }}
          >
            Operational Health is derived from AIS validity,
            moving activity, stationary activity, and invalid
            telemetry for each vessel type.
          </p>

        </div>

      </div>

      {/* ---------------------------------
          RUNTIME TREND
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Runtime Health Trend by{" "}
          {runtimeTrend.granularity}
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <LineChart
            data={
              runtimeTrend.data
            }
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom:
                runtimeTrend.granularity ===
                "Month"
                  ? 35
                  : 65
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              label={{
                value:
                  runtimeTrend.granularity,
                position:
                  "insideBottom",
                offset: -20
              }}
              interval={0}
              angle={
                runtimeTrend.granularity ===
                "Month"
                  ? 0
                  : -25
              }
              textAnchor={
                runtimeTrend.granularity ===
                "Month"
                  ? "middle"
                  : "end"
              }
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
              dataKey="health"
              name="Runtime Health"
              stroke="#22c55e"
              strokeWidth={3}
              dot
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* ---------------------------------
          AIS RUNTIME RESPONSE
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Runtime Response
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
              minWidth: "1100px",
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
                  width: "145px"
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
                  width: "120px"
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
                  width: "220px"
                }}
              />

            </colgroup>

            <thead>
              <tr>

                <th>
                  Runtime ID
                </th>

                <th>
                  Vessel Type
                </th>

                <th>
                  Status
                </th>

                <th>
                  Uptime
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
                    Loading AIS runtime data...
                  </td>
                </tr>
              ) : runtimeData.length === 0 ? (
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
                    No AIS runtime records found.
                  </td>
                </tr>
              ) : (
                runtimeData.map(
                  (item) => (
                    <tr
                      key={
                        item.runtimeId
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
                          item.runtimeId
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
                          item.service
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
                          item.uptime
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
          AIS RUNTIME METRICS
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Runtime Metrics
        </h3>

        <div className="card-grid">

          <div className="kpi-card">
            <h4>
              Total AIS Records
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.total.toLocaleString()}
            </h2>
          </div>

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
              Invalid Records
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

        </div>

      </div>

    </RebuildSprint>
  );
}
