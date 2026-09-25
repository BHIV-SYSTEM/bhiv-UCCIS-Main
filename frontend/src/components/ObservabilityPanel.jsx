import { useEffect, useState } from "react";
import api from "../services/api";

function ObservabilityPanel() {

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/observability")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) {
    return <h3>Loading Runtime Metrics...</h3>;
  }

  return (
    <div className="panel">

      <h2>Runtime Metrics Dashboard</h2>

      <div className="panel-grid">

        <div className="obs-card obs-total">
          <h4>Total Events</h4>
          {/* <h1>{data.totalEvents}</h1> */}
        </div>

        <div className="obs-card obs-success">
          <h4>Successful Events</h4>
          {/* <h1>{data.successEvents}</h1> */}
        </div>

        <div className="obs-card obs-failed">
          <h4>Failed Events</h4>
          {/* <h1>{data.failedEvents}</h1> */}
        </div>

      </div>

    </div>
  );
}

export default ObservabilityPanel;