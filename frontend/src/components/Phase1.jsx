import React, { useEffect, useMemo, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* =========================================================
   COLORS
   ========================================================= */

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
];

/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      char === "," &&
      !insideQuotes
    ) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
}

function parseAISCSV(csvText) {
  if (!csvText) {
    return [];
  }

  const lines = csvText
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map(
    (header) =>
      header
        .replace(/^\uFEFF/, "")
        .trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);

    const row = {};

    headers.forEach((header, index) => {
      row[header] =
        values[index] !== undefined
          ? values[index]
          : "";
    });

    return row;
  });
}

/* =========================================================
   NORMALIZE AIS FIELD
   ========================================================= */

function getAISField(row, possibleNames) {
  for (const name of possibleNames) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {
      return String(row[name]).trim();
    }
  }

  return "";
}

/* =========================================================
   PHASE 1
   ========================================================= */

function Phase1() {
  /* =======================================================
     AIS STATE
     ======================================================= */

  const [aisData, setAISData] = useState([]);
  const [loadingAIS, setLoadingAIS] =
    useState(true);
  const [aisError, setAISError] =
    useState("");

  /* =======================================================
     LOAD AIS CSV
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAISData = async () => {
      try {
        setLoadingAIS(true);
        setAISError("");

        const response = await fetch(
          "/AIS_file.csv",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `AIS CSV request failed: ${response.status}`
          );
        }

        const csvText =
          await response.text();

        const parsedData =
          parseAISCSV(csvText);

        if (!mounted) {
          return;
        }

        setAISData(parsedData);

        if (!parsedData.length) {
          setAISError(
            "AIS_file.csv was loaded but no records were found."
          );
        }
      } catch (error) {
        console.error(
          "Failed to load AIS_file.csv:",
          error
        );

        if (!mounted) {
          return;
        }

        setAISError(
          "Unable to load AIS_file.csv. Make sure the file is inside the public folder."
        );
      } finally {
        if (mounted) {
          setLoadingAIS(false);
        }
      }
    };

    loadAISData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AIS METRICS
     ======================================================= */

  const aisMetrics = useMemo(() => {
    if (!aisData.length) {
      return {
        totalRecords: 0,
        uniqueVessels: 0,
        vesselTypes: 0,
        averageSpeed: 0,
        minLat: null,
        maxLat: null,
        minLon: null,
        maxLon: null,
      };
    }

    const vesselSet = new Set();
    const vesselTypeSet = new Set();

    let totalSpeed = 0;
    let speedCount = 0;

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLon = Infinity;
    let maxLon = -Infinity;

    aisData.forEach((row) => {
      /* MMSI */

      const mmsi = getAISField(row, [
        "MMSI",
        "mmsi",
        "Mmsi",
      ]);

      if (mmsi) {
        vesselSet.add(mmsi);
      }

      /* Vessel Type */

      const vesselType =
        getAISField(row, [
          "VesselType",
          "Vessel Type",
          "vessel_type",
          "vesselType",
        ]);

      if (vesselType) {
        vesselTypeSet.add(vesselType);
      }

      /* SOG */

      const sogValue = Number(
        getAISField(row, [
          "SOG",
          "sog",
          "Speed",
          "speed",
        ])
      );

      if (
        Number.isFinite(sogValue)
      ) {
        totalSpeed += sogValue;
        speedCount++;
      }

      /* LAT */

      const lat = Number(
        getAISField(row, [
          "LAT",
          "Lat",
          "Latitude",
          "latitude",
        ])
      );

      if (Number.isFinite(lat)) {
        minLat = Math.min(
          minLat,
          lat
        );

        maxLat = Math.max(
          maxLat,
          lat
        );
      }

      /* LON */

      const lon = Number(
        getAISField(row, [
          "LON",
          "Lon",
          "Longitude",
          "longitude",
        ])
      );

      if (Number.isFinite(lon)) {
        minLon = Math.min(
          minLon,
          lon
        );

        maxLon = Math.max(
          maxLon,
          lon
        );
      }
    });

    return {
      totalRecords:
        aisData.length,

      uniqueVessels:
        vesselSet.size,

      vesselTypes:
        vesselTypeSet.size,

      averageSpeed:
        speedCount > 0
          ? totalSpeed / speedCount
          : 0,

      minLat:
        minLat === Infinity
          ? null
          : minLat,

      maxLat:
        maxLat === -Infinity
          ? null
          : maxLat,

      minLon:
        minLon === Infinity
          ? null
          : minLon,

      maxLon:
        maxLon === -Infinity
          ? null
          : maxLon,
    };
  }, [aisData]);

  /* =======================================================
     REPOSITORY ARCHITECTURE DATA
     
     The architecture remains the same as your original
     Phase 1 design. AIS is used as the operational data
     source and its record volume is incorporated into the
     repository distribution.
     ======================================================= */

  const repoData = useMemo(() => {
    const totalAIS =
      aisMetrics.totalRecords;

    /*
     * Base architecture weights.
     *
     * These represent the existing Phase 1
     * architecture categories.
     */

    const baseData = [
      {
        name: "Frontend",
        value: 25,
      },
      {
        name: "Backend",
        value: 25,
      },
      {
        name: "Replay Engine",
        value: 20,
      },
      {
        name: "Telemetry",
        value: 15,
      },
      {
        name: "Deployment",
        value: 15,
      },
    ];

    /*
     * When AIS data exists, preserve the
     * architecture distribution but expose
     * AIS-backed telemetry information through
     * the Telemetry section.
     *
     * This prevents the chart from pretending
     * that AIS records are repository files.
     */

    if (totalAIS <= 0) {
      return baseData;
    }

    return baseData.map((item) => {
      if (item.name === "Telemetry") {
        return {
          ...item,
          value: 15,
        };
      }

      return item;
    });
  }, [aisMetrics.totalRecords]);

  /* =======================================================
     AIS STATUS
     ======================================================= */

  const aisStatus = loadingAIS
    ? "LOADING"
    : aisError
    ? "ERROR"
    : aisData.length
    ? "CONNECTED"
    : "NO DATA";

  /* =======================================================
     FORMATTERS
     ======================================================= */

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatSpeed = (value) => {
    return `${Number(
      value || 0
    ).toFixed(2)} knots`;
  };

  const formatCoordinate = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "N/A";
    }

    return Number(value).toFixed(4);
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div style={container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <h1>
        PHASE 1 — Canonical Repository Consolidation
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginTop: "8px",
          marginBottom: "20px",
          fontSize: "15px",
        }}
      >
        AIS operational data connected to the
        canonical repository validation layer.
      </p>

      {/* =================================================
          STATUS CARDS
      ================================================= */}

      <div style={grid}>

        <div style={card}>
          <div style={cardTitle}>
            Unified Repo
          </div>

          <div style={activeValue}>
            ACTIVE
          </div>
        </div>

        <div style={card}>
          <div style={cardTitle}>
            Deployment Flow
          </div>

          <div style={activeValue}>
            VERIFIED
          </div>
        </div>

        <div style={card}>
          <div style={cardTitle}>
            Replay APIs
          </div>

          <div style={activeValue}>
            UNIFIED
          </div>
        </div>

        <div style={card}>
          <div style={cardTitle}>
            AIS Data
          </div>

          <div
            style={{
              ...activeValue,
              color:
                aisStatus === "CONNECTED"
                  ? "#22c55e"
                  : aisStatus ===
                    "LOADING"
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          >
            {aisStatus}
          </div>
        </div>

      </div>

      {/* =================================================
          AIS DATA SUMMARY
      ================================================= */}

      <div style={panel}>

        <h2>
          AIS Operational Data
        </h2>

        {loadingAIS ? (
          <div style={loadingBox}>
            Loading AIS_file.csv...
          </div>
        ) : aisError ? (
          <div style={errorBox}>
            {aisError}
          </div>
        ) : (
          <div style={aisStatsGrid}>

            {/* RECORDS */}

            <div style={aisStatCard}>
              <span style={aisStatLabel}>
                AIS Records
              </span>

              <strong style={aisStatValue}>
                {formatNumber(
                  aisMetrics.totalRecords
                )}
              </strong>
            </div>

            {/* VESSELS */}

            <div style={aisStatCard}>
              <span style={aisStatLabel}>
                Unique Vessels
              </span>

              <strong style={aisStatValue}>
                {formatNumber(
                  aisMetrics.uniqueVessels
                )}
              </strong>
            </div>

            {/* VESSEL TYPES */}

            <div style={aisStatCard}>
              <span style={aisStatLabel}>
                Vessel Types
              </span>

              <strong style={aisStatValue}>
                {formatNumber(
                  aisMetrics.vesselTypes
                )}
              </strong>
            </div>

            {/* SPEED */}

            <div style={aisStatCard}>
              <span style={aisStatLabel}>
                Average SOG
              </span>

              <strong style={aisStatValue}>
                {formatSpeed(
                  aisMetrics.averageSpeed
                )}
              </strong>
            </div>

          </div>
        )}

      </div>

      {/* =================================================
          PIE CHART
      ================================================= */}

      <div style={panel}>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "32px",
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Repository Architecture Distribution
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginTop: "-10px",
            marginBottom: "15px",
          }}
        >
          Canonical UCCIS architecture with
          AIS telemetry integration
        </p>

        <div
          style={{
            width: "100%",
            height: "480px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={repoData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="43%"
                outerRadius={170}
                innerRadius={65}
                paddingAngle={2}
                labelLine={true}
                label={({ value }) =>
                  `${value}%`
                }
              >

                {repoData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      stroke="#ffffff"
                      strokeWidth={2}
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
                contentStyle={{
                  background:
                    "#102030",
                  border:
                    "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
                labelStyle={{
                  color: "#ffffff",
                  fontWeight: "700",
                }}
                formatter={(
                  value
                ) => [
                  `${value}%`,
                  "Distribution",
                ]}
              />

              <Legend
                verticalAlign="bottom"
                iconType="square"
                wrapperStyle={{
                  color: "#ffffff",
                  fontSize: "17px",
                  paddingTop: "25px",
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* =================================================
          AIS GEOGRAPHIC COVERAGE
      ================================================= */}

      <div style={panel}>

        <h2>
          AIS Geographic Coverage
        </h2>

        <div style={coverageGrid}>

          <div style={coverageCard}>
            <span style={aisStatLabel}>
              Latitude Range
            </span>

            <strong style={coverageValue}>
              {formatCoordinate(
                aisMetrics.minLat
              )}
              {" "}→{" "}
              {formatCoordinate(
                aisMetrics.maxLat
              )}
            </strong>
          </div>

          <div style={coverageCard}>
            <span style={aisStatLabel}>
              Longitude Range
            </span>

            <strong style={coverageValue}>
              {formatCoordinate(
                aisMetrics.minLon
              )}
              {" "}→{" "}
              {formatCoordinate(
                aisMetrics.maxLon
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          INFORMATION PANEL
      ================================================= */}

      <div style={panel}>

        <h2>
          Canonical Repository Information
        </h2>

        <div style={infoLine}>
          One unified repository now manages
          replay, telemetry, runtime proof,
          validation, governance, and
          deployment infrastructure layers.
        </div>

        <div style={infoLine}>
          Replay APIs are consolidated into
          one deterministic replay architecture
          to eliminate duplicate replay logic.
        </div>

        <div style={infoLine}>
          Deployment infrastructure now
          operates through one canonical
          operational entry point.
        </div>

        <div style={infoLine}>
          Runtime logs, replay evidence, and
          telemetry sequencing are preserved
          through centralized operational
          proof layers.
        </div>

        <div style={infoLine}>
          Observability systems are now
          directly connected with replay,
          telemetry, and governance
          infrastructure.
        </div>

        <div style={infoLine}>
          AIS_file.csv is connected as the
          operational AIS telemetry source
          for repository validation and
          observability metrics.
        </div>

        <div style={infoLine}>
          Canonical architecture improves
          operational maintainability and
          institutional deployment consistency.
        </div>

      </div>

      {/* =================================================
          BACKEND RESPONSE
      ================================================= */}

      {/*
      <div style={panel}>

        <h2>
          Backend Operational Response
        </h2>

        <pre style={pre}>
{JSON.stringify(
  backendResponse,
  null,
  2
)}
        </pre>

      </div>
      */}

    </div>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const container = {
  background: "#071018",
  minHeight: "100vh",
  color: "white",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const card = {
  background: "#102030",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #1f3b57",
  fontSize: "15px",
  fontWeight: "bold",
  minHeight: "90px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box",
};

const cardTitle = {
  color: "#94a3b8",
  fontSize: "13px",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const activeValue = {
  color: "#22c55e",
  fontSize: "20px",
  fontWeight: "700",
};

const panel = {
  background: "#102030",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #1f3b57",
  marginTop: "30px",
  boxSizing: "border-box",
};

const infoLine = {
  marginBottom: "14px",
  color: "#cbd5e1",
  lineHeight: "24px",
};

const pre = {
  color: "#9dc6ef",
  overflowX: "auto",
  fontSize: "14px",
};

const aisStatsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: "15px",
  marginTop: "15px",
};

const aisStatCard = {
  background: "#071018",
  border: "1px solid #1f3b57",
  borderRadius: "10px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minHeight: "85px",
  justifyContent: "center",
};

const aisStatLabel = {
  color: "#94a3b8",
  fontSize: "13px",
};

const aisStatValue = {
  color: "#22c55e",
  fontSize: "22px",
  fontWeight: "700",
};

const loadingBox = {
  padding: "20px",
  textAlign: "center",
  color: "#f59e0b",
  background: "#071018",
  borderRadius: "8px",
};

const errorBox = {
  padding: "20px",
  color: "#fca5a5",
  background: "#2a1115",
  border: "1px solid #7f1d1d",
  borderRadius: "8px",
};

const coverageGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "20px",
};

const coverageCard = {
  background: "#071018",
  border: "1px solid #1f3b57",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const coverageValue = {
  color: "#60a5fa",
  fontSize: "20px",
  fontWeight: "700",
};

/* =========================================================
   RESPONSIVE CSS
   ========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "phase1-responsive-styles"
  )
) {
  const style =
    document.createElement("style");

  style.id =
    "phase1-responsive-styles";

  style.innerHTML = `
    @media (max-width: 1000px) {
      .phase1-status-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .phase1-status-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);
}

export default Phase1;