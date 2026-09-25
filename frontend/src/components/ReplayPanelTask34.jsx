import { useEffect, useState } from "react";
import api from "../services/api";

function ReplayPanelTask34() {

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/replay")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) {
    return <h3>Loading Replay Data...</h3>;
  }

  return (
    <div className="panel">

      <h2>Replay Dashboard</h2>

      <div className="panel-grid">

        <div className="replay-card replay-total">
          <h4>Total Replays</h4>
          {/* <h1>{data.totalReplays}</h1> */}
        </div>

        <div className="replay-card replay-success">
          <h4>Successful Replays</h4>
          {/* <h1>{data.successfulReplays}</h1> */}
        </div>

        <div className="replay-card replay-failed">
          <h4>Failed Replays</h4>
          {/* <h1>{data.failedReplays}</h1> */}
        </div>

      </div>

    </div>
  );
}

export default ReplayPanelTask34;