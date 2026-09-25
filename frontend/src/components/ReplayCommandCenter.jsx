import ReplayTimeline from "../components/replay/ReplayTimeline";
import ReplayPlayback from "../components/replay/ReplayPlayback";
import IncidentProgression from "../components/replay/IncidentProgression";
import AcknowledgementChain from "../components/replay/AcknowledgementChain";
import ResolutionReconstruction from "../components/replay/ResolutionReconstruction";
import ReplayDivergence from "../components/replay/ReplayDivergence";

export default function ReplayCommandCenter() {

  return (
    <div className="replay-root">

      {/* ================================================= */}
      {/* PHASE 5 — REPLAY UX HARDENING                    */}
      {/* ================================================= */}

      {/*
        Goal:
        Human-readable replay cognition

        Replace:
        raw payload cognition

        With:
        - replay timeline playback
        - lifecycle visualization
        - incident progression
        - acknowledgement chains
        - resolution reconstruction
        - replay divergence visibility

        Replay remains:
        reconstructive
        NOT directive
      */}

      {/* HEADER */}
      <div className="replay-header">

        <div className="replay-title">
          REPLAY COMMAND CENTER
        </div>

        <div className="replay-live">
          ● RECONSTRUCTION ACTIVE
        </div>

      </div>

      {/* MAIN REPLAY GRID */}
      <div className="replay-grid">

        {/* LEFT */}
        <div className="replay-left">

          <ReplayTimeline />

          <IncidentProgression />

        </div>

        {/* CENTER */}
        <div className="replay-center">

          <ReplayPlayback />

          <ResolutionReconstruction />

        </div>

        {/* RIGHT */}
        <div className="replay-right">

          <AcknowledgementChain />

          <ReplayDivergence />

        </div>

      </div>

      {/* FOOTER */}
      <div className="replay-footer">

        Replay Safe • Reconstruction Synced • Timeline Stable

      </div>

    </div>
  );
}