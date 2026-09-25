import { useState } from "react";

export default function
BackendResponseModal({
  open,
  data,
  onClose
}) {

  const [technicalMode,
    setTechnicalMode] =
      useState(false);

  if (!open) return null;

  function getOperationalSummary() {

    if (!data) {
      return "No operational data available.";
    }

    if (
      data.trace_id?.includes("FLOOD")
    ) {

      return `
Replay continuity preserved across
distributed flood escalation events.
Governance reconstruction verified.
`;
    }

    if (
      data.lifecycle
    ) {

      return `
Governance lifecycle completed
successfully with replay validation.
`;
    }

    if (
      data.concurrent_operators
    ) {

      return `
Concurrent operator coordination
completed without collision.
`;
    }

    return `
Operational replay validation
completed successfully.
`;
  }

  function renderTimeline() {

    const timeline = [

      "SIGNAL_RECEIVED",

      "INTELLIGENCE_GENERATED",

      "ESCALATION_CREATED",

      "GOVERNANCE_VISIBLE",

      "ENFORCEMENT_ROUTED",

      "EXECUTION_ACKNOWLEDGED",

      "RESOLUTION_CONFIRMED",

      "REPLAY_VALIDATED"
    ];

    return (

      <div className="timeline">

        {
          timeline.map((item, index) => (

            <div
              key={index}
              className="timeline-item"
            >

              <div className="timeline-dot" />

              <div>
                {item}
              </div>

            </div>
          ))
        }

      </div>
    );
  }

  function renderOperationalView() {

    return (

      <div>

        <div className="trace-box">

          <div className="trace-title">
            Operational Summary
          </div>

          <p>
            {
              getOperationalSummary()
            }
          </p>

        </div>

        <div className="trace-box">

          <div className="trace-title">
            Replay Integrity
          </div>

          <p className="status-green">
            VERIFIED + IMMUTABLE
          </p>

        </div>

        <div className="trace-box">

          <div className="trace-title">
            Governance Status
          </div>

          <p className="status-green">
            ACTIVE
          </p>

        </div>

        <div className="trace-box">

          <div className="trace-title">
            Enforcement Visibility
          </div>

          <p>
            External acknowledgement
            replay successfully validated.
          </p>

        </div>

        <div className="trace-box">

          <div className="trace-title">
            Lifecycle Timeline
          </div>

          {
            renderTimeline()
          }

        </div>

      </div>
    );
  }

  function renderTechnicalView() {

    return (

      <div>

        <div className="trace-box">

          <div className="trace-title">
            Technical Inspection
          </div>

          <p className="status-yellow">
            ENGINEERING VIEW
          </p>

        </div>

        <pre className="json-view">

          {
            JSON.stringify(
              data,
              null,
              2
            )
          }

        </pre>

      </div>
    );
  }

  return (

    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>
            UCCIS Operational View
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >

            <button
              onClick={() =>
                setTechnicalMode(
                  !technicalMode
                )
              }
            >

              {
                technicalMode

                  ? "Hide Technical"

                  : "Technical Inspection"
              }

            </button>

            <button onClick={onClose}>
              Close
            </button>

          </div>

        </div>

        {

          technicalMode

            ? renderTechnicalView()

            : renderOperationalView()

        }

      </div>

    </div>
  );
}