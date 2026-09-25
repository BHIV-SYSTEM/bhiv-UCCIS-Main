import React, { useEffect, useMemo, useState } from "react";

const AIS_FILE = "/AIS_file.csv";

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
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
}

function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header.replace(/^"|"$/g, "").trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] =
        values[index] !== undefined
          ? values[index].replace(/^"|"$/g, "").trim()
          : "";
    });

    return row;
  });
}

/* =========================================================
   NUMBER HELPER
========================================================= */

function number(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

/* =========================================================
   AIS METRICS
========================================================= */

function calculateAISMetrics(records) {
  const vessels = new Set();
  const vesselTypes = new Set();

  let totalSOG = 0;
  let moving = 0;

  records.forEach((record) => {
    if (record.MMSI) {
      vessels.add(String(record.MMSI));
    }

    if (record.VesselType) {
      vesselTypes.add(String(record.VesselType));
    }

    const sog = number(record.SOG);

    totalSOG += sog;

    if (sog > 0) {
      moving++;
    }
  });

  const totalRecords = records.length;

  const averageSOG =
    totalRecords > 0
      ? totalSOG / totalRecords
      : 0;

  const movingPercentage =
    totalRecords > 0
      ? (moving / totalRecords) * 100
      : 0;

  /*
   * AIS operational score.
   * This is calculated from the available AIS data.
   */

  const activityScore =
    Math.min(movingPercentage, 100) * 0.7;

  const speedScore =
    Math.min(averageSOG / 10, 1) * 30;

  const riskScore = Number(
    (activityScore + speedScore).toFixed(1)
  );

  let riskLevel = "LOW";

  if (riskScore > 70) {
    riskLevel = "HIGH";
  } else if (riskScore >= 40) {
    riskLevel = "MEDIUM";
  }

  return {
    totalRecords,
    uniqueVessels: vessels.size,
    vesselTypes: vesselTypes.size,
    averageSOG: Number(averageSOG.toFixed(2)),
    movingPercentage: Number(
      movingPercentage.toFixed(1)
    ),
    riskScore,
    riskLevel,
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MinisterDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD AIS CSV
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadAIS() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(AIS_FILE);

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv could not be loaded. HTTP ${response.status}`
          );
        }

        const text = await response.text();

        const parsed = parseCSV(text);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv contains no valid records."
          );
        }

        if (active) {
          setRecords(parsed);
        }
      } catch (err) {
        console.error("AIS loading error:", err);

        if (active) {
          setError(
            err.message || "Unable to load AIS data."
          );
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAIS();

    return () => {
      active = false;
    };
  }, []);

  /* =======================================================
     METRICS
  ======================================================= */

  const metrics = useMemo(() => {
    return calculateAISMetrics(records);
  }, [records]);

  /* =======================================================
     RISK COLOR
  ======================================================= */

  const riskColor =
    metrics.riskLevel === "HIGH"
      ? "#dc2626"
      : metrics.riskLevel === "MEDIUM"
      ? "#f59e0b"
      : "#16a34a";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "32px",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#000000",
      }}
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <h1
        style={{
          fontSize: "54px",
          fontWeight: 700,
          color: "#000000",
          marginBottom: "10px",
        }}
      >
        Ministerial Operations Dashboard
      </h1>

      <p
        style={{
          color: "#4b5563",
          fontSize: "17px",
          marginBottom: "30px",
        }}
      >
        Executive operational intelligence powered by AIS
        telemetry
      </p>

      {/* ===================================================
          AIS ERROR
      =================================================== */}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <strong>AIS Data Error</strong>

          <div style={{ marginTop: "5px" }}>
            {error}
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "12px",
            }}
          >
            Make sure the file is here:
            <strong> frontend/public/AIS_file.csv</strong>
          </div>
        </div>
      )}

      {/* ===================================================
          CRITICAL ALERT
      =================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "22px",
          padding: "32px",
          boxShadow:
            "0 8px 24px rgba(0,0,0,.12)",
          border: "1px solid #e5e7eb",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Critical Flood Risk Escalation
          </h2>

          <div
            style={{
              background: "#dc2626",
              color: "#ffffff",
              padding: "12px 22px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Critical
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            lineHeight: "2.2",
            fontSize: "18px",
            color: "#000000",
          }}
        >
          <p>
            <strong>District:</strong> Thane West
          </p>

          <p>
            <strong>Operational Impact:</strong>{" "}
            Waterlogging expected across multiple sectors.
          </p>

          <p>
            <strong>Citizen Risk:</strong>{" "}
            Potential disruption to transport and emergency
            movement.
          </p>

          <p>
            <strong>Recommended Action:</strong>{" "}
            Mobilize drainage response teams immediately.
          </p>

          <p>
            <strong>Assigned Authority:</strong>{" "}
            District Control Office
          </p>
        </div>
      </div>

      {/* ===================================================
          AIS SUMMARY
      =================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          marginBottom: "32px",
        }}
      >
        {/* AIS RECORDS */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 5px 18px rgba(0,0,0,.08)",
          }}
        >
          <small
            style={{
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            AIS RECORDS
          </small>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginTop: "8px",
            }}
          >
            {loading
              ? "..."
              : metrics.totalRecords.toLocaleString()}
          </div>
        </div>

        {/* UNIQUE VESSELS */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 5px 18px rgba(0,0,0,.08)",
          }}
        >
          <small
            style={{
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            UNIQUE VESSELS
          </small>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginTop: "8px",
            }}
          >
            {loading
              ? "..."
              : metrics.uniqueVessels.toLocaleString()}
          </div>
        </div>

        {/* AVG SOG */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 5px 18px rgba(0,0,0,.08)",
          }}
        >
          <small
            style={{
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            AVERAGE SOG
          </small>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginTop: "8px",
            }}
          >
            {loading
              ? "..."
              : `${metrics.averageSOG} kn`}
          </div>
        </div>

        {/* MOVEMENT */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 5px 18px rgba(0,0,0,.08)",
          }}
        >
          <small
            style={{
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            MOVING VESSELS
          </small>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginTop: "8px",
            }}
          >
            {loading
              ? "..."
              : `${metrics.movingPercentage}%`}
          </div>
        </div>

        {/* RISK */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "22px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 5px 18px rgba(0,0,0,.08)",
          }}
        >
          <small
            style={{
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            AIS RISK SCORE
          </small>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginTop: "8px",
              color: riskColor,
            }}
          >
            {loading
              ? "..."
              : metrics.riskScore}
          </div>

          <small
            style={{
              color: riskColor,
              fontWeight: 700,
            }}
          >
            {loading ? "" : metrics.riskLevel}
          </small>
        </div>
      </div>

      {/* ===================================================
          AIS OPERATIONAL STATUS
      =================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "22px",
          padding: "32px",
          boxShadow:
            "0 8px 24px rgba(0,0,0,.12)",
          border: "1px solid #e5e7eb",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#000000",
            marginBottom: "24px",
          }}
        >
          AIS Operational Intelligence
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#000000",
                fontSize: "18px",
              }}
            >
              Operational Stability
            </h3>

            <p
              style={{
                color: "#374151",
                fontSize: "17px",
                lineHeight: 1.7,
              }}
            >
              AIS telemetry indicates{" "}
              <strong style={{ color: riskColor }}>
                {metrics.riskLevel.toLowerCase()}
              </strong>{" "}
              operational activity based on the calculated
              AIS risk score.
            </p>
          </div>

          <div>
            <h3
              style={{
                color: "#000000",
                fontSize: "18px",
              }}
            >
              Resource Pressure
            </h3>

            <p
              style={{
                color: "#374151",
                fontSize: "17px",
                lineHeight: 1.7,
              }}
            >
              {loading
                ? "Loading AIS telemetry..."
                : `${metrics.movingPercentage}% of AIS records show vessel movement, with an average SOG of ${metrics.averageSOG} knots.`}
            </p>
          </div>

          <div>
            <h3
              style={{
                color: "#000000",
                fontSize: "18px",
              }}
            >
              Governance Risks
            </h3>

            <p
              style={{
                color: "#374151",
                fontSize: "17px",
                lineHeight: 1.7,
              }}
            >
              Calculated AIS risk score:{" "}
              <strong style={{ color: riskColor }}>
                {loading ? "..." : metrics.riskScore}
              </strong>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          ORIGINAL DISTRICT OPERATIONAL STATUS
      =================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "22px",
          padding: "32px",
          boxShadow:
            "0 8px 24px rgba(0,0,0,.12)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#000000",
            marginBottom: "28px",
          }}
        >
          District Operational Status
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              Operational Stability
            </h3>

            <p
              style={{
                fontSize: "18px",
                color: "#374151",
              }}
            >
              Operationally stable with moderate traffic
              congestion.
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              Resource Pressure
            </h3>

            <p
              style={{
                fontSize: "18px",
                color: "#374151",
              }}
            >
              Drainage teams operating at 82% utilization.
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              Governance Risks
            </h3>

            <p
              style={{
                fontSize: "18px",
                color: "#374151",
              }}
            >
              Flood escalation risk increasing in eastern
              sectors.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          AIS DATA SOURCE
      =================================================== */}

      <div
        style={{
          marginTop: "25px",
          textAlign: "right",
          color: "#6b7280",
          fontSize: "12px",
        }}
      >
        Data source: <strong>AIS_file.csv</strong>
      </div>
    </div>
  );
}