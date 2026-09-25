import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import "./style.css";

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

/* ======================================================
   CONFIGURATION
====================================================== */

const AIS_FILE = "/AIS_file.csv";

/*
 * Six geographic AIS zones.
 */
const ZONE_DEFINITIONS = [
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

/* ======================================================
   CSV PARSER
====================================================== */

/*
 * Handles normal CSV values and quoted values.
 */
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
      values.push(
        current.trim()
      );

      current = "";
    } else {
      current += character;
    }
  }

  values.push(
    current.trim()
  );

  return values;
};

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
   NUMBER HELPER
====================================================== */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

/* ======================================================
   ZONE CLASSIFICATION
====================================================== */

const getAISZone = (
  latitude,
  longitude
) => {
  const lat =
    toNumber(latitude);

  const lon =
    toNumber(longitude);

  /*
   * Hawaii / Pacific Islands
   */

  if (
    lon < -140 &&
    lat < 30
  ) {
    return 6;
  }

  /*
   * Pacific / West Coast
   */

  if (lon < -105) {
    return 1;
  }

  /*
   * Gulf Coast
   */

  if (
    lat < 32 &&
    lon >= -105 &&
    lon <= -85
  ) {
    return 2;
  }

  /*
   * Florida / Atlantic
   */

  if (
    lat < 32 &&
    lon > -85
  ) {
    return 4;
  }

  /*
   * Atlantic / Northeast
   */

  if (
    lat >= 32 &&
    lon > -85
  ) {
    return 3;
  }

  /*
   * Central / Inland
   */

  return 5;
};

/* ======================================================
   RISK CLASSIFICATION
====================================================== */

const getPrediction = (
  riskScore
) => {
  if (riskScore > 100) {
    return "HIGH";
  }

  if (riskScore >= 50) {
    return "MEDIUM";
  }

  return "LOW";
};

/* ======================================================
   DECISION
====================================================== */

const getDecision = (
  riskScore
) => {
  if (riskScore > 100) {
    return {
      action: "ALERT",
      priority: "HIGH",
    };
  }

  if (riskScore >= 50) {
    return {
      action: "MONITOR",
      priority: "MEDIUM",
    };
  }

  return {
    action: "NONE",
    priority: "LOW",
  };
};

/* ======================================================
   REASON
====================================================== */

const getReason = (
  riskScore,
  activity,
  movingPercentage
) => {
  if (riskScore > 100) {
    return (
      "High AIS activity and vessel movement " +
      "triggered an elevated risk assessment."
    );
  }

  if (riskScore >= 50) {
    return (
      "Moderate AIS activity detected. " +
      "Continued monitoring is recommended."
    );
  }

  if (
    movingPercentage < 20
  ) {
    return (
      "Low vessel movement and lower AIS " +
      "activity were detected in this zone."
    );
  }

  return (
    "AIS activity remains within the " +
    "routine monitoring range."
  );
};

/* ======================================================
   BUILD ZONE DATA
====================================================== */

const buildZoneData = (
  records
) => {
  const zoneMap = {};

  ZONE_DEFINITIONS.forEach(
    (zone) => {
      zoneMap[zone.id] = {
        zone_id:
          `zone_${zone.id}`,

        zone_number:
          zone.id,

        zone_name:
          zone.name,

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
        getAISZone(
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
        toNumber(
          record.SOG
        );

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
     MAXIMUM ACTIVITY
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

  /* ====================================================
     BUILD FINAL OBJECTS
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

      const movingPercentage =
        zone.records > 0
          ? (
              zone.movingRecords /
              zone.records
            ) * 100
          : 0;

      const latitude =
        zone.records > 0
          ? zone.latitudeTotal /
            zone.records
          : 0;

      const longitude =
        zone.records > 0
          ? zone.longitudeTotal /
            zone.records
          : 0;

      /*
       * AIS-derived risk score.
       *
       * Maximum score = 120.
       *
       * Activity contributes up to 70.
       * Vessel concentration contributes up to 30.
       * Vessel speed contributes up to 20.
       */

      const activityScore =
        (
          zone.records /
          maxRecords
        ) * 70;

      const vesselScore =
        Math.min(
          zone.vessels.size /
            Math.max(
              ...Object.values(
                zoneMap
              ).map(
                (item) =>
                  item.vessels.size
              ),
              1
            ),
          1
        ) * 30;

      const speedScore =
        Math.min(
          averageSOG / 10,
          1
        ) * 20;

      const riskScore =
        Number(
          (
            activityScore +
            vesselScore +
            speedScore
          ).toFixed(1)
        );

      const prediction =
        getPrediction(
          riskScore
        );

      const decision =
        getDecision(
          riskScore
        );

      return {
        zone_id:
          zone.zone_id,

        zone_number:
          zone.zone_number,

        zone_name:
          zone.zone_name,

        risk_score:
          riskScore,

        prediction,

        execution_request:
          decision.action ===
          "NONE"
            ? {
                action:
                  "NONE",
                priority:
                  "LOW",
              }
            : {
                action:
                  decision.action,
                priority:
                  decision.priority,
              },

        reason:
          getReason(
            riskScore,
            activity,
            movingPercentage
          ),

        trace_id:
          `AIS_ZONE_${String(
            zone.zone_number
          ).padStart(
            2,
            "0"
          )}`,

        ais_records:
          zone.records,

        unique_vessels:
          zone.vessels.size,

        vessel_types:
          zone.vesselTypes.size,

        avg_sog:
          Number(
            averageSOG.toFixed(
              2
            )
          ),

        activity:
          Number(
            activity.toFixed(
              1
            )
          ),

        moving_percentage:
          Number(
            movingPercentage.toFixed(
              1
            )
          ),

        latitude:
          Number(
            latitude.toFixed(
              4
            )
          ),

        longitude:
          Number(
            longitude.toFixed(
              4
            )
          ),

        latest_time:
          zone.latestTimestamp,
      };
    }
  );
};

/* ======================================================
   MAIN COMPONENT
====================================================== */

const UCCISIntelligenceDashboard =
  () => {
    const [
      zones,
      setZones,
    ] = useState([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      error,
      setError,
    ] = useState("");

    const [
      lastUpdated,
      setLastUpdated,
    ] = useState("");

    const riskChart =
      useRef(null);

    const predictionChart =
      useRef(null);

    const decisionChart =
      useRef(null);

    /* ==================================================
       DESTROY CHARTS
    ================================================== */

    const destroyCharts =
      useCallback(() => {
        if (
          riskChart.current
        ) {
          riskChart.current.destroy();

          riskChart.current =
            null;
        }

        if (
          predictionChart.current
        ) {
          predictionChart.current.destroy();

          predictionChart.current =
            null;
        }

        if (
          decisionChart.current
        ) {
          decisionChart.current.destroy();

          decisionChart.current =
            null;
        }
      }, []);

    /* ==================================================
       CREATE CHARTS
    ================================================== */

    const createCharts =
      useCallback(
        (zonesData) => {
          destroyCharts();

          if (
            !zonesData ||
            zonesData.length === 0
          ) {
            return;
          }

          const labels =
            zonesData.map(
              (zone, index) =>
                zone.zone_name ||
                `Zone ${
                  index + 1
                }`
            );

          const risks =
            zonesData.map(
              (zone) =>
                Number(
                  zone.risk_score ??
                    zone.risk ??
                    0
                )
            );

          /* ============================================
             PREDICTION COUNTS
          ============================================ */

          const predictionCounts = {
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
          };

          zonesData.forEach(
            (zone) => {
              const prediction =
                String(
                  zone.prediction ||
                    "LOW"
                ).toUpperCase();

              if (
                prediction ===
                "HIGH"
              ) {
                predictionCounts.HIGH++;
              } else if (
                prediction ===
                "MEDIUM"
              ) {
                predictionCounts.MEDIUM++;
              } else {
                predictionCounts.LOW++;
              }
            }
          );

          /* ============================================
             DECISION COUNTS
          ============================================ */

          const decisionCounts = {
            ALERT: 0,
            MONITOR: 0,
            NONE: 0,
          };

          zonesData.forEach(
            (zone) => {
              const action =
                String(
                  zone
                    .execution_request
                    ?.action ||
                    "NONE"
                ).toUpperCase();

              if (
                action ===
                "ALERT"
              ) {
                decisionCounts.ALERT++;
              } else if (
                action ===
                "MONITOR"
              ) {
                decisionCounts.MONITOR++;
              } else {
                decisionCounts.NONE++;
              }
            }
          );

          /* ============================================
             RISK CHART
          ============================================ */

          const riskCanvas =
            document.getElementById(
              "riskChart"
            );

          if (riskCanvas) {
            riskChart.current =
              new Chart(
                riskCanvas,
                {
                  type: "bar",

                  data: {
                    labels,

                    datasets: [
                      {
                        label:
                          "Risk Score",

                        data: risks,

                        backgroundColor:
                          zonesData.map(
                            (
                              zone
                            ) => {
                              if (
                                zone.risk_score >
                                100
                              ) {
                                return "#dc2626";
                              }

                              if (
                                zone.risk_score >=
                                50
                              ) {
                                return "#f59e0b";
                              }

                              return "#16a34a";
                            }
                          ),

                        borderColor:
                          "#111827",

                        borderWidth:
                          1,
                      },
                    ],
                  },

                  options: {
                    responsive:
                      true,

                    maintainAspectRatio:
                      false,

                    plugins: {
                      legend: {
                        position:
                          "top",
                      },

                      title: {
                        display:
                          false,
                      },

                      tooltip: {
                        callbacks: {
                          label:
                            (
                              context
                            ) =>
                              `Risk Score: ${context.raw}`,
                        },
                      },
                    },

                    scales: {
                      x: {
                        ticks: {
                          color:
                            "#ffffff",
                          font: {
                            weight:
                              "600",
                          },
                        },

                        title: {
                          display:
                            true,

                          text:
                            "Zone",
                        },
                      },

                      y: {
                        beginAtZero:
                          true,

                        suggestedMax:
                          120,

                        ticks: {
                          color:
                            "#ffffff",
                        },

                        title: {
                          display:
                            true,

                          text:
                            "Risk Score",
                        },
                      },
                    },
                  },
                }
              );
          }

          /* ============================================
             PREDICTION CHART
          ============================================ */

          const predictionCanvas =
            document.getElementById(
              "predictionChart"
            );

          if (
            predictionCanvas
          ) {
            predictionChart.current =
              new Chart(
                predictionCanvas,
                {
                  type: "pie",

                  data: {
                    labels: [
                      "HIGH",
                      "MEDIUM",
                      "LOW",
                    ],

                    datasets: [
                      {
                        data: [
                          predictionCounts.HIGH,
                          predictionCounts.MEDIUM,
                          predictionCounts.LOW,
                        ],

                        backgroundColor: [
                          "#dc2626",
                          "#f59e0b",
                          "#16a34a",
                        ],

                        borderColor:
                          "#ffffff",

                        borderWidth:
                          2,
                      },
                    ],
                  },

                  options: {
                    responsive:
                      true,

                    maintainAspectRatio:
                      false,

                    plugins: {
                      legend: {
                        position:
                          "top",
                      },

                      title: {
                        display:
                          false,
                      },
                    },
                  },
                }
              );
          }

          /* ============================================
             DECISION CHART
          ============================================ */

          const decisionCanvas =
            document.getElementById(
              "decisionChart"
            );

          if (
            decisionCanvas
          ) {
            decisionChart.current =
              new Chart(
                decisionCanvas,
                {
                  type: "doughnut",

                  data: {
                    labels: [
                      "ALERT",
                      "MONITOR",
                      "NONE",
                    ],

                    datasets: [
                      {
                        data: [
                          decisionCounts.ALERT,
                          decisionCounts.MONITOR,
                          decisionCounts.NONE,
                        ],

                        backgroundColor: [
                          "#dc2626",
                          "#f59e0b",
                          "#16a34a",
                        ],

                        borderColor:
                          "#ffffff",

                        borderWidth:
                          2,
                      },
                    ],
                  },

                  options: {
                    responsive:
                      true,

                    maintainAspectRatio:
                      false,

                    cutout:
                      "50%",

                    plugins: {
                      legend: {
                        position:
                          "top",
                      },

                      title: {
                        display:
                          false,
                      },
                    },
                  },
                }
              );
          }
        },
        [destroyCharts]
      );

    /* ==================================================
       LOAD AIS DATA
    ================================================== */

    const loadData =
      useCallback(
        async () => {
          try {
            setLoading(
              true
            );

            setError("");

            console.log(
              "======================================"
            );

            console.log(
              "UCCIS INTELLIGENCE DASHBOARD"
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
                  cache:
                    "no-store",
                }
              );

            if (
              !response.ok
            ) {
              throw new Error(
                `Unable to load AIS_file.csv. HTTP ${response.status}`
              );
            }

            const csvText =
              await response.text();

            const records =
              parseCSV(
                csvText
              );

            console.log(
              "AIS records loaded:",
              records.length
            );

            if (
              records.length ===
              0
            ) {
              throw new Error(
                "AIS_file.csv contains no valid records."
              );
            }

            const zoneData =
              buildZoneData(
                records
              );

            console.log(
              "AIS zone intelligence:",
              zoneData
            );

            setZones(
              zoneData
            );

            setLastUpdated(
              new Date().toLocaleTimeString()
            );

            /*
             * Chart creation is delayed one render cycle
             * so React has mounted the canvas elements.
             */

            setTimeout(() => {
              createCharts(
                zoneData
              );
            }, 0);
          } catch (
            loadError
          ) {
            console.error(
              "Error loading AIS data:",
              loadError
            );

            setZones([]);

            setError(
              loadError.message ||
                "Failed to load AIS data."
            );

            destroyCharts();
          } finally {
            setLoading(
              false
            );
          }
        },
        [
          createCharts,
          destroyCharts,
        ]
      );

    /* ==================================================
       INITIAL LOAD
    ================================================== */

    useEffect(() => {
      loadData();

      /*
       * Refresh every 5 seconds.
       */

      const interval =
        setInterval(
          () => {
            loadData();
          },
          5000
        );

      return () => {
        clearInterval(
          interval
        );

        destroyCharts();
      };
    }, [
      loadData,
      destroyCharts,
    ]);

    /* ==================================================
       BORDER COLOR
    ================================================== */

    const getBorderColor =
      (risk) => {
        if (
          risk > 100
        ) {
          return "#dc2626";
        }

        if (
          risk >= 50
        ) {
          return "#f59e0b";
        }

        return "#16a34a";
      };

    /* ==================================================
       CARD CLASS
    ================================================== */

    const getZoneCardClass =
      (risk) => {
        if (
          risk > 100
        ) {
          return "high";
        }

        if (
          risk >= 50
        ) {
          return "medium";
        }

        return "low";
      };

    /* ==================================================
       RENDER
    ================================================== */

    return (
      <div className="task5-dashboard">

        {/* ==============================================
            HEADER
        ============================================== */}

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap:
              "20px",
            flexWrap:
              "wrap",
          }}
        >
          <div>
            <h1>
              🏙️ UCCIS Intelligence
              Dashboard
            </h1>

            {/* <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#64748b",
                fontSize:
                  "13px",
              }}
            >
              AIS-based zone intelligence,
              risk prediction and
              execution decisions
            </p> */}
          </div>

          <div
            style={{
              fontSize:
                "11px",
              color:
                "#64748b",
              textAlign:
                "right",
            }}
          >
            {/* <div>
              DATA SOURCE
            </div>

            <strong
              style={{
                color:
                  "#111827",
              }}
            >
              AIS_file.csv
            </strong> */}

            {/* {lastUpdated && (
              <div>
                Updated:
                {" "}
                {lastUpdated}
              </div>
            )} */}
          </div>
        </div>

        {/* ==============================================
            REFRESH
        ============================================== */}

        <div className="refresh-container">

          {/* <button
            onClick={
              loadData
            }
            style={{
              backgroundColor:
                "#000000",

              color:
                "#ffffff",

              border:
                "none",

              padding:
                "12px 24px",

              borderRadius:
                "8px",

              fontSize:
                "16px",

              fontWeight:
                "bold",

              cursor:
                "pointer",

              transition:
                "0.3s ease",

              boxShadow:
                "0 4px 8px rgba(0,0,0,0.2)",
            }}

            onMouseOver={(
              event
            ) => {
              event.currentTarget.style.backgroundColor =
                "#333333";
            }}

            onMouseOut={(
              event
            ) => {
              event.currentTarget.style.backgroundColor =
                "#000000";
            }}
          >
            🔄 Refresh
          </button> */}

        </div>

        {/* ==============================================
            ERROR
        ============================================== */}

        {error && (
          <div
            style={{
              background:
                "#fef2f2",
              border:
                "1px solid #fecaca",
              color:
                "#b91c1c",
              borderRadius:
                "8px",
              padding:
                "14px",
              margin:
                "15px 0",
            }}
          >
            <strong>
              AIS Data Error
            </strong>

            <div
              style={{
                marginTop:
                  "5px",
              }}
            >
              {error}
            </div>

            <div
              style={{
                marginTop:
                  "6px",
                fontSize:
                  "12px",
              }}
            >
              Check that this file exists:
              {" "}
              <strong>
                frontend/public/AIS_file.csv
              </strong>
            </div>
          </div>
        )}

        {/* ==============================================
            SUMMARY
        ============================================== */}

        {!loading &&
          zones.length >
            0 && (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap:
                  "12px",
                margin:
                  "20px 0",
              }}
            >

              <SummaryCard
                title="AIS RECORDS"
                value={zones
                  .reduce(
                    (
                      total,
                      zone
                    ) =>
                      total +
                      zone.ais_records,
                    0
                  )
                  .toLocaleString()}
              />

              <SummaryCard
                title="VESSELS"
                value={zones
                  .reduce(
                    (
                      total,
                      zone
                    ) =>
                      total +
                      zone.unique_vessels,
                    0
                  )
                  .toLocaleString()}
              />

              <SummaryCard
                title="HIGH"
                value={
                  zones.filter(
                    (
                      zone
                    ) =>
                      zone.prediction ===
                      "HIGH"
                  ).length
                }
              />

              <SummaryCard
                title="MEDIUM"
                value={
                  zones.filter(
                    (
                      zone
                    ) =>
                      zone.prediction ===
                      "MEDIUM"
                  ).length
                }
              />

              <SummaryCard
                title="LOW"
                value={
                  zones.filter(
                    (
                      zone
                    ) =>
                      zone.prediction ===
                      "LOW"
                  ).length
                }
              />

            </div>
          )}

        {/* ==============================================
            CHARTS
        ============================================== */}

        <div className="charts">

          <div className="chart-box">

            <h3>
              AIS Risk Score by Zone
            </h3>

            <div
              style={{
                position:
                  "relative",
                width:
                  "100%",
                height:
                  "350px",
              }}
            >
              <canvas
                id="riskChart"
              ></canvas>
            </div>

          </div>

          <div className="chart-box">

            <h3>
              Prediction Breakdown
            </h3>

            <div
              style={{
                position:
                  "relative",
                width:
                  "100%",
                height:
                  "250px",
              }}
            >
              <canvas
                id="predictionChart"
              ></canvas>
            </div>

          </div>

          <div className="chart-box">

            <h3>
              Execution Decision Breakdown
            </h3>

            <div
              style={{
                position:
                  "relative",
                width:
                  "100%",
                height:
                  "250px",
              }}
            >
              <canvas
                id="decisionChart"
              ></canvas>
            </div>

          </div>

        </div>

        {/* ==============================================
            LOADING
        ============================================== */}

        {loading ? (
          <h3
            style={{
              textAlign:
                "center",
              marginTop:
                "30px",
            }}
          >
            Loading AIS Intelligence...
          </h3>
        ) : (

          /* ============================================
             ZONE GRID
          ============================================ */

          <div className="zone-grid">

            {zones.length ===
            0 ? (
              <h3>
                No Zone Data Found
              </h3>
            ) : (
              zones.map(
                (
                  zone,
                  index
                ) => {

                  const risk =
                    Number(
                      zone.risk_score
                    ) || 0;

                  const cardClass =
                    getZoneCardClass(
                      risk
                    );

                  const borderColor =
                    getBorderColor(
                      risk
                    );

                  const decision =
                    zone
                      .execution_request
                      ?.action ||
                    "NONE";

                  const priority =
                    zone
                      .execution_request
                      ?.priority ||
                    "LOW";

                  return (
                    <div
                      key={
                        zone.zone_id ||
                        index
                      }
                      className={`zone-card ${cardClass}`}
                      style={{
                        borderLeft:
                          `5px solid ${borderColor}`,
                      }}
                    >

                      {/* ZONE NAME */}

                      <h2>
                        {
                          zone.zone_name ||
                          `Zone ${
                            index +
                            1
                          }`
                        }
                      </h2>

                      {/* RISK */}

                      <p>
                        <strong>
                          Risk:
                        </strong>{" "}
                        <span
                          style={{
                            color:
                              borderColor,
                            fontWeight:
                              "700",
                          }}
                        >
                          {risk}
                        </span>
                      </p>

                      {/* AIS RECORDS */}

                      <p>
                        <strong>
                          AIS Records:
                        </strong>{" "}
                        {zone.ais_records?.toLocaleString() ||
                          0}
                      </p>

                      {/* VESSELS */}

                      <p>
                        <strong>
                          Unique Vessels:
                        </strong>{" "}
                        {zone.unique_vessels?.toLocaleString() ||
                          0}
                      </p>

                      {/* SOG */}

                      <p>
                        <strong>
                          Avg SOG:
                        </strong>{" "}
                        {zone.avg_sog ||
                          0}{" "}
                        knots
                      </p>

                      {/* ACTIVITY */}

                      <p>
                        <strong>
                          AIS Activity:
                        </strong>{" "}
                        {zone.activity ||
                          0}
                        %
                      </p>

                      {/* MOVEMENT */}

                      <p>
                        <strong>
                          Moving:
                        </strong>{" "}
                        {zone.moving_percentage ||
                          0}
                        %
                      </p>

                      {/* PREDICTION */}

                      <p>
                        <strong>
                          Prediction:
                        </strong>{" "}

                        <span
                          style={{
                            color:
                              borderColor,
                            fontWeight:
                              "700",
                          }}
                        >
                          {zone.prediction ||
                            "LOW"}
                        </span>
                      </p>

                      {/* DECISION */}

                      <p>
                        <strong>
                          Decision:
                        </strong>{" "}

                        <span
                          style={{
                            fontWeight:
                              "700",
                          }}
                        >
                          {decision}
                          {" "}
                          (
                          {priority}
                          )
                        </span>
                      </p>

                      {/* REASON */}

                      <p>
                        <strong>
                          Reason:
                        </strong>{" "}
                        {zone.reason ||
                          "No significant anomalies detected in this zone."}
                      </p>

                      {/* TRACE */}

                      <p>
                        <strong>
                          Trace:
                        </strong>{" "}

                        {zone.trace_id ||
                          "AIS_ZONE_TRACE"}
                      </p>

                      {/* COORDINATES */}

                      <p
                        style={{
                          fontSize:
                            "11px",
                          color:
                            "#64748b",
                        }}
                      >
                        <strong>
                          Center:
                        </strong>{" "}
                        {zone.latitude ||
                          0}
                        {", "}
                        {zone.longitude ||
                          0}
                      </p>

                    </div>
                  );
                }
              )
            )}

          </div>
        )}

      </div>
    );
  };

/* ======================================================
   SUMMARY CARD
====================================================== */

const SummaryCard = ({
  title,
  value,
}) => {
  return (
    <div
      style={{
        background:
          "#ffffff",
        borderRadius:
          "10px",
        padding:
          "15px",
        boxShadow:
          "0 1px 4px rgba(0,0,0,0.1)",
        border:
          "1px solid #e5e7eb",
      }}
    >

      <div
        style={{
          color:
            "#64748b",
          fontSize:
            "10px",
          fontWeight:
            "700",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop:
            "5px",
          color:
            "#111827",
          fontSize:
            "25px",
          fontWeight:
            "700",
        }}
      >
        {value}
      </div>

    </div>
  );
};

export default UCCISIntelligenceDashboard;