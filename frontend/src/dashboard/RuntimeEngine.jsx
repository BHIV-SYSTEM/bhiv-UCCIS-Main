import React, { useState } from "react";

import SidebarTask36 from "../components/Layout/SidebarTask36";
import HeaderTask36 from "../components/Layout/HeaderTask36";

import DashboardView from "../views/DashboardView";
import RuntimeView from "../views/RuntimeView";
import SignalsViewTask36 from "../views/SignalsViewTask36";
import TelemetryViewTask36 from "../views/TelemetryViewTask36";
import IncidentsViewTask36 from "../views/IncidentsViewTask36";
import EscalationsViewTask36 from "../views/EscalationsViewTask36";
import ReplayViewTask36 from "../views/ReplayViewTask36";
import EvidenceViewTask36 from "../views/EvidenceViewTask36";
import AnalyticsView from "../views/AnalyticsView";
import SettingsView from "../views/SettingsView";

function RuntimeEngine() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  return (
    <div className="layout">

      <SidebarTask36
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="main-content">

        <HeaderTask36 />

        {activePage === "Dashboard" &&
          <DashboardView />}

        {activePage === "Runtime" &&
          <RuntimeView />}

        {activePage === "Signals" &&
          <SignalsViewTask36 />}

        {activePage === "Telemetry" &&
          <TelemetryViewTask36 />}

        {activePage === "Incidents" &&
          <IncidentsViewTask36 />}

        {activePage === "Escalations" &&
          <EscalationsViewTask36 />}

        {activePage === "Replay" &&
          <ReplayViewTask36 />}

        {activePage === "Evidence" &&
          <EvidenceViewTask36 />}

        {activePage === "Analytics" &&
          <AnalyticsView />}

        {activePage === "Settings" &&
          <SettingsView />}

      </div>

    </div>
  );
}

export default RuntimeEngine;