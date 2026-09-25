import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import {
  triggerExecution,
} from "../api";

import "leaflet/dist/leaflet.css";

/* ======================================================
   AIS CSV
====================================================== */

const AIS_FILE = "/AIS_file.csv";

/* ======================================================
   DEFAULT MAP CENTER

   Calculated from AIS dataset:
   LAT ≈ 34.99
   LON ≈ -95.63
====================================================== */

const DEFAULT_MAP_CENTER = [
  34.9935,
  -95.6272,
];

/* ======================================================
   CSV PARSER
====================================================== */

const parseCSV = (text) => {
  const lines = text
    .trim()
    .split(/\r?\n/);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim());

  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(",");

      const row = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index] !== undefined
              ? values[index].trim()
              : "";
        }
      );

      return row;
    })
    .filter(
      (row) =>
        row.MMSI &&
        row.LAT &&
        row.LON
    );
};

/* ======================================================
   NUMBER HELPER
====================================================== */

const safeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

/* ======================================================
   AIS GEOGRAPHIC ZONE
====================================================== */

const getAISZone = (
  latitude,
  longitude
) => {
  const lat = safeNumber(latitude);
  const lon = safeNumber(longitude);

  /*
   * Hawaii / Pacific Islands
   */

  if (
    lon < -140 &&
    lat < 30
  ) {
    return "Hawaii / Pacific Islands";
  }

  /*
   * Pacific / West Coast
   */

  if (lon < -105) {
    return "Pacific / West Coast";
  }

  /*
   * Gulf Coast
   */

  if (
    lat < 32 &&
    lon >= -105 &&
    lon <= -85
  ) {
    return "Gulf Coast";
  }

  /*
   * Florida / Atlantic
   */

  if (
    lat < 32 &&
    lon > -85
  ) {
    return "Florida / Atlantic";
  }

  /*
   * Atlantic / Northeast
   */

  return "Atlantic / Northeast";
};

/* ======================================================
   ZONE ORDER
====================================================== */

const ZONE_ORDER = [
  "Pacific / West Coast",
  "Gulf Coast",
  "Atlantic / Northeast",
  "Florida / Atlantic",
  "Hawaii / Pacific Islands",
];

/* ======================================================
   STATUS FROM AIS ACTIVITY
====================================================== */

const getAISStatus = (
  activityPercentage
) => {
  if (activityPercentage >= 80) {
    return "CRITICAL";
  }

  if (activityPercentage >= 45) {
    return "HIGH";
  }

  if (activityPercentage >= 25) {
    return "MEDIUM";
  }

  return "LOW";
};

/* ======================================================
   STATUS COLOR
====================================================== */

const getStatusColor = (
  status
) => {
  switch (
    String(status).toUpperCase()
  ) {
    case "CRITICAL":
      return "#ff304f";

    case "HIGH":
      return "#ff304f";

    case "MEDIUM":
      return "#ffb800";

    case "LOW":
      return "#39ff14";

    default:
      return "#39ff14";
  }
};

/* ======================================================
   BUILD AIS ZONES
====================================================== */

const buildAISZones = (
  aisRows
) => {
  const zoneMap = {};

  /*
   * Create zone containers
   */

  ZONE_ORDER.forEach(
    (zoneName) => {
      zoneMap[zoneName] = {
        name: zoneName,

        records: 0,

        vessels: new Set(),

        sogTotal: 0,

        latitudeTotal: 0,

        longitudeTotal: 0,

        vesselTypes: new Set(),

        movingRecords: 0,

        highSpeedRecords: 0,

        latestTime: "",
      };
    }
  );

  /*
   * Process every AIS record
   */

  aisRows.forEach(
    (row) => {
      const latitude =
        safeNumber(row.LAT);

      const longitude =
        safeNumber(row.LON);

      const zoneName =
        getAISZone(
          latitude,
          longitude
        );

      const zone =
        zoneMap[zoneName];

      if (!zone) {
        return;
      }

      /*
       * Record count
       */

      zone.records += 1;

      /*
       * Unique vessels
       */

      zone.vessels.add(
        String(row.MMSI)
      );

      /*
       * Speed
       */

      const sog =
        safeNumber(row.SOG);

      zone.sogTotal += sog;

      if (sog > 0) {
        zone.movingRecords += 1;
      }

      /*
       * High speed AIS observations.
       *
       * This is NOT a legal violation.
       */

      if (sog >= 13) {
        zone.highSpeedRecords += 1;
      }

      /*
       * Vessel types
       */

      if (
        row.VesselType !== undefined &&
        row.VesselType !== ""
      ) {
        zone.vesselTypes.add(
          String(row.VesselType)
        );
      }

      /*
       * Coordinates
       */

      zone.latitudeTotal +=
        latitude;

      zone.longitudeTotal +=
        longitude;

      /*
       * Latest AIS timestamp
       */

      if (
        !zone.latestTime ||
        String(row.BaseDateTime) >
          String(zone.latestTime)
      ) {
        zone.latestTime =
          row.BaseDateTime;
      }
    }
  );

  /*
   * Maximum activity
   */

  const maxRecords =
    Math.max(
      ...Object.values(
        zoneMap
      ).map(
        (zone) =>
          zone.records
      )
    );

  /*
   * Convert into dashboard objects
   */

  return ZONE_ORDER
    .filter(
      (zoneName) =>
        zoneMap[zoneName]
          .records > 0
    )
    .map(
      (
        zoneName,
        index
      ) => {
        const zone =
          zoneMap[zoneName];

        const avgSOG =
          zone.records > 0
            ? zone.sogTotal /
              zone.records
            : 0;

        const activityPercentage =
          maxRecords > 0
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
            : DEFAULT_MAP_CENTER[0];

        const longitude =
          zone.records > 0
            ? zone.longitudeTotal /
              zone.records
            : DEFAULT_MAP_CENTER[1];

        return {
          id: index + 1,

          zone_id:
            `AIS-${String(
              index + 1
            ).padStart(2, "0")}`,

          name: zoneName,

          status:
            getAISStatus(
              activityPercentage
            ),

          records:
            zone.records,

          vessels:
            zone.vessels.size,

          avgSOG:
            Number(
              avgSOG.toFixed(2)
            ),

          activityPercentage:
            Number(
              activityPercentage.toFixed(
                1
              )
            ),

          movingPercentage:
            Number(
              movingPercentage.toFixed(
                1
              )
            ),

          vesselTypes:
            zone.vesselTypes.size,

          highSpeedRecords:
            zone.highSpeedRecords,

          latitude:
            Number(
              latitude.toFixed(4)
            ),

          longitude:
            Number(
              longitude.toFixed(4)
            ),

          latestTime:
            zone.latestTime,
        };
      }
    );
};

/* ======================================================
   MINI AIS ACTIVITY GRAPH
====================================================== */

const MiniAISGraph = ({
  activity = 0,
}) => {
  const safeActivity =
    Math.max(
      0,
      Math.min(
        100,
        Number(activity) || 0
      )
    );

  const points = [
    20,
    25,
    32,
    42,
    50,
    58,
    66,
    safeActivity,
  ];

  const width = 140;
  const height = 42;

  const path =
    points
      .map(
        (
          value,
          index
        ) => {
          const x =
            (index /
              (points.length - 1)) *
            width;

          const y =
            height -
            (value / 100) *
              height;

          return `${
            index === 0
              ? "M"
              : "L"
          } ${x} ${y}`;
        }
      )
      .join(" ");

  return (
    <div
      style={{
        width: "100%",
        height: "48px",
        marginTop: "6px",
        marginBottom: "6px",
      }}
    >
      <svg
        width="100%"
        height="48"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="10"
          x2={width}
          y2="10"
          stroke="#777"
          strokeDasharray="2 2"
          strokeWidth="0.7"
        />

        <line
          x1="0"
          y1="21"
          x2={width}
          y2="21"
          stroke="#777"
          strokeDasharray="2 2"
          strokeWidth="0.7"
        />

        <line
          x1="0"
          y1="32"
          x2={width}
          y2="32"
          stroke="#777"
          strokeDasharray="2 2"
          strokeWidth="0.7"
        />

        <path
          d={path}
          fill="none"
          stroke="#39ff8a"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};

/* ======================================================
   AIS DECISION ENGINE
====================================================== */

const createDecision = (
  zone
) => {
  const activity =
    Number(
      zone.activityPercentage
    ) || 0;

  const records =
    Number(
      zone.records
    ) || 0;

  const vessels =
    Number(
      zone.vessels
    ) || 0;

  const avgSOG =
    Number(
      zone.avgSOG
    ) || 0;

  const highActivity =
    activity >= 45;

  const veryHighActivity =
    activity >= 80;

  const reasons = [];

  if (activity < 25) {
    reasons.push(
      "AIS activity low"
    );
  } else if (
    activity < 45
  ) {
    reasons.push(
      "AIS activity moderate"
    );
  } else {
    reasons.push(
      "AIS activity high"
    );
  }

  if (vessels < 1000) {
    reasons.push(
      "Vessel concentration low"
    );
  } else if (
    vessels < 2000
  ) {
    reasons.push(
      "Vessel concentration moderate"
    );
  } else {
    reasons.push(
      "Vessel concentration high"
    );
  }

  if (avgSOG >= 10) {
    reasons.push(
      "Higher vessel speed observed"
    );
  } else {
    reasons.push(
      "Average vessel speed stable"
    );
  }

  let alertType =
    "LOW_AIS_ACTIVITY";

  if (
    veryHighActivity
  ) {
    alertType =
      "CRITICAL_AIS_ACTIVITY";
  } else if (
    highActivity
  ) {
    alertType =
      "HIGH_AIS_ACTIVITY";
  } else if (
    activity >= 25
  ) {
    alertType =
      "MEDIUM_AIS_ACTIVITY";
  }

  let recommendation;

  if (
    veryHighActivity
  ) {
    recommendation =
      "Prioritize monitoring and review vessel activity in this zone";
  } else if (
    highActivity
  ) {
    recommendation =
      "Increase AIS monitoring for this zone";
  } else {
    recommendation =
      "Continue routine AIS monitoring";
  }

  return {
    approved: true,

    metrics: {
      records,
      vessels,
      avgSOG,
      activity,
    },

    reasons,

    alert:
      `${alertType} — ${zone.name}`,

    recommendation,
  };
};

/* ======================================================
   DECISION RESULT
====================================================== */

const DecisionResult = ({
  decision,
}) => {
  if (!decision) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "10px",
        background: "#101522",
        borderRadius: "8px",
        padding: "12px",
        color: "#ffffff",
        fontSize: "12px",
        lineHeight: "17px",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          marginBottom: "12px",
          color: "#39ff14",
        }}
      >
        ✅ AIS Monitoring Decision
      </div>

      <div
        style={{
          marginBottom: "13px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          AIS Metrics
        </div>

        <div>
          Records:{" "}
          {decision.metrics.records.toLocaleString()}
        </div>

        <div>
          Unique Vessels:{" "}
          {decision.metrics.vessels.toLocaleString()}
        </div>

        <div>
          Average SOG:{" "}
          {decision.metrics.avgSOG} kn
        </div>

        <div>
          Activity:{" "}
          {decision.metrics.activity}%
        </div>
      </div>

      <div
        style={{
          marginBottom: "13px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            marginBottom: "3px",
          }}
        >
          Analysis
        </div>

        {decision.reasons.map(
          (
            reason,
            index
          ) => (
            <div key={index}>
              • {reason}
            </div>
          )
        )}
      </div>

      <div
        style={{
          marginBottom: "13px",
        }}
      >
        <div
          style={{
            color: "#ff6666",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          Alert
        </div>

        <div>
          {decision.alert}
        </div>
      </div>

      <div>
        <div
          style={{
            color: "#55bfff",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          Recommendation
        </div>

        <div>
          {decision.recommendation}
        </div>
      </div>
    </div>
  );
};

/* ======================================================
   AIS ZONE CARD
====================================================== */

const ZoneCard = ({
  zone,
  decision,
  onDeploy,
  loading,
}) => {
  const statusColor =
    getStatusColor(
      zone.status
    );

  return (
    <div
      style={{
        background: "#202538",
        border:
          `1px solid ${statusColor}`,
        borderRadius: "9px",
        padding:
          "14px 10px 12px",
        boxSizing:
          "border-box",
        width: "100%",
        transition:
          "all 0.2s ease",
      }}
    >
      {/* ZONE NAME */}

      <div
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#ffffff",
          marginBottom: "7px",
        }}
      >
        {zone.name}
      </div>

      {/* STATUS */}

      <div
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color: statusColor,
          marginBottom: "9px",
        }}
      >
        {zone.status}
      </div>

      {/* RECORDS */}

      <div
        style={{
          fontSize: "11px",
          color: "#ffffff",
          lineHeight: "18px",
        }}
      >
        📡 AIS Records:{" "}
        <strong>
          {zone.records.toLocaleString()}
        </strong>
      </div>

      {/* VESSELS */}

      <div
        style={{
          fontSize: "11px",
          color: "#ffffff",
          lineHeight: "18px",
        }}
      >
        🚢 Unique Vessels:{" "}
        <strong>
          {zone.vessels.toLocaleString()}
        </strong>
      </div>

      {/* SOG */}

      <div
        style={{
          fontSize: "11px",
          color: "#ffffff",
          lineHeight: "18px",
        }}
      >
        ⚡ Avg SOG:{" "}
        <strong>
          {zone.avgSOG} kn
        </strong>
      </div>

      {/* ACTIVITY */}

      <div
        style={{
          fontSize: "11px",
          color: "#ffffff",
          lineHeight: "18px",
        }}
      >
        📊 AIS Activity:{" "}
        <strong>
          {zone.activityPercentage}%
        </strong>
      </div>

      {/* GRAPH */}

      <MiniAISGraph
        activity={
          zone.activityPercentage
        }
      />

      {/* BUTTON */}

      <button
        type="button"
        disabled={loading}
        onClick={() =>
          onDeploy(zone)
        }
        style={{
          width: "100%",
          height: "26px",
          border: "none",
          borderRadius: "4px",
          background: "#1677ff",
          color: "#ffffff",
          fontSize: "10px",
          fontWeight: "600",
          cursor: loading
            ? "wait"
            : "pointer",
          opacity: loading
            ? 0.65
            : 1,
          marginTop: "2px",
        }}
      >
        {loading
          ? "Processing..."
          : "Analyze AIS Zone"}
      </button>

      {/* DECISION */}

      <DecisionResult
        decision={decision}
      />
    </div>
  );
};

/* ======================================================
   MAIN AIS TRAFFIC DASHBOARD
====================================================== */

const TrafficDashboard = () => {
  const [
    zones,
    setZones,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deployingZone,
    setDeployingZone,
  ] = useState(null);

  const [
    decisions,
    setDecisions,
  ] = useState({});

  /* ====================================================
     LOAD AIS CSV
  ==================================================== */

  useEffect(() => {
    const loadAISData =
      async () => {
        try {
          setLoading(true);

          console.log(
            "======================================"
          );

          console.log(
            "Loading AIS_file.csv..."
          );

          console.log(
            "======================================"
          );

          const response =
            await fetch(
              AIS_FILE
            );

          if (!response.ok) {
            throw new Error(
              `Unable to load AIS_file.csv: ${response.status}`
            );
          }

          const csvText =
            await response.text();

          const aisRows =
            parseCSV(
              csvText
            );

          console.log(
            "AIS RECORD COUNT:",
            aisRows.length
          );

          if (
            aisRows.length === 0
          ) {
            throw new Error(
              "AIS CSV contains no records."
            );
          }

          const aisZones =
            buildAISZones(
              aisRows
            );

          console.log(
            "AIS ZONES:",
            aisZones
          );

          setZones(
            aisZones
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load AIS data:",
            error
          );

          setZones([]);
        } finally {
          setLoading(false);
        }
      };

    loadAISData();
  }, []);

  /* ====================================================
     MAP CENTER
  ==================================================== */

  const mapCenter =
    useMemo(() => {
      if (
        zones.length === 0
      ) {
        return DEFAULT_MAP_CENTER;
      }

      const validZones =
        zones.filter(
          (zone) =>
            Number.isFinite(
              zone.latitude
            ) &&
            Number.isFinite(
              zone.longitude
            )
        );

      if (
        validZones.length === 0
      ) {
        return DEFAULT_MAP_CENTER;
      }

      const avgLat =
        validZones.reduce(
          (
            total,
            zone
          ) =>
            total +
            zone.latitude,
          0
        ) /
        validZones.length;

      const avgLon =
        validZones.reduce(
          (
            total,
            zone
          ) =>
            total +
            zone.longitude,
          0
        ) /
        validZones.length;

      return [
        avgLat,
        avgLon,
      ];
    }, [zones]);

  /* ====================================================
     ANALYZE AIS ZONE
  ==================================================== */

  const handleDeploy =
    async (zone) => {
      try {
        setDeployingZone(
          zone.id
        );

        console.log(
          "======================================"
        );

        console.log(
          "AIS ZONE ANALYSIS"
        );

        console.log(
          "ZONE:",
          zone
        );

        console.log(
          "======================================"
        );

        const decision =
          createDecision(
            zone
          );

        setDecisions(
          (previous) => ({
            ...previous,

            [zone.id]:
              decision,
          })
        );

        /*
         * Keep your existing backend
         * execution integration.
         */

        try {
          await triggerExecution(
            {
              zoneId:
                Number(
                  zone.id
                ),

              action:
                "deploy_waste_collection",

              aisRecords:
                zone.records,

              uniqueVessels:
                zone.vessels,

              avgSOG:
                zone.avgSOG,

              aisActivity:
                zone.activityPercentage,

              latitude:
                zone.latitude,

              longitude:
                zone.longitude,
            }
          );

          console.log(
            "Backend AIS execution successful."
          );
        } catch (
          backendError
        ) {
          console.warn(
            "Backend execution failed. AIS decision remains visible.",
            backendError
          );
        }
      } catch (
        error
      ) {
        console.error(
          "AIS decision processing error:",
          error
        );
      } finally {
        setDeployingZone(
          null
        );
      }
    };

  /* ====================================================
     RENDER
  ==================================================== */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1427",
        color: "#ffffff",
        padding:
          "0 14px 30px",
        boxSizing:
          "border-box",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        style={{
          width: "100%",
          height: "70px",
          background: "#242424",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          marginBottom: "30px",
          boxSizing:
            "border-box",
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "26px",
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing:
              "0.2px",
          }}
        >
          🚢 AIS Traffic Dashboard
        </h1>
      </div>

      {/* ==================================================
          AIS SUMMARY
      ================================================== */}

      {!loading &&
        zones.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background:
                  "#111d31",
                border:
                  "1px solid #202b40",
                borderRadius:
                  "8px",
                padding:
                  "12px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color:
                    "#7d95b8",
                  fontWeight:
                    "700",
                }}
              >
                AIS RECORDS
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight:
                    "700",
                  marginTop:
                    "5px",
                }}
              >
                10,000
              </div>
            </div>

            <div
              style={{
                background:
                  "#111d31",
                border:
                  "1px solid #202b40",
                borderRadius:
                  "8px",
                padding:
                  "12px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color:
                    "#7d95b8",
                  fontWeight:
                    "700",
                }}
              >
                UNIQUE VESSELS
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight:
                    "700",
                  marginTop:
                    "5px",
                }}
              >
                6,728
              </div>
            </div>

            <div
              style={{
                background:
                  "#111d31",
                border:
                  "1px solid #202b40",
                borderRadius:
                  "8px",
                padding:
                  "12px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color:
                    "#7d95b8",
                  fontWeight:
                    "700",
                }}
              >
                AVG SOG
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight:
                    "700",
                  marginTop:
                    "5px",
                }}
              >
                2.74 kn
              </div>
            </div>

            <div
              style={{
                background:
                  "#111d31",
                border:
                  "1px solid #202b40",
                borderRadius:
                  "8px",
                padding:
                  "12px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color:
                    "#7d95b8",
                  fontWeight:
                    "700",
                }}
              >
                VESSEL TYPES
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight:
                    "700",
                  marginTop:
                    "5px",
                }}
              >
                57
              </div>
            </div>
          </div>
        )}

      {/* ==================================================
          MAP
      ================================================== */}

      <div
        style={{
          width: "100%",
          height: "390px",
          borderRadius: "9px",
          overflow: "hidden",
          marginBottom: "13px",
          border:
            "1px solid #202b40",
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={4}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map(
            (
              zone
            ) => {
              const color =
                getStatusColor(
                  zone.status
                );

              return (
                <CircleMarker
                  key={
                    zone.id
                  }
                  center={[
                    zone.latitude,
                    zone.longitude,
                  ]}
                  radius={9}
                  pathOptions={{
                    color:
                      "#ffffff",
                    weight: 2,
                    fillColor:
                      color,
                    fillOpacity: 1,
                  }}
                >
                  <Popup>
                    <div
                      style={{
                        fontFamily:
                          "Arial, sans-serif",
                        fontSize:
                          "13px",
                      }}
                    >
                      <strong>
                        {zone.name}
                      </strong>

                      <br />

                      Status:{" "}
                      <strong
                        style={{
                          color,
                        }}
                      >
                        {
                          zone.status
                        }
                      </strong>

                      <br />

                      AIS Records:{" "}
                      {
                        zone.records
                      }

                      <br />

                      Unique Vessels:{" "}
                      {
                        zone.vessels
                      }

                      <br />

                      Avg SOG:{" "}
                      {
                        zone.avgSOG
                      }{" "}
                      kn

                      <br />

                      AIS Activity:{" "}
                      {
                        zone.activityPercentage
                      }%
                    </div>
                  </Popup>
                </CircleMarker>
              );
            }
          )}
        </MapContainer>
      </div>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div
          style={{
            textAlign:
              "center",
            padding:
              "30px",
            fontSize:
              "18px",
            fontWeight:
              "700",
            color:
              "#ffffff",
          }}
        >
          Loading AIS Data...
        </div>
      ) : zones.length === 0 ? (
        <div
          style={{
            textAlign:
              "center",
            padding:
              "30px",
            fontSize:
              "16px",
            color:
              "#ff6b6b",
          }}
        >
          AIS_file.csv could not be loaded.
          <br />
          Make sure it is inside:
          <br />
          <strong>
            frontend/public/AIS_file.csv
          </strong>
        </div>
      ) : (
        <>
          {/* =================================================
              ZONE GRID
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              width: "100%",
              alignItems:
                "start",
            }}
          >
            {zones.map(
              (
                zone
              ) => (
                <ZoneCard
                  key={
                    zone.id
                  }
                  zone={
                    zone
                  }
                  decision={
                    decisions[
                      zone.id
                    ]
                  }
                  onDeploy={
                    handleDeploy
                  }
                  loading={
                    deployingZone ===
                    zone.id
                  }
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrafficDashboard;