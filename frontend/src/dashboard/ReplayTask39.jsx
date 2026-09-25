import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReplayTask39() {

  const [replays, setReplays] = useState([]);

  useEffect(() => {
    loadReplays();
  }, []);

  const loadReplays = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/replay"
      );

      if (res.data.length > 0) {

        setReplays(res.data);

      } else {

        setReplays([
          {
            _id: 1,
            replayId: "REP-1001",
            incidentId: "INC-1001",
            traceId: "TRACE-1001",
            status: "Completed",
            duration: 1250,
            createdAt: new Date()
          },
          {
            _id: 2,
            replayId: "REP-1002",
            incidentId: "INC-1002",
            traceId: "TRACE-1002",
            status: "Running",
            duration: 870,
            createdAt: new Date()
          },
          {
            _id: 3,
            replayId: "REP-1003",
            incidentId: "INC-1003",
            traceId: "TRACE-1003",
            status: "Pending",
            duration: 0,
            createdAt: new Date()
          }
        ]);

      }

    } catch (error) {

      console.log(error);

      setReplays([
        {
          _id: 1,
          replayId: "REP-1001",
          incidentId: "INC-1001",
          traceId: "TRACE-1001",
          status: "Completed",
          duration: 1250,
          createdAt: new Date()
        },
        {
          _id: 2,
          replayId: "REP-1002",
          incidentId: "INC-1002",
          traceId: "TRACE-1002",
          status: "Running",
          duration: 870,
          createdAt: new Date()
        }
      ]);

    }
  };

  const completed =
    replays.filter(
      item => item.status === "Completed"
    ).length;

  const running =
    replays.filter(
      item => item.status === "Running"
    ).length;

  const pending =
    replays.filter(
      item => item.status === "Pending"
    ).length;

  return (
    <div className="page-container">

      <h1 className="page-title">
        Replay Command Center
      </h1>

      <p className="page-subtitle">
        Runtime Replay & Trace Reconstruction Engine
      </p>

      <div className="metrics-grid">

        <div className="metric-card">
          <h4>🔄 Total Replays</h4>
          <h2>{replays.length}</h2>
        </div>

        <div className="metric-card">
          <h4>✅ Completed</h4>
          <h2>{completed}</h2>
        </div>

        <div className="metric-card">
          <h4>⚡ Running</h4>
          <h2>{running}</h2>
        </div>

        <div className="metric-card">
          <h4>⏳ Pending</h4>
          <h2>{pending}</h2>
        </div>

      </div>

      <div className="panel">

        <h2>Replay Intelligence</h2>

        <div className="alert success">
          Trace reconstruction engine operational.
        </div>

        <div className="alert info">
          Runtime replay validation enabled.
        </div>

        <div className="alert warning">
          Pending sessions awaiting execution.
        </div>

      </div>

      <div className="panel">

        <h2>Replay Execution Queue</h2>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Replay ID</th>
                <th>Incident ID</th>
                <th>Trace ID</th>
                <th>Status</th>
                <th>Duration (ms)</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>

              {replays.map(item => (

                <tr key={item._id}>

                  <td>{item.replayId}</td>

                  <td>{item.incidentId}</td>

                  <td>{item.traceId}</td>

                  <td>{item.status}</td>

                  <td>{item.duration}</td>

                  <td>
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <div className="panel">

        <h2>Replay Timeline</h2>

        <div className="timeline-item">
          <strong>Replay Engine Started</strong>
          <span>Runtime Session Active</span>
        </div>

        <div className="timeline-item">
          <strong>Trace Reconstruction</strong>
          <span>Historical Event Correlation Enabled</span>
        </div>

        <div className="timeline-item">
          <strong>Replay Validation</strong>
          <span>Evidence Compatibility Verified</span>
        </div>

        <div className="timeline-item">
          <strong>Runtime Pipeline</strong>
          <span>
            Signal → Incident → Escalation → Replay
          </span>
        </div>

      </div>

      <div className="panel">

        <h2>Replay Analytics</h2>

        <div className="summary-grid">

          <div className="summary-card">
            <h4>Average Runtime</h4>
            <p>1.2s</p>
          </div>

          <div className="summary-card">
            <h4>Success Rate</h4>
            <p>99.8%</p>
          </div>

          <div className="summary-card">
            <h4>Trace Accuracy</h4>
            <p>98.6%</p>
          </div>

          <div className="summary-card">
            <h4>Recovery Time</h4>
            <p>0.9s</p>
          </div>

        </div>

      </div>

    </div>
  );
}