import { useEffect, useState } from "react";
import { API } from "../api";

export default function Divergence() {

  const [data, setData] = useState(null);

  useEffect(() => {

    API.get("/anomaly")
      .then(res => setData(res.data));

  }, []);

  return (
    <div className="panel">

      <h2>DIVERGENCE DETECTION</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  );
}