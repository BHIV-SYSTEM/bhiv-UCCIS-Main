import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";

/* ======================================================
   AIS FILE
====================================================== */

const AIS_FILE = "/AIS_file.csv";

/* ======================================================
   DECISION COLORS
====================================================== */

const DECISION_COLORS = {
  LOW: "#16a34a",
  MEDIUM: "#f59e0b",
  HIGH_PRIORITY: "#dc2626",
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

      headers.forEach((header, index) => {
        row[header] =
          values[index] !== undefined
            ? values[index].trim()
            : "";
      });

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
   AIS ZONE DEFINITIONS
====================================================== */

const AIS_ZONE_DEFINITIONS = [
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
   DETERMINE AIS ZONE
====================================================== */

const determineAISZone = (lat, lon) => {
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
   BUILD AIS INTELLIGENCE
====================================================== */

const buildAISIntelligence = (records) => {
  const zoneMap = {};

  AIS_ZONE_DEFINITIONS.forEach((zone) => {
    zoneMap[zone.id] = {
      id: zone.id,
      name: zone.name,

      records: 0,

      vessels: new Set(),

      vesselTypes: new Set(),

      sogTotal: 0,

      movingRecords: 0,

      latitudeTotal: 0,

      longitudeTotal: 0,

      latestTime: "",
    };
  });

  /* ----------------------------------------------------
     PROCESS EVERY AIS RECORD
  ---------------------------------------------------- */

  records.forEach((record) => {
    const lat = toNumber(record.LAT);
    const lon = toNumber(record.LON);

    const zoneId = determineAISZone(
      lat,
      lon
    );

    const zone = zoneMap[zoneId];

    if (!zone) {
      return;
    }

    zone.records += 1;

    /* Unique vessel */

    zone.vessels.add(
      String(record.MMSI)
    );

    /* Vessel type */

    if (record.VesselType) {
      zone.vesselTypes.add(
        String(record.VesselType)
      );
    }

    /* Speed */

    const sog = toNumber(record.SOG);

    zone.sogTotal += sog;

    if (sog > 0) {
      zone.movingRecords += 1;
    }

    /* Coordinates */

    zone.latitudeTotal += lat;
    zone.longitudeTotal += lon;

    /* Latest timestamp */

    if (
      !zone.latestTime ||
      String(record.BaseDateTime) >
        String(zone.latestTime)
    ) {
      zone.latestTime =
        record.BaseDateTime;
    }
  });

  /*
   * Find highest zone activity.
   */

  const maxRecords = Math.max(
    ...Object.values(zoneMap).map(
      (zone) => zone.records
    ),
    1
  );

  /* ----------------------------------------------------
     CONVERT TO DASHBOARD DATA
  ---------------------------------------------------- */

  return AIS_ZONE_DEFINITIONS.map(
    (definition) => {
      const zone =
        zoneMap[definition.id];

      const avgSOG =
        zone.records > 0
          ? zone.sogTotal /
            zone.records
          : 0;

      const activity =
        zone.records > 0
          ? (zone.records /
              maxRecords) *
            100
          : 0;

      const movingPercentage =
        zone.records > 0
          ? (zone.movingRecords /
              zone.records) *
            100
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
       * Risk score is derived from AIS activity.
       *
       * 0-49  = LOW
       * 50-100 = MEDIUM
       * >100 = HIGH_PRIORITY
       */

      const riskScore = Number(
        (
          activity *
          1.25
        ).toFixed(1)
      );

      let decision = "LOW";

      if (riskScore > 100) {
        decision = "HIGH_PRIORITY";
      } else if (riskScore >= 50) {
        decision = "MEDIUM";
      }

      return {
        zone_id:
          `zone_${definition.id}`,

        zone_number:
          definition.id,

        zone_name:
          definition.name,

        risk_score:
          riskScore,

        decision,

        ais_records:
          zone.records,

        unique_vessels:
          zone.vessels.size,

        vessel_types:
          zone.vesselTypes.size,

        avg_sog:
          Number(
            avgSOG.toFixed(2)
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
            latitude.toFixed(4)
          ),

        longitude:
          Number(
            longitude.toFixed(4)
          ),

        latest_time:
          zone.latestTime,
      };
    }
  );
};

/* ======================================================
   MAIN COMPONENT
====================================================== */

const ZoneIntelligenceDashboard = () => {
  const [zones, setZones] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [fetchError, setFetchError] =
    useState(null);

  const [lastUpdated, setLastUpdated] =
    useState("");

  /* ====================================================
     LOAD AIS CSV
  ==================================================== */

  const fetchAISData = async () => {
    try {
      setLoading(true);

      setFetchError(null);

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
          AIS_FILE,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          `AIS_file.csv could not be loaded. HTTP ${response.status}`
        );
      }

      const csvText =
        await response.text();

      const records =
        parseCSV(csvText);

      console.log(
        "AIS RECORDS:",
        records.length
      );

      if (
        records.length === 0
      ) {
        throw new Error(
          "AIS_file.csv contains no valid AIS records."
        );
      }

      const intelligence =
        buildAISIntelligence(
          records
        );

      console.log(
        "TASK 3 AIS INTELLIGENCE:",
        intelligence
      );

      setZones(
        intelligence
      );

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } catch (error) {
      console.error(
        "Failed to load AIS intelligence:",
        error
      );

      setFetchError(
        error.message
      );

      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  /* ====================================================
     INITIAL LOAD
  ==================================================== */

  useEffect(() => {
    fetchAISData();

    /*
     * Refresh every 5 seconds.
     * This reloads the CSV so the dashboard can
     * reflect a changed AIS file.
     */

    const interval =
      setInterval(
        fetchAISData,
        5000
      );

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* ====================================================
     RISK SCORE DATA
  ==================================================== */

  const riskScoreData =
    useMemo(() => {
      return zones.map(
        (zone) => ({
          name:
            `Zone ${zone.zone_number}`,

          riskScore:
            Number(
              zone.risk_score
            ) || 0,

          decision:
            zone.decision ||
            "LOW",
        })
      );
    }, [zones]);

  /* ====================================================
     DECISION BREAKDOWN
  ==================================================== */

  const decisionBreakdown =
    useMemo(() => {
      const counts = {
        LOW: 0,
        MEDIUM: 0,
        HIGH_PRIORITY: 0,
      };

      zones.forEach(
        (zone) => {
          const decision =
            zone.decision ||
            "LOW";

          counts[decision] =
            (counts[decision] ||
              0) + 1;
        }
      );

      return Object.entries(
        counts
      )
        .filter(
          ([, count]) =>
            count > 0
        )
        .map(
          ([
            decision,
            count,
          ]) => ({
            name: decision,
            value: count,
          })
        );
    }, [zones]);

  /* ====================================================
     SUMMARY
  ==================================================== */

  const totalRecords =
    zones.reduce(
      (
        total,
        zone
      ) =>
        total +
        zone.ais_records,
      0
    );

  const totalVessels =
    zones.reduce(
      (
        total,
        zone
      ) =>
        total +
        zone.unique_vessels,
      0
    );

  const totalVesselTypes =
    zones.reduce(
      (
        total,
        zone
      ) =>
        Math.max(
          total,
          zone.vessel_types
        ),
      0
    );

  const highPriority =
    zones.filter(
      (zone) =>
        zone.decision ===
        "HIGH_PRIORITY"
    ).length;

  const mediumPriority =
    zones.filter(
      (zone) =>
        zone.decision ===
        "MEDIUM"
    ).length;

  const lowPriority =
    zones.filter(
      (zone) =>
        zone.decision ===
        "LOW"
    ).length;

  /* ====================================================
     UI
  ==================================================== */

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        boxSizing:
          "border-box",
        fontFamily:
          "Arial, sans-serif",
        background:
          "#f8fafc",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "20px",
          gap: "15px",
        }}
      >

        <div>
          <h1
            style={{
              margin:
                "0 0 5px 0",
              color:
                "#111827",
              fontSize:
                "28px",
              fontWeight:
                "700",
            }}
          >
            🚦 AIS Zone Intelligence
            Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              color:
                "#64748b",
              fontSize:
                "13px",
            }}
          >
            Zone intelligence generated
            from AIS vessel activity
          </p>
        </div>

        <div
          style={{
            textAlign:
              "right",
            color:
              "#64748b",
            fontSize:
              "11px",
          }}
        >
          {/* <div>
            DATA SOURCE
          </div>

          <strong
            style={{
              color:
                "#111827",
              fontSize:
                "13px",
            }}
          >
            AIS_file.csv
          </strong>

          {lastUpdated && (
            <div
              style={{
                marginTop:
                  "4px",
              }}
            >
              Updated:
              {" "}
              {lastUpdated}
            </div>
          )} */}
        </div>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          style={{
            background:
              "#ffffff",
            borderRadius:
              "12px",
            padding:
              "25px",
            marginBottom:
              "20px",
            textAlign:
              "center",
            color:
              "#2563eb",
            fontWeight:
              "700",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          Loading AIS intelligence...
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {fetchError && (
        <div
          style={{
            background:
              "#fef2f2",
            border:
              "1px solid #fecaca",
            color:
              "#b91c1c",
            borderRadius:
              "10px",
            padding:
              "15px",
            marginBottom:
              "20px",
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
            {fetchError}
          </div>

          <div
            style={{
              marginTop:
                "8px",
              fontSize:
                "12px",
            }}
          >
            Make sure the file is located at:
            {" "}
            <strong>
              frontend/public/AIS_file.csv
            </strong>
          </div>
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      {!loading &&
        zones.length > 0 && (
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(5, minmax(0, 1fr))",
              gap:
                "12px",
              marginBottom:
                "20px",
            }}
          >

            <SummaryCard
              title="AIS RECORDS"
              value={totalRecords.toLocaleString()}
              description="AIS observations"
            />

            <SummaryCard
              title="UNIQUE VESSELS"
              value={totalVessels.toLocaleString()}
              description="Across zone groups"
            />

            <SummaryCard
              title="HIGH PRIORITY"
              value={highPriority}
              description="AIS activity zones"
            />

            <SummaryCard
              title="MEDIUM"
              value={mediumPriority}
              description="Monitoring zones"
            />

            <SummaryCard
              title="LOW"
              value={lowPriority}
              description="Routine monitoring"
            />

          </div>
        )}

      {/* =================================================
          NO DATA
      ================================================= */}

      {!loading &&
        !fetchError &&
        zones.length === 0 && (
          <div
            style={{
              background:
                "#ffffff",
              borderRadius:
                "12px",
              padding:
                "30px",
              color:
                "#111827",
              textAlign:
                "center",
            }}
          >
            <h3>
              No AIS Zone Data Found
            </h3>

            <p>
              Check that AIS_file.csv
              exists in frontend/public/.
            </p>
          </div>
        )}

      {/* =================================================
          CHARTS
      ================================================= */}

      {!loading &&
        zones.length > 0 && (
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "minmax(0, 2fr) minmax(280px, 1fr)",
              gap:
                "20px",
              width:
                "100%",
              marginBottom:
                "32px",
              boxSizing:
                "border-box",
            }}
          >

            {/* =================================================
                RISK SCORE
            ================================================= */}

            <div
              style={{
                minWidth: 0,
                width:
                  "100%",
                background:
                  "#ffffff",
                borderRadius:
                  "12px",
                padding:
                  "18px",
                boxSizing:
                  "border-box",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 12px 0",
                  color:
                    "#000000",
                  fontWeight:
                    "700",
                  fontSize:
                    "18px",
                }}
              >
                AIS Risk Score by Zone
              </h3>

              <div
                style={{
                  width:
                    "100%",
                  height:
                    "360px",
                  minWidth: 0,
                }}
              >

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      riskScoreData
                    }
                    margin={{
                      top: 10,
                      right: 20,
                      left: 15,
                      bottom: 75,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#000000"
                      interval={0}
                      height={75}
                      tickMargin={12}
                      tick={{
                        fill:
                          "#000000",
                        fontSize:
                          12,
                        fontWeight:
                          600,
                      }}
                    >
                      <Label
                        value="Zone ID"
                        position="bottom"
                        offset={10}
                        fill="#000000"
                        style={{
                          fontWeight:
                            "700",
                          fontSize:
                            14,
                        }}
                      />
                    </XAxis>

                    <YAxis
                      stroke="#000000"
                      width={60}
                      tick={{
                        fill:
                          "#000000",
                        fontSize:
                          12,
                        fontWeight:
                          600,
                      }}
                    >
                      <Label
                        value="Risk Score"
                        angle={-90}
                        position="insideLeft"
                        offset={-2}
                        fill="#000000"
                        style={{
                          textAnchor:
                            "middle",
                          fontWeight:
                            "700",
                          fontSize:
                            14,
                        }}
                      />
                    </YAxis>

                    <Tooltip
  formatter={(value) => [
    value,
    "Risk Score",
  ]}
  labelFormatter={(label) => `Zone: ${label}`}
  contentStyle={{
    backgroundColor: "#000000",
    border: "1px solid #333",
    color: "#ffffff",
  }}
  labelStyle={{
    color: "#ffffff",
  }}
  itemStyle={{
    color: "#ffffff",
  }}
/>

                    <Bar
                      dataKey="riskScore"
                      barSize={32}
                      radius={[
                        4,
                        4,
                        0,
                        0,
                      ]}
                    >

                      {riskScoreData.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={
                              `bar-${index}`
                            }
                            fill={
                              DECISION_COLORS[
                                entry.decision
                              ] ||
                              "#94a3b8"
                            }
                          />
                        )
                      )}

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* =================================================
                DECISION BREAKDOWN
            ================================================= */}

            <div
              style={{
                minWidth: 0,
                width:
                  "100%",
                background:
                  "#ffffff",
                borderRadius:
                  "12px",
                padding:
                  "18px",
                boxSizing:
                  "border-box",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 12px 0",
                  color:
                    "#000000",
                  fontWeight:
                    "700",
                  fontSize:
                    "18px",
                }}
              >
                Decision Breakdown
              </h3>

              <div
                style={{
                  width:
                    "100%",
                  height:
                    "320px",
                }}
              >

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={
                        decisionBreakdown
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="43%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                    >

                      {decisionBreakdown.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={
                              `cell-${index}`
                            }
                            fill={
                              DECISION_COLORS[
                                entry.name
                              ] ||
                              "#94a3b8"
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      height={35}
                      wrapperStyle={{
                        fontSize:
                          "12px",
                        fontWeight:
                          "600",
                      }}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          ZONE CARDS
      ================================================= */}

      {!loading &&
        zones.length > 0 && (
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(250px, 1fr))",
              gap:
                "16px",
              width:
                "100%",
            }}
          >

            {zones.map(
              (zone) => {
                const color =
                  DECISION_COLORS[
                    zone.decision
                  ];

                return (
                  <div
                    key={
                      zone.zone_id
                    }
                    style={{
                      background:
                        "#ffffff",
                      borderRadius:
                        "12px",
                      padding:
                        "18px",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.1)",
                      borderLeft:
                        `5px solid ${color}`,
                      boxSizing:
                        "border-box",
                      minWidth:
                        0,
                    }}
                  >

                    {/* ZONE */}

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap:
                          "10px",
                      }}
                    >

                      <div>

                        <div
                          style={{
                            color:
                              "#64748b",
                            fontSize:
                              "10px",
                            fontWeight:
                              "700",
                            textTransform:
                              "uppercase",
                          }}
                        >
                          Zone{" "}
                          {
                            zone.zone_number
                          }
                        </div>

                        <h3
                          style={{
                            margin:
                              "5px 0 0",
                            color:
                              "#111827",
                            fontSize:
                              "19px",
                            fontWeight:
                              "700",
                          }}
                        >
                          {
                            zone.zone_name
                          }
                        </h3>

                      </div>

                      <span
                        style={{
                          background:
                            color,
                          color:
                            "#ffffff",
                          borderRadius:
                            "20px",
                          padding:
                            "5px 9px",
                          fontSize:
                            "9px",
                          fontWeight:
                            "700",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          zone.decision
                        }
                      </span>

                    </div>

                    {/* RISK SCORE */}

                    <div
                      style={{
                        marginTop:
                          "18px",
                        padding:
                          "12px",
                        background:
                          "#f8fafc",
                        borderRadius:
                          "8px",
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
                        AIS RISK SCORE
                      </div>

                      <div
                        style={{
                          marginTop:
                            "4px",
                          color:
                            color,
                          fontSize:
                            "27px",
                          fontWeight:
                            "700",
                        }}
                      >
                        {
                          zone.risk_score
                        }
                      </div>

                    </div>

                    {/* METRICS */}

                    <div
                      style={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap:
                          "8px",
                        marginTop:
                          "12px",
                      }}
                    >

                      <Metric
                        label="AIS RECORDS"
                        value={
                          zone.ais_records.toLocaleString()
                        }
                      />

                      <Metric
                        label="VESSELS"
                        value={
                          zone.unique_vessels.toLocaleString()
                        }
                      />

                      <Metric
                        label="AVG SOG"
                        value={`${zone.avg_sog} kn`}
                      />

                      <Metric
                        label="VESSEL TYPES"
                        value={
                          zone.vessel_types
                        }
                      />

                      <Metric
                        label="AIS ACTIVITY"
                        value={`${zone.activity}%`}
                      />

                      <Metric
                        label="MOVING"
                        value={`${zone.moving_percentage}%`}
                      />

                    </div>

                    {/* ACTIVITY BAR */}

                    <div
                      style={{
                        marginTop:
                          "15px",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          color:
                            "#475569",
                          fontSize:
                            "11px",
                          fontWeight:
                            "600",
                          marginBottom:
                            "5px",
                        }}
                      >
                        <span>
                          AIS Activity
                        </span>

                        <span>
                          {
                            zone.activity
                          }%
                        </span>
                      </div>

                      <div
                        style={{
                          width:
                            "100%",
                          height:
                            "7px",
                          background:
                            "#e2e8f0",
                          borderRadius:
                            "10px",
                          overflow:
                            "hidden",
                        }}
                      >

                        <div
                          style={{
                            width:
                              `${Math.min(
                                zone.activity,
                                100
                              )}%`,
                            height:
                              "100%",
                            background:
                              color,
                            borderRadius:
                              "10px",
                          }}
                        />

                      </div>

                    </div>

                    {/* INTELLIGENCE */}

                    <div
                      style={{
                        marginTop:
                          "15px",
                        padding:
                          "12px",
                        background:
                          "#f8fafc",
                        borderRadius:
                          "8px",
                        fontSize:
                          "11px",
                        color:
                          "#475569",
                        lineHeight:
                          "18px",
                      }}
                    >

                      <strong
                        style={{
                          color:
                            "#111827",
                        }}
                      >
                        Intelligence Assessment
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "6px",
                        }}
                      >
                        Vessel activity:
                        {" "}
                        <strong>
                          {
                            zone.activity
                          }%
                        </strong>
                      </div>

                      <div>
                        Average speed:
                        {" "}
                        <strong>
                          {
                            zone.avg_sog
                          }{" "}
                          kn
                        </strong>
                      </div>

                      <div>
                        Moving observations:
                        {" "}
                        <strong>
                          {
                            zone.moving_percentage
                          }%
                        </strong>
                      </div>

                    </div>

                    {/* RECOMMENDATION */}

                    <div
                      style={{
                        marginTop:
                          "10px",
                        padding:
                          "11px",
                        borderRadius:
                          "8px",
                        background:
                          zone.decision ===
                          "HIGH_PRIORITY"
                            ? "#fef2f2"
                            : zone.decision ===
                              "MEDIUM"
                            ? "#fffbeb"
                            : "#f0fdf4",
                        color:
                          "#334155",
                        fontSize:
                          "11px",
                        lineHeight:
                          "17px",
                      }}
                    >

                      <strong
                        style={{
                          color:
                            color,
                        }}
                      >
                        SYSTEM RECOMMENDATION
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "4px",
                        }}
                      >
                        {zone.decision ===
                        "HIGH_PRIORITY"
                          ? "Increase AIS monitoring and review this zone immediately."
                          : zone.decision ===
                            "MEDIUM"
                          ? "Continue active AIS monitoring for this zone."
                          : "Continue routine AIS monitoring."}
                      </div>

                    </div>

                    {/* COORDINATES */}

                    <div
                      style={{
                        marginTop:
                          "10px",
                        color:
                          "#94a3b8",
                        fontSize:
                          "9px",
                      }}
                    >
                      Center:
                      {" "}
                      {
                        zone.latitude
                      }
                      {" , "}
                      {
                        zone.longitude
                      }
                    </div>

                  </div>
                );
              }
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
      style={{
        background:
          "#ffffff",
        borderRadius:
          "10px",
        padding:
          "15px",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.1)",
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
          letterSpacing:
            "0.5px",
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

      <div
        style={{
          marginTop:
            "4px",
          color:
            "#94a3b8",
          fontSize:
            "10px",
        }}
      >
        {description}
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
      style={{
        background:
          "#f8fafc",
        border:
          "1px solid #e5e7eb",
        borderRadius:
          "7px",
        padding:
          "9px",
      }}
    >

      <div
        style={{
          color:
            "#64748b",
          fontSize:
            "8px",
          fontWeight:
            "700",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop:
            "4px",
          color:
            "#111827",
          fontSize:
            "15px",
          fontWeight:
            "700",
        }}
      >
        {value}
      </div>

    </div>
  );
};

export default ZoneIntelligenceDashboard;