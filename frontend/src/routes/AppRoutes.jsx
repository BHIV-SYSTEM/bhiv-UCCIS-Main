import { Routes, Route, Navigate } from "react-router-dom";

import DashboardView from "../layout/Dashboard/DashboardView";
import SignalsView from "../layout/Signals/SignalsView";
import IncidentsView from "../layout/Incidents/IncidentsView";
import EscalationsView from "../layout/Escalations/EscalationsView";
import ReplayView from "../layout/Replay/ReplayView";
import EvidenceView from "../layout/Evidence/EvidenceView";
import AnalyticsView from "../layout/Analytics/AnalyticsView";
import HistoricalOpsView from "../layout/HistoricalOps/HistoricalOpsView";
import DomainsView from "../layout/Domains/DomainsView";
import RuntimeView from "../layout/Runtime/RuntimeView";
import SettingsView from "../layout/Settings/SettingsView";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Dashboard */}
      <Route
        path="/"
        element={<DashboardView />}
      />

      {/* Signals */}
      <Route
        path="/signals"
        element={<SignalsView />}
      />

      {/* Incidents */}
      <Route
        path="/incidents"
        element={<IncidentsView />}
      />

      {/* Escalations */}
      <Route
        path="/escalations"
        element={<EscalationsView />}
      />

      {/* Replay */}
      <Route
        path="/replay"
        element={<ReplayView />}
      />

      {/* Evidence */}
      <Route
        path="/evidence"
        element={<EvidenceView />}
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={<AnalyticsView />}
      />

      {/* Historical Operations */}
      <Route
        path="/historical-ops"
        element={<HistoricalOpsView />}
      />

      {/* Domains */}
      <Route
        path="/domains"
        element={<DomainsView />}
      />

      {/* Runtime */}
      <Route
        path="/runtime"
        element={<RuntimeView />}
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={<SettingsView />}
      />

      {/* Any unknown URL → Dashboard */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}