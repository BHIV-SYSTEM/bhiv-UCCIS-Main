import React from "react";

import ReplayStoryCard from "../components/ReplayStoryCard";
import EscalationJourney from "../components/EscalationJourney";
import AcknowledgementSummary from "../components/AcknowledgementSummary";
import RecoveryVisibilityPanel from "../components/RecoveryVisibilityPanel";
import GovernanceTimeline from "../components/GovernanceTimeline";
import GovernanceStatusBanner from "../components/GovernanceStatusBanner";

export default function GovernanceReplayDashboard() {

  return (
    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <h1>Governance-Safe Replay Visibility (Phase 8)</h1>

      <GovernanceStatusBanner />

      <GovernanceTimeline />

      <ReplayStoryCard />

      <EscalationJourney />

      <AcknowledgementSummary />

      <RecoveryVisibilityPanel />
    </div>
  );
}