// import CanonicalPlatform from "../layout/CanonicalPlatform";
import TelemetryPanelTask34 from "../components/TelemetryPanelTask34";
import TelemetryChartTask34 from "../components/TelemetryChartTask34";
import TelemetryTableTask34 from "../components/TelemetryTableTask34";

function Telemetry() {
  return (
    // <CanonicalPlatform>
      <div className="page-container">

        <TelemetryPanelTask34 />

        <TelemetryChartTask34 />

        <TelemetryTableTask34 />

      </div>
    // </CanonicalPlatform>
  );
}

export default Telemetry;