import "../dashboard.css";

export default function Dashboard() {
  return (
    <div className="uccis-root">

      {/* =========================================================
      GOVERNANCE HEADER
      ========================================================= */}
      <div className="top-header">

        <div>
          <h1 className="main-title">
            UCCIS Governance Command Center
          </h1>

          <p className="main-subtitle">
            Principal Secretary Operational Intelligence Layer
          </p>
        </div>

        <div className="header-status">
          <div className="status-dot"></div>
          LIVE GOVERNANCE STATE
        </div>

      </div>

      {/* =========================================================
      EXECUTIVE KPI STRIP
      ========================================================= */}
      <div className="kpi-row">

        <div className="kpi kpi-red">
          <div className="kpi-title">Active Critical Alerts</div>
          <div className="kpi-value">12</div>

          <div className="kpi-footer">
            +2 escalation spikes detected
          </div>
        </div>

        <div className="kpi kpi-green">
          <div className="kpi-title">Infrastructure Health</div>
          <div className="kpi-value">92%</div>

          <div className="kpi-footer">
            Stable across 18 districts
          </div>
        </div>

        <div className="kpi kpi-blue">
          <div className="kpi-title">Execution Velocity</div>
          <div className="kpi-value">1.8x</div>

          <div className="kpi-footer">
            Workflow throughput increased
          </div>
        </div>

        <div className="kpi kpi-yellow">
          <div className="kpi-title">Pending Escalations</div>
          <div className="kpi-value">7</div>

          <div className="kpi-footer">
            3 require district approval
          </div>
        </div>

        <div className="kpi kpi-orange">
          <div className="kpi-title">Project Delays</div>
          <div className="kpi-value">5</div>

          <div className="kpi-footer">
            Infra pipeline affected
          </div>
        </div>

        <div className="kpi kpi-purple">
          <div className="kpi-title">Dept Efficiency</div>
          <div className="kpi-value">78%</div>

          <div className="kpi-footer">
            +6% improvement this week
          </div>
        </div>

      </div>

      {/* =========================================================
      CORE OPERATIONS LAYER
      ========================================================= */}
      <div className="grid-layout">

        {/* LEFT CORE */}
        <div className="panel operational-core">

          <div className="panel-header">
            Operational Intelligence Core
          </div>

          <div className="panel-body">

            <div className="intel-block">
              <span className="intel-label">
                System Monitoring
              </span>

              <span className="intel-status active">
                ACTIVE
              </span>
            </div>

            <div className="intel-block">
              <span className="intel-label">
                Telemetry Stability
              </span>

              <span className="intel-status stable">
                STABLE
              </span>
            </div>

            <div className="intel-block">
              <span className="intel-label">
                Replay Continuity
              </span>

              <span className="intel-status stable">
                VERIFIED
              </span>
            </div>

            <div className="intel-block">
              <span className="intel-label">
                AI Observation Layer
              </span>

              <span className="intel-status monitoring">
                MONITORING
              </span>
            </div>

            <div className="intel-summary">
              Governance systems operating within acceptable
              operational thresholds. No statewide instability
              detected at this time.
            </div>

          </div>

        </div>

        {/* RIGHT STATUS */}
        <div className="panel command-panel">

          <div className="panel-header">
            Command Status Panel
          </div>

          <div className="status-grid">

            <div className="status-card">
              <div className="status-title">
                System Load
              </div>

              <div className="status-value green">
                NORMAL
              </div>
            </div>

            <div className="status-card">
              <div className="status-title">
                Data Sync
              </div>

              <div className="status-value blue">
                ACTIVE
              </div>
            </div>

            <div className="status-card">
              <div className="status-title">
                Alert Engine
              </div>

              <div className="status-value yellow">
                MONITORING
              </div>
            </div>

            <div className="status-card">
              <div className="status-title">
                AI Layer
              </div>

              <div className="status-value purple">
                STANDBY
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
      VISUALIZATION LAYER
      ========================================================= */}
      <div className="grid-layout">

        {/* TIMELINE */}
        <div className="panel timeline-panel">

          <div className="panel-header">
            Operational Replay Timeline
          </div>

          <div className="timeline-wrapper">

            <div className="timeline-chart">

              <div className="timeline-bars">

                <div className="bar h40"></div>
                <div className="bar h70"></div>
                <div className="bar h55"></div>
                <div className="bar h90"></div>
                <div className="bar h65"></div>
                <div className="bar h100"></div>

              </div>

              <div className="timeline-hours">
                <span>10:00</span>
                <span>10:15</span>
                <span>10:30</span>
                <span>10:45</span>
                <span>11:00</span>
                <span>11:15</span>
              </div>

            </div>

          </div>

        </div>

        {/* HEATMAP */}
        <div className="panel heatmap-panel">

          <div className="panel-header">
            Escalation Heatmap
          </div>

          <div className="heatmap-grid">

            <div className="heat high"></div>
            <div className="heat medium"></div>
            <div className="heat low"></div>

            <div className="heat medium"></div>
            <div className="heat high"></div>
            <div className="heat medium"></div>

            <div className="heat low"></div>
            <div className="heat medium"></div>
            <div className="heat high"></div>

          </div>

          <div className="heatmap-footer">
            High escalation density detected in infrastructure
            and transport governance zones.
          </div>

        </div>

      </div>

      {/* =========================================================
      LOWER GOVERNANCE LAYER
      ========================================================= */}
      <div className="grid-layout">

        {/* LIVE FEED */}
        <div className="panel live-feed">

          <div className="panel-header">
            Live Operational Feed
          </div>

          <div className="feed-item">
            <div className="feed-dot red"></div>
            Power fluctuation detected in Zone 3
          </div>

          <div className="feed-item">
            <div className="feed-dot yellow"></div>
            Transport escalation pending approval
          </div>

          <div className="feed-item">
            <div className="feed-dot green"></div>
            Water distribution system stabilized
          </div>

          <div className="feed-item">
            <div className="feed-dot blue"></div>
            Health infrastructure load balanced
          </div>

          <div className="feed-item">
            <div className="feed-dot purple"></div>
            AI governance sync cycle completed
          </div>

        </div>

        {/* SUMMARY */}
        <div className="panel intelligence-summary">

          <div className="panel-header">
            System Intelligence Summary
          </div>

          <div className="summary-grid">

            <div className="summary-card">
              <div className="summary-title">
                System Stability
              </div>

              <div className="summary-value green">
                HIGH
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-title">
                Risk Clusters
              </div>

              <div className="summary-value yellow">
                3
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-title">
                Escalation Velocity
              </div>

              <div className="summary-value orange">
                MODERATE
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-title">
                Infrastructure Impact
              </div>

              <div className="summary-value red">
                ELEVATED
              </div>
            </div>

          </div>

          <div className="recommendation-box">

            <div className="recommendation-title">
              Executive Recommendation
            </div>

            <div className="recommendation-text">
              Monitor energy sector escalation clusters and
              increase transport oversight in high-density
              operational zones over the next governance cycle.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}