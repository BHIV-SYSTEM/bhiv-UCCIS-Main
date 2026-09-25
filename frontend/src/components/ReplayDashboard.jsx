import React, { useState } from "react";
import "../components/ReplayDashboard.css";

/* ======================================================
   AIS CONFIGURATION
====================================================== */

const AIS_FILE = "/AIS_file.csv";

/* ======================================================
   ZONE DEFINITIONS
====================================================== */

const ZONE_DEFINITIONS = [
  {
    id: 1,
    name: "PACIFIC / WEST COAST",
  },
  {
    id: 2,
    name: "GULF COAST",
  },
  {
    id: 3,
    name: "ATLANTIC / NORTHEAST",
  },
  {
    id: 4,
    name: "FLORIDA / ATLANTIC",
  },
  {
    id: 5,
    name: "CENTRAL / INLAND",
  },
  {
    id: 6,
    name: "HAWAII / PACIFIC ISLANDS",
  },
];

/* ======================================================
   NUMBER HELPER
====================================================== */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

/* ======================================================
   CSV LINE PARSER
====================================================== */

const parseCSVLine = (line) => {
  const values = [];

  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (character === '"') {
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
      character === "," &&
      !insideQuotes
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current.trim());

  return values;
};

/* ======================================================
   CSV PARSER
====================================================== */

const parseCSV = (text) => {
  const lines = text
    .split(/\r?\n/)
    .filter(
      (line) =>
        line.trim() !== ""
    );

  if (lines.length < 2) {
    return [];
  }

  const headers =
    parseCSVLine(lines[0]).map(
      (header) =>
        header
          .replace(/^"|"$/g, "")
          .trim()
    );

  return lines
    .slice(1)
    .map((line) => {
      const values =
        parseCSVLine(line);

      const row = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index] !==
            undefined
              ? values[index]
                  .replace(
                    /^"|"$/g,
                    ""
                  )
                  .trim()
              : "";
        }
      );

      return row;
    })
    .filter(
      (row) =>
        row.MMSI &&
        row.LAT !== undefined &&
        row.LON !== undefined
    );
};

/* ======================================================
   DETERMINE AIS ZONE
====================================================== */

const determineZone = (
  latitude,
  longitude
) => {
  const lat =
    toNumber(latitude);

  const lon =
    toNumber(longitude);

  /* Hawaii / Pacific Islands */

  if (
    lon < -140 &&
    lat < 30
  ) {
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
};

/* ======================================================
   PREDICTION
====================================================== */

const getPrediction = (
  riskScore
) => {
  if (riskScore >= 70) {
    return "HIGH";
  }

  if (riskScore >= 40) {
    return "MEDIUM";
  }

  return "LOW";
};

/* ======================================================
   BUILD AIS REPLAY DATA
====================================================== */

const buildReplayData = (
  records
) => {
  const zoneMap = {};

  ZONE_DEFINITIONS.forEach(
    (zone) => {
      zoneMap[zone.id] = {
        id: zone.id,
        zone_name: zone.name,
        records: 0,
        vessels: new Set(),
        vesselTypes: new Set(),
        totalSOG: 0,
        movingRecords: 0,
        latitudeTotal: 0,
        longitudeTotal: 0,
        latestTimestamp: "",
      };
    }
  );

  /* ====================================================
     PROCESS AIS RECORDS
  ==================================================== */

  records.forEach(
    (record) => {
      const latitude =
        toNumber(record.LAT);

      const longitude =
        toNumber(record.LON);

      const zoneId =
        determineZone(
          latitude,
          longitude
        );

      const zone =
        zoneMap[zoneId];

      if (!zone) {
        return;
      }

      zone.records++;

      zone.vessels.add(
        String(record.MMSI)
      );

      if (
        record.VesselType
      ) {
        zone.vesselTypes.add(
          String(
            record.VesselType
          )
        );
      }

      const sog =
        toNumber(record.SOG);

      zone.totalSOG += sog;

      if (sog > 0) {
        zone.movingRecords++;
      }

      zone.latitudeTotal +=
        latitude;

      zone.longitudeTotal +=
        longitude;

      if (
        record.BaseDateTime &&
        (
          !zone.latestTimestamp ||
          String(
            record.BaseDateTime
          ) >
            String(
              zone.latestTimestamp
            )
        )
      ) {
        zone.latestTimestamp =
          record.BaseDateTime;
      }
    }
  );

  /* ====================================================
     MAXIMUM VALUES
  ==================================================== */

  const maxRecords =
    Math.max(
      ...Object.values(
        zoneMap
      ).map(
        (zone) =>
          zone.records
      ),
      1
    );

  const maxVessels =
    Math.max(
      ...Object.values(
        zoneMap
      ).map(
        (zone) =>
          zone.vessels.size
      ),
      1
    );

  const maxAverageSOG =
    Math.max(
      ...Object.values(
        zoneMap
      ).map((zone) => {
        if (
          zone.records === 0
        ) {
          return 0;
        }

        return (
          zone.totalSOG /
          zone.records
        );
      }),
      1
    );

  /* ====================================================
     FINAL ZONE DATA
  ==================================================== */

  return ZONE_DEFINITIONS.map(
    (definition) => {
      const zone =
        zoneMap[
          definition.id
        ];

      const averageSOG =
        zone.records > 0
          ? zone.totalSOG /
            zone.records
          : 0;

      const activity =
        zone.records > 0
          ? (
              zone.records /
              maxRecords
            ) * 100
          : 0;

      const vesselActivity =
        zone.vessels.size > 0
          ? (
              zone.vessels.size /
              maxVessels
            ) * 100
          : 0;

      const speedActivity =
        averageSOG > 0
          ? (
              averageSOG /
              maxAverageSOG
            ) * 100
          : 0;

      const movingPercentage =
        zone.records > 0
          ? (
              zone.movingRecords /
              zone.records
            ) * 100
          : 0;

      /*
       * Risk calculation:
       *
       * AIS activity       = 50%
       * Vessel activity    = 30%
       * Speed activity     = 20%
       */

      const riskScore =
        Number(
          (
            activity * 0.5 +
            vesselActivity * 0.3 +
            speedActivity * 0.2
          ).toFixed(1)
        );

      const prediction =
        getPrediction(
          riskScore
        );

      let action = "NONE";
      let priority = "LOW";

      if (
        prediction === "HIGH"
      ) {
        action = "ALERT";
        priority = "HIGH";
      } else if (
        prediction === "MEDIUM"
      ) {
        action = "MONITOR";
        priority = "MEDIUM";
      }

      let reason =
        "No significant AIS anomaly detected in this zone.";

      if (
        prediction === "HIGH"
      ) {
        reason =
          "High AIS activity, vessel concentration and movement require immediate attention.";
      } else if (
        prediction === "MEDIUM"
      ) {
        reason =
          "Moderate AIS activity detected. Continued zone monitoring is recommended.";
      } else if (
        movingPercentage < 20
      ) {
        reason =
          "Low vessel movement and lower AIS activity detected.";
      }

      return {
        id: zone.id,

        zone_name:
          zone.zone_name,

        risk_score:
          riskScore,

        prediction,

        execution_request: {
          action,
          priority,
        },

        reason,

        trace_id:
          `AIS_TASK6_ZONE_${String(
            zone.id
          ).padStart(2, "0")}`,

        ais_records:
          zone.records,

        unique_vessels:
          zone.vessels.size,

        vessel_types:
          zone.vesselTypes.size,

        avg_sog:
          Number(
            averageSOG.toFixed(2)
          ),

        activity:
          Number(
            activity.toFixed(1)
          ),

        moving_percentage:
          Number(
            movingPercentage.toFixed(1)
          ),

        latitude:
          Number(
            (
              zone.records > 0
                ? zone.latitudeTotal /
                  zone.records
                : 0
            ).toFixed(4)
          ),

        longitude:
          Number(
            (
              zone.records > 0
                ? zone.longitudeTotal /
                  zone.records
                : 0
            ).toFixed(4)
          ),

        timestamp:
          zone.latestTimestamp ||
          new Date().toLocaleTimeString(),
      };
    }
  );
};

/* ======================================================
   MAIN COMPONENT
====================================================== */

const ReplayDashboard = () => {
  const [
    zones,
    setZones,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    showResults,
    setShowResults,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* ====================================================
     LOAD AIS DATA
  ==================================================== */

  const loadZones = async () => {
    try {
      setLoading(true);
      setShowResults(true);
      setError("");

      console.log(
        "======================================"
      );

      console.log(
        "TASK 6 REPLAY DASHBOARD"
      );

      console.log(
        "Loading AIS data..."
      );

      console.log(
        "Source:",
        AIS_FILE
      );

      console.log(
        "======================================"
      );

      const response =
        await fetch(
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

      const records =
        parseCSV(csvText);

      console.log(
        "AIS records:",
        records.length
      );

      if (
        records.length === 0
      ) {
        throw new Error(
          "No valid AIS records found in AIS_file.csv."
        );
      }

      const formatted =
        buildReplayData(
          records
        );

      console.log(
        "Task 6 zone data:",
        formatted
      );

      setZones(
        formatted
      );
    } catch (err) {
      console.error(
        "Task 6 AIS loading error:",
        err
      );

      setZones([]);

      setError(
        err.message ||
          "Failed to load AIS data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ====================================================
     STATE CLASS
  ==================================================== */

  const getStateClass = (
    state
  ) => {
    if (
      state === "HIGH"
    ) {
      return "high";
    }

    if (
      state === "MEDIUM"
    ) {
      return "medium";
    }

    return "low";
  };

  /* ====================================================
     MAX RISK
  ==================================================== */

  const maxRisk =
    Math.max(
      ...zones.map(
        (zone) =>
          Number(
            zone.risk_score
          )
      ),
      100
    );

  /* ====================================================
     PIE ANALYTICS
  ==================================================== */

  const totalZones =
    zones.length;

  const highCount =
    zones.filter(
      (zone) =>
        zone.prediction ===
        "HIGH"
    ).length;

  const mediumCount =
    zones.filter(
      (zone) =>
        zone.prediction ===
        "MEDIUM"
    ).length;

  const lowCount =
    zones.filter(
      (zone) =>
        zone.prediction ===
        "LOW"
    ).length;

  const highPct =
    totalZones
      ? (highCount /
          totalZones) *
        100
      : 0;

  const mediumPct =
    totalZones
      ? (mediumCount /
          totalZones) *
        100
      : 0;

  const lowPct =
    totalZones
      ? (lowCount /
          totalZones) *
        100
      : 0;

  const pieStyle = {
    background: `conic-gradient(
      #ef4444 0% ${highPct}%,
      #f59e0b ${highPct}% ${
        highPct + mediumPct
      }%,
      #22c55e ${
        highPct + mediumPct
      }% 100%
    )`,
  };

  /* ====================================================
     TOTAL AIS
  ==================================================== */

  const totalAISRecords =
    zones.reduce(
      (
        total,
        zone
      ) =>
        total +
        Number(
          zone.ais_records ||
            0
        ),
      0
    );

  const totalVessels =
    zones.reduce(
      (
        total,
        zone
      ) =>
        total +
        Number(
          zone.unique_vessels ||
            0
        ),
      0
    );

  /* ====================================================
     RENDER
  ==================================================== */

  return (
    <div className="task6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="header">

        <div>
          <h1>
            UCCIS Multi-Zone
            Intelligence System
          </h1>

          <p
            style={{
              margin:
                "4px 0 0",
              color:
                "#64748b",
              fontSize:
                "13px",
            }}
          >
            AIS-powered Task 6
            replay and risk
            intelligence
          </p>
        </div>

        <button
          onClick={
            loadZones
          }
        >
          Run All Zones
        </button>

      </div>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {!showResults && (
        <div className="empty-box">
          Click{" "}
          <strong>
            Run All Zones
          </strong>{" "}
          to display the AIS
          intelligence dashboard.
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="panel"
          style={{
            background:
              "#fef2f2",
            border:
              "1px solid #fecaca",
            color:
              "#b91c1c",
          }}
        >
          <strong>
            AIS Data Error
          </strong>

          <p>
            {error}
          </p>

          <small>
            Make sure the file exists at:
            {" "}
            <strong>
              frontend/public/AIS_file.csv
            </strong>
          </small>
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="panel loading">
          Loading Zone
          Intelligence...
        </div>
      )}

      {/* ==================================================
          RESULTS
      ================================================== */}

      {!loading &&
        showResults &&
        zones.length > 0 && (
          <>

            {/* ============================================
                SUMMARY
            ============================================ */}

            <div
              className="cards-grid"
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <div className="zone-card">
                <h2>
                  AIS RECORDS
                </h2>

                <p>
                  <strong>
                    {totalAISRecords.toLocaleString()}
                  </strong>
                </p>

                <small>
                  AIS observations
                </small>
              </div>

              <div className="zone-card">
                <h2>
                  UNIQUE VESSELS
                </h2>

                <p>
                  <strong>
                    {totalVessels.toLocaleString()}
                  </strong>
                </p>

                <small>
                  Vessel activity
                </small>
              </div>

              <div className="zone-card">
                <h2>
                  HIGH RISK
                </h2>

                <p className="high">
                  <strong>
                    {highCount}
                  </strong>
                </p>

                <small>
                  Zones
                </small>
              </div>

              <div className="zone-card">
                <h2>
                  MEDIUM RISK
                </h2>

                <p className="medium">
                  <strong>
                    {mediumCount}
                  </strong>
                </p>

                <small>
                  Zones
                </small>
              </div>

              <div className="zone-card">
                <h2>
                  LOW RISK
                </h2>

                <p className="low">
                  <strong>
                    {lowCount}
                  </strong>
                </p>

                <small>
                  Zones
                </small>
              </div>

            </div>

            {/* ============================================
                ZONE CARDS
            ============================================ */}

            <div className="cards-grid">

              {zones.map(
                (zone) => (
                  <div
                    className={`zone-card ${getStateClass(
                      zone.prediction
                    )}`}
                    key={
                      zone.id
                    }
                  >

                    <h2>
                      {
                        zone.zone_name
                      }
                    </h2>

                    <p>
                      <strong>
                        Risk:
                      </strong>{" "}
                      <span>
                        {
                          zone.risk_score
                        }
                      </span>
                    </p>

                    <p
                      className={getStateClass(
                        zone.prediction
                      )}
                    >
                      <strong>
                        State:
                      </strong>{" "}
                      {
                        zone.prediction
                      }
                    </p>

                    <p>
                      <strong>
                        AIS Records:
                      </strong>{" "}
                      {zone.ais_records?.toLocaleString() ||
                        0}
                    </p>

                    <p>
                      <strong>
                        Vessels:
                      </strong>{" "}
                      {zone.unique_vessels?.toLocaleString() ||
                        0}
                    </p>

                    <p>
                      <strong>
                        Avg SOG:
                      </strong>{" "}
                      {
                        zone.avg_sog
                      }{" "}
                      knots
                    </p>

                    <p>
                      <strong>
                        AIS Activity:
                      </strong>{" "}
                      {
                        zone.activity
                      }%
                    </p>

                    <p>
                      <strong>
                        Moving:
                      </strong>{" "}
                      {
                        zone.moving_percentage
                      }%
                    </p>

                    <p>
                      <strong>
                        Decision:
                      </strong>{" "}
                      {
                        zone
                          .execution_request
                          ?.action ||
                        "NONE"
                      }{" "}
                      (
                      {
                        zone
                          .execution_request
                          ?.priority ||
                        "LOW"
                      }
                      )
                    </p>

                    <p>
                      <strong>
                        Reason:
                      </strong>{" "}
                      {
                        zone.reason
                      }
                    </p>

                    <p>
                      <strong>
                        Trace:
                      </strong>{" "}
                      {
                        zone.trace_id
                      }
                    </p>

                  </div>
                )
              )}

            </div>

            {/* ============================================
                ZONE RISK COMPARISON
            ============================================ */}

            <section className="panel">

              <h2>
                Zone Risk Comparison
              </h2>

              <div
                style={{
                  width: "100%",
                  marginTop: "25px",
                }}
              >

                {/* ========================================
                    COMPLETE CHART
                ======================================== */}

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "390px",
                  }}
                >

                  {/* ======================================
                      Y AXIS
                  ====================================== */}

                  <div
                    style={{
                      width: "70px",
                      minWidth: "70px",
                      height: "300px",
                      position: "relative",
                      display: "flex",
                      flexDirection:
                        "column",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-end",
                      paddingRight:
                        "12px",
                      boxSizing:
                        "border-box",
                      color:
                        "#9ca3af",
                      fontSize:
                        "14px",
                    }}
                  >

                    <span>
                      100
                    </span>

                    <span>
                      80
                    </span>

                    <span>
                      60
                    </span>

                    <span>
                      40
                    </span>

                    <span>
                      20
                    </span>

                    <span>
                      0
                    </span>

                    {/* Y AXIS TITLE */}

                    <div
                      style={{
                        position:
                          "absolute",
                        left:
                          "0px",
                        top:
                          "135px",
                        transform:
                          "rotate(-90deg)",
                        transformOrigin:
                          "center",
                        color:
                          "#ffffff",
                        fontSize:
                          "14px",
                        fontWeight:
                          "700",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Risk Score
                    </div>

                  </div>

                  {/* ======================================
                      RIGHT SIDE
                  ====================================== */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >

                    {/* ==================================
                        BAR AREA ONLY
                    ================================== */}

                    <div
                      style={{
                        height:
                          "300px",
                        width:
                          "100%",
                        display:
                          "flex",
                        alignItems:
                          "flex-end",
                        justifyContent:
                          "space-around",
                        gap:
                          "8px",
                        padding:
                          "0 10px",
                        boxSizing:
                          "border-box",
                        borderBottom:
                          "2px solid rgba(255,255,255,0.35)",
                      }}
                    >

                      {zones.map(
                        (zone) => {

                          const risk =
                            Number(
                              zone.risk_score
                            ) || 0;

                          const barHeight =
                            Math.min(
                              risk,
                              100
                            );

                          let barColor =
                            "#22c55e";

                          if (
                            risk >=
                            70
                          ) {
                            barColor =
                              "#ef4444";
                          } else if (
                            risk >=
                            40
                          ) {
                            barColor =
                              "#f59e0b";
                          }

                          return (
                            <div
                              key={
                                zone.id
                              }
                              style={{
                                flex:
                                  "1 1 0",
                                maxWidth:
                                  "115px",
                                height:
                                  "100%",
                                display:
                                  "flex",
                                flexDirection:
                                  "column",
                                justifyContent:
                                  "flex-end",
                                alignItems:
                                  "center",
                                position:
                                  "relative",
                              }}
                            >

                              {/* RISK VALUE */}

                              <div
                                style={{
                                  color:
                                    "#ffffff",
                                  fontSize:
                                    "13px",
                                  fontWeight:
                                    "700",
                                  marginBottom:
                                    "7px",
                                }}
                              >
                                {
                                  risk.toFixed(
                                    1
                                  )
                                }
                              </div>

                              {/* BAR */}

                              <div
                                style={{
                                  width:
                                    "60px",
                                  height:
                                    `${barHeight}%`,
                                  minHeight:
                                    risk >
                                    0
                                      ? "5px"
                                      : "0",
                                  backgroundColor:
                                    barColor,
                                  borderRadius:
                                    "3px 3px 0 0",
                                  transition:
                                    "height 0.4s ease",
                                }}
                              />

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* ==================================
                        ZONE NAMES
                        BELOW THE BASELINE
                    ================================== */}

                    <div
                      style={{
                        display:
                          "flex",
                        width:
                          "100%",
                        justifyContent:
                          "space-around",
                        gap:
                          "8px",
                        padding:
                          "12px 10px 0",
                        boxSizing:
                          "border-box",
                      }}
                    >

                      {zones.map(
                        (zone) => {

                          const zoneLabels = {
                            "PACIFIC / WEST COAST":
                              [
                                "PACIFIC",
                                "WEST COAST",
                              ],

                            "GULF COAST":
                              [
                                "GULF",
                                "COAST",
                              ],

                            "ATLANTIC / NORTHEAST":
                              [
                                "ATLANTIC",
                                "NORTHEAST",
                              ],

                            "FLORIDA / ATLANTIC":
                              [
                                "FLORIDA",
                                "ATLANTIC",
                              ],

                            "CENTRAL / INLAND":
                              [
                                "CENTRAL",
                                "INLAND",
                              ],

                            "HAWAII / PACIFIC ISLANDS":
                              [
                                "HAWAII",
                                "PACIFIC",
                                "ISLANDS",
                              ],
                          };

                          const labels =
                            zoneLabels[
                              zone.zone_name
                            ] || [
                              zone.zone_name,
                            ];

                          return (
                            <div
                              key={
                                zone.id
                              }
                              style={{
                                flex:
                                  "1 1 0",
                                maxWidth:
                                  "115px",
                                minHeight:
                                  "65px",
                                display:
                                  "flex",
                                flexDirection:
                                  "column",
                                justifyContent:
                                  "flex-start",
                                alignItems:
                                  "center",
                                textAlign:
                                  "center",
                                color:
                                  "#d1d5db",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "700",
                                lineHeight:
                                  "15px",
                              }}
                            >

                              {labels.map(
                                (
                                  label,
                                  index
                                ) => (
                                  <div
                                    key={
                                      index
                                    }
                                  >
                                    {
                                      label
                                    }
                                  </div>
                                )
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* ==================================
                        X AXIS TITLE
                    ================================== */}

                    <div
                      style={{
                        textAlign:
                          "center",
                        color:
                          "#ffffff",
                        fontSize:
                          "14px",
                        fontWeight:
                          "700",
                        marginTop:
                          "8px",
                      }}
                    >
                      Zone
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* ============================================
                PIE CHART
            ============================================ */}

            <section className="panel">

              <h2>
                Risk State Distribution
              </h2>

              <div className="pie-section">

                <div
                  className="pie-chart"
                  style={
                    pieStyle
                  }
                ></div>

                <div className="pie-legend">

                  <div className="legend-item">

                    <span className="dot high-dot"></span>

                    <span>
                      HIGH Risk (
                      {
                        highCount
                      }{" "}
                      Zones -{" "}
                      {
                        highPct.toFixed(
                          0
                        )
                      }
                      %)
                    </span>

                  </div>

                  <div className="legend-item">

                    <span className="dot medium-dot"></span>

                    <span>
                      MEDIUM Risk (
                      {
                        mediumCount
                      }{" "}
                      Zones -{" "}
                      {
                        mediumPct.toFixed(
                          0
                        )
                      }
                      %)
                    </span>

                  </div>

                  <div className="legend-item">

                    <span className="dot low-dot"></span>

                    <span>
                      LOW Risk (
                      {
                        lowCount
                      }{" "}
                      Zones -{" "}
                      {
                        lowPct.toFixed(
                          0
                        )
                      }
                      %)
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* ============================================
                PROJECT INFORMATION
            ============================================ */}

            <section className="panel">

              <h2>
                Task 6 - Project Metrics &
                Information
              </h2>

              <div className="project-info-grid">

                <div className="info-card">

                  <h3>
                    Risk Threshold Rules
                  </h3>

                  <p>
                    <span className="high">
                      HIGH:
                    </span>{" "}
                    Risk Score ≥ 70
                  </p>

                  <p>
                    <span className="medium">
                      MEDIUM:
                    </span>{" "}
                    40 ≤ Risk Score &lt; 70
                  </p>

                  <p>
                    <span className="low">
                      LOW:
                    </span>{" "}
                    Risk Score &lt; 40
                  </p>

                </div>

                <div className="info-card">

                  <h3>
                    AIS Data Processing
                  </h3>

                  <p>
                    Task 6 processes AIS
                    vessel observations
                    using vessel activity,
                    vessel concentration,
                    movement and speed to
                    generate a zone-level
                    intelligence state.
                  </p>

                </div>

                <div className="info-card">

                  <h3>
                    Execution States
                  </h3>

                  <p>
                    <strong>
                      HIGH
                    </strong>{" "}
                    → ALERT
                  </p>

                  <p>
                    <strong>
                      MEDIUM
                    </strong>{" "}
                    → MONITOR
                  </p>

                  <p>
                    <strong>
                      LOW
                    </strong>{" "}
                    → NONE
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

      {/* ==================================================
          NO DATA
      ================================================== */}

      {!loading &&
        showResults &&
        zones.length === 0 &&
        !error && (
          <div className="panel">

            <h3>
              No Zone Data Found
            </h3>

          </div>
        )}

    </div>
  );
};

export default ReplayDashboard;