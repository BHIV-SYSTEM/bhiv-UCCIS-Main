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
  CartesianGrid
} from "recharts";

const AIS_FILE = "/AIS_file.csv";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#dc2626",
  "#2563eb"
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

  const validTimestamp =
    timestamp !== "" &&
    !Number.isNaN(
      new Date(timestamp).getTime()
    );

  const valid =
    validMMSI &&
    validCoordinates &&
    validSOG &&
    validTimestamp;

  return {
    id: `AIS-${index + 1}`,
    mmsi: String(mmsi || "Unknown"),
    timestamp: timestamp || "Unknown",
    lat,
    lon,
    sog,
    vesselType: String(
      vesselType || "Unknown"
    ),
    validMMSI,
    validCoordinates,
    validSOG,
    validTimestamp,
    valid
  };
}

/* ---------------------------------
   AIS evidence status
---------------------------------- */
function getEvidenceStatus(row) {
  /*
    AIS_file.csv does not contain an actual
    evidence repository/status field.

    These statuses therefore describe the
    quality/processing state of AIS telemetry:

      Verified = valid moving telemetry
      Pending  = valid stationary telemetry
      Rejected = invalid telemetry
      Archived = no source field available
  */

  if (!row.valid) {
    return "Rejected";
  }

  if (row.sog === 0) {
    return "Pending";
  }

  return "Verified";
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
          {Number(item.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default function EvidenceView() {
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
     Evidence metrics
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

    const verified =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog > 0
      );

    const pending =
      aisRows.filter(
        (row) =>
          row.valid &&
          row.sog === 0
      );

    /*
      AIS_file.csv has no evidence archive
      field, so Archived is not invented.
    */
    const archived = 0;

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

    const validCoordinates =
      aisRows.filter(
        (row) =>
          row.validCoordinates
      ).length;

    return {
      total,
      valid: valid.length,
      invalid: invalid.length,
      verified: verified.length,
      pending: pending.length,
      archived,
      uniqueVessels,
      validCoordinates
    };
  }, [aisRows]);

  /* ---------------------------------
     Evidence status distribution
  ---------------------------------- */
  const evidenceStatus =
    useMemo(
      () => [
        {
          name: "Verified",
          value: metrics.verified
        },
        {
          name: "Pending",
          value: metrics.pending
        },
        {
          name: "Rejected",
          value: metrics.invalid
        },
        {
          name: "Archived",
          value: metrics.archived
        }
      ],
      [metrics]
    );

  /* ---------------------------------
     Evidence by vessel type
  ---------------------------------- */
  const evidenceDomains =
    useMemo(() => {
      const counts = {};

      aisRows.forEach((row) => {
        const type =
          row.vesselType ||
          "Unknown";

        counts[type] =
          (counts[type] || 0) + 1;
      });

      return Object.entries(counts)
        .map(([domain, count]) => ({
          domain,
          count
        }))
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 10);
    }, [aisRows]);

  /* ---------------------------------
     Recent AIS evidence response
  ---------------------------------- */
  const backendResponse =
    useMemo(() => {
      return [...aisRows]
        .sort((a, b) => {
          const aTime =
            new Date(
              a.timestamp
            ).getTime();

          const bTime =
            new Date(
              b.timestamp
            ).getTime();

          if (Number.isNaN(aTime)) {
            return 1;
          }

          if (Number.isNaN(bTime)) {
            return -1;
          }

          return bTime - aTime;
        })
        .slice(0, 10)
        .map((row) => ({
          evidenceId:
            `EVD-${row.mmsi}`,
          traceId: row.id,
          category:
            row.vesselType,
          status:
            getEvidenceStatus(row),
          sog: row.sog,
          latitude: row.lat,
          longitude: row.lon,
          timestamp:
            row.timestamp
        }));
    }, [aisRows]);

  return (
    <RebuildSprint>

      <h2>
        Evidence Repository
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
            Total Evidence
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
            Verified
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.verified.toLocaleString()}
          </h2>
        </div>

        <div className="kpi-card">
          <h4>
            Pending
          </h4>

          <h2
            style={{
              color: "#ffffff"
            }}
          >
            {loading
              ? "..."
              : metrics.pending.toLocaleString()}
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

      </div>

      {/* ---------------------------------
          CHARTS
      ---------------------------------- */}

      <div className="dashboard-two-column">

        <div className="card">

          <h3>
            Evidence Status Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>

              <Pie
                data={evidenceStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {evidenceStatus.map(
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
            Evidence By Vessel Type
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={
                evidenceDomains
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
                dataKey="count"
                name="AIS Records"
                fill="#2563eb"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ---------------------------------
          AIS EVIDENCE RESPONSE
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Evidence Response
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
              minWidth: "980px",
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
                  width: "105px"
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
                  width: "85px"
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
                  Evidence ID
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
                  Trace ID
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
                  Vessel Type
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
                  SOG
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
                  Latitude
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
                  Longitude
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
                  Timestamp
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
                    Loading AIS data...
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
                    No AIS evidence
                    records found.
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
                          item.evidenceId
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
                            "normal"
                        }}
                      >
                        {item.status}
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
                            "nowrap"
                        }}
                      >
                        {
                          Number.isFinite(
                            item.latitude
                          )
                            ? item.latitude.toFixed(
                                5
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
                            "nowrap"
                        }}
                      >
                        {
                          Number.isFinite(
                            item.longitude
                          )
                            ? item.longitude.toFixed(
                                5
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
          AIS EVIDENCE METRICS
      ---------------------------------- */}

      <div className="card">

        <h3>
          AIS Evidence Metrics
        </h3>

        <div className="card-grid">

          <div className="kpi-card">
            <h4>
              Valid AIS Records
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
              Valid Coordinates
            </h4>

            <h2
              style={{
                color:
                  "#000000"
              }}
            >
              {metrics.validCoordinates.toLocaleString()}
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

        </div>

      </div>

    </RebuildSprint>
  );
}
