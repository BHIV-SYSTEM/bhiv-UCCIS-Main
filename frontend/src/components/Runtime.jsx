import RuntimeCards from "../components/RuntimeCards";
import RuntimeLogs from "../components/RuntimeLogs";
import RuntimeStatus from "../components/RuntimeStatus";
import RuntimeFlow from "../components/RuntimeFlow";
import SignalChart from "../components/SignalChart";
import IncidentChart from "../components/IncidentChart";

export default function Runtime() {
  return (
    <div className="runtime-page">

      <h1>UCCIS Runtime Monitoring Center</h1>

      <RuntimeCards />

      <div className="runtime-charts">
        <SignalChart />
        <IncidentChart />
      </div>

      <RuntimeStatus />

      <RuntimeFlow />

      <RuntimeLogs />

    </div>
  );
}