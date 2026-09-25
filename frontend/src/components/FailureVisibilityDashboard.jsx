import React from "react";

import FailureAlertBanner from "../components/FailureAlertBanner";
import TelemetryWarningPanel from "../components/TelemetryWarningPanel";
import OperatorDisconnectCard from "../components/OperatorDisconnectCard";
import ReplayRecoveryNotice from "../components/ReplayRecoveryNotice";
import DelayedAcknowledgementPanel from "../components/DelayedAcknowledgementPanel";
import CorruptionAlertPanel from "../components/CorruptionAlertPanel";
import FailureTimeline from "../components/FailureTimeline";

export default function FailureVisibilityDashboard() {

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
      <h1>Operational Failure Visibility Layer (Phase 9)</h1>

      <FailureAlertBanner />

      <FailureTimeline />

      <TelemetryWarningPanel />

      <OperatorDisconnectCard />

      <ReplayRecoveryNotice />

      <DelayedAcknowledgementPanel />

      <CorruptionAlertPanel />
    </div>
  );
}