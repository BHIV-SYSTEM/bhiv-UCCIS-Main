import { useEffect, useState } from "react";
import api from "../services/api";

function TelemetryPanelTask34() {

  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/telemetry")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) {
    return <h3>Loading Telemetry...</h3>;
  }

  return (
    <div className="panel">

      <h2>Telemetry Dashboard</h2>

      <div className="panel-grid">

        <div className="telemetry-card telemetry-total">
          <h4>Total Telemetry</h4>
          {/* <h1>{data.totalTelemetry}</h1> */}
        </div>

        <div className="telemetry-card telemetry-health">
          <h4>Healthy Streams</h4>
          {/* <h1>{data.healthyStreams}</h1> */}
        </div>

        <div className="telemetry-card telemetry-warning">
          <h4>Warning Streams</h4>
          {/* <h1>{data.warningStreams}</h1> */}
        </div>

      </div>

    </div>
  );
}

export default TelemetryPanelTask34;