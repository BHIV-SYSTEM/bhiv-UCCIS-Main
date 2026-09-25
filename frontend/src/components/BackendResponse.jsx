import { useState } from "react";

const BackendResponse = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // EXECUTE FLOOD SCENARIO
  // =========================
  const executeFloodScenario = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/flood/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          event_id: 101,
          severity: "HIGH"
        })
      });

      const result = await res.json();

      setData(result); // 🔥 THIS FIXES YOUR NULL ISSUE

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="card">
  //     <h2>Backend Response</h2>

  //     {/* BUTTON */}
  //     <button
  //       onClick={executeFloodScenario}
  //       disabled={loading}
  //       className="btn"
  //     >
  //       {loading ? "Executing..." : "Execute Flood Scenario"}
  //     </button>

  //     {/* RESPONSE */}
  //     <div className="response-box">
  //       <pre>
  //         {data ? JSON.stringify(data, null, 2) : "null"}
  //       </pre>
  //     </div>
  //   </div>
  // );
};

export default BackendResponse;