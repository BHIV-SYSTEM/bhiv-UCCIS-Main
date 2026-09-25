import SignalCards from "../components/SignalCards";
import SignalTypeChart from "../components/SignalTypeChart";
import SignalStatusChart from "../components/SignalStatusChart";
import SignalsExtra from "../components/SignalsExtra";

export default function SignalsTask27() {
  return (
    <div className="signals-page">

      <div className="signals-header">
        <h1>UCCIS Signal Monitoring Center</h1>
        <p>
          Real-time signal analytics, incident monitoring,
          telemetry tracking and operational visibility.
        </p>
      </div>

      <SignalCards />

      <div className="signal-charts">

        <div className="chart-card">
          <SignalTypeChart />
        </div>

        <div className="chart-card">
          <SignalStatusChart />
        </div>

      </div>

    </div>
  );
}