import React, { useEffect, useMemo, useState } from "react";

import RuntimeCards from "../components/RuntimeCards";
import RuntimeLogsTask27 from "../components/RuntimeLogsTask27";
import RuntimeStatus from "../components/RuntimeStatus";
import RuntimeFlow from "../components/RuntimeFlow";
import SignalChart from "../components/SignalChart";
import IncidentChart from "../components/IncidentChart";

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   CSV PARSER
========================================================= */

const parseCSVLine = (line) => {
  const values = [];

  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());

  return values;
};

const parseCSV = (text) => {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header
      .replace(/^"|"$/g, "")
      .trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
};

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (row, names) => {
  const keys = Object.keys(row || {});

  const normalizedNames = names.map((name) =>
    String(name).toLowerCase().trim()
  );

  const matchedKey = keys.find((key) =>
    normalizedNames.includes(
      String(key).toLowerCase().trim()
    )
  );

  return matchedKey ? row[matchedKey] : "";
};

/* =========================================================
   NORMALIZE AIS
========================================================= */

const normalizeAIS = (rows) => {
  return rows.map((row, index) => {
    const mmsi = String(
      getField(row, [
        "MMSI",
        "mmsi",
        "Mmsi",
        "vessel_id",
        "vesselId",
      ]) || ""
    ).trim();

    const sog = Number(
      getField(row, [
        "SOG",
        "sog",
        "Speed",
        "speed",
      ])
    );

    const lat = Number(
      getField(row, [
        "LAT",
        "lat",
        "Latitude",
        "latitude",
      ])
    );

    const lon = Number(
      getField(row, [
        "LON",
        "lon",
        "Longitude",
        "longitude",
      ])
    );

    return {
      id: mmsi || `AIS-${index + 1}`,

      mmsi,

      sog,

      lat,

      lon,

      moving:
        Number.isFinite(sog) &&
        sog > 0,

      validCoordinates:
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180,

      validSpeed:
        Number.isFinite(sog) &&
        sog >= 0,
    };
  });
};

/* =========================================================
   COMPONENT
========================================================= */

export default function RuntimeTask27() {
  const [aisData, setAISData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadAIS = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${AIS_FILE}?t=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv returned HTTP ${response.status}`
          );
        }

        const csvText = await response.text();

        const parsed = parseCSV(csvText);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv contains no records."
          );
        }

        const normalized = normalizeAIS(parsed);

        if (mounted) {
          setAISData(normalized);
        }

      } catch (err) {
        console.error(
          "Task 27 AIS Error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load AIS runtime data."
          );
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAIS();

    const interval = setInterval(
      loadAIS,
      30000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     AIS METRICS
  ======================================================= */

  const metrics = useMemo(() => {
    if (!aisData.length) {
      return {
        records: 0,
        vessels: 0,
        moving: 0,
        movingPercentage: 0,
        valid: 0,
        invalid: 0,
        quality: 0,
        avgSpeed: 0,
      };
    }

    const vessels = new Set(
      aisData
        .map((row) => row.mmsi)
        .filter(Boolean)
    ).size;

    const moving = aisData.filter(
      (row) => row.moving
    ).length;

    const valid = aisData.filter(
      (row) =>
        row.validCoordinates &&
        row.validSpeed
    ).length;

    const invalid = aisData.length - valid;

    const quality = Math.round(
      (valid / aisData.length) * 100
    );

    const speedValues = aisData
      .map((row) => row.sog)
      .filter((value) =>
        Number.isFinite(value)
      );

    const avgSpeed =
      speedValues.length > 0
        ? speedValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / speedValues.length
        : 0;

    return {
      records: aisData.length,

      vessels,

      moving,

      movingPercentage:
        Math.round(
          (moving / aisData.length) *
            100
        ),

      valid,

      invalid,

      quality,

      avgSpeed: Number(
        avgSpeed.toFixed(2)
      ),
    };
  }, [aisData]);

  /* =======================================================
     SIGNAL DATA
  ======================================================= */

  const signalData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    return [
      {
        name: "Telemetry",
        value: Math.round(
          metrics.records / 1000
        ),
      },
      {
        name: "Vessel Monitoring",
        value: Math.round(
          metrics.vessels / 1000
        ),
      },
      {
        name: "Activity",
        value: Math.round(
          metrics.movingPercentage
        ),
      },
      {
        name: "Valid Data",
        value: Math.round(
          metrics.quality
        ),
      },
      {
        name: "Validation",
        value: metrics.invalid,
      },
    ];
  }, [aisData, metrics]);

  /* =======================================================
     INCIDENT DATA
  ======================================================= */

  const incidentData = useMemo(() => {
    if (!aisData.length) {
      return [];
    }

    const stationary = Math.max(
      metrics.records - metrics.moving,
      0
    );

    const invalid = metrics.invalid;

    const lowQuality = Math.max(
      100 - metrics.quality,
      0
    );

    return [
      {
        name: "Moving Activity",
        value: metrics.moving,
      },
      {
        name: "Stationary Activity",
        value: stationary,
      },
      {
        name: "Validation Issues",
        value: invalid,
      },
      {
        name: "Quality Risk",
        value: lowQuality,
      },
    ];
  }, [aisData, metrics]);

  /* =======================================================
     RUNTIME STATUS DATA
  ======================================================= */

  const runtimeStatus = useMemo(() => {
    if (!aisData.length) {
      return "NO DATA";
    }

    if (metrics.quality >= 90) {
      return "HEALTHY";
    }

    if (metrics.quality >= 70) {
      return "DEGRADED";
    }

    return "WARNING";
  }, [aisData, metrics]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="runtime-page"
        style={{
          padding: "30px",
          color: "#ffffff",
        }}
      >
        <h1>
          UCCIS Runtime Monitoring Center
        </h1>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Loading AIS runtime telemetry...
        </p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="runtime-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >

        <div>
          <h1>
            UCCIS Runtime Monitoring Center
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "5px",
              fontSize: "13px",
            }}
          >
            Runtime operations • AIS telemetry •
            Incident monitoring
          </p>
        </div>

        {/* AIS STATUS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "8px",
            background:
              "rgba(15,23,42,.85)",
            border:
              "1px solid rgba(56,189,248,.3)",
            color: "#cbd5e1",
            fontSize: "12px",
          }}
        >

          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                aisData.length > 0
                  ? "#22c55e"
                  : "#ef4444",
            }}
          />

          {aisData.length > 0
            ? "AIS DATA LIVE"
            : "AIS DATA UNAVAILABLE"}

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: "20px",
            borderRadius: "8px",
            background:
              "rgba(245,158,11,.08)",
            border:
              "1px solid rgba(245,158,11,.3)",
            color: "#fbbf24",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          RUNTIME CARDS

          Values are passed so the child component can use
          real AIS metrics.
      ================================================= */}

      <RuntimeCards
        totalSignals={metrics.records}
        activeSystems={metrics.vessels}
        movingRecords={metrics.moving}
        dataQuality={metrics.quality}
        averageSpeed={metrics.avgSpeed}
      />

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="runtime-charts">

        <SignalChart
          data={signalData}
        />

        <IncidentChart
          data={incidentData}
        />

      </div>

      {/* =================================================
          RUNTIME STATUS
      ================================================= */}

      <RuntimeStatus
        status={runtimeStatus}
        dataQuality={metrics.quality}
        movingPercentage={
          metrics.movingPercentage
        }
      />

      {/* =================================================
          RUNTIME FLOW
      ================================================= */}

      <RuntimeFlow />

      {/* =================================================
          RUNTIME LOGS
      ================================================= */}

      <RuntimeLogsTask27
        aisData={aisData}
        metrics={metrics}
      />

    </div>
  );
}