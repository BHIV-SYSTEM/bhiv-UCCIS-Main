import React, { useMemo, useState } from "react";
import axios from "axios";

import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";
import DonutChart from "../charts/DonutChart";

/*
=========================================================
API CONFIGURATION
=========================================================
If .env contains:

REACT_APP_API_URL=http://localhost:5000/api

then the component uses:

http://localhost:5000/api/intelligence-run

=========================================================
*/

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

const INTELLIGENCE_ENDPOINT =
  `${API_BASE_URL}/intelligence-run`;


/*
=========================================================
HELPERS
=========================================================
*/

const normalizeZoneData = (zones) => {
  if (!zones) {
    return [];
  }

  /*
    Case 1:
    zones = {
      zone_1: [...],
      zone_2: [...],
      zone_3: [...]
    }
  */

  if (
    typeof zones === "object" &&
    !Array.isArray(zones)
  ) {
    return Object.entries(zones).map(
      ([zoneKey, value]) => ({
        zoneKey,
        records: Array.isArray(value)
          ? value
          : [],
      })
    );
  }

  /*
    Case 2:
    zones = [
      {
        zone_id: 1,
        ...
      }
    ]
  */

  if (Array.isArray(zones)) {
    return [
      {
        zoneKey: "ALL ZONES",
        records: zones,
      },
    ];
  }

  return [];
};


/*
=========================================================
ZONE CARD
=========================================================
*/

function ZoneHeader({
  zoneKey,
  recordCount,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "18px",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "24px",
            fontWeight: 800,
          }}
        >
          {zoneKey}
        </h2>

        <div
          style={{
            marginTop: "5px",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          Intelligence records: {recordCount}
        </div>
      </div>

      {/* <div
        style={{
          background: "#111827",
          color: "#ffffff",
          padding: "7px 13px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        INTELLIGENCE ACTIVE
      </div> */}
    </div>
  );
}


/*
=========================================================
MAIN COMPONENT
=========================================================
*/

function IntelligenceEngine() {
  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [lastRun, setLastRun] =
    useState(null);


  /*
  =======================================================
  RUN INTELLIGENCE ENGINE
  =======================================================
  */

  const runEngine = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "================================="
      );

      console.log(
        "UCCIS INTELLIGENCE ENGINE"
      );

      console.log(
        "API:",
        INTELLIGENCE_ENDPOINT
      );

      console.log(
        "================================="
      );

      const response =
        await axios.get(
          INTELLIGENCE_ENDPOINT,
          {
            timeout: 15000,

            headers: {
              Accept:
                "application/json",
            },
          }
        );

      console.log(
        "Intelligence response:",
        response.data
      );

      const responseData =
        response.data;

      /*
      ---------------------------------------------------
      Validate response
      ---------------------------------------------------
      */

      if (!responseData) {
        throw new Error(
          "Backend returned an empty response."
        );
      }

      if (
        responseData.success === false
      ) {
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Intelligence Engine returned an unsuccessful response."
        );
      }

      /*
      ---------------------------------------------------
      Determine snapshot
      ---------------------------------------------------
      */

      let snapshot =
        responseData.snapshot;

      /*
        Some backend versions may return
        the intelligence object directly.
      */

      if (!snapshot) {
        snapshot =
          responseData.data;
      }

      if (!snapshot) {
        snapshot =
          responseData.result;
      }

      if (!snapshot) {
        snapshot =
          responseData;
      }

      /*
      ---------------------------------------------------
      Make sure there is actual zone information
      ---------------------------------------------------
      */

      if (
        !snapshot ||
        typeof snapshot !==
          "object"
      ) {
        throw new Error(
          "Backend returned an invalid intelligence snapshot."
        );
      }

      /*
      ---------------------------------------------------
      Save data
      ---------------------------------------------------
      */

      setData(snapshot);

      setLastRun(
        new Date().toLocaleTimeString()
      );

      console.log(
        "Intelligence snapshot:",
        snapshot
      );
    } catch (err) {
      console.error(
        "Intelligence Engine Error:",
        err
      );

      /*
      ---------------------------------------------------
      Extract useful backend error
      ---------------------------------------------------
      */

      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message;

      const statusCode =
        err.response?.status;

      let message =
        serverMessage ||
        err.message ||
        "Unable to run Intelligence Engine.";

      if (statusCode) {
        message =
          `HTTP ${statusCode}: ${message}`;
      }

      /*
      ---------------------------------------------------
      Helpful message for 404
      ---------------------------------------------------
      */

      if (
        statusCode === 404
      ) {
        message =
          `Intelligence endpoint was not found. Checked: ${INTELLIGENCE_ENDPOINT}`;
      }

      /*
      ---------------------------------------------------
      Helpful message for network error
      ---------------------------------------------------
      */

      if (
        !err.response &&
        err.request
      ) {
        message =
          `Cannot connect to backend at ${API_BASE_URL}. Make sure the Node.js server is running on port 5000.`;
      }

      setError(message);

      setData(null);
    } finally {
      setLoading(false);
    }
  };


  /*
  =======================================================
  NORMALIZE ZONES
  =======================================================
  */

  const normalizedZones =
    useMemo(() => {
      if (!data) {
        return [];
      }

      /*
      Preferred structure:
      data.zones
      */

      if (data.zones) {
        return normalizeZoneData(
          data.zones
        );
      }

      /*
      Alternative structure:
      data.snapshot.zones
      */

      if (
        data.snapshot?.zones
      ) {
        return normalizeZoneData(
          data.snapshot.zones
        );
      }

      /*
      Alternative:
      data.zone_data
      */

      if (data.zone_data) {
        return normalizeZoneData(
          data.zone_data
        );
      }

      return [];
    }, [data]);


  /*
  =======================================================
  TOTAL RECORD COUNT
  =======================================================
  */

  const totalRecords =
    useMemo(() => {
      return normalizedZones.reduce(
        (total, zone) =>
          total +
          zone.records.length,
        0
      );
    }, [normalizedZones]);


  /*
  =======================================================
  RENDER
  =======================================================
  */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "25px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#111827",
      }}
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div
        style={{
          background: "#111827",
          color: "#ffffff",
          borderRadius: "14px",
          padding: "24px 28px",
          marginBottom: "22px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: 800,
              }}
            >
              UCCIS Intelligence Engine
            </h1>

            <p
              style={{
                margin:
                  "7px 0 0",
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              Multi-zone intelligence,
              risk analysis and
              operational analytics
            </p>
          </div>

          {/* RUN BUTTON */}

          <button
            type="button"
            onClick={runEngine}
            disabled={loading}
            style={{
              background:
                loading
                  ? "#6b7280"
                  : "#00c97b",

              color: "#ffffff",

              border: "none",

              padding:
                "13px 24px",

              borderRadius: "8px",

              fontSize: "15px",

              fontWeight: 800,

              cursor: loading
                ? "not-allowed"
                : "pointer",

              boxShadow:
                "0 3px 10px rgba(0,0,0,0.2)",
            }}
          >
            {loading
              ? "Running..."
              : "▶ Run Intelligence Engine"}
          </button>
        </div>
      </div>


      {/* =================================================
          STATUS BAR
      ================================================= */}

      {data && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginBottom: "22px",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              borderRadius: "10px",
              padding: "16px",
              border:
                "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              ZONES
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              {normalizedZones.length}
            </div>
          </div>


          <div
            style={{
              background: "#ffffff",
              borderRadius: "10px",
              padding: "16px",
              border:
                "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              TOTAL RECORDS
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              {totalRecords}
            </div>
          </div>


          <div
            style={{
              background: "#ffffff",
              borderRadius: "10px",
              padding: "16px",
              border:
                "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              ENGINE STATUS
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                marginTop: "8px",
                color: "#16a34a",
              }}
            >
              ● ACTIVE
            </div>
          </div>


          {lastRun && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "10px",
                padding: "16px",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                LAST RUN
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginTop: "8px",
                }}
              >
                {lastRun}
              </div>
            </div>
          )}

        </div>
      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            background: "#fff1f2",
            border:
              "1px solid #fecdd3",
            color: "#9f1239",
            borderRadius: "10px",
            padding: "16px 18px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              marginBottom: "6px",
            }}
          >
            Intelligence Engine Failed
          </div>

          <div
            style={{
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#be123c",
            }}
          >
            Endpoint:
            {" "}
            {INTELLIGENCE_ENDPOINT}
          </div>
        </div>
      )}


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        !data && (
          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "55px 20px",
              textAlign: "center",
              color: "#6b7280",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "12px",
              }}
            >
              🧠
            </div>

            <h2
              style={{
                margin:
                  "0 0 8px",
                color: "#111827",
              }}
            >
              Intelligence Engine Ready
            </h2>

            <p
              style={{
                margin: 0,
              }}
            >
              Click
              {" "}
              <strong>
                Run Intelligence Engine
              </strong>
              {" "}
              to load zone intelligence.
            </p>
          </div>
        )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "50px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              marginBottom: "10px",
            }}
          >
            ⚙️
          </div>

          <h3
            style={{
              margin: 0,
            }}
          >
            Running Intelligence Engine...
          </h3>

          <p
            style={{
              color: "#6b7280",
              marginBottom: 0,
            }}
          >
            Processing zone intelligence
            and generating analytics.
          </p>
        </div>
      )}


      {/* =================================================
          NO ZONES
      ================================================= */}

      {!loading &&
        !error &&
        data &&
        normalizedZones.length ===
          0 && (
          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h3>
              No Zone Data Found
            </h3>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              The Intelligence Engine
              returned a valid response,
              but no zone data was found
              in the response.
            </p>
          </div>
        )}


      {/* =================================================
          ZONE DATA
      ================================================= */}

      {!loading &&
        !error &&
        normalizedZones.map(
          ({
            zoneKey,
            records,
          }) => (
            <div
              key={zoneKey}
              style={{
                background:
                  "#ffffff",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "14px",
                padding:
                  "22px",
                marginBottom:
                  "24px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.06)",
              }}
            >

              {/* ZONE HEADER */}

              <ZoneHeader
                zoneKey={
                  zoneKey
                }
                recordCount={
                  records.length
                }
              />


              {records.length ===
              0 ? (
                <div
                  style={{
                    background:
                      "#f9fafb",
                    borderRadius:
                      "8px",
                    padding:
                      "30px",
                    textAlign:
                      "center",
                    color:
                      "#9ca3af",
                  }}
                >
                  No data for this
                  zone.
                </div>
              ) : (
                <>

                  {/* =====================================
                      TOP CHART ROW
                  ===================================== */}

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: "20px",
                    }}
                  >

                    {/* BAR */}

                    <div
                      style={{
                        minWidth: 0,
                        height: "360px",
                        background:
                          "#ffffff",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "10px",
                        padding:
                          "15px",
                      }}
                    >
                      <BarChart
                        data={
                          records
                        }
                      />
                    </div>


                    {/* LINE */}

                    <div
                      style={{
                        minWidth: 0,
                        height: "360px",
                        background:
                          "#ffffff",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "10px",
                        padding:
                          "15px",
                      }}
                    >
                      <LineChart
                        data={
                          records
                        }
                      />
                    </div>

                  </div>


                  {/* =====================================
                      BOTTOM CHART ROW
                  ===================================== */}

                  <div
                    style={{
                      marginTop:
                        "20px",

                      display:
                        "grid",

                      gridTemplateColumns:
                        "repeat(2, 300px)",

                      justifyContent:
                        "center",

                      gap: "30px",
                    }}
                  >

                    {/* PIE */}

                    <div
                      style={{
                        width:
                          "300px",

                        height:
                          "300px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        background:
                          "#ffffff",

                        border:
                          "1px solid #e5e7eb",

                        borderRadius:
                          "10px",

                        padding:
                          "10px",

                        boxShadow:
                          "0 2px 10px rgba(0,0,0,0.06)",
                      }}
                    >
                      <PieChart
                        data={
                          records
                        }
                      />
                    </div>


                    {/* DONUT */}

                    <div
                      style={{
                        width:
                          "300px",

                        height:
                          "300px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        background:
                          "#ffffff",

                        border:
                          "1px solid #e5e7eb",

                        borderRadius:
                          "10px",

                        padding:
                          "10px",

                        boxShadow:
                          "0 2px 10px rgba(0,0,0,0.06)",
                      }}
                    >
                      <DonutChart
                        data={
                          records
                        }
                      />
                    </div>

                  </div>

                </>
              )}

            </div>
          )
        )}


      {/* =================================================
          RESPONSIVE STYLE
      ================================================= */}

      <style>
        {`

          @media (max-width: 900px) {

            .intelligence-chart-row {
              grid-template-columns: 1fr;
            }

          }

          @media (max-width: 700px) {

            body {
              overflow-x: hidden;
            }

          }

        `}
      </style>

    </div>
  );
}

export default IntelligenceEngine;