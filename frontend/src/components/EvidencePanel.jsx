import { useEffect, useState } from "react";
import api from "../services/api";

function EvidencePanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/evidence")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  // if (!data) {
  //   return <h3>Loading Evidence...</h3>;
  // }

  return (
    <div className="panel">

      <h2>Evidence Dashboard</h2>

      <div className="panel-grid">

        <div className="evidence-card evidence-total">
          <h4>Total Evidence</h4>
          {/* <h1>{data.totalEvidence}</h1> */}
        </div>

        <div className="evidence-card evidence-verified">
          <h4>Verified Evidence</h4>
          {/* <h1>{data.verifiedEvidence}</h1> */}
        </div>

        <div className="evidence-card evidence-pending">
          <h4>Pending Review</h4>
          {/* <h1>{data.pendingEvidence}</h1> */}
        </div>

      </div>

    </div>
  );
}

export default EvidencePanel;