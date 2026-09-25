import React, { useState } from "react";

import { getReplay } from "../services/api";
import ReplayTimelineTask32 from "../components/ReplayTimelineTask32";
import IncidentChartTask32 from "../components/IncidentChartTask32";

const ReplayViewTask32 = () => {
  const [traceId, setTraceId] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [replayMeta, setReplayMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  const loadReplay = async () => {
    if (!traceId) return;

    setLoading(true);
    setError(null);
    setReady(false);

    try {
      const response = await getReplay(traceId);

      console.log("REPLAY RESPONSE:", response);

      const data = response?.data || response || {};

      const timelineData =
        data.timeline ||
        data.events ||
        data.replay_events ||
        [];

      setTimeline(Array.isArray(timelineData) ? timelineData : []);

      setReplayMeta({
        trace_id: traceId,
        totalEvents: timelineData.length || 0,
        signals: Number(data.signals) || 0,
        incidents: Number(data.incidents) || 0,
        escalations: Number(data.escalations) || 0,
        status: data.status || "UNKNOWN",
        duration: data.duration || "N/A",
      });

      // 🔥 FIX 2: DELAY RENDER FOR RECHARTS STABILITY
      setTimeout(() => {
        setReady(true);
      }, 100);

    } catch (err) {
      console.error(err);
      setError("Replay API failed");
      setTimeline([]);
      setReplayMeta(null);
      setReady(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>

      <h1>Replay Analytics</h1>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={traceId}
          onChange={(e) => setTraceId(e.target.value)}
          placeholder="Enter Trace ID"
          style={{ padding: 10, flex: 1 }}
        />

        <button onClick={loadReplay}>
          {loading ? "Loading..." : "Load Replay"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* CARDS */}
      {replayMeta && (
        <div className="cards" style={{ marginTop: 20 }}>

          <div className="stat-card">
            <h3>Trace ID</h3>
            <p>{replayMeta.trace_id}</p>
          </div>

          <div className="stat-card">
            <h3>Total Events</h3>
            <p>{replayMeta.totalEvents}</p>
          </div>

          <div className="stat-card">
            <h3>Status</h3>
            <p>{replayMeta.status}</p>
          </div>

          <div className="stat-card">
            <h3>Duration</h3>
            <p>{replayMeta.duration}</p>
          </div>

        </div>
      )}

      {/* CHART (ONLY AFTER READY) */}
      {replayMeta && ready && (
        <div className="chart-section" style={{ minHeight: 350 }}>
          <h3>Replay Distribution</h3>

          <IncidentChartTask32
            signals={replayMeta.signals}
            incidents={replayMeta.incidents}
            escalations={replayMeta.escalations}
          />
        </div>
      )}

      {/* TIMELINE */}
      <ReplayTimelineTask32 timeline={timeline || []} />

      {/* BACKEND */}
      {replayMeta && (
        <div className="backend-response">
          <h3>Backend Response</h3>
          <pre>{JSON.stringify(replayMeta, null, 2)}</pre>
        </div>
      )}

    </div>
  );
};

export default ReplayViewTask32;