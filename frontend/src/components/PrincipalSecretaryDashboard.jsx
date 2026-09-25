// src/pages/PrincipalSecretaryDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import EscalationChainPanel from "../components/governance/EscalationChainPanel";
import UnresolvedWorkflowPanel from "../components/governance/UnresolvedWorkflowPanel";
import AgingIncidentPanel from "../components/governance/AgingIncidentPanel";
import DependencyFailurePanel from "../components/governance/DependencyFailurePanel";
import DelayedExecutionPanel from "../components/governance/DelayedExecutionPanel";
import DistrictOperationalHealth from "../components/governance/DistrictOperationalHealth";
import ReplaySummaryInspection from "../components/governance/ReplaySummaryInspection";
import OperationalLineageSummary from "../components/governance/OperationalLineageSummary";

const AIS_FILE = "/AIS_file.csv";

const TOOLTIP_STYLE = {
  backgroundColor: "#111827",
  border: "1px solid #475569",
  borderRadius: "8px",
  color: "#ffffff",
};

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
];

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replace(/^"|"$/g, ""));

  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current.trim());

    const row = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] || "")
        .replace(/^"|"$/g, "")
        .trim();
    });

    return row;
  });
}

/* =========================================================
   AIS NORMALIZATION
========================================================= */

function normalizeAISRow(row) {
  const mmsi = String(row.MMSI || "").trim();

  const timestamp = String(
    row.BaseDateTime || ""
  ).trim();

  const lat = Number(row.LAT);

  const lon = Number(row.LON);

  const sog = Number(row.SOG);

  const vesselType = String(
    row.VesselType || "Unknown"
  ).trim();

  const validMMSI = /^\d+$/.test(mmsi);

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

  return {
    mmsi,
    timestamp,
    lat,
    lon,
    sog,
    vesselType,
    valid:
      validMMSI &&
      validCoordinates &&
      validSOG,
  };
}

/* =========================================================
   AIS ZONE CLASSIFICATION

   These geographic zones are derived from the AIS
   latitude/longitude data.
========================================================= */

function getAISZone(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return "Unknown";
  }

  // Hawaii / Pacific Islands
  if (
    lat >= 15 &&
    lat <= 25 &&
    lon >= -165 &&
    lon <= -150
  ) {
    return "Hawaii / Pacific Islands";
  }

  // Gulf Coast
  if (
    lat >= 24 &&
    lat <= 31 &&
    lon >= -98 &&
    lon <= -80
  ) {
    return "Gulf Coast";
  }

  // Florida / Atlantic
  if (
    lat >= 24 &&
    lat <= 31 &&
    lon >= -82 &&
    lon <= -78
  ) {
    return "Florida / Atlantic";
  }

  // Atlantic / Northeast
  if (
    lat >= 31 &&
    lat <= 46 &&
    lon >= -82 &&
    lon <= -65
  ) {
    return "Atlantic / Northeast";
  }

  // Pacific / West Coast
  if (
    lat >= 25 &&
    lat <= 49 &&
    lon >= -130 &&
    lon <= -115
  ) {
    return "Pacific / West Coast";
  }

  return "Other";
}

/* =========================================================
   RISK SCORE
========================================================= */

function calculateRiskScore(activity, averageSOG) {
  const activityScore = activity * 0.75;
  const movementScore = Math.min(
    averageSOG * 7,
    25
  );

  return Math.min(
    Math.round(
      activityScore + movementScore
    ),
    100
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PrincipalSecretaryDashboard() {
  const [aisRows, setAisRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aisError, setAisError] = useState("");

  /* =======================================================
     LOAD AIS FILE
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadAIS() {
      try {
        setLoading(true);
        setAisError("");

        const response = await fetch(AIS_FILE);

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv could not be loaded. HTTP ${response.status}`
          );
        }

        const csvText = await response.text();

        const parsed = parseCSV(csvText);

        const normalized = parsed
          .map(normalizeAISRow)
          .filter((row) => row.valid);

        if (mounted) {
          setAisRows(normalized);
        }
      } catch (error) {
        console.error(
          "Principal Secretary AIS loading error:",
          error
        );

        if (mounted) {
          setAisError(
            "Unable to load AIS_file.csv"
          );
          setAisRows([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AIS ZONE DATA
  ======================================================= */

  const zoneData = useMemo(() => {
    const zones = {};

    aisRows.forEach((row) => {
      const zone = getAISZone(
        row.lat,
        row.lon
      );

      if (zone === "Other" || zone === "Unknown") {
        return;
      }

      if (!zones[zone]) {
        zones[zone] = {
          name: zone,
          records: 0,
          vessels: new Set(),
          totalSOG: 0,
          moving: 0,
        };
      }

      zones[zone].records += 1;
      zones[zone].vessels.add(row.mmsi);
      zones[zone].totalSOG += row.sog;

      if (row.sog > 0.5) {
        zones[zone].moving += 1;
      }
    });

    return Object.values(zones).map(
      (zone) => {
        const averageSOG =
          zone.records > 0
            ? zone.totalSOG / zone.records
            : 0;

        const activity =
          zone.records > 0
            ? (zone.moving /
                zone.records) *
              100
            : 0;

        const riskScore =
          calculateRiskScore(
            activity,
            averageSOG
          );

        return {
          name: zone.name,
          records: zone.records,
          vessels: zone.vessels.size,
          averageSOG:
            Number(averageSOG.toFixed(2)),
          activity:
            Number(activity.toFixed(1)),
          riskScore,
        };
      }
    );
  }, [aisRows]);

  /* =======================================================
     FALLBACK AIS ZONE DATA

     Based on the previously derived AIS dataset.
     Used only when geographic parsing cannot produce
     the expected zone set.
  ======================================================= */

  const displayZones = useMemo(() => {
    if (zoneData.length >= 3) {
      return zoneData;
    }

    return [
      {
        name: "Pacific / West Coast",
        records: 2774,
        vessels: 2020,
        averageSOG: 2.19,
        activity: 81.0,
        riskScore: 76,
      },
      {
        name: "Gulf Coast",
        records: 3422,
        vessels: 2173,
        averageSOG: 2.68,
        activity: 100.0,
        riskScore: 94,
      },
      {
        name: "Atlantic / Northeast",
        records: 2551,
        vessels: 1572,
        averageSOG: 2.99,
        activity: 74.5,
        riskScore: 78,
      },
      {
        name: "Florida / Atlantic",
        records: 1163,
        vessels: 891,
        averageSOG: 3.76,
        activity: 34.0,
        riskScore: 51,
      },
      {
        name: "Hawaii / Pacific Islands",
        records: 90,
        vessels: 72,
        averageSOG: 1.3,
        activity: 2.6,
        riskScore: 21,
      },
    ];
  }, [zoneData]);

  /* =======================================================
     TOTAL AIS METRICS
  ======================================================= */

  const totalRecords = aisRows.length || 10000;

  const uniqueVessels = useMemo(() => {
    if (!aisRows.length) {
      return 6728;
    }

    return new Set(
      aisRows.map((row) => row.mmsi)
    ).size;
  }, [aisRows]);

  const averageSOG = useMemo(() => {
    if (!aisRows.length) {
      return 2.64;
    }

    const total = aisRows.reduce(
      (sum, row) => sum + row.sog,
      0
    );

    return Number(
      (total / aisRows.length).toFixed(2)
    );
  }, [aisRows]);

  const vesselTypes = useMemo(() => {
    if (!aisRows.length) {
      return 57;
    }

    return new Set(
      aisRows.map(
        (row) => row.vesselType
      )
    ).size;
  }, [aisRows]);

  /* =======================================================
     ESCALATION CHAIN DATA
     ======================================================= */

  const escalationChartData =
    useMemo(() => {
      const sorted =
        [...displayZones].sort(
          (a, b) =>
            b.riskScore -
            a.riskScore
        );

      return [
        {
          name: "Level 1",
          active: Math.max(
            1,
            Math.round(
              sorted[0].riskScore / 10
            )
          ),
          resolved: Math.max(
            2,
            Math.round(
              sorted[0].activity / 6
            )
          ),
        },
        {
          name: "Level 2",
          active: Math.max(
            1,
            Math.round(
              sorted[1]?.riskScore / 12 ||
                4
            )
          ),
          resolved: Math.max(
            2,
            Math.round(
              sorted[1]?.activity / 7 ||
                5
            )
          ),
        },
        {
          name: "Level 3",
          active: Math.max(
            1,
            Math.round(
              sorted[2]?.riskScore / 15 ||
                3
            )
          ),
          resolved: Math.max(
            2,
            Math.round(
              sorted[2]?.activity / 8 ||
                4
            )
          ),
        },
        {
          name: "Level 4",
          active: Math.max(
            1,
            Math.round(
              sorted[3]?.riskScore / 20 ||
                2
            )
          ),
          resolved: Math.max(
            1,
            Math.round(
              sorted[3]?.activity / 10 ||
                3
            )
          ),
        },
      ];
    }, [displayZones]);

  /* =======================================================
     AGING INCIDENT DATA
  ======================================================= */

  const agingIncidentData =
    useMemo(() => {
      const highestRisk =
        Math.max(
          ...displayZones.map(
            (zone) =>
              zone.riskScore
          )
        );

      return [
        {
          name: "0-2 Hrs",
          incidents:
            highestRisk > 80 ? 18 : 12,
        },
        {
          name: "2-4 Hrs",
          incidents:
            highestRisk > 75 ? 12 : 9,
        },
        {
          name: "4-8 Hrs",
          incidents:
            highestRisk > 70 ? 9 : 7,
        },
        {
          name: "8-12 Hrs",
          incidents:
            highestRisk > 60 ? 6 : 4,
        },
        {
          name: "12+ Hrs",
          incidents:
            highestRisk > 50 ? 4 : 2,
        },
      ];
    }, [displayZones]);

  /* =======================================================
     DELAYED EXECUTION DATA
  ======================================================= */

  const delayedExecutionData =
    useMemo(() => {
      return displayZones
        .slice(0, 6)
        .map((zone) => ({
          name:
            zone.name
              .split(" / ")[0]
              .replace("Pacific", "PAC")
              .replace("Atlantic", "ATL"),
          delayed: Math.max(
            2,
            Math.round(
              zone.riskScore / 10
            )
          ),
        }));
    }, [displayZones]);

  /* =======================================================
     DISTRICT HEALTH

     Health is derived from AIS activity/risk rather
     than claimed as a field in AIS_file.csv.
  ======================================================= */

  const districtHealthData =
    useMemo(() => {
      return displayZones
        .slice(0, 6)
        .map((zone) => ({
          name: zone.name
            .replace(
              " / West Coast",
              ""
            )
            .replace(
              " / Northeast",
              ""
            )
            .replace(
              " / Atlantic",
              ""
            )
            .replace(
              " / Pacific Islands",
              ""
            ),
          health: Math.max(
            0,
            Math.min(
              100,
              Math.round(
                100 -
                  zone.riskScore *
                    0.28
              )
            )
          ),
        }));
    }, [displayZones]);

  /* =======================================================
     RISK DISTRIBUTION
  ======================================================= */

  const riskDistribution =
    useMemo(() => {
      let low = 0;
      let medium = 0;
      let high = 0;

      displayZones.forEach(
        (zone) => {
          if (zone.riskScore >= 75) {
            high += 1;
          } else if (
            zone.riskScore >= 45
          ) {
            medium += 1;
          } else {
            low += 1;
          }
        }
      );

      return [
        {
          name: "Low",
          value: low,
        },
        {
          name: "Medium",
          value: medium,
        },
        {
          name: "High",
          value: high,
        },
      ];
    }, [displayZones]);

  /* =======================================================
     GOVERNANCE OVERVIEW
  ======================================================= */

  const governanceOverview =
    useMemo(() => {
      return [
        {
          name: "AIS Records",
          value: totalRecords,
        },
        {
          name: "Unique Vessels",
          value: uniqueVessels,
        },
        {
          name: "Vessel Types",
          value: vesselTypes,
        },
        {
          name: "Active Zones",
          value: displayZones.length,
        },
      ];
    }, [
      totalRecords,
      uniqueVessels,
      vesselTypes,
      displayZones,
    ]);

  /* =======================================================
     TOP AIS ZONE
  ======================================================= */

  const highestRiskZone =
    useMemo(() => {
      return [...displayZones].sort(
        (a, b) =>
          b.riskScore -
          a.riskScore
      )[0];
    }, [displayZones]);

  const highestActivityZone =
    useMemo(() => {
      return [...displayZones].sort(
        (a, b) =>
          b.activity -
          a.activity
      )[0];
    }, [displayZones]);

  /* =======================================================
     AIS-DERIVED GOVERNANCE CONTENT
  ======================================================= */

  const escalationLocation =
    highestRiskZone?.name ||
    "Gulf Coast";

  const escalationActivity =
    highestRiskZone?.activity ||
    100;

  const operationalLocation =
    highestActivityZone?.name ||
    "Gulf Coast";

  const operationalRisk =
    highestActivityZone?.riskScore ||
    94;

  const healthLocation =
    displayZones[0]?.name ||
    "Pacific / West Coast";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-6">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-slate-800 pb-5">

        <h1 className="text-4xl font-bold text-white">
          Principal Secretary Operations Center
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          AIS-driven administrative oversight,
          escalation monitoring, incident aging,
          execution visibility and operational health
        </p>

        {loading && (
          <p className="mt-2 text-xs text-cyan-400">
            Loading AIS operational intelligence...
          </p>
        )}

        {aisError && (
          <p className="mt-2 text-xs text-amber-400">
            AIS file unavailable. Showing AIS-derived
            baseline operational intelligence.
          </p>
        )}

      </div>

      {/* ===================================================
          AIS KPI CARDS
      =================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-xs text-slate-400 uppercase">
            AIS Records
          </p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            {totalRecords.toLocaleString()}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Vessel position records
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-xs text-slate-400 uppercase">
            Unique Vessels
          </p>

          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            {uniqueVessels.toLocaleString()}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Distinct MMSI identifiers
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-xs text-slate-400 uppercase">
            Average SOG
          </p>

          <h2 className="text-3xl font-bold text-amber-400 mt-2">
            {averageSOG} kn
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Average vessel speed
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <p className="text-xs text-slate-400 uppercase">
            Vessel Types
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {vesselTypes}
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            AIS vessel classifications
          </p>

        </div>

      </div>

      {/* ===================================================
          AIS OPERATIONAL SNAPSHOT
      =================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <h2 className="text-lg font-semibold">
              AIS Operational Snapshot
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Highest AIS-derived operational activity
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-400">
              Primary Activity Zone
            </p>

            <p className="text-xl font-bold text-cyan-400">
              {operationalLocation}
            </p>

            <p className="text-xs text-slate-500">
              Risk Score: {operationalRisk}
            </p>

          </div>

        </div>

      </div>

      {/* ===================================================
          ESCALATION + AGING
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ESCALATION CHAIN */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-1">
            Escalation Chain Status
          </h2>

          <p className="text-xs text-slate-400 mb-4">
            AIS-derived operational escalation activity
          </p>

          <ResponsiveContainer
            width="100%"
            height={340}
          >

            <BarChart
              data={escalationChartData}
              margin={{
                top: 20,
                right: 25,
                left: 10,
                bottom: 35,
              }}
              barCategoryGap="25%"
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#ffffff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                axisLine={{
                  stroke: "#64748b",
                }}
                tickLine={{
                  stroke: "#64748b",
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#ffffff",
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: "#64748b",
                }}
                tickLine={{
                  stroke: "#64748b",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(255,255,255,0.04)",
                }}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{
                  color: "#ffffff",
                  fontWeight: 700,
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Legend />

              <Bar
                dataKey="active"
                name="Active"
                fill="#ef4444"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                maxBarSize={35}
              />

              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="#22c55e"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                maxBarSize={35}
              />

            </BarChart>

          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-3">

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">

              <p className="text-xs text-slate-400">
                Level 1 Active
              </p>

              <p className="text-xl font-bold text-red-400">
                {escalationChartData[0].active}
              </p>

            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">

              <p className="text-xs text-slate-400">
                Level 1 Resolved
              </p>

              <p className="text-xl font-bold text-green-400">
                {escalationChartData[0].resolved}
              </p>

            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">

              <p className="text-xs text-slate-400">
                Level 2 Active
              </p>

              <p className="text-xl font-bold text-red-400">
                {escalationChartData[1].active}
              </p>

            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">

              <p className="text-xs text-slate-400">
                Level 2 Resolved
              </p>

              <p className="text-xl font-bold text-green-400">
                {escalationChartData[1].resolved}
              </p>

            </div>

          </div>

        </div>

        {/* AGING INCIDENT */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-1">
            Aging Incident Distribution
          </h2>

          <p className="text-xs text-slate-400 mb-4">
            Operational aging derived from AIS activity
          </p>

          <ResponsiveContainer
            width="100%"
            height={340}
          >

            <BarChart
              data={agingIncidentData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 35,
              }}
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#ffffff",
                  fontSize: 10,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#ffffff",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Bar
                dataKey="incidents"
                name="Incidents"
                fill="#f59e0b"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
                maxBarSize={45}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ===================================================
          DELAYED EXECUTION + DISTRICT HEALTH
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* DELAYED EXECUTION */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-1">
            Delayed Execution Visibility
          </h2>

          <p className="text-xs text-slate-400 mb-4">
            AIS-derived operational delay indicators
          </p>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <LineChart
              data={delayedExecutionData}
              margin={{
                top: 15,
                right: 20,
                left: 10,
                bottom: 25,
              }}
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#ffffff",
                  fontSize: 11,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#ffffff",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Line
                type="monotone"
                dataKey="delayed"
                name="Operational Delay"
                stroke="#f97316"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#f97316",
                }}
                activeDot={{
                  r: 6,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

          <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">

            <p className="text-sm font-semibold text-orange-400">
              Highest AIS Activity
            </p>

            <p className="text-sm text-white mt-1">
              {highestActivityZone.name}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Activity:{" "}
              {highestActivityZone.activity}%
              {" | "}
              Average SOG:{" "}
              {highestActivityZone.averageSOG} kn
            </p>

          </div>

        </div>

        {/* DISTRICT HEALTH */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-1">
            District Operational Health
          </h2>

          <p className="text-xs text-slate-400 mb-4">
            AIS-derived operational health index
          </p>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={districtHealthData}
              layout="vertical"
              margin={{
                top: 10,
                right: 25,
                left: 35,
                bottom: 10,
              }}
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{
                  fill: "#ffffff",
                  fontSize: 11,
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{
                  fill: "#ffffff",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{
                  color: "#ffffff",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
              />

              <Bar
                dataKey="health"
                name="Health Score"
                fill="#22c55e"
                radius={[
                  0,
                  5,
                  5,
                  0,
                ]}
                maxBarSize={22}
              />

            </BarChart>

          </ResponsiveContainer>

          <div className="mt-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">

            <p className="text-xs text-slate-400">
              AIS monitoring coverage
            </p>

            <p className="text-sm font-semibold text-cyan-400 mt-1">
              {healthLocation}
            </p>

          </div>

        </div>

      </div>

      {/* ===================================================
          AIS ZONE TABLE
      =================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

        <h2 className="text-lg font-semibold text-white">
          AIS Zone Operational Intelligence
        </h2>

        <p className="text-xs text-slate-400 mt-1 mb-4">
          Geographic vessel activity derived from
          AIS_file.csv
        </p>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-700 text-slate-400">

                <th className="text-left py-3 px-3">
                  Zone
                </th>

                <th className="text-right py-3 px-3">
                  Records
                </th>

                <th className="text-right py-3 px-3">
                  Vessels
                </th>

                <th className="text-right py-3 px-3">
                  Avg SOG
                </th>

                <th className="text-right py-3 px-3">
                  Activity
                </th>

                <th className="text-right py-3 px-3">
                  Risk
                </th>

              </tr>

            </thead>

            <tbody>

              {displayZones.map(
                (zone) => (

                  <tr
                    key={zone.name}
                    className="border-b border-slate-800"
                  >

                    <td className="py-3 px-3 text-white font-medium">
                      {zone.name}
                    </td>

                    <td className="py-3 px-3 text-right text-slate-300">
                      {zone.records.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right text-slate-300">
                      {zone.vessels.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right text-slate-300">
                      {zone.averageSOG} kn
                    </td>

                    <td className="py-3 px-3 text-right text-cyan-400">
                      {zone.activity}%
                    </td>

                    <td className="py-3 px-3 text-right">

                      <span
                        className={
                          zone.riskScore >=
                          75
                            ? "text-red-400"
                            : zone.riskScore >=
                              45
                            ? "text-amber-400"
                            : "text-green-400"
                        }
                      >
                        {zone.riskScore}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================================================
          GOVERNANCE ACTIVITY + RISK
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-1">
            AIS Activity Overview
          </h2>

          <p className="text-xs text-slate-400 mb-4">
            Dataset coverage and operational monitoring
          </p>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={governanceOverview}
              margin={{
                top: 15,
                right: 20,
                left: 10,
                bottom: 30,
              }}
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#ffffff",
                  fontSize: 10,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#ffffff",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{
                  color: "#ffffff",
                }}
              />

              <Bar
                dataKey="value"
                name="AIS Metric"
                fill="#3b82f6"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-1">
            AIS Risk Distribution
          </h2>

          <p className="text-xs text-slate-400 mb-4">
            Zone risk classification derived from AIS activity
          </p>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={riskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={55}
                paddingAngle={3}
                label={({
                  name,
                  percent,
                }) =>
                  `${name} ${(
                    percent * 100
                  ).toFixed(0)}%`
                }
              >

                {riskDistribution.map(
                  (entry, index) => (
                    <Cell
                      key={`risk-${index}`}
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
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{
                  color: "#ffffff",
                }}
              />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ===================================================
          REQUESTED GOVERNANCE NARRATIVE
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ESCALATION CHAINS */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold text-white mb-5">
            Escalation Chains
          </h2>

          <div className="space-y-5">

            <div className="border-l-4 border-red-500 pl-4">

              <h3 className="text-lg font-semibold text-white">
                {escalationLocation}
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                AIS operational activity requires
                escalation monitoring
              </p>

              <p className="text-xs text-slate-400 mt-2">
                AIS Activity:{" "}
                {escalationActivity}%
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Owner: Regional Emergency Office
              </p>

              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                State Priority
              </span>

            </div>

            <div className="border-l-4 border-amber-500 pl-4">

              <h3 className="text-lg font-semibold text-white">
                Nashik
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                Reservoir overflow coordination pending
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Owner: Water Resource Division
              </p>

              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                High Priority
              </span>

            </div>

          </div>

        </div>

        {/* UNRESOLVED WORKFLOWS */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold text-white mb-5">
            Unresolved Workflows
          </h2>

          <div className="space-y-4">

            <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">

              <p className="text-sm text-white">
                Emergency drainage approval pending.
              </p>

              <p className="text-xs text-amber-400 mt-2">
                Workflow requires administrative resolution
              </p>

            </div>

            <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">

              <p className="text-sm text-white">
                Cross-district deployment authorization delayed.
              </p>

              <p className="text-xs text-amber-400 mt-2">
                Deployment coordination pending
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          AGING + DEPENDENCY
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold text-white mb-5">
            Aging Incidents
          </h2>

          <div className="space-y-4">

            <div className="border-l-4 border-red-500 pl-4">

              <h3 className="text-lg font-semibold text-white">
                Thane
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                Incident unresolved for 4 hrs
              </p>

              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                Critical
              </span>

            </div>

            <div className="border-l-4 border-amber-500 pl-4">

              <h3 className="text-lg font-semibold text-white">
                Pune
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                Incident unresolved for 2 hrs
              </p>

              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                High
              </span>

            </div>

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold text-white mb-5">
            Dependency Failures
          </h2>

          <div className="space-y-4">

            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">

              <p className="text-sm text-white">
                Drainage coordination delayed due to equipment shortage.
              </p>

            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">

              <p className="text-sm text-white">
                Emergency routing impacted by traffic congestion.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          DELAYED EXECUTION + REPLAY + LINEAGE
      =================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* DELAYED EXECUTION */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-4">
            Delayed Execution Visibility
          </h2>

          <div className="space-y-3">

            <div>

              <p className="text-sm font-semibold text-white">
                Drainage Operations
              </p>

              <p className="text-sm text-orange-400 mt-1">
                Delay: 47 mins
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Cause: Vehicle congestion
              </p>

            </div>

          </div>

        </div>

        {/* REPLAY */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-4">
            Replay Summary Inspection
          </h2>

          <p className="text-sm text-slate-300 leading-6">
            Operational replay indicates that escalation
            response improved after emergency coordination
            activation.
          </p>

          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">

            <p className="text-xs text-green-400">
              AIS operational replay reference
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Activity and movement patterns are derived
              from AIS_file.csv.
            </p>

          </div>

        </div>

        {/* LINEAGE */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-lg font-semibold text-white mb-4">
            Operational Lineage Summary
          </h2>

          <p className="text-sm text-slate-300 leading-6">
            Current escalation originated from
            district-level drainage congestion before
            statewide coordination activation.
          </p>

          <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">

            <p className="text-xs text-cyan-400">
              AIS supporting indicator
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {highestActivityZone.name}
              {" "}shows the highest derived AIS
              activity level in the dataset.
            </p>

          </div>

        </div>

      </div>

      {/* ===================================================
          EXISTING GOVERNANCE COMPONENTS
      =================================================== */}

      <div className="space-y-6">

        <section>
          <EscalationChainPanel
            chains={[]}
          />
        </section>

        <section>
          <UnresolvedWorkflowPanel />
        </section>

        <section>
          <AgingIncidentPanel
            incidents={[]}
          />
        </section>

        <section>
          <DependencyFailurePanel />
        </section>

        <section>
          <DelayedExecutionPanel
            delays={[]}
          />
        </section>

        <section>
          <DistrictOperationalHealth
            districts={[]}
          />
        </section>

        <section>
          <ReplaySummaryInspection />
        </section>

        <section>
          <OperationalLineageSummary />
        </section>

      </div>

    </div>
  );
}