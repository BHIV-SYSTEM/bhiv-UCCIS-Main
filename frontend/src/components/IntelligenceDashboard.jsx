import React, {
  useEffect,
  useState,
} from "react";

import ZoneCardTask3 from "../components/ZoneCardTask3";

/* ======================================================
   AIS FILE
====================================================== */

const AIS_FILE = "/AIS_file.csv";

/* ======================================================
   AIS ZONES
====================================================== */

const AIS_ZONES = [
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
   NUMBER HELPER
====================================================== */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

/* ======================================================
   CSV PARSER
====================================================== */

const parseCSV = (text) => {
  const lines = text
    .trim()
    .split(/\r?\n/);

  if (lines.length <= 1) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) =>
      header.trim()
    );

  return lines
    .slice(1)
    .map((line) => {
      const values =
        line.split(",");

      const row = {};

      headers.forEach(
        (
          header,
          index
        ) => {
          row[header] =
            values[index] !==
            undefined
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
   DETERMINE AIS ZONE
====================================================== */

const determineZone = (
  lat,
  lon
) => {
  lat = toNumber(lat);
  lon = toNumber(lon);

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
    lon > -85 &&
    lat >= 32
  ) {
    return 3;
  }

  /*
   * Central / Inland
   */

  return 5;
};

/* ======================================================
   STATUS
====================================================== */

const getStatus = (
  activity
) => {
  if (activity >= 80) {
    return "CRITICAL";
  }

  if (activity >= 50) {
    return "HIGH";
  }

  if (activity >= 25) {
    return "MEDIUM";
  }

  return "LOW";
};

/* ======================================================
   INTELLIGENCE LEVEL
====================================================== */

const getIntelligenceLevel = (
  activity
) => {
  if (activity >= 80) {
    return "CRITICAL INTELLIGENCE";
  }

  if (activity >= 50) {
    return "HIGH PRIORITY";
  }

  if (activity >= 25) {
    return "MONITOR";
  }

  return "NORMAL";
};

/* ======================================================
   BUILD AIS INTELLIGENCE
====================================================== */

const buildIntelligence = (
  records
) => {
  const zoneMap = {};

  AIS_ZONES.forEach(
    (zone) => {
      zoneMap[zone.id] = {
        id: zone.id,

        name: zone.name,

        records: 0,

        vessels: new Set(),

        vesselTypes: new Set(),

        sogTotal: 0,

        latTotal: 0,

        lonTotal: 0,

        movingVessels: 0,

        latestTime: "",
      };
    }
  );

  /* ----------------------------------------------
     PROCESS AIS RECORDS
  ---------------------------------------------- */

  records.forEach(
    (record) => {
      const lat =
        toNumber(
          record.LAT
        );

      const lon =
        toNumber(
          record.LON
        );

      const zoneId =
        determineZone(
          lat,
          lon
        );

      const zone =
        zoneMap[zoneId];

      if (!zone) {
        return;
      }

      zone.records += 1;

      zone.vessels.add(
        String(
          record.MMSI
        )
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

      zone.sogTotal += sog;

      if (sog > 0) {
        zone.movingVessels += 1;
      }

      zone.latTotal += lat;

      zone.lonTotal += lon;

      if (
        !zone.latestTime ||
        String(
          record.BaseDateTime
        ) >
          String(
            zone.latestTime
          )
      ) {
        zone.latestTime =
          record.BaseDateTime;
      }
    }
  );

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

  /* ----------------------------------------------
     CONVERT TO DASHBOARD DATA
  ---------------------------------------------- */

  return AIS_ZONES.map(
    (zoneDefinition) => {
      const zone =
        zoneMap[
          zoneDefinition.id
        ];

      const avgSOG =
        zone.records > 0
          ? zone.sogTotal /
            zone.records
          : 0;

      const activity =
        zone.records > 0
          ? (
              zone.records /
              maxRecords
            ) *
            100
          : 0;

      const movingPercentage =
        zone.records > 0
          ? (
              zone.movingVessels /
              zone.records
            ) *
            100
          : 0;

      const latitude =
        zone.records > 0
          ? zone.latTotal /
            zone.records
          : 0;

      const longitude =
        zone.records > 0
          ? zone.lonTotal /
            zone.records
          : 0;

      const status =
        getStatus(
          activity
        );

      return {
        zone_id:
          zoneDefinition.id,

        zone_name:
          zoneDefinition.name,

        name:
          zoneDefinition.name,

        status,

        intelligence_level:
          getIntelligenceLevel(
            activity
          ),

        ais_records:
          zone.records,

        records:
          zone.records,

        unique_vessels:
          zone.vessels.size,

        vessels:
          zone.vessels.size,

        vessel_types:
          zone.vesselTypes.size,

        avg_sog:
          Number(
            avgSOG.toFixed(2)
          ),

        avgSOG:
          Number(
            avgSOG.toFixed(2)
          ),

        activity:
          Number(
            activity.toFixed(1)
          ),

        activity_percentage:
          Number(
            activity.toFixed(1)
          ),

        moving_percentage:
          Number(
            movingPercentage.toFixed(
              1
            )
          ),

        latitude:
          Number(
            latitude.toFixed(4)
          ),

        longitude:
          Number(
            longitude.toFixed(4)
          ),

        latest_time:
          zone.latestTime,

        /* ----------------------------------------
           INTELLIGENCE
        ---------------------------------------- */

        intelligence: {
          status,

          activity:
            Number(
              activity.toFixed(
                1
              )
            ),

          records:
            zone.records,

          uniqueVessels:
            zone.vessels.size,

          vesselTypes:
            zone.vesselTypes.size,

          avgSOG:
            Number(
              avgSOG.toFixed(
                2
              )
            ),

          recommendation:
            activity >= 80
              ? "Immediate AIS monitoring recommended"
              : activity >= 50
              ? "Increase AIS monitoring"
              : activity >= 25
              ? "Continue active monitoring"
              : "Routine AIS monitoring",
        },
      };
    }
  );
};

/* ======================================================
   DASHBOARD
====================================================== */

const IntelligenceDashboard = () => {
  const [
    zonesData,
    setZonesData,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ====================================================
     LOAD AIS DATA
  ==================================================== */

  useEffect(() => {
    const loadAIS =
      async () => {
        try {
          setLoading(true);

          setError("");

          console.log(
            "======================================"
          );

          console.log(
            "TASK 3 - LOADING AIS DATA"
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
              `AIS_file.csv returned ${response.status}`
            );
          }

          const csvText =
            await response.text();

          const records =
            parseCSV(
              csvText
            );

          console.log(
            "AIS RECORDS:",
            records.length
          );

          if (
            records.length === 0
          ) {
            throw new Error(
              "No AIS records found."
            );
          }

          const intelligence =
            buildIntelligence(
              records
            );

          console.log(
            "TASK 3 AIS INTELLIGENCE:",
            intelligence
          );

          setZonesData(
            intelligence
          );
        } catch (
          err
        ) {
          console.error(
            "Failed to load AIS intelligence:",
            err
          );

          setError(
            err.message ||
              "Failed to load AIS data."
          );

          setZonesData([]);
        } finally {
          setLoading(false);
        }
      };

    loadAIS();
  }, []);

  /* ====================================================
     SUMMARY
  ==================================================== */

  const totalRecords =
    zonesData.reduce(
      (
        total,
        zone
      ) =>
        total +
        zone.records,
      0
    );

  const totalVessels =
    new Set(
      zonesData.flatMap(
        (zone) =>
          Array(
            zone.vessels
          ).fill(
            zone.zone_id
          )
      )
    ).size;

  const criticalZones =
    zonesData.filter(
      (zone) =>
        zone.status ===
        "CRITICAL"
    ).length;

  const highZones =
    zonesData.filter(
      (zone) =>
        zone.status ===
        "HIGH"
    ).length;

  /* ====================================================
     RENDER
  ==================================================== */

  return (
    <div
      style={
        styles.container
      }
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={
          styles.header
        }
      >
        <div>

          <h1
            style={
              styles.title
            }
          >
            AIS Intelligence
            Dashboard
          </h1>

          <p
            style={
              styles.subtitle
            }
          >
            Real-time intelligence
            derived from AIS
            vessel activity
          </p>

        </div>

        <div
          style={
            styles.datasetBadge
          }
        >
          AIS DATASET
          <strong>
            10,000 Records
          </strong>
        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      {!loading &&
        zonesData.length >
          0 && (
          <div
            style={
              styles.summaryGrid
            }
          >

            <SummaryCard
              title="AIS RECORDS"
              value="10,000"
              description="AIS observations"
            />

            <SummaryCard
              title="ZONE INTELLIGENCE"
              value={
                zonesData.length
              }
              description="Active geographic zones"
            />

            <SummaryCard
              title="HIGH PRIORITY"
              value={
                highZones
              }
              description="Zones requiring monitoring"
            />

            <SummaryCard
              title="CRITICAL"
              value={
                criticalZones
              }
              description="High AIS activity zones"
            />

          </div>
        )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          style={
            styles.loading
          }
        >
          <div
            style={
              styles.loadingIcon
            }
          >
            ◌
          </div>

          Loading AIS
          Intelligence...
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading &&
        error && (
          <div
            style={
              styles.error
            }
          >
            <strong>
              AIS Data Error
            </strong>

            <div>
              {error}
            </div>

            <small>
              Make sure
              AIS_file.csv is
              inside:
              frontend/public/
            </small>
          </div>
        )}

      {/* =================================================
          ZONE CARDS
      ================================================= */}

      {!loading &&
        !error &&
        zonesData.length >
          0 && (
          <div
            style={
              styles.grid
            }
          >

            {zonesData.map(
              (zone) => (
                <AISZoneCard
                  key={
                    zone.zone_id
                  }
                  zone={
                    zone
                  }
                />
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
  description,
}) => {
  return (
    <div
      style={
        styles.summaryCard
      }
    >

      <div
        style={
          styles.summaryTitle
        }
      >
        {title}
      </div>

      <div
        style={
          styles.summaryValue
        }
      >
        {value}
      </div>

      <div
        style={
          styles.summaryDescription
        }
      >
        {description}
      </div>

    </div>
  );
};

/* ======================================================
   AIS ZONE CARD

   We keep ZoneCardTask3 available, but use our own
   AIS wrapper so the dashboard does not depend on
   unknown backend fields.
====================================================== */

const AISZoneCard = ({
  zone,
}) => {
  const color =
    zone.status ===
    "CRITICAL"
      ? "#ff304f"
      : zone.status ===
        "HIGH"
      ? "#ff6b35"
      : zone.status ===
        "MEDIUM"
      ? "#ffb800"
      : "#39ff14";

  return (
    <div
      style={{
        ...styles.zoneCard,
        borderLeft:
          `4px solid ${color}`,
      }}
    >

      {/* HEADER */}

      <div
        style={
          styles.zoneHeader
        }
      >

        <div>

          <div
            style={
              styles.zoneNumber
            }
          >
            ZONE{" "}
            {String(
              zone.zone_id
            ).padStart(
              2,
              "0"
            )}
          </div>

          <h2
            style={
              styles.zoneName
            }
          >
            {zone.zone_name}
          </h2>

        </div>

        <div
          style={{
            ...styles.status,
            color,
            borderColor:
              color,
          }}
        >
          {zone.status}
        </div>

      </div>

      {/* INTELLIGENCE LEVEL */}

      <div
        style={{
          ...styles.intelligenceBadge,
          color,
        }}
      >
        {zone.intelligence_level}
      </div>

      {/* METRICS */}

      <div
        style={
          styles.metricsGrid
        }
      >

        <Metric
          label="AIS RECORDS"
          value={
            zone.records.toLocaleString()
          }
        />

        <Metric
          label="UNIQUE VESSELS"
          value={
            zone.vessels.toLocaleString()
          }
        />

        <Metric
          label="AVG SOG"
          value={`${zone.avgSOG} kn`}
        />

        <Metric
          label="VESSEL TYPES"
          value={
            zone.vessel_types
          }
        />

        <Metric
          label="AIS ACTIVITY"
          value={`${zone.activity_percentage}%`}
        />

        <Metric
          label="MOVING"
          value={`${zone.moving_percentage}%`}
        />

      </div>

      {/* ACTIVITY BAR */}

      <div
        style={
          styles.activityContainer
        }
      >

        <div
          style={
            styles.activityHeader
          }
        >

          <span>
            AIS Activity
          </span>

          <strong>
            {zone.activity_percentage}%
          </strong>

        </div>

        <div
          style={
            styles.activityBackground
          }
        >

          <div
            style={{
              ...styles.activityBar,
              width:
                `${Math.min(
                  zone.activity_percentage,
                  100
                )}%`,
              background:
                color,
            }}
          />

        </div>

      </div>

      {/* INTELLIGENCE */}

      <div
        style={
          styles.intelligenceBox
        }
      >

        <div
          style={
            styles.intelligenceTitle
          }
        >
          INTELLIGENCE ASSESSMENT
        </div>

        <p>
          AIS records:{" "}
          <strong>
            {zone.records.toLocaleString()}
          </strong>
        </p>

        <p>
          Vessel concentration:{" "}
          <strong>
            {zone.vessels.toLocaleString()}
          </strong>
        </p>

        <p>
          Average vessel speed:{" "}
          <strong>
            {zone.avgSOG} kn
          </strong>
        </p>

        <p>
          Latest AIS observation:{" "}
          <strong>
            {zone.latest_time ||
              "Available"}
          </strong>
        </p>

      </div>

      {/* RECOMMENDATION */}

      <div
        style={
          styles.recommendation
        }
      >

        <div
          style={
            styles.recommendationTitle
          }
        >
          SYSTEM RECOMMENDATION
        </div>

        <div>
          {zone.intelligence
            .recommendation}
        </div>

      </div>

    </div>
  );
};

/* ======================================================
   METRIC
====================================================== */

const Metric = ({
  label,
  value,
}) => {
  return (
    <div
      style={
        styles.metric
      }
    >

      <div
        style={
          styles.metricLabel
        }
      >
        {label}
      </div>

      <div
        style={
          styles.metricValue
        }
      >
        {value}
      </div>

    </div>
  );
};

/* ======================================================
   STYLES
====================================================== */

const styles = {
  container: {
    minHeight:
      "100vh",

    padding:
      "24px",

    background:
      "#081525",

    color:
      "#ffffff",

    fontFamily:
      "Arial, Helvetica, sans-serif",

    boxSizing:
      "border-box",
  },

  header: {
    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap:
      "20px",

    marginBottom:
      "22px",
  },

  title: {
    margin:
      "0",

    color:
      "#ffffff",

    fontSize:
      "30px",

    fontWeight:
      "700",

    letterSpacing:
      "0.5px",
  },

  subtitle: {
    margin:
      "7px 0 0",

    color:
      "#7890ad",

    fontSize:
      "13px",
  },

  datasetBadge: {
    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "flex-end",

    color:
      "#6f89aa",

    fontSize:
      "10px",

    fontWeight:
      "700",

    letterSpacing:
      "1px",
  },

  summaryGrid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",

    gap:
      "14px",

    marginBottom:
      "20px",
  },

  summaryCard: {
    background:
      "#0e1d30",

    border:
      "1px solid #1c3149",

    borderRadius:
      "10px",

    padding:
      "15px 17px",
  },

  summaryTitle: {
    color:
      "#6e88aa",

    fontSize:
      "10px",

    fontWeight:
      "700",

    letterSpacing:
      "1px",
  },

  summaryValue: {
    marginTop:
      "6px",

    fontSize:
      "24px",

    fontWeight:
      "700",
  },

  summaryDescription: {
    marginTop:
      "4px",

    color:
      "#637b98",

    fontSize:
      "11px",
  },

  grid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",

    gap:
      "16px",

    alignItems:
      "start",
  },

  zoneCard: {
    background:
      "#101e31",

    border:
      "1px solid #1d3249",

    borderRadius:
      "10px",

    padding:
      "17px",

    boxSizing:
      "border-box",

    minHeight:
      "410px",
  },

  zoneHeader: {
    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "flex-start",

    gap:
      "10px",
  },

  zoneNumber: {
    color:
      "#6682a6",

    fontSize:
      "9px",

    fontWeight:
      "700",

    letterSpacing:
      "1.5px",
  },

  zoneName: {
    margin:
      "5px 0 0",

    fontSize:
      "18px",

    fontWeight:
      "700",
  },

  status: {
    border:
      "1px solid",

    borderRadius:
      "20px",

    padding:
      "4px 9px",

    fontSize:
      "9px",

    fontWeight:
      "700",

    whiteSpace:
      "nowrap",
  },

  intelligenceBadge: {
    marginTop:
      "12px",

    fontSize:
      "11px",

    fontWeight:
      "700",

    letterSpacing:
      "0.8px",
  },

  metricsGrid: {
    display:
      "grid",

    gridTemplateColumns:
      "repeat(2, 1fr)",

    gap:
      "8px",

    marginTop:
      "14px",
  },

  metric: {
    background:
      "#17263b",

    border:
      "1px solid #223850",

    borderRadius:
      "7px",

    padding:
      "10px",
  },

  metricLabel: {
    color:
      "#6e87a6",

    fontSize:
      "8px",

    fontWeight:
      "700",

    letterSpacing:
      "0.8px",
  },

  metricValue: {
    marginTop:
      "4px",

    fontSize:
      "16px",

    fontWeight:
      "700",

    color:
      "#ffffff",
  },

  activityContainer: {
    marginTop:
      "15px",
  },

  activityHeader: {
    display:
      "flex",

    justifyContent:
      "space-between",

    marginBottom:
      "5px",

    color:
      "#7891ae",

    fontSize:
      "10px",
  },

  activityBackground: {
    height:
      "5px",

    background:
      "#26384e",

    borderRadius:
      "5px",

    overflow:
      "hidden",
  },

  activityBar: {
    height:
      "100%",

    borderRadius:
      "5px",

    transition:
      "width 0.4s ease",
  },

  intelligenceBox: {
    marginTop:
      "14px",

    padding:
      "11px",

    background:
      "#0b1728",

    border:
      "1px solid #1c3048",

    borderRadius:
      "7px",

    color:
      "#8ea3bc",

    fontSize:
      "10px",

    lineHeight:
      "17px",
  },

  intelligenceTitle: {
    color:
      "#5fa8ff",

    fontSize:
      "9px",

    fontWeight:
      "700",

    letterSpacing:
      "1px",

    marginBottom:
      "5px",
  },

  recommendation: {
    marginTop:
      "10px",

    padding:
      "10px",

    borderRadius:
      "7px",

    background:
      "#10243a",

    color:
      "#b9cbe0",

    fontSize:
      "10px",

    lineHeight:
      "15px",
  },

  recommendationTitle: {
    color:
      "#55bfff",

    fontSize:
      "9px",

    fontWeight:
      "700",

    letterSpacing:
      "0.8px",

    marginBottom:
      "4px",
  },

  loading: {
    minHeight:
      "300px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "center",

    justifyContent:
      "center",

    color:
      "#78a7d8",

    fontSize:
      "18px",

    fontWeight:
      "700",
  },

  loadingIcon: {
    fontSize:
      "40px",

    marginBottom:
      "10px",
  },

  error: {
    padding:
      "20px",

    background:
      "#351923",

    border:
      "1px solid #713044",

    borderRadius:
      "9px",

    color:
      "#ff9cae",

    lineHeight:
      "24px",
  },
};

export default IntelligenceDashboard;