import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";

import CommandInterface from "../components/CommandInterface"; // Task 1//
// import AISModulePanel from "../components/AISModulePanel";
import TrafficDashboard from "../components/TrafficDashboard"; // Task 2//
import IntelligenceDashboard from "../components/IntelligenceDashboard"; // Task 3//
import ZoneIntelligenceDashboard from "../ZoneIntelligenceDashboard"; // Task 4//
import UCCISIntelligenceDashboard from "../components/UCCISIntelligenceDashboard"; // Task 5//
import ReplayDashboard from "../components/ReplayDashboard"; // Task 6//
import UrbanIntelligence from "../components/UrbanIntelligence"; // Task 7//
import IntelligenceEngine from "../components/IntelligenceEngine"; // Task 8//
import MinisterDashboardTask9 from "../components/MinisterDashboard.js"; // Task 9//
import GovernanceDashboard from "../components/GovernanceDashboard"; // Task 10//
import ObservabilityDashboard from "../components/ObservabilityDashboard"; // Task 11//
import UCCISUnifiedDashboard from "../components/UCCISUnifiedDashboard"; // Task 12//
import MinisterDashboardTask12
from "../components/MinisterDashboard.jsx"; // Task 12//

import ReplayCenter
from "../components/ReplayCenter.jsx"; // Task 13//
import MinisterOperationalCenter
from "../components/MinisterOperationalCenter.jsx"; // Task 14//
import PrincipalSecretaryDashboard
from "../components/PrincipalSecretaryDashboard.jsx"; // Task 15//
import OSDOperationalCenter
from "../components/OSDOperationalCenter.jsx";

import FieldOperationsDashboard
from "../components/FieldOperationsDashboard.jsx";
import ReplayStoryPage
from "../components/ReplayStoryPage.jsx";
import ReplayValidationPage
from "../components/ReplayValidationPage.jsx";
import LiveOperationsPage
from "../components/LiveOperationsPage.jsx";
import TechnicalInspectionPage
from "../technical/pages/TechnicalInspectionPage";

import AdminModePage
from "../technical/pages/AdminModePage";

import AuditModePage
from "../technical/pages/AuditModePage";
import ReliabilityOperationsPage
from "../components/ReliabilityOperationsPage.jsx";

import MinisterialPilotProofPage
from "../components/MinisterialPilotProofPage.jsx";
/*
=========================================================
TASK 13
Replay Reconstruction Platform
=========================================================
*/
import HomeDashboard from "../components/HomeDashboard";
import UnifiedDashboard from "../components/UnifiedDashboard.jsx";
import ReplayCharts from "../components/ReplayCharts.jsx";

/*
=========================================================
TASK 14
UCCIS COMMAND CENTER
=========================================================
IMPORTANT:
Change these paths if your Task 14 pages folder
is located somewhere else.
=========================================================
*/
import Operations from "../components/Operations";
import Replay from "../components/Replay.jsx";
import Observability from "../components/Observability";
import Governance from "../components/Governance.jsx";

/*
=========================================================
TASK 15
STATE-DRIVEN COMMAND CENTER
(no routing — mirrors the Task 14 pattern)
=========================================================
IMPORTANT:
Governance and Replay reuse the same files as Task 14,
so they're imported again here under aliases to avoid
a duplicate-identifier error.
=========================================================
*/
import GovernanceTask15 from "../components/GovernanceTask15";
import ReplayTask15 from "../components/ReplayTask15";
import Telemetry from "../components/Telemetry";
import Validation from "../components/Validation";
import Operators from "../components/Operators";
import Testing from "../components/Testing";

/* Task 16 */
import ExecutiveDashboard from "../components/ExecutiveDashboard";
import Phase1 from "../components/Phase1";
import Phase2 from "../components/Phase2";
import Phase3 from "../components/Phase3";
import Phase4 from "../components/Phase4";
import Phase5 from "../components/Phase5";
import Phase6 from "../components/Phase6";
import Phase7 from "../components/Phase7";

/* Task 17 */
import SidebarTask17 from "../components/SidebarTask17";
import ExecutiveOverview from "../components/ExecutiveOverview";
import ReplayReconstruction from "../components/ReplayReconstruction";
import OperationalStress from "../components/OperationalStress";
import EntropyFailure from "../components/EntropyFailure";
import EscalationVisibility from "../components/EscalationVisibility";
import FieldContinuity from "../components/FieldContinuity";

/* Task 18 */
import GovernanceCommandCenter from "../components/GovernanceCommandCenter";

/* Task 19 */
import OperationalLayer from "../components/OperationalLayer";

/* Task 20 */
import ControlIntelligenceSystem from "../dashboard/ControlIntelligenceSystem";

/* Task 21 */
import SystemOperational from "../dashboard/SystemOperational";

/* Task 22 */
import CivicIntelligenceSystem from "../components/CivicIntelligenceSystem";

/* Task 23 */
import OperationalSystem from "../components/OperationalSystem";

/* Task 24 */
import IntelligenceModule from "../components/IntelligenceModule";

/* Task 25 */
import Home from "../components/Home";

/* Task 26 */
import TelemetryTask26 from "../components/TelemetryTask26";
import RuntimeTask26 from "../components/RuntimeTask26";
import ReplayTask26 from "../components/ReplayTask26";

/* Task 27 */
import Navbar from "../components/Navbar";
import RuntimeDashboard from "../components/RuntimeDashboard";
import Runtime from "../components/Runtime";
import SignalsTask27 from "../components/SignalsTask27";

/* Task 28 */
import CommandCenters from "../components/CommandCenters";

/* Task 29 */
import SidebarTask29 from "../components/SidebarTask29";
import HeaderTask29 from "../components/HeaderTask29";
import Demonstration from "../components/Demonstration";
import SignalsTask29 from "../components/SignalsTask29";
import TelemetryTask29 from "../components/TelemetryTask29";
import IncidentsTask29 from "../components/IncidentsTask29";
import Escalations from "../components/Escalations";
import Decisions from "../components/Decisions";
import ReplaySessions from "../components/ReplaySessions";
import RuntimeLogsTask29 from "../components/RuntimeLogsTask29.jsx";
import Analytics from "../components/Analytics";

/* Task 30 */
import MainLayout from "../layout/MainLayout";
import EDODemonstration from "../dashboard/EDODemonstration";
import Signals from "../dashboard/Signals";
import TelemetryTask30 from "../dashboard/Telemetry";
import Incidents from "../dashboard/Incidents";
import EscalationsTask30 from "../dashboard/Escalations";
import DecisionsTask30 from "../dashboard/Decisions";
import ReplayTask30 from "../dashboard/Replay";
import RuntimeLogs from "../dashboard/RuntimeLogs";

/* Task 31 */
import Operational from "../components/Operational";

/* Task 32 */
import RuntimeDashboardTask32 from "../components/RuntimeDashboardTask32";
import ReplayViewTask32 from "../components/ReplayViewTask32";
import RuntimeLogsTask32 from "../components/RuntimeLogsTask32";

/* Task 33 */
import CommandCenter from "../dashboard/CommandCenter";

/* Task 34 */
import CanonicalPlatform from "../layout/CanonicalPlatform";
import SignalsTask34 from "../layout/Signals.jsx";
import TelemetryTask34 from "../layout/Telemetry.jsx";
import IncidentsTask34 from "../layout/Incidents.jsx";
import EscalationsTask34 from "../layout/Escalations.jsx";
import ReplayTask34 from "../layout/Replay.jsx";
import Evidence from "../layout/Evidence.jsx";
import ObservabilityTask34 from "../layout/Observability.jsx";
import ReviewPackets from "../layout/ReviewPackets.jsx";

/* Task 35 */
import SidebarTask35 from "../components/SidebarTask35";
import DashboardHeaderTask35 from "../components/DashboardHeaderTask35";
import SummaryCardsTask35 from "../components/SummaryCardsTask35";
import RuntimeMetricsChartTask35 from "../components/RuntimeMetricsChartTask35";
import ActiveOperations from "../components/ActiveOperations";
import RuntimeHealthTask35 from "../components/RuntimeHealthTask35";
import TimelineReconstruction from "../components/TimelineReconstruction";
import HistoricalOperations from "../components/HistoricalOperations";
import MultiDomainPanel from "../components/MultiDomainPanel";
import ReplayMetrics from "../components/ReplayMetrics";
import EvidencePanelTask35 from "../components/EvidencePanelTask35";
import PlatformReadiness from "../components/PlatformReadiness";
import ModuleDrilldown from "../components/ModuleDrilldown";
import GlobalSearch from "../components/GlobalSearch";
import RuntimeKPIs from "../components/RuntimeKPIs";
import LiveRuntimeFeed from "../components/LiveRuntimeFeed";
import IncidentSeverity from "../components/IncidentSeverity";
import DomainHealth from "../components/DomainHealth";
import TraceLineage from "../components/TraceLineage";
import EvidenceChain from "../components/EvidenceChain";
import DeploymentHealth from "../components/DeploymentHealth";
import OperatorActivityTask35 from "../components/OperatorActivityTask35";
import ReplayReconstructionTask35 from "../components/ReplayReconstructionTask35";
import api from "../api";
import "../styles/Task35.css";

/* Task 36 */
import RuntimeEngine from "../dashboard/RuntimeEngine";
// import "../Task36.css";

/* Task 37 */
import AppRoutes from "../routes/AppRoutes";

/* Task 38 */
import AppRoutesTask38 from "../routes/AppRoutesTask38";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Header from "../components/Layout/Header.jsx";
import "../Task38.css";

/*
=========================================================
TASK 39
UCCIS RUNTIME (SIDEBAR + ROUTER SUB-APP)
=========================================================
IMPORTANT:
Task 39 brings its own page set (Dashboard, Incidents,
Escalations, Replay, Evidence, Runtime) living under
"../pages/...". Several of these names collide with
identifiers already imported above for earlier tasks
(Incidents, Escalations, Replay, Evidence, Runtime), so
they are imported here under a "Task39" suffix to avoid
duplicate-identifier errors. Also note this file (Dashboard.jsx)
is itself the default export used elsewhere, so the Task 39
page named "Dashboard" is aliased to DashboardTask39.
=========================================================
*/
import DashboardTask39 from "../dashboard/Dashboard.jsx";
import IncidentsTask39 from "../dashboard/Incidents";
import EscalationsTask39 from "../dashboard/Escalations";
import ReplayTask39 from "../dashboard/Replay";
import EvidenceTask39 from "../dashboard/Evidence";
import RuntimeTask39 from "../dashboard/Runtime";

import "./Dashboard.css";

/* =====================================================
   TASK 30 — SELF-CONTAINED ROUTER SUB-APP
   Mirrors the App.jsx you supplied, renamed to avoid
   clashing with this file's own default export (also
   called "Dashboard").
===================================================== */
export function Task30App() {
  /*
    TASK 30 FIX

    Do NOT mount another <Routes> tree here.

    This Dashboard is already running inside the application's
    BrowserRouter. The previous Task30App used its own Routes with
    path="/" which could match the parent application's URL instead
    of rendering the Task 30 content.

    Task 30 is therefore kept visually and functionally identical,
    but its internal navigation is state-driven.
  */

  const [task30Page, setTask30Page] = useState("dashboard");

  const task30Pages = [
    { id: "dashboard", label: "Dashboard" },
    { id: "signals", label: "Signals" },
    { id: "telemetry", label: "Telemetry" },
    { id: "incidents", label: "Incidents" },
    { id: "escalations", label: "Escalations" },
    { id: "decisions", label: "Decisions" },
    { id: "replay", label: "Replay" },
    { id: "runtime", label: "Runtime Logs" },
  ];

  const renderTask30Page = () => {
    switch (task30Page) {
      case "dashboard":
        return <EDODemonstration />;

      case "signals":
        return <Signals />;

      // case "telemetry":
      //   return <TelemetryTask30 />;

      case "incidents":
        return <Incidents />;

      case "escalations":
        return <EscalationsTask30 />;

      case "decisions":
        return <DecisionsTask30 />;

      case "replay":
        return <ReplayTask30 />;

      case "runtime":
        return <RuntimeLogs />;

      default:
        return <EDODemonstration />;
    }
  };

  return (
    <div
      className="task30-inner"
      style={{
        width: "100%",
        minHeight: "700px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="task30-nav"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "16px",
          marginBottom: "20px",
          borderRadius: "10px",
          background: "#111827",
        }}
      >
        {task30Pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setTask30Page(page.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "7px",
              border: "1px solid #374151",
              cursor: "pointer",
              background:
                task30Page === page.id ? "#2563eb" : "#1f2937",
              color: "#ffffff",
              fontWeight:
                task30Page === page.id ? "700" : "500",
            }}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div
        className="task30-content"
        style={{
          width: "100%",
          minHeight: "600px",
        }}
      >
        {renderTask30Page()}
      </div>
    </div>
  );
}

/* =====================================================
   TASK 32 — SELF-CONTAINED ROUTER SUB-APP
   Mirrors the new App.jsx you supplied:
     "/"       -> RuntimeDashboard
     "/replay" -> ReplayView
     "/logs"   -> RuntimeLogs
   Mounted wholesale via Task32App, exactly like Task 30
   is mounted via Task30App.
===================================================== */
/* =====================================================
   TASK 32 — ROUTER SUB-APP
===================================================== */

function Task32App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<RuntimeDashboardTask32 />}
      />

      <Route
        path="replay"
        element={<ReplayViewTask32 />}
      />

      <Route
        path="logs"
        element={<RuntimeLogsTask32 />}
      />
    </Routes>
  );
}

function Task34App() {
  return (
    <Routes>
      <Route path="/" element={<CanonicalPlatform />}>

        <Route index element={<DashboardTask34 />} />

        <Route
          path="signals"
          element={<SignalsTask34 />}
        />

        <Route
          path="telemetry"
          element={<TelemetryTask34 />}
        />

        <Route
          path="incidents"
          element={<IncidentsTask34 />}
        />

        <Route
          path="escalations"
          element={<EscalationsTask34 />}
        />

        <Route
          path="replay"
          element={<ReplayTask34 />}
        />

        <Route
          path="evidence"
          element={<Evidence />}
        />

        <Route
          path="observability"
          element={<ObservabilityTask34 />}
        />

        <Route
          path="review-packets"
          element={<ReviewPackets />}
        />

      </Route>
    </Routes>
  );
}

/* Task 37 wrapper */
const renderTask37 = () => {
  return (
    <div className="task37-wrapper">
      <AppRoutes />
    </div>
  );
};

/* =====================================================
   TASK 39 — SELF-CONTAINED ROUTER SUB-APP
   Mirrors the App.jsx you supplied for Task 39: a sidebar
   layout with links to Dashboard / Incidents / Escalations /
   Replay / Evidence / Runtime, each mounted at an absolute
   path ("/dashboard", "/incidents", etc.), exactly the same
   mounting convention used by Task30App / Task32App / Task34App
   above. Mounted wholesale via Task39App rather than switched
   internally, since it brings its own routes and its own
   sidebar/link-based navigation (not the top-nav button strip
   used by Tasks 14/15/16/17/26/27).
===================================================== */
function Task39App() {
  const task39LinkStyle = {
    color: "#e5e7eb",
    textDecoration: "none",
    display: "block",
    padding: "12px",
    borderRadius: "8px",
    background: "#1f2937"
  };

  return (
    <div className="task39-layout" style={{ display: "flex" }}>
      {/* Sidebar */}

      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "#111827",
          borderRight: "1px solid #1f2937",
          padding: "20px"
        }}
      >
        <h2
          style={{
            color: "#38bdf8",
            marginBottom: "30px"
          }}
        >
          UCCIS Runtime
        </h2>

        <nav>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <li>
              <Link to="/dashboard" style={task39LinkStyle}>
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/incidents" style={task39LinkStyle}>
                Incidents
              </Link>
            </li>

            <li>
              <Link to="/escalations" style={task39LinkStyle}>
                Escalations
              </Link>
            </li>

            <li>
              <Link to="/replay" style={task39LinkStyle}>
                Replay
              </Link>
            </li>

            <li>
              <Link to="/evidence" style={task39LinkStyle}>
                Evidence
              </Link>
            </li>

            <li>
              <Link to="/runtime" style={task39LinkStyle}>
                Runtime
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}

      <main
        style={{
          flex: 1,
          padding: "25px",
          overflowY: "auto"
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<DashboardTask39 />} />

          <Route path="/incidents" element={<IncidentsTask39 />} />

          <Route path="/escalations" element={<EscalationsTask39 />} />

          <Route path="/replay" element={<ReplayTask39 />} />

          <Route path="/evidence" element={<EvidenceTask39 />} />

          <Route path="/runtime" element={<RuntimeTask39 />} />

          <Route
            path="*"
            element={
              <div>
                <h1>404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

const Dashboard = () => {
  /* =====================================================
     ACTIVE MAIN PAGE (internal, state-driven tasks)
  ===================================================== */

  const [activePage, setActivePage] =
    useState("task1");

  /* =====================================================
     TASK 14 ACTIVE PAGE
  ===================================================== */

  const [task14Page, setTask14Page] =
    useState("operations");

  /* =====================================================
     TASK 15 ACTIVE PAGE
     State-driven, same pattern as Task 14 — no router,
     no URL changes. Just an internal switch.
  ===================================================== */

  const [task15Page, setTask15Page] =
    useState("governance");

  const task15Pages = [
    { id: "governance", label: "Governance" },
    { id: "replay", label: "Replay" },
    { id: "telemetry", label: "Telemetry" },
    { id: "validation", label: "Validation" },
    { id: "operators", label: "Operators" },
    { id: "testing", label: "Testing" },
  ];

  /* =====================================================
     DASHBOARD MENU (internal tasks)
  ===================================================== */

  const menus = [
    {
      id: "task1",
      label: "Command Interface",
    },
    {
      id: "task2",
      label: "Traffic Dashboard",
    },
    {
      id: "task3",
      label: "Intelligence Dashboard",
    },
    {
      id: "task4",
      label: "Zone Intelligence Dashboard",
    },
    {
      id: "task5",
      label: "UCCIS Intelligence Dashboard",
    },
    {
      id: "task6",
      label: "Replay Dashboard",
    },
    {
      id: "task7",
      label: "Urban Intelligence Dashboard",
    },
    {
      id: "task8",
      label: "Run Intelligence Engine",
    },
    {
      id: "task9",
      label: "Mumbai Command Center",
    },
    {
      id: "task10",
      label: "Mumbai-Thane Ministerial",
    },
    {
      id: "task11",
      label: "Operational Observability",
    },
    {
      id: "task12",
      label: "Unified Governance",
    },
    {
      id: "task13",
      label: "Replay Reconstruction Platform",
    },
    {
      id: "task14",
      label: "UCCIS Command Center",
    },
    {
      id: "task15",
      label: "Routed Platform",
    },
    {
      id: "task16",
      label: "Executive Platform",
    },
    {
      id: "task17",
      label: "Executive Overview",
    },
    {
      id: "task18",
      label: "Governance Command",
    },
    {
      id: "task19",
      label: "Operational Platform",
    },
    {
      id: "task20",
      label: "Intelligence System",
    },
    {
      id: "task21",
      label: "System Operational",
    },
    {
      id: "task22",
      label: "Civic System",
    },
    {
      id: "task23",
      label: "Operational System",
    },
    {
      id: "task24",
      label: "Intelligence Module",
    },
    {
      id: "task25",
      label: "Runtime Command",
    },
    {
      id: "task26",
      label: "Operational Console",
    },
    {
      id: "task27",
      label: "Runtime Dashboard",
    },
    {
      id: "task28",
      label: "Command Centers",
    },
    {
      id: "task29",
      label: "Command Suite",
    },
    {
      id: "task30",
      label: "Router Command Center",
    },
    {
      id: "task31",
      label: "Operational",
    },
    {
      id: "task32",
      label: "Runtime Command Router",
    },
    {
      id: "task33",
      label: "Runtime Platform"
    },
    {
      id: "task34",
      label: "Critical Governance",
    },
    {
      id: "task35",
      label: "Runtime Operations Console",
    },
    {
      id: "task36",
      label: "Engine Sprint",
    },
    {
      id: "task37",
      label: "Production Sprint",
    },
    {
      id: "task38",
      label: "Convergence Platform",
    },
    {
      id: "task39",
      label: "UCCIS Runtime",
    },
  ];

  /* =====================================================
   TASK 12 STATE
===================================================== */

const [task12Page, setTask12Page] = useState("uccis-dashboard");

/* =====================================================
   TASK 12 PAGE RENDERER
===================================================== */

const renderTask12Page = () => {
  switch (task12Page) {
    case "uccis-dashboard":
      return <UCCISUnifiedDashboard />;

    case "dashboard":
      return <MinisterDashboardTask12 />;

    case "replay":
      return <ReplayCenter />;

    case "minster":
      return <MinisterOperationalCenter />;

    case "secretary":
      return <PrincipalSecretaryDashboard />;  

    case "osd":
      return <OSDOperationalCenter />;

    case "field":
      return <FieldOperationsDashboard />;

    case "replay-story":
      return <ReplayStoryPage />;

    case "replay-validation":
      return <ReplayValidationPage />;

    case "live":
      return <LiveOperationsPage />;

    case "technical-inspection":
      return <TechnicalInspectionPage />;

    case "admin":
      return <AdminModePage />;

    case "audit":
      return <AuditModePage />;

    case "reliability":
      return <ReliabilityOperationsPage />;

    case "pilot-proof":
      return <MinisterialPilotProofPage />;

    default:
      return <UCCISUnifiedDashboard />;
  }
};

/* =====================================================
   TASK 12 COMMAND CENTER
===================================================== */

const renderTask12 = () => {
  return (
    <div className="task12-wrapper">
      {/* ===============================================
          TASK 12 SUB-NAVIGATION
          (Governance / Escalation / Field Execution / Replay)
      =============================================== */}

      <div className="top-nav">
        {/* LOGO */}

        <div className="logo">
          Unified Governance
        </div>

        {/* NAVIGATION */}

        <div className="nav-links">

  <button
    type="button"
    className={task12Page === "uccis-dashboard" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("uccis-dashboard")}
  >
    Phase 1 - Governance UX
  </button>

  <button
    type="button"
    className={task12Page === "dashboard" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("dashboard")}
  >
    Phase 2 - Minister Layer
  </button>

  <button
    type="button"
    className={task12Page === "secretary" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("secretary")}
  >
    Phase 3 - Secretary Layer
  </button>

  <button
    type="button"
    className={task12Page === "osd" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("osd")}
  >
    Phase 4 - OSD + Field
  </button>

  <button
    type="button"
    className={task12Page === "replay-story" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("replay-story")}
  >
    Phase 5 - Replay Story
  </button>

  <button
    type="button"
    className={task12Page === "replay-validation" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("replay-validation")}
  >
    Phase 6 - Replay Validation
  </button>

  <button
    type="button"
    className={task12Page === "live" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("live")}
  >
    Phase 7 - Live Operations
  </button>

  <button
    type="button"
    className={task12Page === "technical-inspection" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("technical-inspection")}
  >
    Phase 8 - Technical Isolation
  </button>

  <button
    type="button"
    className={task12Page === "reliability" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("reliability")}
  >
    Phase 9 - Reliability
  </button>

  <button
    type="button"
    className={task12Page === "pilot-proof" ? "task12-nav-active" : ""}
    onClick={() => setTask12Page("pilot-proof")}
  >
    Phase 10 - Pilot Proof
  </button>

</div>

        {/* LIVE STATUS */}

        {/* <div className="live-status">
          ● LIVE
        </div> */}
      </div>

      {/* ===============================================
          TASK 12 PAGE CONTENT
      =============================================== */}

      <div className="task12-content">
        {renderTask12Page()}
      </div>
    </div>
  );
};

const getTask13PageFromPath = () => {
  const path = window.location.pathname;

  const phaseMap = {
    "/phase/replay": "replay",
    "/phase/concurrency": "concurrency",
    "/phase/corruption": "corruption",
    "/phase/lineage": "lineage",
    "/phase/enforcement": "enforcement",
    "/phase/field": "field",
    "/phase/stability": "stability",
    "/phase/governance": "governance",
    "/phase/failure": "failure",
    "/phase/final": "final",
  };

  return phaseMap[path] || "home";
};

const [task13Page, setTask13Page] = useState("home");

const navigateTask13 = (path, page) => {
  setTask13Page(page);
  window.history.pushState({}, "", path);

  // Tell React to re-render after changing the URL without
  // creating a second BrowserRouter.
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const renderTask13Page = () => {
  switch (task13Page) {

    case "home":
      return (
        <HomeDashboard
          onOpenOperationalDashboard={() =>
            navigateTask13("/phase/replay", "replay")
          }
        />
      );

    case "replay":
      return <ReplayCharts phase="replay" />;

    case "concurrency":
      return <ReplayCharts phase="concurrency" />;

    case "corruption":
      return <ReplayCharts phase="corruption" />;

    case "lineage":
      return <ReplayCharts phase="lineage" />;

    case "enforcement":
      return <ReplayCharts phase="enforcement" />;

    case "field":
      return <ReplayCharts phase="field" />;

    case "stability":
      return <ReplayCharts phase="stability" />;

    case "governance":
      return <ReplayCharts phase="governance" />;

    case "failure":
      return <ReplayCharts phase="failure" />;

    case "final":
      return <ReplayCharts phase="final" />;

    default:
      return <HomeDashboard />;
  }
};

/* =====================================================
   TASK 13 COMMAND CENTER
===================================================== */

const renderTask13 = () => {
  return (
    <div className="task13-wrapper">

      {/* ===============================================
          TASK 13 SUB-NAVIGATION
          Replay / Concurrency / Corruption / Lineage
          / Enforcement / Field / Stability /
          Governance / Failure
      =============================================== */}

      <div className="task13-top-nav">

        {/* LOGO */}

        <div className="task13-logo">
          UCCIS Replay System
        </div>


        {/* NAVIGATION */}

        <div className="task13-nav-links">

          <button
            type="button"
            className={task13Page === "replay" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/replay", "replay")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 1 — Replay
          </button>

          <button
            type="button"
            className={task13Page === "concurrency" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/concurrency", "concurrency")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 2 — Concurrency
          </button>

          <button
            type="button"
            className={task13Page === "corruption" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/corruption", "corruption")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 3 — Corruption
          </button>

          <button
            type="button"
            className={task13Page === "lineage" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/lineage", "lineage")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 4 — Lineage
          </button>

          <button
            type="button"
            className={task13Page === "enforcement" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/enforcement", "enforcement")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 5 — Enforcement
          </button>

          <button
            type="button"
            className={task13Page === "field" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/field", "field")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 6 — Field
          </button>

          <button
            type="button"
            className={task13Page === "stability" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/stability", "stability")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 7 — Stability
          </button>

          <button
            type="button"
            className={task13Page === "governance" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/governance", "governance")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 8 — Governance
          </button>

          <button
            type="button"
            className={task13Page === "failure" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/failure", "failure")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 9 — Failure
          </button>

          <button
            type="button"
            className={task13Page === "final" ? "task13-nav-active" : ""}
            onClick={() => navigateTask13("/phase/final", "final")}
            style={{
    width: "280px",
    height: "42px",
    padding: "8px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    marginBottom: "8px"
  }}
          >
            Phase 10 — Final
          </button>

        </div>

      </div>

      {/* ===============================================
          TASK 13 PAGE CONTENT
      =============================================== */}

      <div className="task13-content">

        {renderTask13Page()}

      </div>

    </div>
  );
};

  /* =====================================================
     NAV CLICK HANDLERS
  ===================================================== */

  const navigate = useNavigate();

  const handleTaskClick = (taskId) => {
    /*
      TASK 30 FIX:
      Task 30 is rendered inside this Dashboard as a state-driven
      sub-application. Do NOT navigate to /task30 here because
      this Dashboard file does not define a top-level /task30 route.
    */
    if (taskId === "task30") {
      setActivePage("task30");
      return;
    }

    setActivePage(taskId);
  };

  /* =====================================================
     TASK 14 PAGE RENDERER
  ===================================================== */

  const renderTask14Page = () => {
    switch (task14Page) {
      case "operations":
        return <Operations />;

      case "replay":
        return <Replay />;

      case "observability":
        return <Observability />;

      case "governance":
        return <Governance />;

      default:
        return <Operations />;
    }
  };

  /* =====================================================
     TASK 14 COMMAND CENTER
  ===================================================== */

  const renderTask14 = () => {
    return (
      <div className="task14-wrapper">
        {/* ===============================================
            TASK 14 SUB-NAVIGATION
            (Operations / Replay / Observability / Governance)
        =============================================== */}

        <div className="top-nav">
          {/* LOGO */}

          <div className="logo">
            UCCIS COMMAND CENTER
          </div>

          {/* NAVIGATION */}

          <div className="nav-links">
            <button
              type="button"
              className={
                task14Page === "operations"
                  ? "task14-nav-active"
                  : ""
              }
              onClick={() =>
                setTask14Page("operations")
              }
            >
              Operations
            </button>

            <button
              type="button"
              className={
                task14Page === "replay"
                  ? "task14-nav-active"
                  : ""
              }
              onClick={() =>
                setTask14Page("replay")
              }
            >
              Replay
            </button>

            <button
              type="button"
              className={
                task14Page === "observability"
                  ? "task14-nav-active"
                  : ""
              }
              onClick={() =>
                setTask14Page("observability")
              }
            >
              Observability
            </button>

            <button
              type="button"
              className={
                task14Page === "governance"
                  ? "task14-nav-active"
                  : ""
              }
              onClick={() =>
                setTask14Page("governance")
              }
            >
              Governance
            </button>
          </div>

          {/* LIVE STATUS */}

          {/* <div className="live-status">
            ● LIVE
          </div> */}
        </div>

        {/* ===============================================
            TASK 14 PAGE CONTENT
        =============================================== */}

        <div className="task14-content">
          {renderTask14Page()}
        </div>
      </div>
    );
  };

  /* =====================================================
     TASK 15 PAGE RENDERER
  ===================================================== */

  const renderTask15Page = () => {
    switch (task15Page) {
      case "governance":
        return <GovernanceTask15 />;

      case "replay":
        return <ReplayTask15 />;

      case "telemetry":
        return <Telemetry />;

      case "validation":
        return <Validation />;

      case "operators":
        return <Operators />;

      case "testing":
        return <Testing />;

      default:
        return <GovernanceTask15 />;
    }
  };

  /* =====================================================
     TASK 15 — STATE-DRIVEN COMMAND CENTER
     Mirrors the Task 14 pattern exactly: internal state,
     no router, no URL changes.
  ===================================================== */

  const renderTask15 = () => {
    return (
      <div className="task15-wrapper">
        <div className="top-nav">
          {/* LOGO */}

          <div className="logo">
            ROUTED PLATFORM
          </div>

          {/* NAVIGATION */}

          <div className="nav-links task15-nav">
            {task15Pages.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  task15Page === item.id
                    ? "task15-active"
                    : ""
                }
                onClick={() => setTask15Page(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* LIVE STATUS */}

          {/* <div className="live-status">
            ● LIVE
          </div> */}
        </div>

        {/* ===============================================
            TASK 15 PAGE CONTENT
        =============================================== */}

        <div className="task15-content">
          {renderTask15Page()}
        </div>
      </div>
    );
  };

  const [task16Page, setTask16Page] = useState("executiveDashboard");

  const task16Pages = [
    { id: "executive", label: "ExecutiveDashboard"},
    { id: "phase1", label: "Phase 1"},
    { id: "phase2", label: "Phase 2"},
    { id: "phase3", label: "Phase 3"},
    { id: "phase4", label: "Phase 4"},
    { id: "phase5", label: "Phase 5"},
    { id: "phase6", label: "Phase 6"},
    { id: "phase7", label: "Phase 7"},
  ];

    /* =====================================================
     TASK 16 PAGE RENDERER
  ===================================================== */
  const renderTask16Page = () => {
    switch (task16Page) {
      case "executiveDashboard":
        return <ExecutiveDashboard />;

      case "phase1":
        return <Phase1 />;

      case "phase2":
        return <Phase2 />;

      case "phase3":
        return <Phase3 />;

      case "phase4":
        return <Phase4 />;

      case "phase5":
        return <Phase5 />;

      case "phase6":
        return <Phase6 />;

      case "phase7":
        return <Phase7 />;

      default:
        return <ExecutiveDashboard />;
    }
  };

   /* =====================================================
     TASK 16 — STATE-DRIVEN COMMAND CENTER
  ===================================================== */

  const renderTask16 = () => {
    return (
      <div className="task16-wrapper">
        <div className="top-nav">
          {/* LOGO */}

          <div className="logo">
            Executive Platform
          </div>

          {/* NAVIGATION */}

          <div className="nav-links task16-nav">
            {task16Pages.map((item) => (
              <button
              key={item.id}
              type="button"
              className={
                task16Page === item.id
                ? "task16-active"
                : ""
              }
              onClick={() => setTask16Page(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

           {/* LIVE STATUS */}

          {/* <div className="live-status">
            ● LIVE
          </div> */}
        </div>
        {/* ===============================================
            TASK 16 PAGE CONTENT
        =============================================== */}

        <div className="task16-content">
          {renderTask16Page()}
        </div>
      </div>
    );
  };

  const [task17Page, setTask17Page] = useState("executiveOverview");

  const task17Pages = [
    { id: "executive", label: "ExecutiveOverview"},
    { id: "replayreconstruct", label: "ReplayReconstruction"},
    { id: "operational", label: "OperationalStress"},
    { id: "entropy", label: "EntropyFailure"},
    { id: "escalationvis", label: "EscalationVisibility"},
    { id: "field", label: "FieldContinuity"},
  ];

  const renderTask17Page = () => {
    switch (task17Page) {
      case "executiveOverview":
        return <ExecutiveOverview />;

      case "replayReconstruction":
        return <ReplayReconstruction />;

      case "operational":
        return <OperationalStress />;

      case "entropy":
        return <EntropyFailure />;

      case "escalationVisibility":
        return <EscalationVisibility />;

      case "field":
        return <FieldContinuity />;

      default:
        return <ExecutiveOverview />;
    }
  };

  const renderTask17 = () => {
    return (
      <div className="task17-wrapper">
        <div className="top-nav">
          {/* LOGO */}

          <div className="logo">
            EXECUTIVE OVERVIEW
          </div>

          {/* NAVIGATION */}

          <div className="nav-links task17-nav">
            {task17Pages.map((item) => (
              <button
              key={item.id}
              type="button"
              className={
                task17Page === item.id
                ? "task17-active"
                : ""
              }
              onClick={() => setTask17Page(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* LIVE STATUS */}

          {/* <div className="live-status">
            ● LIVE
          </div> */}
        </div>
        {/* ===============================================
            TASK 17 PAGE CONTENT
        =============================================== */}

        <div className="task17-content">
          {renderTask17Page()}
        </div>
      </div>
    );
  };

  /* =====================================================
     TASK 26 ACTIVE PAGE
     State-driven, same pattern as Tasks 14-17 — no router,
     no URL changes, no Sidebar import (see the Task 26
     import note above for why).
  ===================================================== */

  const [task26Page, setTask26Page] = useState("telemetry");

  const task26Pages = [
    { id: "telemetry", label: "Telemetry" },
    { id: "runtime", label: "Runtime" },
    { id: "replay", label: "Replay" },
  ];

  const renderTask26Page = () => {
    switch (task26Page) {
      case "telemetry":
        return <TelemetryTask26 />;

      case "runtime":
        return <RuntimeTask26 />;

      case "replay":
        return <ReplayTask26 />;

      default:
        return <TelemetryTask26 />;
    }
  };

  const renderTask26 = () => {
    return (
      <div className="task26-wrapper">
        <div className="top-nav">
          {/* LOGO */}

          <div className="logo">
            OPERATIONAL CONSOLE
          </div>

          {/* NAVIGATION */}

          <div className="nav-links task26-nav">
            {task26Pages.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  task26Page === item.id
                    ? "task26-active"
                    : ""
                }
                onClick={() => setTask26Page(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* LIVE STATUS */}

          {/* <div className="live-status">
            ● LIVE
          </div> */}
        </div>

        {/* ===============================================
            TASK 26 PAGE CONTENT
        =============================================== */}

        <div className="task26-content">
          {renderTask26Page()}
        </div>
      </div>
    );
  };

  const [task27Page, setTask27Page] = useState("dashboard");

  const task27Pages = [
    { id: "runtimeDashboard", label: "RuntimeDashboard" },
    { id: "runtime", label: "Runtime" },
    { id: "signals", label: "Signals" },
  ];

  const renderTask27Page = () => {
    switch (task27Page) {
      case "runtimeDashboard":
        return <RuntimeDashboard />;

      case "runtime":
        return <Runtime />;

      case "signals":
        return <SignalsTask27 />;

      default:
        return <RuntimeDashboard/>;
    }
  };

  const renderTask27 = () => {
    return (
      <div className="task27-wrapper">
        <div className="top-nav">
          {/* LOGO */}

          <div className="logo">
            RUNTIME DASHBOARD
          </div>

          {/* NAVIGATION */}

          <div className="nav-links task27-nav">
            {task27Pages.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  task27Page === item.id
                    ? "task27-active"
                    : ""
                }
                onClick={() => setTask27Page(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* LIVE STATUS */}

          {/* <div className="live-status">
            ● LIVE
          </div> */}
        </div>

        {/* ===============================================
            TASK 27 PAGE CONTENT
        =============================================== */}

        <div className="task27-content">
          {renderTask27Page()}
        </div>
      </div>
    );
  };

  /* =====================================================
     TASK 29 — UCCIS COMMAND SUITE
     State-driven, same pattern as Tasks 14-27. Task 29's own
     App.jsx used a Sidebar + Header layout (rather than the
     top-nav button strip used by Tasks 14/15/16/17/26/27), so
     that layout is preserved here — SidebarTask29 receives the
     internal task29Page state directly, mirroring how it drove
     React Router-free navigation in the original file.
  ===================================================== */

  const [task29Page, setTask29Page] = useState("demonstration");

  const summaryTask29 = {
    signals: 12,
    telemetry: 20,
    incidents: 8,
    runtimeLogs: 50
  };

  const sampleDataTask29 = [
    { id: 1, signal_id: 101, signal_type: "Flood Alert" },
    { id: 2, signal_id: 102, signal_type: "Flood Alert" },
    { id: 3, signal_id: 103, signal_type: "Flood Alert" },
    { id: 4, signal_id: 104, signal_type: "Flood Alert" },
    { id: 5, signal_id: 105, signal_type: "Flood Alert" },

    { id: 6, signal_id: 106, signal_type: "Traffic Incident" },
    { id: 7, signal_id: 107, signal_type: "Traffic Incident" },
    { id: 8, signal_id: 108, signal_type: "Traffic Incident" },

    { id: 9, signal_id: 109, signal_type: "Medical Emergency" },
    { id: 10, signal_id: 110, signal_type: "Medical Emergency" },
    { id: 11, signal_id: 111, signal_type: "Medical Emergency" },
    { id: 12, signal_id: 112, signal_type: "Medical Emergency" },

    { id: 13, signal_id: 113, signal_type: "Power Failure" },
    { id: 14, signal_id: 114, signal_type: "Power Failure" },

    { id: 15, signal_id: 115, signal_type: "Cyber Incident" },
    { id: 16, signal_id: 116, signal_type: "Cyber Incident" },
    { id: 17, signal_id: 117, signal_type: "Cyber Incident" },
    { id: 18, signal_id: 118, signal_type: "Cyber Incident" },
    { id: 19, signal_id: 119, signal_type: "Cyber Incident" },
    { id: 20, signal_id: 120, signal_type: "Cyber Incident" }
  ];

  const renderTask29Page = () => {
    switch (task29Page) {
      case "dashboard":
        return <Demonstration summary={summaryTask29} />;

      case "signals":
        return <SignalsTask29 data={sampleDataTask29} />;

      case "telemetry":
        return <TelemetryTask29 data={sampleDataTask29} />;

      case "incidents":
        return <IncidentsTask29 data={sampleDataTask29} />;

      case "escalations":
        return <Escalations data={sampleDataTask29} />;

      case "decisions":
        return <Decisions data={sampleDataTask29} />;

      case "replaySessions":
        return <ReplaySessions data={sampleDataTask29} />;

      case "runtimeLogs":
        return <RuntimeLogsTask29 data={sampleDataTask29} />;

      case "analytics":
        return <Analytics />;

      // case "systemHealth":
      //   return (
      //     <div className="content-card">
      //       <h2>System Health</h2>

      //       <p>
      //         Backend Status :
      //         <strong> ONLINE</strong>
      //       </p>

      //       <p>
      //         Database Status :
      //         <strong> CONNECTED</strong>
      //       </p>

      //       <p>
      //         Runtime Engine :
      //         <strong> ACTIVE</strong>
      //       </p>
      //     </div>
      //   );

      default:
        return <Demonstration summary={summaryTask29} />;
    }
  };

  const renderTask29 = () => {
    return (
      <div
  className="task29-wrapper"
  style={{
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    background: "#070b1d",
  }}
>
  <SidebarTask29
    activePage={task29Page}
    setActivePage={setTask29Page}
  />

  <div
    className="main-content"
    style={{
      flex: 1,
      marginLeft: "280px",
      padding: "24px",
      width: "calc(100% - 280px)",
      overflowX: "hidden",
    }}
  >
    <HeaderTask29 />

    {renderTask29Page()}
  </div>
</div>
    );
  };

  /* =====================================================
     TASK 30 — ROUTER COMMAND CENTER
     Task 30 brings its own React Router tree (BrowserRouter
     + Routes + MainLayout), unlike Tasks 1-29. It is mounted
     wholesale via Task30App (defined above, outside this
     component) rather than switched internally.
  ===================================================== */

  const renderTask30 = () => {
    return (
      <div className="task30-wrapper">
        <Task30App />
      </div>
    );
  };

  /* =====================================================
     TASK 32 — RUNTIME COMMAND ROUTER
     Same pattern as Task 30: this task brings its own
     React Router tree ("/", "/replay", "/logs"), so it is
     mounted wholesale via Task32App (defined above, outside
     this component) rather than switched internally.
  ===================================================== */

  /* =====================================================
   TASK 32 PAGE STATE
===================================================== */

const [task32Page, setTask32Page] = useState("runtime");


/* =====================================================
   TASK 32 PAGE RENDERER
===================================================== */

const renderTask32Page = () => {
  switch (task32Page) {

    case "runtime":
      return <RuntimeDashboardTask32 />;

    case "replay":
      return <ReplayViewTask32 />;

    case "logs":
      return <RuntimeLogsTask32 />;

    default:
      return <RuntimeDashboardTask32 />;
  }
};


/* =====================================================
   TASK 32 — RUNTIME COMMAND ROUTER
===================================================== */

const renderTask32 = () => {
  /*
   * TASK 32 FIX
   *
   * RuntimeDashboardTask32 already contains the complete Task 32
   * dashboard UI (sidebar, header, runtime health cards, charts, etc.).
   * Do not wrap it in another Task 32 navigation/header.
   */
  return <RuntimeDashboardTask32 />;
};

   /* =====================================================
   TASK 34 PAGE STATE
===================================================== */

const [task34Page, setTask34Page] = useState("dashboard");

const task34Pages = [
  { id: "dashboard", label: "Dashboard" },
  { id: "signals", label: "Signals" },
  { id: "telemetry", label: "Telemetry" },
  { id: "incidents", label: "Incidents" },
  { id: "escalations", label: "Escalations" },
  { id: "replay", label: "Replay" },
  { id: "evidence", label: "Evidence" },
  { id: "observability", label: "Observability" },
  { id: "review-packets", label: "Review Packets" },
];


/* =====================================================
   TASK 34 PAGE RENDERER
===================================================== */

const renderTask34Page = () => {
  switch (task34Page) {

    case "dashboard":
      return <CanonicalPlatform />;

    case "signals":
      return <SignalsTask34 />;

    case "telemetry":
      return <TelemetryTask34 />;

    case "incidents":
      return <IncidentsTask34 />;

    case "escalations":
      return <EscalationsTask34 />;

    case "replay":
      return <ReplayTask34 />;

    case "evidence":
      return <Evidence />;

    case "observability":
      return <ObservabilityTask34 />;

    case "review-packets":
      return <ReviewPackets />;

    default:
      return <CanonicalPlatform />;
  }
};


/* =====================================================
   TASK 34 — CRITICAL GOVERNANCE
===================================================== */

const renderTask34 = () => {
  return (
    <div className="task34-wrapper">

      {/* ===============================================
          TASK 34 SUB-NAVIGATION
      =============================================== */}

      <div className="top-nav">

        <div className="logo">
          Critical Governance
        </div>

        <div className="nav-links task34-nav">

          {task34Pages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                task34Page === item.id
                  ? "task34-active"
                  : ""
              }
              onClick={() => setTask34Page(item.id)}
            >
              {item.label}
            </button>
          ))}

        </div>
      </div>


      {/* ===============================================
          TASK 34 PAGE CONTENT
      =============================================== */}

      <div className="task34-content">
        {renderTask34Page()}
      </div>

    </div>
  );
};

  /* =====================================================
     TASK 35 — RUNTIME OPERATIONS CONSOLE
     Task 35's own App.jsx was a full standalone layout
     (Sidebar + module switch + a live stats fetch), similar
     in spirit to Task 29's Sidebar-driven layout above but
     with its own component set. Its internal `selectedModule`
     state is renamed task35Module below to avoid confusion
     with this file's own top-level `activePage` state, and its
     `stats`/`loadStats` are renamed to match. The Dashboard
     section itself is otherwise reproduced as-is.
  ===================================================== */

  const [task35Module, setTask35Module] = useState("Dashboard");

  const [task35Stats, setTask35Stats] = useState({
    activeSignals: 24,
    incidents: 8,
    escalations: 3,
    traces: 17
  });

  useEffect(() => {
    loadTask35Stats();
  }, []);

  const loadTask35Stats = async () => {
    try {
      const res = await api.get("/analytics/stats");
      setTask35Stats(res.data);
    } catch (err) {
      console.log("Using demo values...");
    }
  };

  const renderTask35 = () => {
    return (
      <div className="layout">
        <SidebarTask35
          selectedModule={task35Module}
          setSelectedModule={setTask35Module}
        />

        <div className="content">
          <DashboardHeaderTask35 />

          {task35Module === "Dashboard" && (
            <>
              {/* Search */}
              <GlobalSearch />

              {/* KPI Cards */}
              <RuntimeKPIs />

              {/* Main Summary */}
              <SummaryCardsTask35 stats={task35Stats} />

              {/* Main Runtime Chart */}
              <RuntimeMetricsChartTask35 stats={task35Stats} />

              {/* Feed + Deployment */}
              <div className="two-column">
                <LiveRuntimeFeed />
                <DeploymentHealth />
              </div>

              {/* Active Ops + Health */}
              <div className="two-column">
                <ActiveOperations />
                <RuntimeHealthTask35 />
              </div>

              {/* Severity + Domain */}
              <div className="two-column">
                <IncidentSeverity />
                <DomainHealth />
              </div>

              {/* Timeline */}
              <TimelineReconstruction />

              {/* Trace Lineage */}
              <TraceLineage />

              {/* Historical */}
              <HistoricalOperations />

              {/* Multi Domain */}
              <MultiDomainPanel />

              {/* Replay Reconstruction (reuses Task 17's import) */}
              <ReplayReconstructionTask35 />

              {/* Replay + Evidence */}
              <div className="two-column">
                <ReplayMetrics />
                <EvidencePanelTask35 />
              </div>

              {/* Evidence Chain */}
              <EvidenceChain />

              {/* Operator Activity */}
              <OperatorActivityTask35 />

              {/* Platform Readiness */}
              <PlatformReadiness />
            </>
          )}

          {task35Module !== "Dashboard" && (
            <ModuleDrilldown selectedModule={task35Module} />
          )}
        </div>
      </div>
    );
  };

  /* =====================================================
     TASK 39 — UCCIS RUNTIME
     Same pattern as Task 30/32/34: this task brings its own
     React Router tree, plus its own Sidebar with Links (rather
     than the top-nav button strip). It is mounted wholesale
     via Task39App (defined above, outside this component)
     rather than switched internally.
  ===================================================== */

  const renderTask39 = () => {
    return (
      <div className="task39-wrapper">
        <Task39App />
      </div>
    );
  };

  /* =====================================================
     RENDER ACTIVE PAGE (internal, state-driven tasks)
  ===================================================== */

  const renderPage = () => {
    switch (activePage) {
      /* =================================================
         TASK 1
      ================================================= */

      case "task1":
        return (
          <>
            <h2 className="section-title">
              Command Interface
            </h2>

            <CommandInterface />
          </>
        );

      /* =================================================
         TASK 2
      ================================================= */

      case "task2":
        return (
          <>
            <h2 className="section-title">
              Traffic Dashboard
            </h2>

            <TrafficDashboard />
          </>
        );

      /* =================================================
         TASK 3
      ================================================= */

      case "task3":
        return (
          <>
            <h2 className="section-title">
              Intelligence Dashboard
            </h2>

            <IntelligenceDashboard />
          </>
        );

      /* =================================================
         TASK 4
      ================================================= */

      case "task4":
        return (
          <>
            <h2 className="section-title">
              Zone Intelligence Dashboard
            </h2>

            <ZoneIntelligenceDashboard />
          </>
        );

      /* =================================================
         TASK 5
      ================================================= */

      case "task5":
        return (
          <>
            <h2 className="section-title">
              UCCIS Intelligence Dashboard
            </h2>

            <UCCISIntelligenceDashboard />
          </>
        );

      /* =================================================
         TASK 6
      ================================================= */

      case "task6":
        return (
          <>
            <h2 className="section-title">
              Replay Dashboard
            </h2>

            <ReplayDashboard />
          </>
        );

      /* =================================================
         TASK 7
      ================================================= */

      case "task7":
        return (
          <>
            <h2 className="section-title">
              Urban Intelligence Dashboard
            </h2>

            <UrbanIntelligence />
          </>
        );

      /* =================================================
         TASK 8
      ================================================= */

      case "task8":
        return (
          <>
            <h2 className="section-title">
              Run Intelligence Engine
            </h2>

            <IntelligenceEngine />
          </>
        );

      /* =================================================
         TASK 9
      ================================================= */

      case "task9":
        return (
          <>
            <h2 className="section-title">
              Mumbai Command Center
            </h2>

            <MinisterDashboardTask9 />
          </>
        );

      /* =================================================
         TASK 10
      ================================================= */

      case "task10":
        return (
          <>
            <h2 className="section-title">
              Mumbai-Thane Ministerial
            </h2>

            <GovernanceDashboard />
          </>
        );

      /* =================================================
         TASK 11
      ================================================= */

      case "task11":
        return (
          <>
            <h2 className="section-title">
              Operational Observability
            </h2>

            <ObservabilityDashboard />
          </>
        );

      /* =================================================
         TASK 12
         UNIFIED GOVERNANCE
      ================================================= */

      case "task12":
        return (
          <>
            <h2 className="section-title">
              Unified Governance
            </h2>

            {renderTask12()}
          </>
        );

      /* =================================================
         TASK 13
         REPLAY RECONSTRUCTION PLATFORM
      ================================================= */

      case "task13":
        return (
          <>
            <h2 className="section-title">
              Replay Reconstruction Platform
            </h2>

            {renderTask13()}
          </>
        );

      /* =================================================
         TASK 14
         UCCIS COMMAND CENTER
      ================================================= */

      case "task14":
        return (
          <>
            <h2 className="section-title">
              UCCIS Command Center
            </h2>

            {renderTask14()}
          </>
        );

      /* =================================================
         TASK 15
         ROUTED PLATFORM (state-driven)
      ================================================= */

      case "task15":
        return (
          <>
            <h2 className="section-title">
              Routed Platform
            </h2>

            {renderTask15()}
          </>
        );

      /* =================================================
         TASK 16
         EXECUTIVE PLATFORM
      ================================================= */

        case "task16":
        return (
          <>
            <h2 className="section-title">
              Executive Platform
            </h2>

            {renderTask16()}
          </>
        );
      /* =================================================
         TASK 17
         EXECUTIVE OVERVIEW
      ================================================= */

       case "task17":
        return (
          <>
            <h2 className="section-title">
              Executive Overview
            </h2>

            {renderTask17()}
          </>
        );

        /* Task 18 */

        case "task18":
        return (
          <>
            <h2 className="section-title">
              Governance Command Center
            </h2>

            <GovernanceCommandCenter />
          </>
        );

        /* Task 19 */

        case "task19":
          return (
            <>
              <h2 className="section-title">
                Operational Platform
              </h2>

              <OperationalLayer />
            </>
          );

          /* Task 20 */

          case "task20":
            return (
              <>
                <h2 className="section-title">
                  Intelligence System
                </h2>

                <ControlIntelligenceSystem />
              </>
            );

            /* Task 21 */

            case "task21":
              return (
                <>
                  <h2 className="section-title">
                    System Operational
                  </h2>

                  <SystemOperational />
                </>
              );

              /* Task 22 */

              case "task22":
                return (
                  <>
                    <h2 className="section-title">
                      Civic System
                    </h2>

                    <CivicIntelligenceSystem />
                  </>
                );

                /* Task 23 */

                case "task23":
                  return (
                    <>
                      <h2 className="section-title">
                        Operational System
                      </h2>

                      <OperationalSystem />
                    </>
                  );

                  /* Task 24 */

                  case "task24":
                    return (
                      <>
                        <h2 className="section-title">
                          Intelligence Module
                        </h2>

                        <IntelligenceModule />
                      </>
                    );

                    /* Task 25 */

                    case "task25":
                      return (
                        <>
                          <h2 className="section-title">
                            Runtime Command
                          </h2>

                          <Home />
                        </>
                      );

                      /* Task 26 */

                      case "task26":
                        return (
                          <>
                            <h2 className="section-title">
                              Operational Console
                            </h2>

                            {renderTask26()}
                          </>
                        );

                        /* Task 27 */

                      case "task27":
                        return (
                          <>
                            <h2 className="section-title">
                              Runtime Dashboard
                            </h2>

                            {renderTask27()}
                          </>
                        );

                        /* Task 28 */

                        case "task28":
                          return (
                            <>
                              <h2 className="section-title">
                                Command Centers
                              </h2>

                              <CommandCenters />
                            </>
                          );

                          /* Task 29 */

                          case "task29":
                            return (
                              <>
                                <h2 className="section-title">
                                  Command Suite
                                </h2>

                                {renderTask29()}
                              </>
                            );

                          /* Task 30 */

                          case "task30":
                            return (
                              <>
                                <h2 className="section-title">
                                  Router Command Center
                                </h2>

                                {renderTask30()}
                              </>
                            );

                            /* Task 31 */

                            case "task31":
                              return (
                                <>
                                  <h2 className="section-title">
                                    Operational Dashboard
                                  </h2>

                                  <Operational />
                                </>
                              );

                            /* Task 32 */

                            case "task32":
                              /*
                               * TASK 32 FIX
                               * Render the real Task 32 dashboard directly.
                               * The old section title and wrapper added an
                               * extra "Runtime Command Router" layer above
                               * the dashboard shown in the reference UI.
                               */
                              return <RuntimeDashboardTask32 />;

                              /* Task 33*/

                              case "task33":
                                return (
                                  <>
                                    <h2 className="section-title">
                                      Runtime Platform
                                    </h2>

                                    <CommandCenter />
                                  </>
                                );

                                /* Task 34 */

                            case "task34":
                              return (
                                <>
                                  <h2 className="section-title">
                                    Critical Governance
                                  </h2>

                                  {renderTask34()}
                                </>
                              );

                              /* Task 35 */

                            case "task35":
                              return (
                                <>
                                  <h2 className="section-title">
                                    Runtime Operations Console
                                  </h2>

                                  {renderTask35()}
                                </>
                              );

                              /* Task 36 */

                              case "task36":
                                return (
                                  <>
                                    <h2 className="section-title">
                                      Engine Sprint
                                    </h2>

                                    <RuntimeEngine />
                                  </>
                                );

                                /* Task 37 */
                                
                                case "task37":
                                  return (
                                    <>
                                      <h2 className="section-title">
                                        Production Sprint
                                      </h2>

                                      {renderTask37()}
                                    </>
                                  );

                                  /* Task 38 */

                                  case "task38":
                                    return (
                                    <div className="task38-layout">
                                    <Sidebar />
                                    <div className="task38-main">
                                    <Header />
                                    <AppRoutesTask38 />
                                    </div>
                                    </div>
                                    );

                                  /* Task 39 */

                                  case "task39":
                                    return (
                                      <>
                                        <h2 className="section-title">
                                          UCCIS Runtime
                                        </h2>

                                        {renderTask39()}
                                      </>
                                    );
      /* =================================================
         DEFAULT
      ================================================= */

      default:
        return (
          <>
            <h2 className="section-title">
              Command Interface
            </h2>

            <CommandInterface />
          </>
        );
    }
  };

  /* =====================================================
     UCCIS WORKFLOW VIEW
     Replaces the old button-grid navigation with a
     connected workflow / architecture style interface.
  ===================================================== */

  const [workflowZoom, setWorkflowZoom] = useState(1);
  const [selectedWorkflowGroup, setSelectedWorkflowGroup] = useState("entry");
  const [selectedWorkflowTask, setSelectedWorkflowTask] = useState(null);

  const workflowGroups = [
    {
      id: "entry",
      title: "ENTRY & CONTROL",
      subtitle: "Central access and command",
      color: "#38bdf8",
      tasks: [
        { id: "task1", label: "Command Interface", short: "CONTROL" },
        { id: "task2", label: "Traffic Dashboard", short: "TRAFFIC" },
        { id: "task3", label: "Intelligence Dashboard", short: "INTELLIGENCE" },
        { id: "task4", label: "Zone Intelligence Dashboard", short: "ZONE INTEL" },
        { id: "task5", label: "UCCIS Intelligence Dashboard", short: "UCCIS INTEL" },
        { id: "task6", label: "Replay Dashboard", short: "REPLAY" },
      ],
    },
    {
      id: "intelligence",
      title: "INTELLIGENCE LAYER",
      subtitle: "Analysis, prediction and decision support",
      color: "#a78bfa",
      tasks: [
        { id: "task7", label: "Urban Intelligence Dashboard", short: "URBAN INTEL" },
        { id: "task8", label: "Run Intelligence Engine", short: "ENGINE" },
        { id: "task9", label: "Mumbai Command Center", short: "MUMBAI OPS" },
        { id: "task10", label: "Mumbai-Thane Ministerial", short: "MINISTERIAL" },
        { id: "task11", label: "Operational Observability", short: "OBSERVABILITY" },
        { id: "task12", label: "Unified Governance", short: "GOVERNANCE" },
      ],
    },
    {
      id: "command",
      title: "COMMAND & DECISION",
      subtitle: "Routing, executive and governance decisions",
      color: "#f59e0b",
      tasks: [
        { id: "task13", label: "Replay Reconstruction Platform", short: "RECONSTRUCTION" },
        { id: "task14", label: "UCCIS Command Center", short: "COMMAND CENTER" },
        { id: "task15", label: "Routed Platform", short: "ROUTING" },
        { id: "task16", label: "Executive Platform", short: "EXECUTIVE" },
        { id: "task17", label: "Executive Overview", short: "OVERVIEW" },
        { id: "task18", label: "Governance Command", short: "GOV COMMAND" },
      ],
    },
    {
      id: "operations",
      title: "OPERATIONAL SYSTEMS",
      subtitle: "Core civic and operational services",
      color: "#22c55e",
      tasks: [
        { id: "task19", label: "Operational Platform", short: "OPS PLATFORM" },
        { id: "task20", label: "Intelligence System", short: "INTEL SYSTEM" },
        { id: "task21", label: "System Operational", short: "SYSTEM OPS" },
        { id: "task22", label: "Civic System", short: "CIVIC" },
        { id: "task23", label: "Operational System", short: "OPERATIONS" },
        { id: "task24", label: "Intelligence Module", short: "MODULE" },
      ],
    },
    {
      id: "runtime",
      title: "RUNTIME & COMMAND",
      subtitle: "Live execution, routing and consoles",
      color: "#06b6d4",
      tasks: [
        { id: "task25", label: "Runtime Command", short: "RUNTIME CMD" },
        { id: "task26", label: "Operational Console", short: "CONSOLE" },
        { id: "task27", label: "Runtime Dashboard", short: "RUNTIME" },
        { id: "task28", label: "Command Centers", short: "CENTERS" },
        { id: "task29", label: "Command Suite", short: "SUITE" },
        { id: "task30", label: "Router Command Center", short: "ROUTER" },
      ],
    },
    {
      id: "platform",
      title: "PLATFORM DELIVERY",
      subtitle: "Execution, governance, convergence and runtime",
      color: "#ec4899",
      tasks: [
        { id: "task31", label: "Operational", short: "OPERATIONAL" },
        { id: "task32", label: "Runtime Command Router", short: "CMD ROUTER" },
        { id: "task33", label: "Runtime Platform", short: "PLATFORM" },
        { id: "task34", label: "Critical Governance", short: "CRITICAL GOV" },
        { id: "task35", label: "Runtime Operations Console", short: "OPS CONSOLE" },
        { id: "task36", label: "Engine Sprint", short: "ENGINE SPRINT" },
        { id: "task37", label: "Production Sprint", short: "PRODUCTION" },
        { id: "task38", label: "Convergence Platform", short: "CONVERGENCE" },
        { id: "task39", label: "UCCIS Runtime", short: "UCCIS RUNTIME" },
      ],
    },
  ];

  const workflowTaskMap = {};
  workflowGroups.forEach((group) => {
    group.tasks.forEach((task) => {
      workflowTaskMap[task.id] = task;
    });
  });

  const selectedGroup = workflowGroups.find(
    (group) => group.id === selectedWorkflowGroup
  ) || workflowGroups[0];

  const openWorkflowGroup = (groupId) => {
    setSelectedWorkflowGroup(groupId);
    setSelectedWorkflowTask(null);
  };

  const selectWorkflowTask = (taskId) => {
    const task = workflowTaskMap[taskId];

    if (!task) return;

    setSelectedWorkflowTask(taskId);
    handleTaskClick(taskId);

    window.requestAnimationFrame(() => {
      const content = document.getElementById("uccis-workflow-content");
      if (content) {
        content.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  /* =====================================================
     MAIN DASHBOARD JSX
  ===================================================== */

  return (
    <div className="uccis-command-dashboard">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .uccis-command-dashboard {
          min-height: 100vh;
          width: 100%;
          display: flex;
          color: #e7eef8;
          background:
            radial-gradient(circle at 75% 0%, rgba(37, 99, 235, 0.14), transparent 30%),
            #07111f;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }

        /* SIDEBAR */
        .uccis-sidebar {
          width: 238px;
          min-width: 238px;
          min-height: 100vh;
          padding: 18px 13px;
          border-right: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(4, 12, 25, 0.96);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .uccis-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px 22px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.09);
        }

        .uccis-logo {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #2563eb, #0ea5e9);
          color: white;
          font-weight: 900;
          font-size: 16px;
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.28);
        }

        .uccis-brand-text strong {
          display: block;
          font-size: 14px;
          letter-spacing: 0.6px;
        }

        .uccis-brand-text span {
          display: block;
          margin-top: 3px;
          color: #60738e;
          font-size: 8px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .uccis-side-label {
          margin: 22px 9px 8px;
          color: #53667f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .uccis-side-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .uccis-side-item {
          width: 100%;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: #8193aa;
          cursor: pointer;
          text-align: left;
          transition: 0.18s ease;
        }

        .uccis-side-item:hover {
          background: rgba(30, 64, 175, 0.12);
          color: #dceaff;
        }

        .uccis-side-item.active {
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.24), rgba(14, 165, 233, 0.06));
          border-color: rgba(56, 189, 248, 0.18);
          color: #eff8ff;
        }

        .uccis-side-icon {
          width: 27px;
          height: 27px;
          flex: 0 0 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(148, 163, 184, 0.07);
          font-size: 10px;
          font-weight: 900;
        }

        .uccis-side-item.active .uccis-side-icon {
          color: var(--item-color);
          background: color-mix(in srgb, var(--item-color) 13%, transparent);
        }

        .uccis-side-name {
          flex: 1;
          font-size: 10px;
          font-weight: 750;
          line-height: 1.2;
        }

        .uccis-side-count {
          color: #4e637d;
          font-size: 8px;
          font-weight: 900;
        }

        .uccis-sidebar-bottom {
          margin-top: auto;
          padding-top: 14px;
        }

        .uccis-system-card {
          padding: 12px;
          border: 1px solid rgba(34, 197, 94, 0.16);
          border-radius: 11px;
          background: rgba(22, 101, 52, 0.08);
        }

        .uccis-system-card-top {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #86efac;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .uccis-system-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
        }

        .uccis-system-card p {
          margin: 7px 0 0;
          color: #5f7691;
          font-size: 8px;
          line-height: 1.45;
        }

        /* MAIN */
        .uccis-main {
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          overflow-y: auto;
        }

        .uccis-topbar {
          height: 67px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.10);
          background: rgba(7, 17, 31, 0.88);
          backdrop-filter: blur(18px);
          position: sticky;
          top: 0;
          z-index: 15;
        }

        .uccis-search {
          flex: 1;
          max-width: 610px;
          height: 39px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 10px;
          background: rgba(15, 29, 48, 0.85);
          color: #5e7692;
        }

        .uccis-search span {
          font-size: 15px;
        }

        .uccis-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #dbeafe;
          font-size: 10px;
        }

        .uccis-search input::placeholder {
          color: #566b84;
        }

        .uccis-top-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .uccis-top-action {
          width: 34px;
          height: 34px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 9px;
          background: #0c1a2d;
          color: #8ba0b8;
          cursor: pointer;
        }

        .uccis-top-action:hover {
          color: #e5f2ff;
          border-color: rgba(56, 189, 248, 0.35);
        }

        .uccis-user {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          margin-left: 5px;
          border-radius: 50%;
          background: linear-gradient(145deg, #2563eb, #0ea5e9);
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .uccis-page {
          padding: 25px 26px 34px;
          max-width: 1500px;
          margin: 0 auto;
        }

        .uccis-page-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 21px;
        }

        .uccis-page-head h1 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.4px;
        }

        .uccis-page-head p {
          margin: 6px 0 0;
          color: #71849b;
          font-size: 10px;
        }

        .uccis-refresh {
          padding: 9px 13px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 9px;
          background: #0d1b2d;
          color: #a9bbcf;
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
        }

        /* KPI CARDS */
        .uccis-kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin-bottom: 16px;
        }

        .uccis-kpi {
          position: relative;
          min-height: 104px;
          padding: 15px 16px;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 12px;
          background: linear-gradient(145deg, #0d1c30, #0a1728);
        }

        .uccis-kpi::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--kpi-color);
        }

        .uccis-kpi-label {
          color: #7589a1;
          font-size: 9px;
          font-weight: 800;
        }

        .uccis-kpi-value {
          margin-top: 12px;
          color: #f1f7ff;
          font-size: 24px;
          line-height: 1;
          font-weight: 850;
        }

        .uccis-kpi-sub {
          margin-top: 7px;
          color: #4f6680;
          font-size: 8px;
        }

        .uccis-kpi-icon {
          position: absolute;
          top: 14px;
          right: 15px;
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: color-mix(in srgb, var(--kpi-color) 12%, transparent);
          color: var(--kpi-color);
          font-size: 11px;
          font-weight: 900;
        }

        /* CONTENT GRID */
        .uccis-dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr);
          gap: 16px;
        }

        .uccis-panel {
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 13px;
          background: #0b192b;
          overflow: hidden;
        }

        .uccis-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px 17px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.10);
        }

        .uccis-panel-title {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .uccis-panel-title h2 {
          margin: 0;
          font-size: 13px;
        }

        .uccis-panel-title p {
          margin: 3px 0 0;
          color: #61758d;
          font-size: 8px;
        }

        .uccis-panel-badge {
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.11);
          color: #7db8ff;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        /* WORKFLOW */
        .uccis-workflow-list {
          padding: 13px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .uccis-workflow-row {
          display: grid;
          grid-template-columns: 32px minmax(0, 1fr) auto 18px;
          align-items: center;
          gap: 11px;
          min-height: 55px;
          padding: 7px 10px;
          border: 1px solid rgba(148, 163, 184, 0.09);
          border-radius: 10px;
          background: #0d1d31;
          cursor: pointer;
          text-align: left;
          color: #dbeafe;
          transition: 0.18s ease;
        }

        .uccis-workflow-row:hover,
        .uccis-workflow-row.active {
          border-color: color-mix(in srgb, var(--row-color) 45%, transparent);
          background: color-mix(in srgb, var(--row-color) 7%, #0d1d31);
          transform: translateX(2px);
        }

        .uccis-row-number {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          border: 1px solid color-mix(in srgb, var(--row-color) 45%, transparent);
          color: var(--row-color);
          font-size: 8px;
          font-weight: 900;
        }

        .uccis-row-info strong {
          display: block;
          font-size: 10px;
        }

        .uccis-row-info span {
          display: block;
          margin-top: 3px;
          color: #586f89;
          font-size: 7px;
        }

        .uccis-row-count {
          color: #5f7895;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .uccis-row-arrow {
          color: var(--row-color);
          font-size: 14px;
        }

        /* MODULES */
        .uccis-module-panel {
          margin-top: 16px;
        }

        .uccis-module-grid {
          padding: 13px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .uccis-module-card {
          min-height: 67px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px;
          border: 1px solid rgba(148, 163, 184, 0.10);
          border-radius: 9px;
          background: #0a1728;
          color: #dceaff;
          cursor: pointer;
          text-align: left;
          transition: 0.18s ease;
        }

        .uccis-module-card:hover,
        .uccis-module-card.active {
          border-color: var(--module-color);
          transform: translateY(-1px);
          box-shadow: 0 7px 18px rgba(0,0,0,0.20);
        }

        .uccis-module-index {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: color-mix(in srgb, var(--module-color) 10%, transparent);
          color: var(--module-color);
          font-size: 8px;
          font-weight: 900;
        }

        .uccis-module-card strong {
          font-size: 9px;
          line-height: 1.25;
        }

        .uccis-module-card span {
          display: block;
          margin-top: 3px;
          color: #536b85;
          font-size: 7px;
        }

        /* RIGHT COLUMN */
        .uccis-health-body {
          padding: 15px;
        }

        .uccis-health-score {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border: 1px solid rgba(34, 197, 94, 0.13);
          border-radius: 10px;
          background: rgba(22, 101, 52, 0.06);
        }

        .uccis-health-circle {
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 5px solid rgba(34, 197, 94, 0.55);
          color: #86efac;
          font-size: 14px;
          font-weight: 900;
        }

        .uccis-health-score strong {
          display: block;
          font-size: 11px;
        }

        .uccis-health-score span {
          display: block;
          margin-top: 4px;
          color: #5c738c;
          font-size: 8px;
        }

        .uccis-metric {
          padding: 12px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        }

        .uccis-metric:last-child {
          border-bottom: 0;
        }

        .uccis-metric-head {
          display: flex;
          justify-content: space-between;
          color: #8396ad;
          font-size: 8px;
        }

        .uccis-metric-head strong {
          color: #dbeafe;
          font-size: 8px;
        }

        .uccis-progress {
          height: 5px;
          margin-top: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: #13243a;
        }

        .uccis-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--metric-color);
        }

        .uccis-activity {
          margin-top: 16px;
        }

        .uccis-activity-list {
          padding: 4px 15px 12px;
        }

        .uccis-activity-item {
          display: flex;
          gap: 10px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        }

        .uccis-activity-item:last-child {
          border-bottom: 0;
        }

        .uccis-activity-dot {
          width: 7px;
          height: 7px;
          margin-top: 4px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: var(--activity-color);
          box-shadow: 0 0 8px var(--activity-color);
        }

        .uccis-activity-item strong {
          display: block;
          color: #cddbef;
          font-size: 8px;
        }

        .uccis-activity-item span {
          display: block;
          margin-top: 3px;
          color: #536b85;
          font-size: 7px;
        }

        /* RENDERED TASK */
        .uccis-rendered-panel {
          margin-top: 16px;
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 13px;
          background: #0b192b;
          overflow: hidden;
        }

        .uccis-rendered-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 13px 16px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.10);
        }

        .uccis-rendered-head h2 {
          margin: 0;
          font-size: 12px;
        }

        .uccis-rendered-head p {
          margin: 4px 0 0;
          color: #5e7590;
          font-size: 7px;
        }

        .uccis-back {
          padding: 7px 10px;
          border: 1px solid rgba(56, 189, 248, 0.22);
          border-radius: 7px;
          background: rgba(14, 116, 144, 0.08);
          color: #7dd3fc;
          cursor: pointer;
          font-size: 7px;
          font-weight: 900;
        }

        .uccis-rendered-content {
          padding: 0;
        }

        .uccis-empty {
          min-height: 210px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #61758e;
          font-size: 10px;
          padding: 25px;
        }

        .uccis-empty strong {
          display: block;
          color: #dbeafe;
          font-size: 14px;
          margin-bottom: 5px;
        }

        @media (max-width: 1100px) {
          .uccis-sidebar {
            width: 205px;
            min-width: 205px;
          }

          .uccis-kpis {
            grid-template-columns: repeat(2, 1fr);
          }

          .uccis-dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .uccis-command-dashboard {
            display: block;
            overflow: auto;
          }

          .uccis-sidebar {
            width: 100%;
            min-width: 0;
            min-height: auto;
            position: relative;
          }

          .uccis-side-nav {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .uccis-sidebar-bottom {
            display: none;
          }

          .uccis-topbar {
            position: relative;
            padding: 10px 14px;
          }

          .uccis-page {
            padding: 18px 14px 25px;
          }

          .uccis-page-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .uccis-kpis {
            grid-template-columns: 1fr 1fr;
          }

          .uccis-module-grid {
            grid-template-columns: 1fr;
          }
        }

        /* =====================================================
           UCCIS FONT SIZE — INCREASED FOR BETTER READABILITY
           ===================================================== */
        .uccis-page-head h1 {
          font-size: 30px;
        }

        .uccis-search input {
          font-size: 12px;
        }

        .uccis-brand-text strong {
          font-size: 16px;
        }

        .uccis-brand-text span {
          font-size: 9px;
        }

        .uccis-side-label {
          font-size: 10px;
        }

        .uccis-side-name {
          font-size: 12px;
        }

        .uccis-side-count {
          font-size: 9px;
        }

        .uccis-side-icon {
          font-size: 11px;
        }

        .uccis-kpi-label {
          font-size: 11px;
        }

        .uccis-kpi-value {
          font-size: 30px;
        }

        .uccis-kpi-sub {
          font-size: 10px;
        }

        .uccis-kpi-icon {
          font-size: 12px;
        }

        .uccis-panel-title h2 {
          font-size: 15px;
        }

        .uccis-panel-title p {
          font-size: 9px;
        }

        .uccis-panel-badge {
          font-size: 9px;
        }

        .uccis-row-number {
          font-size: 10px;
        }

        .uccis-row-info strong {
          font-size: 12px;
        }

        .uccis-row-info span {
          font-size: 9px;
        }

        .uccis-row-count {
          font-size: 9px;
        }

        .uccis-row-arrow {
          font-size: 16px;
        }

        .uccis-module-index {
          font-size: 10px;
        }

        .uccis-module-card strong {
          font-size: 11px;
        }

        .uccis-module-card span {
          font-size: 9px;
        }

        .uccis-health-circle {
          font-size: 16px;
        }

        .uccis-health-score strong {
          font-size: 13px;
        }

        .uccis-health-score span {
          font-size: 10px;
        }

        .uccis-metric-head {
          font-size: 10px;
        }

        .uccis-metric-head strong {
          font-size: 10px;
        }

        .uccis-activity-item strong {
          font-size: 10px;
        }

        .uccis-activity-item span {
          font-size: 9px;
        }

        .uccis-rendered-head h2 {
          font-size: 14px;
        }

        .uccis-rendered-head p {
          font-size: 9px;
        }

        .uccis-back {
          font-size: 9px;
        }

        .uccis-empty {
          font-size: 12px;
        }

        .uccis-empty strong {
          font-size: 16px;
        }

      `}</style>

      <aside className="uccis-sidebar">
        <div className="uccis-sidebar-brand">
          <div className="uccis-logo">U</div>
          <div className="uccis-brand-text">
            <strong>UCCIS</strong>
            <span>Unified Command Center</span>
          </div>
        </div>

        <div className="uccis-side-label">Workspace</div>

        <nav className="uccis-side-nav">
          <Link
            to="/ais"
            className="uccis-side-item"
            style={{ "--item-color": "#38bdf8", textDecoration: "none" }}
          >
            <span className="uccis-side-icon">AIS</span>
            <span className="uccis-side-name">AIS Intelligence</span>
            <span className="uccis-side-count">CSV</span>
          </Link>
          {workflowGroups.map((group, index) => (
            <button
              key={group.id}
              type="button"
              className={`uccis-side-item ${
                selectedWorkflowGroup === group.id ? "active" : ""
              }`}
              style={{ "--item-color": group.color }}
              onClick={() => openWorkflowGroup(group.id)}
            >
              <span className="uccis-side-icon">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="uccis-side-name">
                {group.title}
              </span>

              <span className="uccis-side-count">
                {group.tasks.length}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="uccis-main">
        <header className="uccis-topbar">
          {/* <div className="uccis-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search modules, commands, operations..."
              aria-label="Search modules"
            />
          </div> */}

          <div className="uccis-top-actions">
            {/* <button className="uccis-top-action" type="button" title="Alerts">
              ♧
            </button>
            <button className="uccis-top-action" type="button" title="System status">
              ◇
            </button> */}
            <button
              className="uccis-top-action"
              type="button"
              title="Refresh"
              onClick={() => window.location.reload()}
            >
              ↻
            </button>
            {/* <div className="uccis-user">U</div> */}
          </div>
        </header>

        <div className="uccis-page">
          <div className="uccis-page-head">
            <div>
              <h1>UCCIS Command Dashboard</h1>
              {/* <p>
                Monitor the platform, select a workflow layer, and open an
                operational module when required.
              </p> */}
            </div>

            {/* <button
              type="button"
              className="uccis-refresh"
              onClick={() => setSelectedWorkflowTask(null)}
            >
              ↻ Refresh View
            </button> */}
          </div>

          <section className="uccis-kpis">
            <div className="uccis-kpi" style={{ "--kpi-color": "#38bdf8" }}>
              <div className="uccis-kpi-label">WORKFLOW LAYERS</div>
              <div className="uccis-kpi-value">{workflowGroups.length}</div>
              <div className="uccis-kpi-sub">High-level command domains</div>
              <div className="uccis-kpi-icon">◈</div>
            </div>

            <div className="uccis-kpi" style={{ "--kpi-color": "#22c55e" }}>
              <div className="uccis-kpi-label">ACTIVE MODULES</div>
              <div className="uccis-kpi-value">{menus.length}</div>
              <div className="uccis-kpi-sub">Integrated UCCIS capabilities</div>
              <div className="uccis-kpi-icon">✓</div>
            </div>

            <div className="uccis-kpi" style={{ "--kpi-color": "#a78bfa" }}>
              <div className="uccis-kpi-label">SELECTED LAYER</div>
              <div className="uccis-kpi-value">
                {String(selectedWorkflowGroup === "entry" ? 1 :
                  selectedWorkflowGroup === "intelligence" ? 2 :
                  selectedWorkflowGroup === "command" ? 3 :
                  selectedWorkflowGroup === "operations" ? 4 :
                  selectedWorkflowGroup === "runtime" ? 5 : 6).padStart(2, "0")}
              </div>
              <div className="uccis-kpi-sub">{selectedGroup.title}</div>
              <div className="uccis-kpi-icon">◎</div>
            </div>

            <div className="uccis-kpi" style={{ "--kpi-color": "#f59e0b" }}>
              <div className="uccis-kpi-label">MODULE STATUS</div>
              <div className="uccis-kpi-value">
                {selectedWorkflowTask ? "OPEN" : "READY"}
              </div>
              <div className="uccis-kpi-sub">
                {selectedWorkflowTask
                  ? workflowTaskMap[selectedWorkflowTask].label
                  : "Awaiting module selection"}
              </div>
              <div className="uccis-kpi-icon">●</div>
            </div>
          </section>

          <div className="uccis-dashboard-grid">
            <div>
              <section className="uccis-panel">
                <div className="uccis-panel-head">
                  <div className="uccis-panel-title">
                    <div>
                      <h2>Command Workflow</h2>
                      {/* <p>Choose one of the six primary platform layers</p> */}
                    </div>
                  </div>
                  {/* <span className="uccis-panel-badge">6 LAYERS</span> */}
                </div>

                <div className="uccis-workflow-list">
                  {workflowGroups.map((group, index) => (
                    <button
                      key={group.id}
                      type="button"
                      className={`uccis-workflow-row ${
                        selectedWorkflowGroup === group.id ? "active" : ""
                      }`}
                      style={{ "--row-color": group.color }}
                      onClick={() => openWorkflowGroup(group.id)}
                    >
                      <span className="uccis-row-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="uccis-row-info">
                        <strong>{group.title}</strong>
                        <span>{group.subtitle}</span>
                      </span>

                      <span className="uccis-row-count">
                        {group.tasks.length} MODULES
                      </span>

                      <span className="uccis-row-arrow">›</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="uccis-panel uccis-module-panel">
                <div className="uccis-panel-head">
                  <div className="uccis-panel-title">
                    <div>
                      <h2>{selectedGroup.title}</h2>
                      {/* <p>Select a module to open its existing dashboard</p> */}
                    </div>
                  </div>
                  {/* <span
                    className="uccis-panel-badge"
                    style={{
                      color: selectedGroup.color,
                      background: `color-mix(in srgb, ${selectedGroup.color} 10%, transparent)`
                    }}
                  >
                    {selectedGroup.tasks.length} MODULES
                  </span> */}
                </div>

                <div className="uccis-module-grid">
                  {selectedGroup.tasks.map((task, index) => (
                    <button
                      key={task.id}
                      type="button"
                      className={`uccis-module-card ${
                        selectedWorkflowTask === task.id ? "active" : ""
                      }`}
                      style={{ "--module-color": selectedGroup.color }}
                      onClick={() => selectWorkflowTask(task.id)}
                    >
                      <span className="uccis-module-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span>
                        <strong>{task.label}</strong>
                        <span>{task.short}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div>
              <section className="uccis-panel">
                <div className="uccis-panel-head">
                  <div className="uccis-panel-title">
                    <div>
                      <h2>System Health</h2>
                      {/* <p>Platform readiness overview</p> */}
                    </div>
                  </div>
                  {/* <span className="uccis-panel-badge">LIVE</span> */}
                </div>

                <div className="uccis-health-body">
                  <div className="uccis-health-score">
                    <div className="uccis-health-circle">98%</div>
                    <div>
                      <strong>Operational Health</strong>
                      <span>All core command layers available</span>
                    </div>
                  </div>

                  <div className="uccis-metric">
                    <div className="uccis-metric-head">
                      <span>Command Availability</span>
                      <strong>98%</strong>
                    </div>
                    <div className="uccis-progress">
                      <span style={{ "--metric-color": "#38bdf8", width: "98%" }} />
                    </div>
                  </div>

                  <div className="uccis-metric">
                    <div className="uccis-metric-head">
                      <span>Intelligence Services</span>
                      <strong>96%</strong>
                    </div>
                    <div className="uccis-progress">
                      <span style={{ "--metric-color": "#a78bfa", width: "96%" }} />
                    </div>
                  </div>

                  <div className="uccis-metric">
                    <div className="uccis-metric-head">
                      <span>Runtime Services</span>
                      <strong>99%</strong>
                    </div>
                    <div className="uccis-progress">
                      <span style={{ "--metric-color": "#06b6d4", width: "99%" }} />
                    </div>
                  </div>

                  <div className="uccis-metric">
                    <div className="uccis-metric-head">
                      <span>Governance Layer</span>
                      <strong>97%</strong>
                    </div>
                    <div className="uccis-progress">
                      <span style={{ "--metric-color": "#22c55e", width: "97%" }} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="uccis-panel uccis-activity">
                <div className="uccis-panel-head">
                  <div className="uccis-panel-title">
                    <div>
                      <h2>Command Activity</h2>
                      <p>Current workflow context</p>
                    </div>
                  </div>
                </div>

                <div className="uccis-activity-list">
                  <div
                    className="uccis-activity-item"
                    style={{ "--activity-color": selectedGroup.color }}
                  >
                    <span className="uccis-activity-dot" />
                    <div>
                      <strong>{selectedGroup.title} selected</strong>
                      <span>{selectedGroup.tasks.length} modules available</span>
                    </div>
                  </div>

                  <div
                    className="uccis-activity-item"
                    style={{ "--activity-color": "#38bdf8" }}
                  >
                    <span className="uccis-activity-dot" />
                    <div>
                      <strong>Workflow ready</strong>
                      <span>Waiting for operator module selection</span>
                    </div>
                  </div>

                  <div
                    className="uccis-activity-item"
                    style={{ "--activity-color": "#22c55e" }}
                  >
                    <span className="uccis-activity-dot" />
                    <div>
                      <strong>Core services online</strong>
                      <span>Command environment available</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {selectedWorkflowTask && (
            <section className="uccis-rendered-panel">
              <div className="uccis-rendered-head">
                <div>
                  <h2>{workflowTaskMap[selectedWorkflowTask].label}</h2>
                  {/* <p>
                    Workflow node {selectedWorkflowTask.replace("task", "TASK ")}
                  </p> */}
                </div>

                <button
                  type="button"
                  className="uccis-back"
                  onClick={() => setSelectedWorkflowTask(null)}
                >
                  ← BACK TO DASHBOARD
                </button>
              </div>

              {/* <div className="uccis-rendered-content">
                <AISModulePanel
                  taskId={selectedWorkflowTask}
                  moduleName={workflowTaskMap[selectedWorkflowTask].label}
                /> */}

                {renderPage()}
              {/* </div> */}
            </section>
          )}

          {!selectedWorkflowTask && (
            <div className="uccis-empty">
              <div>
                <strong>Command workspace ready</strong>
                Select a module above to open its existing dashboard.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
};

export default Dashboard;