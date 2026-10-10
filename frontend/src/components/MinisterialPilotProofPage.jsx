
import React from "react";

const lifecycle = [
  {
    stage: "Signal",
    time: "10:12 AM",
    description:
      "Flooding alert detected near Kurla transport corridor.",
    status: "DETECTED",
    icon: "◉",
    color: "blue",
  },
  {
    stage: "Intelligence",
    time: "10:14 AM",
    description:
      "Regional intelligence engine classified incident severity as HIGH.",
    status: "ANALYZED",
    icon: "⌁",
    color: "purple",
  },
  {
    stage: "Escalation",
    time: "10:17 AM",
    description:
      "Escalation routed to regional operational command.",
    status: "ESCALATED",
    icon: "↗",
    color: "red",
  },
  {
    stage: "Governance Visibility",
    time: "10:19 AM",
    description:
      "Ministerial dashboard updated with district stress indicators.",
    status: "VISIBLE",
    icon: "▣",
    color: "cyan",
  },
  {
    stage: "Field Assignment",
    time: "10:23 AM",
    description:
      "Drainage and traffic diversion teams assigned.",
    status: "ASSIGNED",
    icon: "⌖",
    color: "orange",
  },
  {
    stage: "Acknowledgement",
    time: "10:28 AM",
    description:
      "Field teams acknowledged execution workflow.",
    status: "ACKNOWLEDGED",
    icon: "✓",
    color: "green",
  },
  {
    stage: "Resolution",
    time: "10:46 AM",
    description:
      "Flood conditions stabilized and traffic restored.",
    status: "RESOLVED",
    icon: "✓",
    color: "green",
  },
  {
    stage: "Replay Reconstruction",
    time: "10:52 AM",
    description:
      "Immutable replay reconstruction sequence generated successfully.",
    status: "RECONSTRUCTED",
    icon: "⟳",
    color: "purple",
  },
  {
    stage: "Audit Visibility",
    time: "10:58 AM",
    description:
      "Audit layer validated continuity and replay integrity.",
    status: "AUDITED",
    icon: "▤",
    color: "blue",
  },
];

const readinessItems = [
  "Governance-safe visibility operational",
  "Replay continuity preserved",
  "Escalation lifecycle validated",
  "Audit isolation verified",
  "Distributed replay reconstruction stable",
  "Field execution workflow active",
  "Concurrency-safe replay confirmed",
  "Reliability safeguards operational",
  "Role hierarchy functioning",
  "Ministerial pilot ready",
];

function SummaryCard({ label, value, description, icon, color }) {
  return (
    <article className={`mp-summary-card ${color}`}>
      <div className="mp-summary-top">
        <span className="mp-summary-icon">{icon}</span>
        <span className="mp-summary-label">{label}</span>
      </div>

      <div className="mp-summary-value">{value}</div>
      <p className="mp-summary-description">{description}</p>
    </article>
  );
}

export default function MinisterialPilotProofPage() {
  return (
    <>
      <style>{ministerialStyles}</style>

      <main className="mp-page">
        {/* HEADER */}
        <header className="mp-header">
          <div>
            <div className="mp-eyebrow">
              UCCIS / OPERATIONAL GOVERNANCE
            </div>

            <h1>Ministerial Pilot Proof</h1>

            <p>
              Complete operational governance lifecycle demonstration
            </p>
          </div>

          {/* <div className="mp-header-status">
            <span className="mp-status-indicator" />
            <div>
              <strong>Lifecycle Overview</strong>
              <small>9 recorded stages</small>
            </div>
          </div> */}
        </header>

        {/* SUMMARY CARDS */}
        <section className="mp-summary-grid">
          <SummaryCard
            label="Operational State"
            value="STABLE"
            description="Reported final operational state"
            icon="✓"
            color="green"
          />

          <SummaryCard
            label="Replay Integrity"
            value="VALID"
            description="Reported replay status"
            icon="⟳"
            color="blue"
          />

          <SummaryCard
            label="Audit Status"
            value="VERIFIED"
            description="Reported audit status"
            icon="▤"
            color="purple"
          />

          <SummaryCard
            label="Escalation Continuity"
            value="COMPLETE"
            description="Reported lifecycle continuity"
            icon="↗"
            color="orange"
          />
        </section>

        {/* TIMELINE */}
        <section className="mp-panel">
          <div className="mp-panel-heading">
            <div>
              <h2>Operational Lifecycle</h2>
              <p>
                Follow the signal from initial detection through audit visibility.
              </p>
            </div>

            <span className="mp-stage-count">
              {lifecycle.length} STAGES
            </span>
          </div>

          <div className="mp-timeline">
            {lifecycle.map((item, index) => (
              <article
                key={item.stage}
                className="mp-timeline-item"
              >
                <div className="mp-timeline-track">
                  <div className={`mp-timeline-icon ${item.color}`}>
                    {item.icon}
                  </div>

                  {index !== lifecycle.length - 1 && (
                    <div className="mp-timeline-line" />
                  )}
                </div>

                <div className="mp-timeline-card">
                  <div className="mp-timeline-main">
                    <div className="mp-stage-heading">
                      <span className="mp-stage-index">
                        STAGE {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3>{item.stage}</h3>
                    </div>

                    <p className="mp-stage-description">
                      {item.description}
                    </p>
                  </div>

                  <div className="mp-stage-meta">
                    <span className="mp-stage-time">
                      <span aria-hidden="true">◷</span>
                      {item.time}
                    </span>

                    <span className={`mp-status-badge ${item.color}`}>
                      <span className="mp-badge-dot" />
                      {item.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* READINESS ASSESSMENT */}
        <section className="mp-readiness">
          <div className="mp-readiness-heading">
            <div className="mp-readiness-icon">✓</div>

            <div>
              <div className="mp-readiness-eyebrow">
                FINAL VALIDATION PANEL
              </div>

              <h2>Ministerial Readiness Assessment</h2>

              <p>
                Review the readiness statements supplied for this pilot demonstration.
              </p>
            </div>
          </div>

          <div className="mp-readiness-grid">
            {readinessItems.map((item, index) => (
              <div className="mp-readiness-item" key={item}>
                <span className="mp-readiness-check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mp-readiness-footer">
            <span className="mp-readiness-footer-dot" />
            <span>
              Pilot readiness statements displayed as provided
            </span>
          </div>
        </section>

        <footer className="mp-footer">
          <strong>Ministerial Pilot Proof</strong>
          <span>
            Operational lifecycle · Governance visibility · Audit reconstruction
          </span>
        </footer>
      </main>
    </>
  );
}

const ministerialStyles = `
  .mp-page {
    --mp-bg: #f3f6fb;
    --mp-card: #ffffff;
    --mp-text: #172033;
    --mp-muted: #64748b;
    --mp-border: #e2e8f0;

    min-height: 100vh;
    padding: 28px;
    background: var(--mp-bg);
    color: var(--mp-text);
    font-family: Inter, "Segoe UI", Arial, sans-serif;
    font-size: 14px;
  }

  .mp-page *,
  .mp-page *::before,
  .mp-page *::after {
    box-sizing: border-box;
  }

  /* Header */

  .mp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 22px;
    margin-bottom: 28px;
  }

  .mp-eyebrow {
    margin-bottom: 10px;
    color: #2563eb;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.8px;
  }

  .mp-header h1 {
    margin: 0 0 10px;
    color: #111827;
    font-size: clamp(27px, 3vw, 38px);
    font-weight: 850;
    letter-spacing: -1.1px;
    line-height: 1.2;
  }

  .mp-header > div:first-child > p {
    margin: 0;
    color: var(--mp-muted);
    font-size: 14px;
    line-height: 1.7;
  }

  .mp-header-status {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 17px;
    border: 1px solid #bbf7d0;
    border-radius: 13px;
    background: #f0fdf4;
  }

  .mp-status-indicator {
    width: 10px;
    height: 10px;
    flex: 0 0 10px;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 0 4px #dcfce7;
  }

  .mp-header-status strong,
  .mp-header-status small {
    display: block;
  }

  .mp-header-status strong {
    margin-bottom: 5px;
    color: #166534;
    font-size: 12px;
  }

  .mp-header-status small {
    color: #15803d;
    font-size: 11px;
  }

  /* Summary */

  .mp-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .mp-summary-card {
    min-width: 0;
    padding: 21px;
    border: 1px solid var(--mp-border);
    border-top: 3px solid #2563eb;
    border-radius: 15px;
    background: var(--mp-card);
    box-shadow: 0 4px 15px rgb(15 23 42 / 3%);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .mp-summary-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgb(15 23 42 / 7%);
  }

  .mp-summary-card.green {
    border-top-color: #16a34a;
  }

  .mp-summary-card.blue {
    border-top-color: #2563eb;
  }

  .mp-summary-card.purple {
    border-top-color: #7c3aed;
  }

  .mp-summary-card.orange {
    border-top-color: #ea580c;
  }

  .mp-summary-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 21px;
  }

  .mp-summary-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 11px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 20px;
    font-weight: 800;
  }

  .mp-summary-card.green .mp-summary-icon {
    background: #f0fdf4;
    color: #16a34a;
  }

  .mp-summary-card.purple .mp-summary-icon {
    background: #f5f3ff;
    color: #7c3aed;
  }

  .mp-summary-card.orange .mp-summary-icon {
    background: #fff7ed;
    color: #ea580c;
  }

  .mp-summary-label {
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
  }

  .mp-summary-value {
    margin-bottom: 9px;
    overflow-wrap: anywhere;
    color: #111827;
    font-size: clamp(22px, 2vw, 29px);
    font-weight: 850;
    letter-spacing: -0.6px;
  }

  .mp-summary-card.green .mp-summary-value {
    color: #15803d;
  }

  .mp-summary-card.blue .mp-summary-value {
    color: #1d4ed8;
  }

  .mp-summary-card.purple .mp-summary-value {
    color: #6d28d9;
  }

  .mp-summary-card.orange .mp-summary-value {
    color: #c2410c;
    font-size: clamp(19px, 1.8vw, 25px);
  }

  .mp-summary-description {
    margin: 0;
    color: #64748b;
    font-size: 11px;
    line-height: 1.6;
  }

  /* Timeline panel */

  .mp-panel {
    margin-bottom: 24px;
    padding: 25px;
    border: 1px solid var(--mp-border);
    border-radius: 17px;
    background: #ffffff;
    box-shadow: 0 4px 15px rgb(15 23 42 / 3%);
  }

  .mp-panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 28px;
  }

  .mp-panel-heading h2 {
    margin: 0 0 7px;
    color: #111827;
    font-size: 20px;
    font-weight: 800;
  }

  .mp-panel-heading p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.7;
  }

  .mp-stage-count {
    padding: 8px 11px;
    border: 1px solid #dbeafe;
    border-radius: 8px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
  }

  /* Lifecycle timeline */

  .mp-timeline {
    display: flex;
    flex-direction: column;
  }

  .mp-timeline-item {
    display: grid;
    grid-template-columns: 45px minmax(0, 1fr);
    gap: 15px;
    min-width: 0;
  }

  .mp-timeline-track {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
  }

  .mp-timeline-icon {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border: 1px solid #dbeafe;
    border-radius: 13px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 19px;
    font-weight: 800;
  }

  .mp-timeline-icon.purple {
    border-color: #ddd6fe;
    background: #f5f3ff;
    color: #7c3aed;
  }

  .mp-timeline-icon.red {
    border-color: #fecaca;
    background: #fef2f2;
    color: #dc2626;
  }

  .mp-timeline-icon.cyan {
    border-color: #a5f3fc;
    background: #ecfeff;
    color: #0891b2;
  }

  .mp-timeline-icon.orange {
    border-color: #fed7aa;
    background: #fff7ed;
    color: #ea580c;
  }

  .mp-timeline-icon.green {
    border-color: #bbf7d0;
    background: #f0fdf4;
    color: #16a34a;
  }

  .mp-timeline-line {
    width: 2px;
    min-height: 25px;
    flex: 1;
    margin: 5px 0;
    background: linear-gradient(#cbd5e1, #e2e8f0);
  }

  .mp-timeline-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 22px;
    min-width: 0;
    margin-bottom: 17px;
    padding: 19px 21px;
    border: 1px solid #e2e8f0;
    border-radius: 13px;
    background: #ffffff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .mp-timeline-card:hover {
    border-color: #bfdbfe;
    box-shadow: 0 5px 17px rgb(37 99 235 / 6%);
  }

  .mp-timeline-main {
    min-width: 0;
    flex: 1;
  }

  .mp-stage-index {
    display: block;
    margin-bottom: 7px;
    color: #94a3b8;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.2px;
  }

  .mp-stage-heading h3 {
    margin: 0;
    color: #172033;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.5;
  }

  .mp-stage-description {
    margin: 9px 0 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .mp-stage-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    flex: 0 0 auto;
  }

  .mp-stage-time {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  .mp-status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 7px 10px;
    border: 1px solid #dbeafe;
    border-radius: 7px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 9px;
    font-weight: 850;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }

  .mp-status-badge .mp-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .mp-status-badge.purple {
    border-color: #ddd6fe;
    background: #f5f3ff;
    color: #6d28d9;
  }

  .mp-status-badge.red {
    border-color: #fecaca;
    background: #fef2f2;
    color: #b91c1c;
  }

  .mp-status-badge.cyan {
    border-color: #a5f3fc;
    background: #ecfeff;
    color: #0e7490;
  }

  .mp-status-badge.orange {
    border-color: #fed7aa;
    background: #fff7ed;
    color: #c2410c;
  }

  .mp-status-badge.green {
    border-color: #bbf7d0;
    background: #f0fdf4;
    color: #15803d;
  }

  /* Readiness panel */

  .mp-readiness {
    margin-top: 26px;
    padding: 30px;
    border: 1px solid #263449;
    border-radius: 18px;
    background: linear-gradient(135deg, #111827, #172554);
    color: #ffffff;
    box-shadow: 0 12px 35px rgb(15 23 42 / 13%);
  }

  .mp-readiness-heading {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 27px;
  }

  .mp-readiness-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    border: 1px solid #166534;
    border-radius: 13px;
    background: #14532d;
    color: #86efac;
    font-size: 24px;
    font-weight: 800;
  }

  .mp-readiness-eyebrow {
    margin-bottom: 8px;
    color: #93c5fd;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.6px;
  }

  .mp-readiness-heading h2 {
    margin: 0 0 9px;
    color: #ffffff;
    font-size: clamp(20px, 2.5vw, 27px);
    font-weight: 800;
    line-height: 1.4;
  }

  .mp-readiness-heading p {
    margin: 0;
    color: #cbd5e1;
    font-size: 12px;
    line-height: 1.7;
  }

  .mp-readiness-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 13px 22px;
  }

  .mp-readiness-item {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    min-width: 0;
    padding: 14px;
    border: 1px solid #334155;
    border-radius: 10px;
    background: rgb(255 255 255 / 4%);
    color: #e2e8f0;
    font-size: 12px;
    line-height: 1.7;
  }

  .mp-readiness-check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 21px;
    flex: 0 0 21px;
    border-radius: 6px;
    background: #14532d;
    color: #86efac;
    font-size: 12px;
    font-weight: 800;
  }

  .mp-readiness-footer {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 23px;
    padding-top: 17px;
    border-top: 1px solid #334155;
    color: #cbd5e1;
    font-size: 11px;
    line-height: 1.7;
  }

  .mp-readiness-footer-dot {
    width: 7px;
    height: 7px;
    flex: 0 0 7px;
    border-radius: 50%;
    background: #60a5fa;
  }

  /* Footer */

  .mp-footer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 22px 3px 5px;
    color: #64748b;
    font-size: 11px;
    line-height: 1.7;
  }

  .mp-footer strong {
    color: #334155;
    font-size: 12px;
  }

  /* Responsive */

  @media (max-width: 1100px) {
    .mp-summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 700px) {
    .mp-page {
      padding: 15px;
    }

    .mp-header {
      align-items: flex-start;
      gap: 17px;
    }

    .mp-header-status {
      width: 100%;
    }

    .mp-panel {
      padding: 17px;
    }

    .mp-timeline-item {
      grid-template-columns: 35px minmax(0, 1fr);
      gap: 10px;
    }

    .mp-timeline-icon {
      width: 34px;
      height: 34px;
      flex-basis: 34px;
      border-radius: 10px;
      font-size: 16px;
    }

    .mp-timeline-card {
      flex-direction: column;
      gap: 14px;
      padding: 15px;
    }

    .mp-stage-meta {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      gap: 10px;
    }

    .mp-readiness {
      padding: 21px;
    }

    .mp-readiness-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }
  }

  @media (max-width: 450px) {
    .mp-summary-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    .mp-summary-card {
      padding: 17px;
    }

    .mp-summary-top {
      margin-bottom: 14px;
    }

    .mp-summary-value {
      font-size: 25px;
    }

    .mp-summary-card.orange .mp-summary-value {
      font-size: 22px;
    }

    .mp-panel-heading h2 {
      font-size: 18px;
    }

    .mp-stage-heading h3 {
      font-size: 14px;
    }

    .mp-status-badge {
      font-size: 8px;
      padding: 6px 8px;
    }

    .mp-readiness-heading {
      gap: 11px;
    }

    .mp-readiness-icon {
      width: 38px;
      height: 38px;
      flex-basis: 38px;
      font-size: 20px;
    }

    .mp-footer {
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mp-page *,
    .mp-page *::before,
    .mp-page *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
