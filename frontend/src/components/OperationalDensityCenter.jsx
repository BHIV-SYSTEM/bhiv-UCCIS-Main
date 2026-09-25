import CommandTicker from "../components/density/CommandTicker";

import OperationalMatrix from "../components/density/OperationalMatrix";

import DistrictStressGrid from "../components/density/DistrictStressGrid";

import LiveTelemetryPanel from "../components/density/LiveTelemetryPanel";

import ExecutionDensity from "../components/density/ExecutionDensity";

import IntelligenceFeed from "../components/density/IntelligenceFeed";

import SignalIntegrity from "../components/density/SignalIntegrity";

export default function OperationalDensityCenter() {

  return (
    <div className="density-root">

      {/* ================================================= */}
      {/* PHASE 6 — OPERATIONAL DENSITY ENGINEERING         */}
      {/* ================================================= */}

      {/*
        Inspired by:
        - Bloomberg terminals
        - NOC/SOC dashboards
        - emergency operation centers
        - trading terminals
        - command-center systems

        Goals:
        - operational cognition
        - low-scroll visibility
        - real-time infrastructure feel
        - information density
        - calm command surfaces
      */}

      {/* ================================================= */}
      {/* COMMAND TICKER                                   */}
      {/* ================================================= */}

      <CommandTicker />

      {/* ================================================= */}
      {/* MAIN DENSITY GRID                                */}
      {/* ================================================= */}

      <div className="density-grid">

        {/* LEFT COMMAND COLUMN */}
        <div className="density-left">

          <OperationalMatrix />

          <ExecutionDensity />

        </div>

        {/* CENTER INTELLIGENCE */}
        <div className="density-center">

          <DistrictStressGrid />

          <IntelligenceFeed />

        </div>

        {/* RIGHT TELEMETRY */}
        <div className="density-right">

          <LiveTelemetryPanel />

          <SignalIntegrity />

        </div>

      </div>

      {/* FOOTER */}
      <div className="density-footer">

        Operational Density Stable • Signal Integrity Active • Governance Cognition Synced

      </div>

    </div>
  );
}