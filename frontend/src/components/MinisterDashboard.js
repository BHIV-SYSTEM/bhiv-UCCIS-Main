import React, {
  useCallback,
  useState,
} from "react";

import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";

import StatCard from "../components/Cards/StatCard";

import EscalationChart from "../components/Charts/EscalationChart";
import DomainPieChart from "../components/Charts/DomainPieChart";

import ZoneHeatmap from "../components/Map/ZoneHeatmap";

import IntelligenceTable from "../components/Tables/IntelligenceTable";
import GovernanceTable from "../components/Tables/GovernanceTable";

import ReplayControls from "../components/Replay/ReplayControls";

import API from "../services/api";


/* =========================================================
   PHASE CONFIGURATION
========================================================= */

const PHASE_ENDPOINTS = {
  1: "/ingestion",
  2: "/intelligence",
  3: "/intelligence",
  4: "/governance",
  5: "/lifecycle",
  6: "/dashboard",
  7: "/replay",
  8: "/failure",
  9: "/tantra-flow",
  10: "/run-simulation",
};


/* =========================================================
   PHASE NAMES
========================================================= */

const PHASE_NAMES = {
  1: "Signal Ingestion",
  2: "Intelligence Processing",
  3: "Intelligence Analysis",
  4: "Governance",
  5: "Lifecycle",
  6: "Dashboard",
  7: "Replay",
  8: "Failure Handling",
  9: "Tantra Flow",
  10: "Simulation",
};


/* =========================================================
   SAFE RESPONSE HELPER
========================================================= */

const getResponseData = (response) => {
  if (!response) {
    return null;
  }

  if (
    response.data &&
    typeof response.data === "object"
  ) {
    return response.data;
  }

  return null;
};


/* =========================================================
   COMPONENT
========================================================= */

function MinisterDashboard() {

  /* =======================================================
     STATES
  ======================================================= */

  const [
    simulation,
    setSimulation,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");

  const [
    phaseData,
    setPhaseData,
  ] = useState(null);

  const [
    selectedPhase,
    setSelectedPhase,
  ] = useState("");

  const [
    simulationStatus,
    setSimulationStatus,
  ] = useState("READY");


  /* =======================================================
     UPDATE TIMESTAMP
  ======================================================= */

  const updateTimestamp = () => {
    setLastUpdated(
      new Date().toLocaleTimeString()
    );
  };


  /* =======================================================
     RUN SIMULATION
  ======================================================= */

  const runSimulation =
    useCallback(async () => {

      if (loading) {
        return;
      }

      try {

        setLoading(true);
        setError("");
        setSimulationStatus(
          "RUNNING"
        );

        console.log(
          "======================================"
        );

        console.log(
          "UCCIS MINISTERIAL SIMULATION"
        );

        console.log(
          "GET /run-simulation"
        );

        console.log(
          "======================================"
        );

        const response =
          await API.get(
            "/run-simulation"
          );

        const result =
          getResponseData(
            response
          );

        console.log(
          "Simulation response:",
          result
        );

        if (!result) {
          throw new Error(
            "Backend returned an empty response."
          );
        }

        /*
        -----------------------------------------------------
        Check explicit backend failure
        -----------------------------------------------------
        */

        if (
          result.success === false
        ) {
          throw new Error(
            result.error ||
              result.message ||
              "Ministerial simulation failed."
          );
        }

        /*
        -----------------------------------------------------
        Store simulation
        -----------------------------------------------------
        */

        const simulationData =
          result.data ??
          result.snapshot ??
          result.result ??
          result;

        setSimulation(
          simulationData
        );

        setPhaseData(
          result
        );

        setSelectedPhase(
          "PHASE 10 — Simulation"
        );

        setSimulationStatus(
          "COMPLETED"
        );

        updateTimestamp();

      } catch (err) {

        console.error(
          "Ministerial simulation error:",
          err
        );

        const serverMessage =
          err.response?.data?.error ||
          err.response?.data?.message;

        const message =
          serverMessage ||
          err.message ||
          "Unable to run ministerial simulation.";

        setError(
          message
        );

        setSimulationStatus(
          "FAILED"
        );

      } finally {

        setLoading(false);

      }

    }, [loading]);


  /* =======================================================
     REFRESH DASHBOARD
  ======================================================= */

  const refreshDashboard =
    useCallback(async () => {

      if (loading) {
        return;
      }

      try {

        setLoading(true);
        setError("");
        setSimulationStatus(
          "REFRESHING"
        );

        console.log(
          "Refreshing Minister Dashboard..."
        );

        const response =
          await API.get(
            "/run-simulation"
          );

        const result =
          getResponseData(
            response
          );

        if (!result) {
          throw new Error(
            "Dashboard refresh returned an empty response."
          );
        }

        if (
          result.success === false
        ) {
          throw new Error(
            result.error ||
              result.message ||
              "Dashboard refresh failed."
          );
        }

        const simulationData =
          result.data ??
          result.snapshot ??
          result.result ??
          result;

        setSimulation(
          simulationData
        );

        setPhaseData(
          result
        );

        setSelectedPhase(
          "Dashboard Refresh"
        );

        setSimulationStatus(
          "COMPLETED"
        );

        updateTimestamp();

        console.log(
          "Dashboard refreshed:",
          result
        );

      } catch (err) {

        console.error(
          "Dashboard refresh error:",
          err
        );

        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Unable to refresh dashboard.";

        setError(
          message
        );

        setSimulationStatus(
          "FAILED"
        );

      } finally {

        setLoading(false);

      }

    }, [loading]);


  /* =======================================================
     LOAD PHASE
  ======================================================= */

  const loadPhase =
    useCallback(
      async (phaseId) => {

        if (loading) {
          return;
        }

        try {

          setLoading(true);
          setError("");

          const numericPhase =
            Number(
              phaseId
            );

          const endpoint =
            PHASE_ENDPOINTS[
              numericPhase
            ] ||
            "/run-simulation";

          const phaseName =
            PHASE_NAMES[
              numericPhase
            ] ||
            "Unknown Phase";

          console.log(
            "======================================"
          );

          console.log(
            `Loading Phase ${numericPhase}`
          );

          console.log(
            "Phase:",
            phaseName
          );

          console.log(
            "Endpoint:",
            endpoint
          );

          console.log(
            "======================================"
          );

          const response =
            await API.get(
              endpoint
            );

          const result =
            getResponseData(
              response
            );

          if (!result) {
            throw new Error(
              `Phase ${numericPhase} returned an empty response.`
            );
          }

          if (
            result.success === false
          ) {
            throw new Error(
              result.error ||
                result.message ||
                `Phase ${numericPhase} failed.`
            );
          }

          setPhaseData(
            result
          );

          setSelectedPhase(
            `PHASE ${numericPhase} — ${phaseName}`
          );

          updateTimestamp();

          console.log(
            `Phase ${numericPhase} response:`,
            result
          );

          /*
          ---------------------------------------------------
          Phase 10 also represents simulation data
          ---------------------------------------------------
          */

          if (
            numericPhase === 10
          ) {

            const simulationData =
              result.data ??
              result.snapshot ??
              result.result ??
              result;

            setSimulation(
              simulationData
            );

            setSimulationStatus(
              "COMPLETED"
            );
          }

        } catch (err) {

          console.error(
            `Phase ${phaseId} error:`,
            err
          );

          const message =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            `Unable to load Phase ${phaseId}.`;

          setError(
            message
          );

          setSimulationStatus(
            "FAILED"
          );

        } finally {

          setLoading(false);

        }

      },
      [loading]
    );


  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = () => {
    setError("");
  };


  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const activeZones =
    simulation?.zones?.length ??
    simulation?.activeZones ??
    simulation?.active_zones ??
    6;

  const escalationCount =
    simulation?.escalations ??
    simulation?.escalation_count ??
    simulation?.escalationCount ??
    (simulation ? 1 : 0);

  const governanceState =
    simulation?.governance ??
    simulation?.governance_state ??
    simulation?.governanceState ??
    (simulation
      ? "APPROVED"
      : "PENDING");

  const replayState =
    simulation?.replay ??
    simulation?.replay_state ??
    simulation?.replayState ??
    (simulation
      ? "ACTIVE"
      : "0");


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        refreshDashboard={
          refreshDashboard
        }
        loadPhase={
          loadPhase
        }
      />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="main-content">

        {/* =================================================
            HEADER
        ================================================= */}

        <Header
          runSimulation={
            runSimulation
          }
        />


        {/* =================================================
            LOADING STATUS
        ================================================= */}

        {loading && (
          <div
            className="loading-box"
            style={{
              border:
                "1px solid #3b82f6",
              background:
                "#eff6ff",
              color:
                "#1d4ed8",
            }}
          >
            <strong>
              {simulationStatus ===
              "REFRESHING"
                ? "Refreshing Ministerial Dashboard..."
                : "Running Ministerial Simulation..."}
            </strong>

            <div
              style={{
                fontSize:
                  "13px",
                marginTop:
                  "5px",
              }}
            >
              Please wait while
              the UCCIS pipeline
              processes the request.
            </div>
          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="loading-box"
            style={{
              background:
                "#fef2f2",
              border:
                "1px solid #ef4444",
              color:
                "#991b1b",
              position:
                "relative",
            }}
          >

            <button
              type="button"
              onClick={
                clearError
              }
              style={{
                position:
                  "absolute",
                right:
                  "12px",
                top:
                  "10px",
                border:
                  "none",
                background:
                  "transparent",
                color:
                  "#991b1b",
                fontSize:
                  "18px",
                cursor:
                  "pointer",
              }}
            >
              ×
            </button>

            <strong>
              Ministerial Dashboard Error
            </strong>

            <div
              style={{
                marginTop:
                  "5px",
                paddingRight:
                  "30px",
              }}
            >
              {error}
            </div>

          </div>
        )}


        {/* =================================================
            LAST UPDATED
        ================================================= */}

        {lastUpdated && (
          <div
            className="loading-box"
            style={{
              background:
                "#f8fafc",
              color:
                "#475569",
              border:
                "1px solid #cbd5e1",
            }}
          >
            <strong>
              Last Updated:
            </strong>{" "}
            {lastUpdated}

            {selectedPhase && (
              <>
                {" | "}
                <strong>
                  {selectedPhase}
                </strong>
              </>
            )}

            <span
              style={{
                marginLeft:
                  "12px",
                fontWeight:
                  700,
                color:
                  simulationStatus ===
                  "FAILED"
                    ? "#dc2626"
                    : simulationStatus ===
                      "COMPLETED"
                    ? "#16a34a"
                    : "#2563eb",
              }}
            >
              ●{" "}
              {simulationStatus}
            </span>
          </div>
        )}


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="stats-grid">

          <StatCard
            title="Active Zones"
            value={
              activeZones
            }
            subtitle="Live Monitoring"
          />

          <StatCard
            title="Escalations"
            value={
              escalationCount
            }
            subtitle="Critical Visibility"
          />

          <StatCard
            title="Governance"
            value={
              governanceState
            }
            subtitle="Execution State"
          />

          <StatCard
            title="Replay Snapshots"
            value={
              replayState
            }
            subtitle="Replay Enabled"
          />

        </div>


        {/* =================================================
            PHASE API RESULT
        ================================================= */}

        {phaseData && (
          <div
            className="phase-output-box"
            style={{
              marginBottom:
                "25px",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap:
                  "15px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "12px",
              }}
            >

              <h2
                style={{
                  margin:
                    0,
                }}
              >
                {selectedPhase ||
                  "Phase"}{" "}
                API Result
              </h2>

              <button
                type="button"
                onClick={() =>
                  setPhaseData(
                    null
                  )
                }
                style={{
                  border:
                    "1px solid #94a3b8",
                  background:
                    "#ffffff",
                  color:
                    "#475569",
                  borderRadius:
                    "6px",
                  padding:
                    "6px 12px",
                  cursor:
                    "pointer",
                  fontWeight:
                    600,
                }}
              >
                Hide Result
              </button>

            </div>

            <pre
              style={{
                margin:
                  0,
                maxHeight:
                  "400px",
                overflow:
                  "auto",
                background:
                  "#0f172a",
                color:
                  "#d1fae5",
                padding:
                  "18px",
                borderRadius:
                  "8px",
                fontSize:
                  "12px",
                lineHeight:
                  "1.5",
                whiteSpace:
                  "pre-wrap",
                wordBreak:
                  "break-word",
              }}
            >
              {JSON.stringify(
                phaseData,
                null,
                2
              )}
            </pre>

          </div>
        )}


        {/* =================================================
            TOP DASHBOARD
        ================================================= */}

        <div className="grid-two">

          <ZoneHeatmap />

          <EscalationChart />

        </div>


        {/* =================================================
            INTELLIGENCE
        ================================================= */}

        <div className="grid-two">

          <IntelligenceTable />

          <DomainPieChart />

        </div>


        {/* =================================================
            GOVERNANCE / REPLAY
        ================================================= */}

        <div className="grid-two">

          <GovernanceTable />

          <ReplayControls />

        </div>


        {/* =================================================
            EXECUTION RESULT
        ================================================= */}

        {simulation && (

          <div className="execution-box">

            <h2>
              Ministerial Execution Result
            </h2>


            {/* =================================================
                EXECUTION STATUS
            ================================================= */}

            <div
              style={{
                marginBottom:
                  "20px",
                padding:
                  "12px 15px",
                borderRadius:
                  "8px",
                background:
                  "#ecfdf5",
                border:
                  "1px solid #86efac",
                color:
                  "#166534",
              }}
            >
              <strong>
                Simulation Completed
              </strong>

              <div
                style={{
                  marginTop:
                    "4px",
                  fontSize:
                    "13px",
                }}
              >
                UCCIS execution
                pipeline completed
                successfully.
              </div>
            </div>


            {/* =================================================
                EXECUTION CARDS
            ================================================= */}

            <div className="execution-grid">

              <div className="execution-card">

                <h3>
                  Signal Ingestion
                </h3>

                <p>
                  COMPLETED
                </p>

              </div>


              <div className="execution-card">

                <h3>
                  Intelligence
                </h3>

                <p>
                  GENERATED
                </p>

              </div>


              <div className="execution-card">

                <h3>
                  Governance
                </h3>

                <p>
                  {String(
                    governanceState
                  ).toUpperCase()}
                </p>

              </div>


              <div className="execution-card">

                <h3>
                  Enforcement
                </h3>

                <p>
                  DEPLOYED
                </p>

              </div>


              <div className="execution-card">

                <h3>
                  Replay Engine
                </h3>

                <p>
                  {String(
                    replayState
                  ).toUpperCase()}
                </p>

              </div>


              <div className="execution-card">

                <h3>
                  Audit History
                </h3>

                <p>
                  GENERATED
                </p>

              </div>

            </div>


            {/* =================================================
                EXECUTION TIMELINE
            ================================================= */}

            <div className="timeline-box">

              <h2>
                Execution Timeline
              </h2>


              <div className="timeline-step">
                <span>
                  01
                </span>

                Signal Received
              </div>


              <div className="timeline-step">
                <span>
                  02
                </span>

                Intelligence Processed
              </div>


              <div className="timeline-step">
                <span>
                  03
                </span>

                Governance Approved
              </div>


              <div className="timeline-step">
                <span>
                  04
                </span>

                Enforcement Triggered
              </div>


              <div className="timeline-step">
                <span>
                  05
                </span>

                Replay Snapshot Stored
              </div>


              <div className="timeline-step">
                <span>
                  06
                </span>

                Dashboard Updated
              </div>

            </div>

          </div>
        )}

      </div>


      {/* =================================================
          PAGE-LEVEL RESPONSIVE CSS
      ================================================= */}

      <style>
        {`

          .loading-box {
            margin: 0 20px 15px;
            padding: 14px 18px;
            border-radius: 8px;
          }

          .phase-output-box {
            overflow: hidden;
          }

          .execution-box {
            margin-top: 25px;
          }

          .execution-grid {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 15px;
          }

          .execution-card {
            padding: 18px;
            border-radius: 10px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow:
              0 2px 8px rgba(0,0,0,0.05);
          }

          .execution-card h3 {
            margin: 0 0 8px;
            font-size: 15px;
          }

          .execution-card p {
            margin: 0;
            font-weight: 800;
            color: #16a34a;
          }

          .timeline-box {
            margin-top: 25px;
          }

          .timeline-step {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
            padding: 12px 15px;
            border-radius: 8px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            font-weight: 600;
          }

          .timeline-step span {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #111827;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            flex-shrink: 0;
          }

          @media (max-width: 1000px) {

            .execution-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }

          }

          @media (max-width: 700px) {

            .execution-grid {
              grid-template-columns: 1fr;
            }

            .loading-box {
              margin-left: 10px;
              margin-right: 10px;
            }

          }

        `}
      </style>

    </div>
  );
}

export default MinisterDashboard;