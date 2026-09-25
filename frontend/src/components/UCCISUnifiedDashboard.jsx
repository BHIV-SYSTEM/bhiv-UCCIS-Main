import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "../styles/UCCISUnifiedDashboard.css";

/* =========================================================
   AIS CSV FILE
========================================================= */

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   AIS ZONES
========================================================= */

const ZONES = [
  {
    id: 1,
    name: "Pacific / West Coast",
  },
  {
    id: 2,
    name: "Gulf Coast",
  },
  {
    id: 3,
    name: "Atlantic / Northeast",
  },
  {
    id: 4,
    name: "Florida / Atlantic",
  },
  {
    id: 5,
    name: "Central / Inland",
  },
  {
    id: 6,
    name: "Hawaii / Pacific Islands",
  },
];

/* =========================================================
   NUMBER HELPER
========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

/* =========================================================
   CSV PARSER
========================================================= */

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

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) =>
    header
      .trim()
      .replace(/^"|"$/g, "")
  );

  return rows.slice(1).map((values) => {
    const object = {};

    headers.forEach((header, index) => {
      object[header] = String(values[index] ?? "")
        .trim()
        .replace(/^"|"$/g, "");
    });

    return object;
  });
}

/* =========================================================
   AIS ZONE CLASSIFICATION
========================================================= */

function getAISZone(latitude, longitude) {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);

  /* Hawaii / Pacific Islands */
  if (lon < -140 && lat < 30) {
    return 6;
  }

  /* Pacific / West Coast */
  if (lon < -105) {
    return 1;
  }

  /* Gulf Coast */
  if (
    lat < 32 &&
    lon >= -105 &&
    lon <= -85
  ) {
    return 2;
  }

  /* Florida / Atlantic */
  if (
    lat < 32 &&
    lon > -85
  ) {
    return 4;
  }

  /* Atlantic / Northeast */
  if (
    lat >= 32 &&
    lon > -85
  ) {
    return 3;
  }

  /* Central / Inland */
  return 5;
}

/* =========================================================
   TOOLTIP
========================================================= */

function CustomTooltip({
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
    <div className="uccis-tooltip">
      <div className="uccis-tooltip-title">
        {label}
      </div>

      {payload.map((item, index) => (
        <div
          key={index}
          className="uccis-tooltip-row"
        >
          <span
            className="uccis-tooltip-value"
          >
            {item.name}
          </span>

          <strong>
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   CUSTOM X AXIS TICK
========================================================= */

function ZoneTick({
  x,
  y,
  payload,
}) {
  const value = payload?.value || "";

  const parts = value.split(" / ");

  return (
    <text
      x={x}
      y={y + 15}
      textAnchor="middle"
      fill="#374151"
      fontSize={11}
      fontWeight={500}
    >
      {parts.length > 1 ? (
        <>
          <tspan
            x={x}
            dy="0"
          >
            {parts[0]}
          </tspan>

          <tspan
            x={x}
            dy="15"
          >
            / {parts.slice(1).join(" / ")}
          </tspan>
        </>
      ) : (
        <tspan x={x}>
          {value}
        </tspan>
      )}
    </text>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function UCCISUnifiedDashboard() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS DATA
  ======================================================= */

  const loadAISData = async () => {
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

      const text = await response.text();

      const parsed = parseCSV(text);

      if (!parsed.length) {
        throw new Error(
          "AIS_file.csv does not contain valid records."
        );
      }

      const cleaned = parsed
        .map((row) => ({
          MMSI: String(
            row.MMSI ?? ""
          ).trim(),

          BaseDateTime: String(
            row.BaseDateTime ?? ""
          ).trim(),

          LAT: toNumber(row.LAT),

          LON: toNumber(row.LON),

          SOG: toNumber(row.SOG),

          VesselType: String(
            row.VesselType ?? ""
          ).trim(),
        }))
        .filter(
          (row) =>
            row.MMSI &&
            Number.isFinite(row.LAT) &&
            Number.isFinite(row.LON) &&
            Number.isFinite(row.SOG)
        );

      if (!cleaned.length) {
        throw new Error(
          "AIS_file.csv was loaded, but no valid AIS records were found."
        );
      }

      console.log(
        "UCCIS AIS records loaded:",
        cleaned.length
      );

      setAisRows(cleaned);
    } catch (err) {
      console.error(
        "AIS loading error:",
        err
      );

      setError(
        err.message ||
          "Failed to load AIS data."
      );

      setAisRows([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadAISData();
  }, []);

  /* =======================================================
     BUILD ZONE DATA
  ======================================================= */

  const zoneData = useMemo(() => {
    const zoneMap = {};

    ZONES.forEach((zone) => {
      zoneMap[zone.id] = {
        zone: zone.name,
        records: 0,
        vessels: new Set(),
        vesselTypes: new Set(),
        totalSOG: 0,
        movingRecords: 0,
      };
    });

    aisRows.forEach((row) => {
      const zoneId = getAISZone(
        row.LAT,
        row.LON
      );

      const zone = zoneMap[zoneId];

      if (!zone) {
        return;
      }

      zone.records += 1;

      zone.vessels.add(row.MMSI);

      if (row.VesselType) {
        zone.vesselTypes.add(
          row.VesselType
        );
      }

      zone.totalSOG += row.SOG;

      if (row.SOG > 0.5) {
        zone.movingRecords += 1;
      }
    });

    return Object.values(zoneMap).map(
      (zone) => ({
        zone: zone.zone,

        records: zone.records,

        vessels: zone.vessels.size,

        vesselTypes:
          zone.vesselTypes.size,

        avgSOG:
          zone.records > 0
            ? Number(
                (
                  zone.totalSOG /
                  zone.records
                ).toFixed(2)
              )
            : 0,

        movingPercentage:
          zone.records > 0
            ? Number(
                (
                  (zone.movingRecords /
                    zone.records) *
                  100
                ).toFixed(1)
              )
            : 0,
      })
    );
  }, [aisRows]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalRecords =
    aisRows.length;

  const totalVessels = useMemo(() => {
    return new Set(
      aisRows.map(
        (row) => row.MMSI
      )
    ).size;
  }, [aisRows]);

  const totalVesselTypes =
    useMemo(() => {
      return new Set(
        aisRows
          .map(
            (row) =>
              row.VesselType
          )
          .filter(Boolean)
      ).size;
    }, [aisRows]);

  const averageSOG =
    useMemo(() => {
      if (!aisRows.length) {
        return 0;
      }

      const total =
        aisRows.reduce(
          (sum, row) =>
            sum + row.SOG,
          0
        );

      return Number(
        (
          total /
          aisRows.length
        ).toFixed(2)
      );
    }, [aisRows]);

  /* =======================================================
     CHART MARGIN
  ======================================================= */

  const chartMargin = {
    top: 20,
    right: 25,
    left: 20,
    bottom: 75,
  };

  /* =======================================================
     CHART PROPS
  ======================================================= */

  const xAxisProps = {
    dataKey: "zone",
    interval: 0,
    height: 80,
    tickLine: false,
    axisLine: {
      stroke: "#9ca3af",
    },
    tick: <ZoneTick />,
    label: {
      value: "AIS Zone",
      position: "insideBottom",
      offset: -25,
      fill: "#111827",
      fontSize: 13,
      fontWeight: 700,
    },
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="uccis-dashboard">
      <main className="uccis-dashboard-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="uccis-dashboard-header">
          <div>
            <div className="uccis-title-row">
              <div className="uccis-title-icon">
                AIS
              </div>

              <div>
                <h1 className="uccis-dashboard-title">
                  Unified Governance Dashboard
                </h1>

                <p className="uccis-dashboard-subtitle">
                  AIS-based operational governance
                  visibility
                </p>
              </div>
            </div>

            {/* <div className="uccis-data-source">
              Data Source:
              <span>
                AIS_file.csv
              </span>

              {aisRows.length > 0 && (
                <span className="uccis-live-badge">
                  LIVE DATA
                </span>
              )}
            </div> */}
          </div>

          {/* <button
            className="uccis-refresh-button"
            onClick={loadAISData}
            disabled={loading}
          >
            <span className="refresh-icon">
              ↻
            </span>

            {loading
              ? "Loading AIS..."
              : "Refresh AIS Data"}
          </button> */}
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="uccis-error">
            <div className="uccis-error-icon">
              !
            </div>

            <div>
              <strong>
                AIS Data Error
              </strong>

              <p>
                {error}
              </p>

              <small>
                Make sure the file exists at:
                <strong>
                  frontend/public/AIS_file.csv
                </strong>
              </small>
            </div>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="uccis-loading">
            <div className="uccis-spinner" />

            <h3>
              Loading AIS data
            </h3>

            <p>
              Reading AIS_file.csv and
              calculating zone statistics...
            </p>
          </div>
        )}

        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        {!loading &&
          aisRows.length > 0 && (
            <>
              {/* =========================================
                  SUMMARY CARDS
              ========================================= */}

              <section className="uccis-summary-grid">

                <div className="uccis-summary-card blue">
                  <div className="summary-card-top">
                    <span>
                      AIS RECORDS
                    </span>

                    <div className="summary-icon">
                      ◉
                    </div>
                  </div>

                  <h2>
                    {totalRecords.toLocaleString()}
                  </h2>

                  <p>
                    Total AIS observations
                  </p>
                </div>

                <div className="uccis-summary-card green">
                  <div className="summary-card-top">
                    <span>
                      UNIQUE VESSELS
                    </span>

                    <div className="summary-icon">
                      ◈
                    </div>
                  </div>

                  <h2>
                    {totalVessels.toLocaleString()}
                  </h2>

                  <p>
                    Unique MMSI identifiers
                  </p>
                </div>

                <div className="uccis-summary-card purple">
                  <div className="summary-card-top">
                    <span>
                      VESSEL TYPES
                    </span>

                    <div className="summary-icon">
                      ◆
                    </div>
                  </div>

                  <h2>
                    {totalVesselTypes.toLocaleString()}
                  </h2>

                  <p>
                    Distinct vessel types
                  </p>
                </div>

                <div className="uccis-summary-card orange">
                  <div className="summary-card-top">
                    <span>
                      AVERAGE SOG
                    </span>

                    <div className="summary-icon">
                      ↗
                    </div>
                  </div>

                  <h2>
                    {averageSOG}
                  </h2>

                  <p>
                    Knots
                  </p>
                </div>

              </section>

              {/* =========================================
                  CHART GRID
              ========================================= */}

              <section className="uccis-chart-grid">

                {/* =======================================
                    CHART 1
                ======================================= */}

                <div className="uccis-chart-card">
                  <div className="uccis-chart-header">
                    <div>
                      <h2>
                        AIS Records by Zone
                      </h2>

                      <p>
                        Number of AIS records assigned
                        to each geographic zone
                      </p>
                    </div>

                    <span className="chart-number blue">
                      01
                    </span>
                  </div>

                  <div className="uccis-chart-container">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={zoneData}
                        margin={chartMargin}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />

                        <XAxis
                          {...xAxisProps}
                        />

                        <YAxis
                          width={75}
                          tick={{
                            fill: "#374151",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={{
                            stroke: "#9ca3af",
                          }}
                          label={{
                            value:
                              "AIS Records",
                            angle: -90,
                            position:
                              "insideLeft",
                            fill: "#111827",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />

                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />

                        <Bar
                          dataKey="records"
                          name="AIS Records"
                          fill="#2563eb"
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                          maxBarSize={55}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* =======================================
                    CHART 2
                ======================================= */}

                <div className="uccis-chart-card">
                  <div className="uccis-chart-header">
                    <div>
                      <h2>
                        Unique Vessels by Zone
                      </h2>

                      <p>
                        Unique MMSI vessel count
                        derived from AIS_file.csv
                      </p>
                    </div>

                    <span className="chart-number green">
                      02
                    </span>
                  </div>

                  <div className="uccis-chart-container">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={zoneData}
                        margin={chartMargin}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />

                        <XAxis
                          {...xAxisProps}
                        />

                        <YAxis
                          width={75}
                          tick={{
                            fill: "#374151",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={{
                            stroke: "#9ca3af",
                          }}
                          label={{
                            value:
                              "Unique Vessels",
                            angle: -90,
                            position:
                              "insideLeft",
                            fill: "#111827",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />

                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />

                        <Bar
                          dataKey="vessels"
                          name="Unique Vessels"
                          fill="#16a34a"
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                          maxBarSize={55}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* =======================================
                    CHART 3
                ======================================= */}

                <div className="uccis-chart-card">
                  <div className="uccis-chart-header">
                    <div>
                      <h2>
                        Average Vessel Speed by Zone
                      </h2>

                      <p>
                        Average Speed Over Ground
                        (SOG)
                      </p>
                    </div>

                    <span className="chart-number purple">
                      03
                    </span>
                  </div>

                  <div className="uccis-chart-container">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={zoneData}
                        margin={chartMargin}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />

                        <XAxis
                          {...xAxisProps}
                        />

                        <YAxis
                          width={75}
                          tick={{
                            fill: "#374151",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={{
                            stroke: "#9ca3af",
                          }}
                          label={{
                            value:
                              "Average SOG (knots)",
                            angle: -90,
                            position:
                              "insideLeft",
                            fill: "#111827",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />

                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />

                        <Bar
                          dataKey="avgSOG"
                          name="Average SOG"
                          fill="#9333ea"
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                          maxBarSize={55}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* =======================================
                    CHART 4
                ======================================= */}

                <div className="uccis-chart-card">
                  <div className="uccis-chart-header">
                    <div>
                      <h2>
                        Vessel Movement by Zone
                      </h2>

                      <p>
                        Percentage of AIS records
                        with SOG greater than
                        0.5 knots
                      </p>
                    </div>

                    <span className="chart-number orange">
                      04
                    </span>
                  </div>

                  <div className="uccis-chart-container">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={zoneData}
                        margin={chartMargin}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />

                        <XAxis
                          {...xAxisProps}
                        />

                        <YAxis
                          width={75}
                          domain={[
                            0,
                            100,
                          ]}
                          tick={{
                            fill: "#374151",
                            fontSize: 12,
                          }}
                          tickLine={false}
                          axisLine={{
                            stroke: "#9ca3af",
                          }}
                          label={{
                            value:
                              "Moving Vessel %",
                            angle: -90,
                            position:
                              "insideLeft",
                            fill: "#111827",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />

                        <Tooltip
                          content={
                            <CustomTooltip />
                          }
                        />

                        <Bar
                          dataKey="movingPercentage"
                          name="Moving Vessel %"
                          fill="#f59e0b"
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                          maxBarSize={55}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </section>

              {/* =========================================
                  ZONE TABLE
              ========================================= */}

              <section className="uccis-table-card">

                <div className="uccis-table-header">
                  <div>
                    <h2>
                      AIS Zone Summary
                    </h2>

                    <p>
                      Operational statistics calculated
                      directly from AIS_file.csv
                    </p>
                  </div>

                  <span className="table-record-count">
                    {zoneData.length} Zones
                  </span>
                </div>

                <div className="uccis-table-wrapper">
                  <table className="uccis-zone-table">
                    <thead>
                      <tr>
                        <th>
                          Zone
                        </th>

                        <th>
                          AIS Records
                        </th>

                        <th>
                          Unique Vessels
                        </th>

                        <th>
                          Vessel Types
                        </th>

                        <th>
                          Avg SOG
                        </th>

                        <th>
                          Moving %
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {zoneData.map(
                        (zone, index) => (
                          <tr
                            key={
                              zone.zone
                            }
                          >
                            <td>
                              <div className="zone-name-cell">
                                <span className="zone-number">
                                  {String(
                                    index + 1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>

                                <strong>
                                  {zone.zone}
                                </strong>
                              </div>
                            </td>

                            <td>
                              <strong>
                                {zone.records.toLocaleString()}
                              </strong>
                            </td>

                            <td>
                              {zone.vessels.toLocaleString()}
                            </td>

                            <td>
                              {zone.vesselTypes}
                            </td>

                            <td>
                              {zone.avgSOG}
                              {" "}
                              knots
                            </td>

                            <td>
                              <div className="movement-cell">
                                <div className="movement-bar">
                                  <span
                                    style={{
                                      width: `${zone.movingPercentage}%`,
                                    }}
                                  />
                                </div>

                                <strong>
                                  {
                                    zone.movingPercentage
                                  }
                                  %
                                </strong>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* =========================================
                  FOOTER
              ========================================= */}

              <footer className="uccis-dashboard-footer">
                {/* <span>
                  UCCIS Unified Governance
                  Intelligence
                </span>

                <span>
                  AIS source: AIS_file.csv
                </span>

                <span className="footer-status">
                  ● Data Loaded
                </span> */}
              </footer>
            </>
          )}

      </main>
    </div>
  );
}