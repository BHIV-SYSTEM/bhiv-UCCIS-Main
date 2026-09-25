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

    else if (
      char === "," &&
      !insideQuotes
    ) {
      row.push(cell.trim());
      cell = "";
    }

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

      row.push(cell.trim());

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

    else {
      cell += char;
    }
  }

  /* -------------------------------------------------------
     LAST ROW
  ------------------------------------------------------- */

  if (
    cell !== "" ||
    row.length > 0
  ) {
    row.push(cell.trim());

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

  /* -------------------------------------------------------
     HEADERS
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     OBJECTS
  ------------------------------------------------------- */

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
  const mmsi =
    getAISField(row, [
      "MMSI",
      "mmsi",
      "Mmsi",
      "MMSI Number",
    ]);

  const timestamp =
    getAISField(row, [
      "BaseDateTime",
      "Base Date Time",
      "Timestamp",
      "timestamp",
      "DateTime",
      "datetime",
    ]);

  const latRaw =
    getAISField(row, [
      "LAT",
      "Lat",
      "Latitude",
      "latitude",
    ]);

  const lonRaw =
    getAISField(row, [
      "LON",
      "Lon",
      "Longitude",
      "longitude",
    ]);

  const sogRaw =
    getAISField(row, [
      "SOG",
      "Sog",
      "Speed",
      "speed",
      "Speed Over Ground",
    ]);

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
     COORDINATE VALIDATION
  ------------------------------------------------------- */

  const validCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;

  /* -------------------------------------------------------
     SOG VALIDATION
  ------------------------------------------------------- */

  const validSOG =
    Number.isFinite(sog) &&
    sog >= 0;

  /* -------------------------------------------------------
     TELEMETRY VALIDATION
  ------------------------------------------------------- */

  const validTelemetry =
    validCoordinates &&
    validSOG;

  /* -------------------------------------------------------
     ACTIVITY STATUS
  ------------------------------------------------------- */

  let status = "INVALID";

  if (validTelemetry) {
    if (sog > 0) {
      status = "MOVING";
    } else {
      status = "STATIONARY";
    }
  }

  /* -------------------------------------------------------
     RUNTIME STATUS
     
     Dashboard-derived from AIS activity.
  ------------------------------------------------------- */

  let runtimeStatus =
    "Pending";

  if (!validTelemetry) {
    runtimeStatus =
      "Pending";
  } else if (
    status === "STATIONARY"
  ) {
    runtimeStatus =
      "Running";
  } else {
    runtimeStatus =
      "Completed";
  }

  /* -------------------------------------------------------
     DERIVED EXECUTION TIME
     
     AIS does not contain execution time.
     This is only an operational visualization value
     derived from SOG.
  ------------------------------------------------------- */

  let executionTime = 0;

  if (validTelemetry) {
    executionTime = Math.max(
      100,
      Math.round(
        1000 /
          (1 + sog)
      )
    );
  }

  return {
    id:
      index + 1,

    traceId:
      mmsi
        ? `AIS-TRACE-${mmsi}`
        : `AIS-TRACE-${index + 1}`,

    signalId:
      `AIS-SIGNAL-${String(
        index + 1
      ).padStart(5, "0")}`,

    incidentId:
      `AIS-INCIDENT-${String(
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

    runtimeStatus,

    executionTime,
  };
}

/* =========================================================
   MAIN RUNTIME COMPONENT
========================================================= */

export default function Runtime() {
  const [
    runtimeData,
    setRuntimeData,
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
     LOAD AIS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadRuntime() {
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
          setRuntimeData(
            normalizedRows
          );
        }
      } catch (err) {
        console.error(
          "Runtime AIS Error:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Failed to load AIS runtime data"
          );

          setRuntimeData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRuntime();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     RUNTIME METRICS
  ======================================================= */

  const totalExecutions =
    runtimeData.length;

  const completedExecutions =
    runtimeData.filter(
      (item) =>
        item.runtimeStatus ===
        "Completed"
    ).length;

  const runningExecutions =
    runtimeData.filter(
      (item) =>
        item.runtimeStatus ===
        "Running"
    ).length;

  const pendingExecutions =
    runtimeData.filter(
      (item) =>
        item.runtimeStatus ===
        "Pending"
    ).length;

  /* =======================================================
     VALID RECORDS
  ======================================================= */

  const validExecutions =
    runtimeData.filter(
      (item) =>
        item.validTelemetry
    ).length;

  /* =======================================================
     INVALID RECORDS
  ======================================================= */

  const invalidExecutions =
    runtimeData.filter(
      (item) =>
        !item.validTelemetry
    ).length;

  /* =======================================================
     SUCCESS RATE
  ======================================================= */

  const successRate =
    totalExecutions > 0
      ? (
          (validExecutions /
            totalExecutions) *
          100
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     AVERAGE RUNTIME
     
     Dashboard-derived from AIS SOG.
  ======================================================= */

  const averageRuntime =
    useMemo(() => {
      const records =
        runtimeData.filter(
          (item) =>
            item.validTelemetry
        );

      if (!records.length) {
        return 0;
      }

      const total =
        records.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.executionTime,
          0
        );

      return (
        total /
        records.length
      );
    }, [runtimeData]);

  /* =======================================================
     TRACE ACCURACY
  ======================================================= */

  const traceAccuracy =
    totalExecutions > 0
      ? (
          (runtimeData.filter(
            (item) =>
              item.mmsi &&
              item.mmsi !==
                "Unknown"
          ).length /
            totalExecutions) *
          100
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     RECOVERY / DATA QUALITY
  ======================================================= */

  const recoveryRate =
    totalExecutions > 0
      ? (
          (validExecutions /
            totalExecutions) *
          100
        ).toFixed(1)
      : "0.0";

  /* =======================================================
     UNIQUE VESSELS
  ======================================================= */

  const uniqueVessels =
    useMemo(() => {
      return new Set(
        runtimeData
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
    }, [runtimeData]);

  /* =======================================================
     RECENT RECORDS
  ======================================================= */

  const recentRuntime =
    useMemo(() => {
      return [
        ...runtimeData,
      ]
        .filter(
          (item) =>
            item.timestamp
        )
        .sort(
          (a, b) => {
            return (
              new Date(
                b.timestamp
              ).getTime() -
              new Date(
                a.timestamp
              ).getTime()
            );
          }
        )
        .slice(0, 100);
    }, [runtimeData]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="page-container">

        <h1 className="page-title">
          Runtime Command Center
        </h1>

        <p className="page-subtitle">
          AIS Telemetry Runtime
          Processing Engine
        </p>

        <div className="panel">

          <h2>
            Loading AIS Runtime...
          </h2>

          <p>
            Reading runtime records
            from AIS_file.csv
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
          Runtime Command Center
        </h1>

        <p className="page-subtitle">
          AIS Telemetry Runtime
          Processing Engine
        </p>

        <div className="panel">

          <h2>
            AIS Runtime Error
          </h2>

          <div className="alert warning">
            {error}
          </div>

          <p>
            Make sure{" "}
            <strong>
              AIS_file.csv
            </strong>{" "}
            is available inside
            the React application's
            public folder.
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

      {/* =================================================
          HEADER
      ================================================= */}

      <h1 className="page-title">
        Runtime Command Center
      </h1>

      <p className="page-subtitle">
        AIS Telemetry Runtime
        Processing Engine
      </p>

      {/* =================================================
          METRICS
      ================================================= */}

      <div className="metrics-grid">

        <div className="metric-card">

          <h4>
            ⚙ Runtime Executions
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {totalExecutions.toLocaleString()}
          </h2>

        </div>

        <div className="metric-card">

          <h4>
            ✅ Completed
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {completedExecutions.toLocaleString()}
          </h2>

        </div>

        <div className="metric-card">

          <h4>
            ⚡ Running
          </h4>

          <h2
            style={{
              color:
                "#000000",
            }}
          >
            {runningExecutions.toLocaleString()}
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
            {pendingExecutions.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* =================================================
          RUNTIME HEALTH
      ================================================= */}

      <div className="panel">

        <h2>
          Runtime Health
        </h2>

        <div className="alert success">
          AIS telemetry processing
          dataset loaded successfully.
        </div>

        <div className="alert info">
          {validExecutions.toLocaleString()} valid
          telemetry records available for
          runtime processing.
        </div>

        <div className="alert warning">
          {invalidExecutions.toLocaleString()} AIS
          validation exceptions require review.
        </div>

        <div className="alert info">
          {uniqueVessels.toLocaleString()} unique
          vessels identified from AIS records.
        </div>

      </div>

      {/* =================================================
          RUNTIME SERVICES
      ================================================= */}

      <div className="panel">

        <h2>
          Runtime Services
        </h2>

        <div className="summary-grid">

          <div className="summary-card">

            <h4>
              AIS Signal Service
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {totalExecutions >
              0
                ? "Active"
                : "Waiting"}
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Telemetry Validation
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {validExecutions.toLocaleString()} Valid
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Vessel Monitoring
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {runningExecutions.toLocaleString()}{" "}
              Stationary
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Replay Records
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {uniqueVessels.toLocaleString()}{" "}
              Vessel Traces
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          RUNTIME EXECUTION RECORDS
      ================================================= */}

      <div className="panel">

        <h2>
          Runtime Execution Records
        </h2>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Trace ID
                </th>

                <th>
                  Signal ID
                </th>

                <th>
                  Incident ID
                </th>

                <th>
                  MMSI
                </th>

                <th>
                  Vessel Type
                </th>

                <th>
                  Status
                </th>

                <th>
                  SOG
                </th>

                <th>
                  Execution Time
                </th>

                <th>
                  Created
                </th>

              </tr>

            </thead>

            <tbody>

              {recentRuntime.length >
              0 ? (
                recentRuntime.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item.id ||
                        index
                      }
                    >

                      {/* Trace */}

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

                      {/* Signal */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.signalId
                        }
                      </td>

                      {/* Incident */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.incidentId
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

                      {/* Status */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.runtimeStatus
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

                      {/* Execution Time */}

                      <td
                        style={{
                          color:
                            "#000000",
                        }}
                      >
                        {
                          item.executionTime
                        }{" "}
                        ms
                      </td>

                      {/* Created */}

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
                    colSpan="9"
                    style={{
                      textAlign:
                        "center",

                      color:
                        "#000000",

                      padding:
                        "20px",
                    }}
                  >
                    No AIS runtime
                    records found
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
            runtimeData.length
          ).toLocaleString()}{" "}
          AIS runtime records.
        </p>

      </div>

      {/* =================================================
          RUNTIME TIMELINE
      ================================================= */}

      <div className="panel">

        <h2>
          Runtime Timeline
        </h2>

        <div className="timeline-item">

          <strong>
            AIS Signal Received
          </strong>

          <span>
            {totalExecutions.toLocaleString()} AIS
            records loaded
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Telemetry Generated
          </strong>

          <span>
            {validExecutions.toLocaleString()} valid
            telemetry records processed
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Vessel Activity Detected
          </strong>

          <span>
            {completedExecutions.toLocaleString()} moving
            vessel records identified
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Stationary Activity
          </strong>

          <span>
            {runningExecutions.toLocaleString()} stationary
            vessel records identified
          </span>

        </div>

        <div className="timeline-item">

          <strong>
            Runtime Validation
          </strong>

          <span>
            {invalidExecutions.toLocaleString()} invalid
            AIS records identified
          </span>

        </div>

      </div>

      {/* =================================================
          RUNTIME ANALYTICS
      ================================================= */}

      <div className="panel">

        <h2>
          Runtime Analytics
        </h2>

        <div className="summary-grid">

          <div className="summary-card">

            <h4>
              Success Rate
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {successRate}%
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Average Runtime
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {averageRuntime.toFixed(
                0
              )}{" "}
              ms
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Trace Accuracy
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {traceAccuracy}%
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Data Quality
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {recoveryRate}%
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          AIS RUNTIME SUMMARY
      ================================================= */}

      <div className="panel">

        <h2>
          AIS Runtime Summary
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
              {totalExecutions.toLocaleString()}
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

          <div className="summary-card">

            <h4>
              Valid Telemetry
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {validExecutions.toLocaleString()}
            </p>

          </div>

          <div className="summary-card">

            <h4>
              Invalid Telemetry
            </h4>

            <p
              style={{
                color:
                  "#000000",
              }}
            >
              {invalidExecutions.toLocaleString()}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}