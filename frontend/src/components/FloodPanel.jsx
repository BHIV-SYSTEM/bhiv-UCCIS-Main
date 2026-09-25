import React, { useState } from "react";

const FloodPanel = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const executeFlood = async () => {
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

      const data = await res.json();
      setResponse(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={executeFlood}>
        {loading ? "Running..." : "Execute Flood Scenario"}
      </button>

      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
};

export default FloodPanel;