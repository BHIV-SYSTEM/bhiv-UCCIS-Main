import React, { useState } from "react";

import useRuntimeData from "../hooks/useRuntimeData";

import SidebarTask33 from "../components/SidebarTask33";
import DashboardHeader from "../components/DashboardHeader";
import SummaryCards from "../components/SummaryCards";
import RuntimeMetricsChart from "../components/RuntimeMetricsChart";

import SignalsView from "../views/SignalsView";
import TelemetryView from "../views/TelemetryView";
import IncidentsView from "../views/IncidentsView";
import EscalationsView from "../views/EscalationsView";
import ReplayView from "../views/ReplayView";
import EvidenceView from "../views/EvidenceView";
import HealthView from "../views/HealthView";

function CommandCenter() {
  const {
    summary,
    signals,
    replay,
    health,
    loading,
  } = useRuntimeData();

  const [activeTab, setActiveTab] = useState("Signals");

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading UCCIS Runtime Command Center...
      </div>
    );
  }

  return (
    <div className="layout">

      {/* =========================
          SIDEBAR
      ========================= */}
      <SidebarTask33
        active={activeTab}
        setActive={setActiveTab}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="content">

        {/* =========================
            HEADER
        ========================= */}
        <DashboardHeader />

        {/* =========================
            SUMMARY CARDS
        ========================= */}
        <SummaryCards summary={summary} />

        {/* =========================
            RUNTIME METRICS
        ========================= */}
        <div className="section-card">
          <h2 className="section-title">
            Runtime Metrics
          </h2>

          <RuntimeMetricsChart
            summary={summary}
          />
        </div>

        {/* =========================
            TAB CONTENT
        ========================= */}

        {activeTab === "Signals" && (
          <SignalsView
            signals={signals}
          />
        )}

        {activeTab === "Telemetry" && (
          <TelemetryView
            signals={signals}
          />
        )}

        {activeTab === "Incidents" && (
          <IncidentsView
            incidents={signals}
          />
        )}

        {activeTab === "Escalations" && (
          <EscalationsView
            escalations={signals}
          />
        )}

        {activeTab === "Replay" && (
          <ReplayView
            replay={replay}
          />
        )}

        {activeTab === "Evidence" && (
          <EvidenceView
            evidence={signals}
          />
        )}

        {activeTab === "Health" && (
          <HealthView
            health={health}
          />
        )}

      </div>
    </div>
  );
}

export default CommandCenter;