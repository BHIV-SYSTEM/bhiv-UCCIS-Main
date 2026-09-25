import {
  useEffect,
  useState
} from "react";

import api from "../api/api";

import DashboardCard from
  "../components/DashboardCard";

import BackendResponseModal from
  "../components/BackendResponseModal";

import ReplayLineChart from
  "../components/Charts/ReplayLineChart";

import ReplayTimelineChart from
  "../components/Charts/ReplayTimelineChart";

import ReplayScatterChart from
  "../components/Charts/ReplayScatterChart";

import LifecycleBarChart from
  "../components/Charts/LifecycleBarChart";

import OperatorConcurrencyChart from
  "../components/Charts/OperatorConcurrencyChart";

import EnforcementBarChart from "../components/Charts/EnforcementBarChart";

import FailurePieChart from
  "../components/Charts/FailurePieChart";

import FailureStackedChart from
  "../components/Charts/FailureStackedChart";

import RecoveryLineChart from
  "../components/Charts/RecoveryLineChart";

import OperationalDonutChart from "../components/Charts/OperationalDonutChart";

import ObservabilityRadialChart from
  "../components/Charts/ObservabilityRadialChart";

import "../styles/Observability.css";

export default function
ObservabilityDashboard() {

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalData, setModalData] =
    useState(null);

  const [systemStatus, setSystemStatus] =
    useState(null);

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {

    try {

      const response =
        await api.get(
          "/observability/overview"
        );

      setSystemStatus(
        response.data
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function openApi(endpoint) {

    try {

      const response =
        await api.get(endpoint, {

          headers: {
            Authorization:
              "VALID_TOKEN",

            role: "ADMIN"
          }
        });

      setModalData(response.data);

      setModalOpen(true);

    } catch (error) {

      setModalData({
        success: false,
        error: error.message
      });

      setModalOpen(true);
    }
  }

  return (

    <div className="dashboard">

      <h1>
        UCCIS Operational Observability
      </h1>

      <div className="grid">

        {/* OBSERVABILITY */}

        <DashboardCard
          title="Observability Overview"

          graph={
            <ObservabilityRadialChart />
          }

          onClick={() =>
            openApi(
              "/observability/overview"
            )
          }
        >

          <p>
            Real-time operational
            observability layer.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              System Status
            </div>

            <p className="status-green">
              HEALTHY
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* REPLAY RECONSTRUCTION */}

        <DashboardCard
          title="Replay Reconstruction"

          graph={
            <ReplayLineChart />
          }

          onClick={() =>
            openApi(
              "/replay/TRACE_MUMBAI_FLOOD"
            )
          }
        >

          <p>
            Immutable replay validation
            and deterministic ordering.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Replay Trace
            </div>

            <p>
              TRACE_MUMBAI_FLOOD
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* REPLAY TIMELINE */}

        <DashboardCard
          title="Replay Timeline"

          graph={
            <ReplayTimelineChart />
          }

          onClick={() =>
            openApi(
              "/replay/timeline/MUMBAI_ZONE_01"
            )
          }
        >

          <p>
            Distributed replay timeline
            continuity.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Zone Timeline
            </div>

            <p>
              MUMBAI_ZONE_01
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* REPLAY RECONSTRUCT */}

        <DashboardCard
          title="Replay Reconstruct API"

          graph={
            <ReplayScatterChart />
          }

          onClick={() =>
            openApi(
              "/replay/reconstruct/TRACE_MUMBAI_FLOOD"
            )
          }
        >

          <p>
            Replay-safe reconstruction
            proof validation.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Reconstruction State
            </div>

            <p className="status-green">
              VERIFIED
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* LIFECYCLE */}

        <DashboardCard
          title="Lifecycle Persistence"

          graph={
            <LifecycleBarChart />
          }

          onClick={() =>
            openApi(
              "/lifecycle/TRACE_GOV_001"
            )
          }
        >

          <p>
            Governance lifecycle
            continuity and persistence.
          </p>

          <div className="scrollable">

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              SIGNAL_RECEIVED
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              INTELLIGENCE_GENERATED
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              ESCALATION_CREATED
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-dot" />
              GOVERNANCE_VISIBLE
            </div>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* CONCURRENCY */}

        <DashboardCard
          title="Concurrency Validation"

          graph={
            <OperatorConcurrencyChart />
          }

          onClick={() =>
            openApi(
              "/concurrency/TRACE_CONCURRENT_001"
            )
          }
        >

          <p>
            Distributed operator-safe
            concurrency validation.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Concurrent Operators
            </div>

            <p>
              4 ACTIVE OPERATORS
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* ENFORCEMENT */}

        <DashboardCard
          title="Enforcement Participation"

          graph={
            <EnforcementBarChart />
          }

          onClick={() =>
            openApi(
              "/enforcement/TRACE_ENFORCEMENT_001"
            )
          }
        >

          <p>
            Constitutional governance
            enforcement boundary proof.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Enforcement Status
            </div>

            <p className="status-yellow">
              EXTERNAL PARTICIPATION
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* FAILURE VALIDATION */}

        <DashboardCard
          title="Failure Validation"

          graph={
            <FailurePieChart />
          }

          onClick={() =>
            openApi(
              "/failure/validate/TRACE_FAILURE_001"
            )
          }
        >

          <p>
            Replay continuity under
            operational failures.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Failure Recovery
            </div>

            <p className="status-green">
              RECOVERED
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* FAILURE LOGS */}

        <DashboardCard
          title="Failure Logs"

          graph={
            <FailureStackedChart />
          }

          onClick={() =>
            openApi(
              "/failure/failures/TRACE_FAILURE_001"
            )
          }
        >

          <p>
            Immutable operational
            failure lineage tracking.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Failure Count
            </div>

            <p className="status-red">
              12 FAILURES DETECTED
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* RECOVERY */}

        <DashboardCard
          title="Recovery Replay"

          graph={
            <RecoveryLineChart />
          }

          onClick={() =>
            openApi(
              "/failure/recoveries/TRACE_FAILURE_001"
            )
          }
        >

          <p>
            Recovery replay continuity
            validation.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Replay Recovery
            </div>

            <p className="status-green">
              CONTINUITY PRESERVED
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

        {/* OPERATIONAL SIMULATION */}

        <DashboardCard
          title="Operational Simulation"

          graph={
            <OperationalDonutChart />
          }

          onClick={() =>
            openApi(
              "/operations/run"
            )
          }
        >

          <p>
            Full governance operational
            simulation execution.
          </p>

          <div className="trace-box">

            <div className="trace-title">
              Operational State
            </div>

            <p className="status-green">
              ACTIVE
            </p>

          </div>

          {/* <div className="live-indicator" /> */}

        </DashboardCard>

      </div>

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