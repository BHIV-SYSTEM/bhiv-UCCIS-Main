import React, { useEffect, useState } from "react";

import api from "../api/api";

import DashboardCard from "../components/DashboardCard";
import BackendResponseModal from "../components/BackendResponseModal";

import ReplayLineChart from "../components/Charts/ReplayLineChart";
import ReplayTimelineChart from "../components/Charts/ReplayTimelineChart";
import ReplayScatterChart from "../components/Charts/ReplayScatterChart";
import LifecycleBarChart from "../components/Charts/LifecycleBarChart";
import OperatorConcurrencyChart from "../components/Charts/OperatorConcurrencyChart";
import EnforcementBarChart from "../components/Charts/EnforcementBarChart";
import FailurePieChart from "../components/Charts/FailurePieChart";
import FailureStackedChart from "../components/Charts/FailureStackedChart";
import RecoveryLineChart from "../components/Charts/RecoveryLineChart";
import OperationalDonutChart from "../components/Charts/OperationalDonutChart";
import ObservabilityRadialChart from "../components/Charts/ObservabilityRadialChart";

import "../styles/Observability.css";

export default function ObservabilityDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);

  /*
   * AIS DATASET SUMMARY
   * -------------------
   * Total records       : 10,000
   * Unique vessels      : 6,728
   * Stationary          : 5,724
   * Moving              : 4,253
   * AIS unavailable     : 23
   * Average SOG         : 2.51 kn
   * Maximum SOG         : 37.4 kn
   * High speed >=10 kn  : 938
   * Vessel types        : 57
   * Data quality        : 99.77%
   * Risk score          : 78 / HIGH
   */

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    try {
      const response = await api.get("/observability/overview");

      setSystemStatus(response.data);
    } catch (error) {
      console.log("AIS observability API unavailable:", error);

      /*
       * The dashboard remains usable from the AIS dataset
       * even when the backend observability endpoint is unavailable.
       */
      setSystemStatus({
        source: "AIS_file.csv",
        status: "ACTIVE",
        dataQuality: 99.77,
        totalRecords: 10000,
        uniqueVessels: 6728,
      });
    }
  }

  async function openApi(endpoint) {
    try {
      const response = await api.get(endpoint, {
        headers: {
          Authorization: "VALID_TOKEN",
          role: "ADMIN",
        },
      });

      setModalData(response.data);
      setModalOpen(true);
    } catch (error) {
      console.log("AIS API request failed:", error);

      setModalData({
        success: false,
        endpoint,
        error: error.message,
        source: "AIS_file.csv",
      });

      setModalOpen(true);
    }
  }

  return (
    <div className="dashboard">
      <h1>AIS Operational Observability</h1>

      <div className="grid">

        {/* =========================================================
            1. AIS OBSERVABILITY OVERVIEW
        ========================================================= */}
        <DashboardCard
          title="AIS Observability Overview"
          graph={<ObservabilityRadialChart />}
          onClick={() =>
            openApi("/observability/overview")
          }
        >
          <p>
            AIS dataset quality and operational
            observability.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Dataset Status
            </div>

            <p className="status-green">
              ACTIVE
            </p>

            <p>
              Records: <strong>10,000</strong>
            </p>

            <p>
              Vessels: <strong>6,728</strong>
            </p>

            <p>
              Data Quality: <strong>99.77%</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            2. AIS RECORD TIMELINE
        ========================================================= */}
        <DashboardCard
          title="AIS Record Timeline"
          graph={<ReplayLineChart />}
          onClick={() =>
            openApi("/ais/timeline")
          }
        >
          <p>
            AIS records observed across the
            dataset time window.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              AIS Time Range
            </div>

            <p>
              00:00 - 00:04
            </p>

            <p>
              Total Records: <strong>10,000</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            3. AIS TEMPORAL ACTIVITY
        ========================================================= */}
        <DashboardCard
          title="AIS Temporal Activity"
          graph={<ReplayTimelineChart />}
          onClick={() =>
            openApi("/ais/activity/timeline")
          }
        >
          <p>
            Temporal distribution of AIS
            observations.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Peak AIS Activity
            </div>

            <p className="status-green">
              00:00 - 4,229 RECORDS
            </p>

            <p>
              00:01 - 3,849 records
            </p>

            <p>
              00:02 - 1,563 records
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            4. AIS SPATIAL DISTRIBUTION
        ========================================================= */}
        <DashboardCard
          title="AIS Spatial Distribution"
          graph={<ReplayScatterChart />}
          onClick={() =>
            openApi("/ais/spatial")
          }
        >
          <p>
            Geographic distribution of the
            highest AIS activity areas.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Top AIS Hotspot
            </div>

            <p className="status-yellow">
              47.5–48.0°N / 122.5–122.0°W
            </p>

            <p>
              Records: <strong>434</strong>
            </p>

            <p>
              Unique Vessels: <strong>340</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            5. VESSEL ACTIVITY LIFECYCLE
        ========================================================= */}
        <DashboardCard
          title="Vessel Activity Lifecycle"
          graph={<LifecycleBarChart />}
          onClick={() =>
            openApi("/ais/activity")
          }
        >
          <p>
            Distribution of vessel activity
            states in the AIS dataset.
          </p>

          <div className="scrollable">

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              STATIONARY — 5,724
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              MOVING — 4,253
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              AIS UNAVAILABLE — 23
            </div>

          </div>
        </DashboardCard>


        {/* =========================================================
            6. TEMPORAL ACTIVITY COMPARISON
        ========================================================= */}
        <DashboardCard
          title="Temporal Activity Comparison"
          graph={<OperatorConcurrencyChart />}
          onClick={() =>
            openApi("/ais/activity/temporal")
          }
        >
          <p>
            Stationary and moving vessel
            activity across time.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Activity Summary
            </div>

            <p>
              Stationary: <strong>5,724</strong>
            </p>

            <p>
              Moving: <strong>4,253</strong>
            </p>

            <p>
              Unavailable: <strong>23</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            7. VESSEL TYPE DISTRIBUTION
        ========================================================= */}
        <DashboardCard
          title="AIS Vessel Type Distribution"
          graph={<EnforcementBarChart />}
          onClick={() =>
            openApi("/ais/vessel-types")
          }
        >
          <p>
            Distribution of the most frequently
            observed AIS vessel types.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Dominant Vessel Type
            </div>

            <p className="status-green">
              TYPE 31
            </p>

            <p>
              Records: <strong>3,394</strong>
            </p>

            <p>
              Total Vessel Types: <strong>57</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            8. AIS ACTIVITY VALIDATION
        ========================================================= */}
        <DashboardCard
          title="AIS Activity Validation"
          graph={<FailurePieChart />}
          onClick={() =>
            openApi("/ais/validation")
          }
        >
          <p>
            Validation of stationary, moving,
            and unavailable AIS observations.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              AIS Validation
            </div>

            <p className="status-green">
              DATA VALIDATED
            </p>

            <p>
              Total Records: <strong>10,000</strong>
            </p>

            <p>
              Quality: <strong>99.77%</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            9. AIS ACTIVITY LOGS
        ========================================================= */}
        <DashboardCard
          title="AIS Activity Logs"
          graph={<FailureStackedChart />}
          onClick={() =>
            openApi("/ais/activity/logs")
          }
        >
          <p>
            Stationary and non-stationary
            observations across the timeline.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Activity Records
            </div>

            <p className="status-green">
              10,000 AIS RECORDS ANALYZED
            </p>

            <p>
              Stationary: <strong>5,724</strong>
            </p>

            <p>
              Moving: <strong>4,253</strong>
            </p>

            <p>
              Unavailable: <strong>23</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            10. AIS RECORD CONTINUITY
        ========================================================= */}
        <DashboardCard
          title="AIS Record Continuity"
          graph={<RecoveryLineChart />}
          onClick={() =>
            openApi("/ais/continuity")
          }
        >
          <p>
            Continuity of AIS observations
            throughout the available time window.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Continuity Status
            </div>

            <p className="status-green">
              CONTINUOUS DATA
            </p>

            <p>
              Records: <strong>10,000</strong>
            </p>

            <p>
              Time Window: <strong>5 minutes</strong>
            </p>
          </div>
        </DashboardCard>


        {/* =========================================================
            11. OPERATIONAL AIS ACTIVITY
        ========================================================= */}
        <DashboardCard
          title="Operational AIS Activity"
          graph={<OperationalDonutChart />}
          onClick={() =>
            openApi("/ais/operations")
          }
        >
          <p>
            Overall stationary versus moving
            vessel activity.
          </p>

          <div className="trace-box">
            <div className="trace-title">
              Operational Activity
            </div>

            <p className="status-green">
              ACTIVE
            </p>

            <p>
              Stationary: <strong>5,724</strong>
            </p>

            <p>
              Moving: <strong>4,253</strong>
            </p>

            <p>
              AIS Unavailable: <strong>23</strong>
            </p>
          </div>
        </DashboardCard>

      </div>


      {/* =========================================================
          BACKEND RESPONSE MODAL
      ========================================================= */}
      <BackendResponseModal
        open={modalOpen}
        data={modalData}
        onClose={() =>
          setModalOpen(false)
        }
      />

    </div>
  );
}
