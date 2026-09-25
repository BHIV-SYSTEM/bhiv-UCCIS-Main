import SystemHealthTask30 from "../components/SystemHealthTask30";
import BackendResponse from "../components/BackendResponse";
import RuntimeLogsTask30 from "../components/RuntimeLogsTask30";
import IncidentChart from "../components/Charts/IncidentChart";
import TelemetryChart from "../components/Charts/TelemetryChart";

const EDODemonstration = () => {
  return (
    <>
      <SystemHealthTask30 />

      <div className="stats-grid">
        <div className="card">
          <h2>Total Signals</h2>
          <h1>15</h1>
        </div>

        <div className="card">
          <h2>Total Telemetry</h2>
          <h1>20</h1>
        </div>

        <div className="card">
          <h2>Total Incidents</h2>
          <h1>8</h1>
        </div>

        <div className="card">
          <h2>Total Escalations</h2>
          <h1>5</h1>
        </div>
      </div>

      <div className="charts-grid">
        <IncidentChart />
        <TelemetryChart />
      </div>

      <BackendResponse />

      <RuntimeLogsTask30 />
    </>
  );
};

export default EDODemonstration;