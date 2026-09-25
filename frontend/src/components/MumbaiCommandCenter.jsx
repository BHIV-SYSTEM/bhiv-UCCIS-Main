import { useEffect, useState } from "react";
import API from "../api/api";

function MumbaiCommandCenter() {

  const [data, setData] = useState(null);

  useEffect(() => {

    API.get("/dashboard")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>UCCIS Mumbai Command Center</h1>

      {data && (
        <>
          <h2>City: {data.city}</h2>
          <h2>Risk Score: {data.risk_score}</h2>
          <h2>Status: {data.governance_status}</h2>
        </>
      )}
    </div>
  );
}

export default MumbaiCommandCenter;