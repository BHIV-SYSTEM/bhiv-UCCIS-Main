import Header from "../components/Header";
import { useState } from "react";

export default function ReplayReconstruction() {

  const [activeSection, setActiveSection] = useState("dashboard");

  const replayData = [
    { label: "T1", value: 68 },
    { label: "T2", value: 72 },
    { label: "T3", value: 81 },
    { label: "T4", value: 77 },
    { label: "T5", value: 89 },
    { label: "T6", value: 94 }
  ];

  const events = [
    {
      time: "12:01",
      title: "Replay synchronization initiated",
      status: "SUCCESS"
    },
    {
      time: "12:03",
      title: "Historical state snapshot loaded",
      status: "INFO"
    },
    {
      time: "12:04",
      title: "Replay divergence detected",
      status: "WARNING"
    },
    {
      time: "12:05",
      title: "Reconstruction engine executed",
      status: "SUCCESS"
    },
    {
      time: "12:06",
      title: "Operational continuity restored",
      status: "SUCCESS"
    },
    {
      time: "12:07",
      title: "Replay synchronization completed",
      status: "SUCCESS"
    }
  ];


  /* =====================================================
     DETAIL VIEW
  ===================================================== */

  if (activeSection !== "dashboard") {

    const detailData = {

      replay: {
        title: "Replay Integrity",
        value: "97%",
        description:
          "Historical event continuity has been preserved across the replay sequence.",
        items: [
          ["Events Replayed", "1,842"],
          ["States Reconstructed", "326"],
          ["Continuity", "97%"],
          ["Sync Latency", "124 ms"]
        ]
      },

      entropy: {
        title: "System Entropy",
        value: "21%",
        description:
          "Runtime disorder has been reduced during the reconstruction process.",
        items: [
          ["Initial Entropy", "34%"],
          ["Current Entropy", "21%"],
          ["Reduction", "38%"],
          ["Status", "STABLE"]
        ]
      },

      confidence: {
        title: "Reconstruction Confidence",
        value: "94%",
        description:
          "The reconstructed state strongly matches historical runtime telemetry.",
        items: [
          ["Event Match", "98%"],
          ["State Match", "96%"],
          ["Telemetry Match", "93%"],
          ["Overall", "94%"]
        ]
      },

      divergence: {
        title: "Divergence Events",
        value: "04",
        description:
          "Four replay divergence events were identified and successfully corrected.",
        items: [
          ["Detected", "04"],
          ["Corrected", "04"],
          ["Active", "00"],
          ["Recovery", "100%"]
        ]
      }

    };

    const selected = detailData[activeSection];

    return (

      <div className="replay-page">

        <Header title="Replay & Reconstruction" />

        <div className="replay-detail-page">

          <button
            className="replay-back-button"
            onClick={() => setActiveSection("dashboard")}
          >
            ← Back to Replay Dashboard
          </button>

          <div className="replay-detail-header">

            <div>

              <span>
                REPLAY ANALYSIS
              </span>

              <h1>
                {selected.title}
              </h1>

              <p>
                {selected.description}
              </p>

            </div>

            <div className="replay-detail-value">
              {selected.value}
            </div>

          </div>


          <div className="replay-detail-grid">

            {selected.items.map((item, index) => (

              <div
                className="replay-detail-card"
                key={index}
              >

                <span>
                  {item[0]}
                </span>

                <strong>
                  {item[1]}
                </strong>

              </div>

            ))}

          </div>


          <div className="replay-analysis-panel">

            <h2>
              Analysis Result
            </h2>

            <div className="replay-analysis-line">
              <span>Historical State</span>
              <strong>VALIDATED</strong>
            </div>

            <div className="replay-analysis-line">
              <span>Runtime Telemetry</span>
              <strong>AVAILABLE</strong>
            </div>

            <div className="replay-analysis-line">
              <span>Reconstruction</span>
              <strong>COMPLETED</strong>
            </div>

            <div className="replay-analysis-line">
              <span>Synchronization</span>
              <strong>STABLE</strong>
            </div>

          </div>

        </div>

      </div>

    );
  }


  /* =====================================================
     MAIN REPLAY DASHBOARD
  ===================================================== */

  return (

    <div className="replay-page">

      <Header title="Replay & Reconstruction" />


      {/* =================================================
          REPLAY HEADER
      ================================================= */}

      <div className="replay-hero">

        <div>

          <span className="replay-label">
            REPLAY CONTROL CENTER
          </span>

          <h1>
            Historical State Reconstruction
          </h1>

          <p>
            Reconstruct, validate and synchronize previous
            operational states from runtime telemetry.
          </p>

        </div>

        <div className="replay-live">

          <span></span>

          LIVE REPLAY

        </div>

      </div>


      {/* =================================================
          STATUS CARDS
      ================================================= */}

      <div className="replay-card-grid">


        {/* REPLAY */}

        <div
          className="replay-card"
          onClick={() => setActiveSection("replay")}
        >

          <div className="replay-card-header">

            <span>
              REPLAY INTEGRITY
            </span>

            <b>
              ↗
            </b>

          </div>

          <h2>
            97%
          </h2>

          <div className="replay-progress">

            <div style={{ width: "97%" }} />

          </div>

          <p>
            Event continuity preserved
          </p>

          <button>
            View Replay →
          </button>

        </div>


        {/* ENTROPY */}

        <div
          className="replay-card"
          onClick={() => setActiveSection("entropy")}
        >

          <div className="replay-card-header">

            <span>
              SYSTEM ENTROPY
            </span>

            <b>
              ↗
            </b>

          </div>

          <h2 className="replay-yellow">
            21%
          </h2>

          <div className="replay-progress yellow">

            <div style={{ width: "21%" }} />

          </div>

          <p>
            Runtime disorder detected
          </p>

          <button>
            Analyze Entropy →
          </button>

        </div>


        {/* CONFIDENCE */}

        <div
          className="replay-card"
          onClick={() => setActiveSection("confidence")}
        >

          <div className="replay-card-header">

            <span>
              RECONSTRUCTION CONFIDENCE
            </span>

            <b>
              ↗
            </b>

          </div>

          <h2 className="replay-cyan">
            94%
          </h2>

          <div className="replay-progress">

            <div style={{ width: "94%" }} />

          </div>

          <p>
            Reconstruction integrity stable
          </p>

          <button>
            View Confidence →
          </button>

        </div>


        {/* DIVERGENCE */}

        <div
          className="replay-card"
          onClick={() => setActiveSection("divergence")}
        >

          <div className="replay-card-header">

            <span>
              DIVERGENCE EVENTS
            </span>

            <b>
              ↗
            </b>

          </div>

          <h2 className="replay-red">
            04
          </h2>

          <div className="divergence-dots">

            <i></i>
            <i></i>
            <i></i>
            <i></i>

          </div>

          <p>
            All divergence events corrected
          </p>

          <button>
            View Events →
          </button>

        </div>

      </div>


      {/* =================================================
          REPLAY RECOVERY CHART
      ================================================= */}

      <div className="replay-panel">

        <div className="replay-panel-header">

          <div>

            <span>
              REPLAY PERFORMANCE
            </span>

            <h2>
              Recovery Progress
            </h2>

          </div>

          <strong>
            94%
          </strong>

        </div>


        <div className="replay-chart">

          {replayData.map((item) => (

            <div
              className="replay-chart-column"
              key={item.label}
            >

              <span>
                {item.value}%
              </span>

              <div className="replay-bar-container">

                <div
                  className="replay-bar"
                  style={{
                    height: `${item.value}%`
                  }}
                />

              </div>

              <small>
                {item.label}
              </small>

            </div>

          ))}

        </div>

      </div>


      {/* =================================================
          RECONSTRUCTION PIPELINE
      ================================================= */}

      <div className="replay-panel">

        <div className="replay-panel-header">

          <div>

            <span>
              RECONSTRUCTION PIPELINE
            </span>

            <h2>
              Processing Stages
            </h2>

          </div>

          <strong className="replay-cyan">
            94% COMPLETE
          </strong>

        </div>


        <div className="replay-pipeline">

          <div className="pipeline-item">

            <strong>01</strong>

            <h3>
              Capture
            </h3>

            <p>
              Runtime events captured
            </p>

            <div>
              <span style={{ width: "100%" }} />
            </div>

            <small>
              COMPLETE
            </small>

          </div>


          <div className="pipeline-item">

            <strong>02</strong>

            <h3>
              Validate
            </h3>

            <p>
              Event sequence validated
            </p>

            <div>
              <span style={{ width: "100%" }} />
            </div>

            <small>
              COMPLETE
            </small>

          </div>


          <div className="pipeline-item">

            <strong>03</strong>

            <h3>
              Compare
            </h3>

            <p>
              Historical state compared
            </p>

            <div>
              <span style={{ width: "100%" }} />
            </div>

            <small>
              COMPLETE
            </small>

          </div>


          <div className="pipeline-item">

            <strong>04</strong>

            <h3>
              Reconstruct
            </h3>

            <p>
              Previous state reconstructed
            </p>

            <div>
              <span style={{ width: "94%" }} />
            </div>

            <small className="active-text">
              ACTIVE
            </small>

          </div>


          <div className="pipeline-item">

            <strong>05</strong>

            <h3>
              Synchronize
            </h3>

            <p>
              Runtime state synchronized
            </p>

            <div>
              <span style={{ width: "91%" }} />
            </div>

            <small className="active-text">
              ACTIVE
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          BOTTOM SECTION
      ================================================= */}

      <div className="replay-bottom-grid">


        {/* EVENT STREAM */}

        <div className="replay-panel">

          <div className="replay-panel-header">

            <div>

              <span>
                RECENT ACTIVITY
              </span>

              <h2>
                Replay Event Stream
              </h2>

            </div>

          </div>


          {events.map((event, index) => (

            <div
              className="replay-event"
              key={index}
            >

              <div
                className={`event-dot ${event.status.toLowerCase()}`}
              />

              <span className="event-time">
                {event.time}
              </span>

              <span className="event-title">
                {event.title}
              </span>

              <span
                className={`event-status ${event.status.toLowerCase()}`}
              >
                {event.status}
              </span>

            </div>

          ))}

        </div>


        {/* ENGINE HEALTH */}

        <div className="replay-panel">

          <div className="replay-panel-header">

            <div>

              <span>
                ENGINE HEALTH
              </span>

              <h2>
                Replay Engine
              </h2>

            </div>

          </div>


          <div className="health-circle">

            <div>

              <strong>
                97
              </strong>

              <span>
                HEALTH
              </span>

            </div>

          </div>


          <div className="health-list">

            <div>
              <span>
                Event Stream
              </span>

              <b>
                ONLINE
              </b>
            </div>

            <div>
              <span>
                State Memory
              </span>

              <b>
                READY
              </b>
            </div>

            <div>
              <span>
                Replay Sync
              </span>

              <b>
                STABLE
              </b>
            </div>

            <div>
              <span>
                Correction Engine
              </span>

              <b>
                ACTIVE
              </b>
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        .replay-page {

          min-height: 100vh;

          padding: 0 20px 40px;

          background:
            linear-gradient(
              135deg,
              #06111e,
              #091a29
            );

          color: #e8f5fb;

        }


        /* HERO */

        .replay-hero {

          display: flex;

          justify-content: space-between;

          align-items: center;

          padding: 22px;

          margin-bottom: 15px;

          border: 1px solid
            rgba(70,190,230,0.15);

          border-radius: 10px;

          background: #0d2133;

        }


        .replay-label {

          color: #50d8ff;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1.5px;

        }


        .replay-hero h1 {

          margin: 7px 0;

          font-size: 22px;

        }


        .replay-hero p {

          margin: 0;

          color: #71899b;

          font-size: 10px;

        }


        .replay-live {

          display: flex;

          align-items: center;

          gap: 7px;

          padding: 9px 13px;

          border-radius: 6px;

          color: #43df93;

          background:
            rgba(67,223,147,0.08);

          font-size: 8px;

          font-weight: 800;

        }


        .replay-live span {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: #43df93;

          box-shadow:
            0 0 10px
            rgba(67,223,147,0.8);

        }


        /* CARDS */

        .replay-card-grid {

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 13px;

          margin-bottom: 15px;

        }


        .replay-card {

          min-height: 190px;

          padding: 17px;

          border: 1px solid
            rgba(110,170,200,0.14);

          border-radius: 9px;

          background: #0d2032;

          cursor: pointer;

          transition: 0.2s;

        }


        .replay-card:hover {

          transform: translateY(-4px);

          border-color:
            rgba(70,215,255,0.45);

          box-shadow:
            0 10px 25px
            rgba(0,0,0,0.25);

        }


        .replay-card-header {

          display: flex;

          justify-content: space-between;

          color: #698196;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 0.8px;

        }


        .replay-card-header b {

          color: #50d8ff;

          font-size: 13px;

        }


        .replay-card h2 {

          margin: 18px 0 10px;

          font-size: 31px;

        }


        .replay-card p {

          color: #6b8498;

          font-size: 8px;

        }


        .replay-card button {

          margin-top: 9px;

          padding: 6px 9px;

          border: 1px solid
            rgba(80,215,255,0.18);

          border-radius: 5px;

          background:
            rgba(80,215,255,0.05);

          color: #50d8ff;

          font-size: 7px;

          cursor: pointer;

        }


        .replay-cyan {

          color: #50d8ff !important;

        }


        .replay-yellow {

          color: #ffbd58;

        }


        .replay-red {

          color: #ff6879;

        }


        .replay-progress {

          height: 4px;

          overflow: hidden;

          border-radius: 5px;

          background:
            rgba(255,255,255,0.06);

        }


        .replay-progress div {

          height: 100%;

          border-radius: inherit;

          background: #50d8ff;

        }


        .replay-progress.yellow div {

          background: #ffbd58;

        }


        .divergence-dots {

          display: flex;

          gap: 5px;

          margin: 20px 0 8px;

        }


        .divergence-dots i {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: #ff6879;

        }


        /* PANELS */

        .replay-panel {

          padding: 20px;

          margin-bottom: 15px;

          border: 1px solid
            rgba(110,170,200,0.14);

          border-radius: 10px;

          background: #0d2032;

        }


        .replay-panel-header {

          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          margin-bottom: 20px;

        }


        .replay-panel-header span {

          color: #50d8ff;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1px;

        }


        .replay-panel-header h2 {

          margin: 6px 0 0;

          font-size: 15px;

        }


        .replay-panel-header > strong {

          color: #50d8ff;

          font-size: 19px;

        }


        /* CHART */

        .replay-chart {

          height: 260px;

          display: flex;

          align-items: flex-end;

          justify-content: space-around;

          gap: 15px;

          padding: 10px 20px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.06);

        }


        .replay-chart-column {

          height: 100%;

          flex: 1;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: flex-end;

          gap: 7px;

        }


        .replay-chart-column > span {

          color: #50d8ff;

          font-size: 8px;

        }


        .replay-bar-container {

          height: 205px;

          width: 45px;

          display: flex;

          align-items: flex-end;

        }


        .replay-bar {

          width: 100%;

          border-radius: 5px 5px 0 0;

          background:
            linear-gradient(
              180deg,
              #50d8ff,
              #176e91
            );

          transition: 0.3s;

        }


        .replay-chart-column:hover
        .replay-bar {

          opacity: 0.75;

        }


        .replay-chart-column small {

          color: #5f778a;

          font-size: 8px;

        }


        /* PIPELINE */

        .replay-pipeline {

          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 10px;

        }


        .pipeline-item {

          padding: 14px;

          border: 1px solid
            rgba(255,255,255,0.06);

          border-radius: 8px;

          background:
            rgba(255,255,255,0.02);

        }


        .pipeline-item > strong {

          color: #50d8ff;

          font-size: 9px;

        }


        .pipeline-item h3 {

          margin: 9px 0 5px;

          font-size: 11px;

        }


        .pipeline-item p {

          min-height: 28px;

          margin: 0 0 10px;

          color: #687f91;

          font-size: 7px;

        }


        .pipeline-item > div {

          height: 4px;

          overflow: hidden;

          border-radius: 5px;

          background:
            rgba(255,255,255,0.06);

        }


        .pipeline-item > div span {

          display: block;

          height: 100%;

          background: #50d8ff;

        }


        .pipeline-item small {

          display: block;

          margin-top: 7px;

          color: #43df93;

          font-size: 7px;

          font-weight: 800;

        }


        .active-text {

          color: #50d8ff !important;

        }


        /* BOTTOM */

        .replay-bottom-grid {

          display: grid;

          grid-template-columns:
            1.4fr 0.8fr;

          gap: 15px;

        }


        .replay-bottom-grid .replay-panel {

          margin-bottom: 0;

        }


        /* EVENTS */

        .replay-event {

          display: grid;

          grid-template-columns:
            10px 60px 1fr auto;

          align-items: center;

          gap: 10px;

          padding: 11px 0;

          border-bottom:
            1px solid
            rgba(255,255,255,0.05);

        }


        .event-dot {

          width: 7px;

          height: 7px;

          border-radius: 50%;

        }


        .event-dot.success {

          background: #43df93;

        }


        .event-dot.info {

          background: #50d8ff;

        }


        .event-dot.warning {

          background: #ffbd58;

        }


        .event-time {

          color: #506a7e;

          font-size: 8px;

        }


        .event-title {

          color: #b4c8d4;

          font-size: 8px;

        }


        .event-status {

          font-size: 7px;

          font-weight: 800;

        }


        .event-status.success {

          color: #43df93;

        }


        .event-status.info {

          color: #50d8ff;

        }


        .event-status.warning {

          color: #ffbd58;

        }


        /* HEALTH */

        .health-circle {

          width: 135px;

          height: 135px;

          margin: 10px auto 20px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:
            conic-gradient(
              #43df93 0deg,
              #43df93 349deg,
              rgba(255,255,255,0.05) 349deg
            );

          position: relative;

        }


        .health-circle::after {

          content: "";

          position: absolute;

          width: 105px;

          height: 105px;

          border-radius: 50%;

          background: #0a1927;

        }


        .health-circle div {

          position: relative;

          z-index: 2;

          text-align: center;

        }


        .health-circle strong {

          display: block;

          font-size: 29px;

        }


        .health-circle span {

          color: #637b8f;

          font-size: 7px;

        }


        .health-list {

          display: flex;

          flex-direction: column;

          gap: 8px;

        }


        .health-list div {

          display: flex;

          justify-content: space-between;

          padding: 9px;

          border-radius: 5px;

          background:
            rgba(255,255,255,0.025);

        }


        .health-list span {

          color: #71889b;

          font-size: 8px;

        }


        .health-list b {

          color: #43df93;

          font-size: 7px;

        }


        /* DETAIL PAGE */

        .replay-detail-page {

          padding: 25px;

          min-height: 600px;

          border: 1px solid
            rgba(70,190,230,0.15);

          border-radius: 10px;

          background: #0d2133;

        }


        .replay-back-button {

          padding: 8px 12px;

          margin-bottom: 25px;

          border: 1px solid
            rgba(80,215,255,0.15);

          border-radius: 6px;

          background:
            rgba(80,215,255,0.05);

          color: #50d8ff;

          font-size: 8px;

          cursor: pointer;

        }


        .replay-detail-header {

          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 30px;

        }


        .replay-detail-header span {

          color: #50d8ff;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1px;

        }


        .replay-detail-header h1 {

          margin: 8px 0;

          font-size: 25px;

        }


        .replay-detail-header p {

          max-width: 600px;

          color: #71899b;

          font-size: 10px;

        }


        .replay-detail-value {

          font-size: 55px;

          color: #50d8ff;

          font-weight: 800;

        }


        .replay-detail-grid {

          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 12px;

          margin-bottom: 20px;

        }


        .replay-detail-card {

          padding: 20px;

          border: 1px solid
            rgba(255,255,255,0.06);

          border-radius: 8px;

          background:
            rgba(255,255,255,0.025);

        }


        .replay-detail-card span {

          display: block;

          color: #627a8d;

          font-size: 8px;

        }


        .replay-detail-card strong {

          display: block;

          margin-top: 8px;

          color: #50d8ff;

          font-size: 22px;

        }


        .replay-analysis-panel {

          padding: 20px;

          border: 1px solid
            rgba(255,255,255,0.06);

          border-radius: 8px;

          background:
            rgba(255,255,255,0.02);

        }


        .replay-analysis-panel h2 {

          margin-top: 0;

          font-size: 15px;

        }


        .replay-analysis-line {

          display: flex;

          justify-content: space-between;

          padding: 12px 0;

          border-bottom:
            1px solid
            rgba(255,255,255,0.05);

        }


        .replay-analysis-line span {

          color: #71899b;

          font-size: 9px;

        }


        .replay-analysis-line strong {

          color: #43df93;

          font-size: 8px;

        }


        /* RESPONSIVE */

        @media (max-width: 1100px) {

          .replay-card-grid {

            grid-template-columns:
              repeat(2, 1fr);

          }

          .replay-pipeline {

            grid-template-columns:
              repeat(2, 1fr);

          }

        }


        @media (max-width: 750px) {

          .replay-card-grid,
          .replay-detail-grid {

            grid-template-columns: 1fr;

          }

          .replay-bottom-grid {

            grid-template-columns: 1fr;

          }

          .replay-pipeline {

            grid-template-columns: 1fr;

          }

          .replay-hero,
          .replay-detail-header {

            flex-direction: column;

            align-items: flex-start;

            gap: 15px;

          }

        }

      `}</style>

    </div>
  );
}