import { useEffect, useState } from "react";

import API from "../services/api";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function Corruption() {

  const [data, setData] = useState(null);

  const [error, setError] = useState(false);

  useEffect(() => {

    API.get("/corruption")

      .then(res => {

        setData(res.data);

      })

      .catch(err => {

        console.log(err);

        setError(true);

      });

  }, []);

  if (error) {

    return (

      <div className="panel">

        <h2>CORRUPTION RECOVERY</h2>

        <div className="status-danger">

          Backend Route Failed

        </div>

      </div>

    );

  }

  if (!data) {

    return (

      <div className="panel">

        <h2>CORRUPTION RECOVERY</h2>

        <div>Loading Recovery Data...</div>

      </div>

    );

  }

  return (

    <div className="panel">

      <h2>CORRUPTION RECOVERY</h2>

      <div className="metric-grid">

        <div className="metric-card">

          Recovery

          <h3>
            {data.replayRecovery}
          </h3>

        </div>

        <div className="metric-card">

          Confidence

          <h3>
            {data.recoveryConfidence}%
          </h3>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={220}
      >

        <LineChart
          data={data.recoveryTimeline}
        >

          <XAxis dataKey="phase" />

          <YAxis />

          <Tooltip />

          <Line
            dataKey="value"
            stroke="#00ff90"
          />

        </LineChart>

      </ResponsiveContainer>

      <div className="feed">

        {data.operationalFeed.map(
          (item, index) => (

            <div key={index}>

              {">"} {item}

            </div>

          )
        )}

      </div>

    </div>

  );

}