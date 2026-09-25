import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

const AIS_FILE = "/AIS_file.csv";

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {
  const rows = [];

  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    /* -------------------------------------------------------
       QUOTED VALUE
    ------------------------------------------------------- */

    if (char === '"') {
      if (
        insideQuotes &&
        next === '"'
      ) {
        cell += '"';
        i++;
      } else {
        insideQuotes =
          !insideQuotes;
      }
    }

    /* -------------------------------------------------------
       COMMA
    ------------------------------------------------------- */

    else if (
      char === "," &&
      !insideQuotes
    ) {
      row.push(
        cell.trim()
      );

      cell = "";
    }

    /* -------------------------------------------------------
       NEW LINE
    ------------------------------------------------------- */

    else if (
      (char === "\n" ||
        char === "\r") &&
      !insideQuotes
    ) {
      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }

      row.push(
        cell.trim()
      );

      if (
        row.some(
          (value) =>
            value !== ""
        )
      ) {
        rows.push(row);
      }

      row = [];
      cell = "";
    }

    /* -------------------------------------------------------
       NORMAL CHARACTER
    ------------------------------------------------------- */

    else {
      cell += char;
    }
  }

  /* ---------------------------------------------------------
     LAST ROW
  --------------------------------------------------------- */

  if (
    cell !== "" ||
    row.length > 0
  ) {
    row.push(
      cell.trim()
    );

    if (
      row.some(
        (value) =>
          value !== ""
      )
    ) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    return [];
  }

  /* ---------------------------------------------------------
     HEADERS
  --------------------------------------------------------- */

  const headers =
    rows[0].map(
      (header) =>
        String(header)
          .trim()
          .replace(
            /^"|"$/g,
            ""
          )
    );

  /* ---------------------------------------------------------
     CREATE OBJECTS
  --------------------------------------------------------- */

  return rows
    .slice(1)
    .map((values) => {
      const record = {};

      headers.forEach(
        (header, index) => {
          record[header] =
            values[index] ??
            "";
        }
      );

      return record;
    });
}

/* =========================================================
   AIS FIELD HELPER
========================================================= */

function getAISField(
  row,
  names
) {
  for (const name of names) {
    if (
      row[name] !==
        undefined &&
      row[name] !== null &&
      String(
        row[name]
      ).trim() !== ""
    ) {
      return String(
        row[name]
      ).trim();
    }
  }

  return "";
}

/* =========================================================
   NORMALIZE AIS RECORD
========================================================= */

function normalizeAISRow(
  row,
  index
) {
  /* -------------------------------------------------------
     MMSI
  ------------------------------------------------------- */

  const mmsi =
    getAISField(row, [
      "MMSI",
      "mmsi",
      "Mmsi",
      "MMSI Number",
    ]);

  /* -------------------------------------------------------
     TIMESTAMP
  ------------------------------------------------------- */

  const timestamp =
    getAISField(row, [
      "BaseDateTime",
      "Base Date Time",
      "Timestamp",
      "timestamp",
      "DateTime",
      "datetime",
    ]);

  /* -------------------------------------------------------
     LATITUDE
  ------------------------------------------------------- */

  const latRaw =
    getAISField(row, [
      "LAT",
      "Lat",
      "Latitude",
      "latitude",
    ]);

  /* -------------------------------------------------------
     LONGITUDE
  ------------------------------------------------------- */

  const lonRaw =
    getAISField(row, [
      "LON",
      "Lon",
      "Longitude",
      "longitude",
    ]);

  /* -------------------------------------------------------
     SOG
  ------------------------------------------------------- */

  const sogRaw =
    getAISField(row, [
      "SOG",
      "Sog",
      "Speed",
      "speed",
      "Speed Over Ground",
    ]);

  /* -------------------------------------------------------
     VESSEL TYPE
  ------------------------------------------------------- */

  const vesselType =
    getAISField(row, [
      "VesselType",
      "Vessel Type",
      "vessel_type",
      "Type",
    ]);

  const lat =
    Number(latRaw);

  const lon =
    Number(lonRaw);

  const sog =
    Number(sogRaw);

  /* -------------------------------------------------------
     VALID COORDINATES
  ------------------------------------------------------- */

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  /* -------------------------------------------------------
     VALID SOG
  ------------------------------------------------------- */

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  /* -------------------------------------------------------
     VALID TELEMETRY
  ------------------------------------------------------- */

  const validTelemetry =
    validCoordinates &&
    validSOG;

  /* -------------------------------------------------------
     STATUS
  ------------------------------------------------------- */

  let status =
    "INVALID";

  if (validTelemetry) {
    if (sog > 0) {
      status = "MOVING";
    } else {
      status = "STATIONARY";
    }
  }

  /* -------------------------------------------------------
     EVIDENCE STATUS
     
     AIS itself does not contain an evidence-status field.
     Therefore this is a dashboard-derived classification.
  ------------------------------------------------------- */

  let evidenceStatus =
    "Archived";

  if (!validTelemetry) {
    evidenceStatus =
      "Archived";
  } else if (
    status === "STATIONARY"
  ) {
    evidenceStatus =
      "Pending";
  } else {
    evidenceStatus =
      "Verified";
  }

  return {
    id: index + 1,

    evidenceId:
      `AIS-EVD-${String(
        index + 1
      ).padStart(5, "0")}`,

    traceId:
      mmsi
        ? `AIS-TRACE-${mmsi}`
        : `AIS-TRACE-${index + 1}`,

    replayId:
      `AIS-REP-${String(
        index + 1
      ).padStart(5, "0")}`,

    mmsi:
      mmsi ||
      "Unknown",

    vesselType:
      vesselType ||
      "Unknown",

    timestamp:
      timestamp ||
      "",

    lat,
    lon,
    sog,

    validCoordinates,
    validSOG,
    validTelemetry,

    status,

    evidenceStatus,
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Evidence() {
  const [
    evidence,
    setEvidence,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     LOAD AIS DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadEvidence() {
      try {
        setLoading(true);
        setError("");

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
            `Failed to load AIS_file.csv (${response.status})`
          );
        }

        const csvText =
          await response.text();

        const parsedRows =
          parseCSV(
            csvText
          );

        const normalizedRows =
          parsedRows.map(
            (
              row,
              index
            ) =>
              normalizeAISRow(
                row,
                index
              )
          );

        if (mounted) {
          setEvidence(
            normalizedRows
          );
        }
      } catch (err) {
        console.error(
          "AIS Evidence Error:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Failed to load AIS evidence"
          );

          setEvidence([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEvidence();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     METRICS
  ======================================================= */

  const totalEvidence =
    evidence.length;

  const verifiedEvidence =
    evidence.filter(
      (item) =>
        item.evidenceStatus ===
        "Verified"
    ).length;

  const pendingEvidence =
    evidence.filter(
      (item) =>
        item.evidenceStatus ===
        "Pending"
    ).length;

  const archivedEvidence =
    evidence.filter(
      (item) =>
        item.evidenceStatus ===
        "Archived"
    ).length;

  /* =======================================================
     VALIDATION RATE
  ======================================================= */

  const validationRate =
    totalEvidence > 0
      ? (
          (verifiedEvidence /
            totalEvidence) *
          100
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     TRACE COVERAGE
  ======================================================= */

  const traceCoverage =
    totalEvidence > 0
      ? (
          (evidence.filter(
            (item) =>
              item.mmsi &&
              item.mmsi !==
                "Unknown"
          ).length /
            totalEvidence) *
          100
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     DATA HEALTH
  ======================================================= */

  const dataHealth =
    totalEvidence > 0
      ? (
          (evidence.filter(
            (item) =>
              item.validTelemetry
          ).length /
            totalEvidence) *
          100
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     MOVING RECORDS
  ======================================================= */

  const movingRecords =
    evidence.filter(
      (item) =>
        item.status ===
        "MOVING"
    ).length;

  /* =======================================================
     STATIONARY RECORDS
  ======================================================= */

  const stationaryRecords =
    evidence.filter(
      (item) =>
        item.status ===
        "STATIONARY"
    ).length;

  /* =======================================================
     INVALID RECORDS
  ======================================================= */

  const invalidRecords =
    evidence.filter(
      (item) =>
        !item.validTelemetry
    ).length;

  /* =======================================================
     UNIQUE VESSELS
  ======================================================= */

  const uniqueVessels =
    useMemo(() => {
      return new Set(
        evidence
          .map(
            (item) =>
              item.mmsi
          )
          .filter(
            (mmsi) =>
              mmsi &&
              mmsi !==
                "Unknown"
          )
      ).size;
    }, [evidence]);

  /* =======================================================
     RECENT EVIDENCE
  ======================================================= */

  const recentEvidence =
    useMemo(() => {
      return [
        ...evidence,
      ]
        .filter(
          (item) =>
            item.timestamp
        )
        .sort(
          (a, b) => {
            const dateA =
              new Date(
                a.timestamp
              ).getTime();

            const dateB =
              new Date(
                b.timestamp
              ).getTime();

            return (
              dateB -
              dateA
            );
          }
        )
        .slice(0, 100);
    }, [evidence]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="page-container">

        <h1 className="page-title">
          Evidence Command Center
        </h1>

        <p className="page-subtitle">
          AIS Telemetry Evidence
          Repository & Validation System
        </p>

        <div className="panel">
          <h2>
            Loading AIS Evidence...
          </h2>

          <p>
            Reading evidence from
            AIS_file.csv
          </p>
        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {
    return (
      <div className="page-container">

        <h1 className="page-title">
          Evidence Command Center
        </h1>

        <p className="page-subtitle">
          AIS Telemetry Evidence
          Repository & Validation System
        </p>

        <div className="panel">

          <h2>
            AIS Evidence Error
          </h2>

          <div className="alert warning">
            {error}
          </div>

          <p>
            Make sure{" "}
            <strong>
              AIS_file.csv
            </strong>{" "}
            exists inside the React
            application's{" "}
            <strong>
              public
            </strong>{" "}
            folder.
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="page-container">

      {/* ===================================================
          HEADER
      =================================================== */}

      <h1 className="page-title">
        Evidence Command Center
      </h1>

      <p className="page-subtitle">
        AIS Telemetry Evidence
        Repository & Validation System
      </p>

      {/* ===================================================
          METRICS
      =================================================== */}

      <div className="metrics-grid">

        <div className="metric-card">
          <h4>
            📂 Total Evidence
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {totalEvidence.toLocaleString()}
          </h2>
        </div>

        <div className="metric-card">
          <h4>
            ✅ Verified
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {verifiedEvidence.toLocaleString()}
          </h2>
        </div>

        <div className="metric-card">
          <h4>
            ⏳ Pending
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {pendingEvidence.toLocaleString()}
          </h2>
        </div>

        <div className="metric-card">
          <h4>
            🗄 Archived
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {archivedEvidence.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ===================================================
          EVIDENCE INTELLIGENCE
      =================================================== */}

      <div className="panel">

        <h2>
          Evidence Intelligence
        </h2>

        <div className="alert success">
          AIS evidence dataset loaded
          successfully.
        </div>

        <div className="alert info">
          {uniqueVessels.toLocaleString()} unique
          vessel traces identified from AIS
          records.
        </div>

        <div className="alert warning">
          {pendingEvidence.toLocaleString()} AIS
          records are classified as pending
          because the vessel is stationary.
        </div>

      </div>

      {/* ===================================================
          EVIDENCE REPOSITORY
      =================================================== */}

      <div className="panel">

        <h2>
          Evidence Repository
        </h2>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>
                  Evidence ID
                </th>

                <th>
                  Trace ID
                </th>

                <th>
                  MMSI
                </th>

                <th>
                  Vessel Type
                </th>

                <th>
                  SOG
                </th>

                <th>
                  Status
                </th>

                <th>
                  Created
                </th>
              </tr>
            </thead>

            <tbody>

              {recentEvidence.length >
              0 ? (
                recentEvidence.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={
                        item.id ||
                        item.evidenceId ||
                        index
                      }
                    >

                      {/* Evidence ID */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.evidenceId
                        }
                      </td>

                      {/* Trace ID */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.traceId
                        }
                      </td>

                      {/* MMSI */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.mmsi
                        }
                      </td>

                      {/* Vessel Type */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.vesselType
                        }
                      </td>

                      {/* SOG */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {Number.isFinite(
                          item.sog
                        )
                          ? item.sog.toFixed(
                              2
                            )
                          : "-"}
                      </td>

                      {/* Status */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.evidenceStatus
                        }
                      </td>

                      {/* Timestamp */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {item.timestamp
                          ? new Date(
                              item.timestamp
                            ).toLocaleString()
                          : "-"}
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",

                      color:
                        "#000000",

                      padding:
                        "20px",
                    }}
                  >
                    No AIS evidence
                    found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

        <p
          style={{
            color:
              "#6b7280",

            fontSize:
              "12px",

            marginTop:
              "10px",
          }}
        >
          Showing the latest{" "}
          {Math.min(
            100,
            evidence.length
          ).toLocaleString()}{" "}
          AIS evidence records.
        </p>

      </div>

      {/* ===================================================
          EVIDENCE TIMELINE
      =================================================== */}

      <div className="panel">

        <h2>
          Evidence Timeline
        </h2>

        <div className="timeline-item">

          <strong>
            AIS Evidence Collection
          </strong>

          <span>
            {totalEvidence.toLocaleString()} AIS
            records loaded
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Telemetry Validation
          </strong>

          <span>
            {verifiedEvidence.toLocaleString()} valid
            telemetry records
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Vessel Activity Analysis
          </strong>

          <span>
            {movingRecords.toLocaleString()} moving
            and{" "}
            {stationaryRecords.toLocaleString()}{" "}
            stationary records
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Validation Exceptions
          </strong>

          <span>
            {invalidRecords.toLocaleString()} invalid
            AIS records identified
          </span>

        </div>

      </div>

      {/* ===================================================
          EVIDENCE ANALYTICS
      =================================================== */}

      <div className="panel">

        <h2>
          Evidence Analytics
        </h2>

        <div className="summary-grid">

          <div className="summary-card">

            <h4>
              Validation Rate
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {validationRate}%
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Data Health
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {dataHealth}%
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Trace Coverage
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {traceCoverage}%
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Unique Vessels
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {uniqueVessels.toLocaleString()}
            </p>

          </div>

        </div>

      </div>

      {/* ===================================================
          AIS DATA SUMMARY
      =================================================== */}

      <div className="panel">

        <h2>
          AIS Evidence Summary
        </h2>

        <div className="summary-grid">

          <div className="summary-card">

            <h4>
              Total AIS Records
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {totalEvidence.toLocaleString()}
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Moving Records
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {movingRecords.toLocaleString()}
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Stationary Records
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {stationaryRecords.toLocaleString()}
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Invalid Records
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {invalidRecords.toLocaleString()}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}