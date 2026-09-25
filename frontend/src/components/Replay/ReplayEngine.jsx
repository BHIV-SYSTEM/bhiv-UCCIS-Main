import { useEffect, useState } from "react";

import ReplayCard from "../primitives/ReplayCard";

const ReplayEngine = () => {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    fetch(
      "http://localhost:5000/api/replay"
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setData(data)
      );

  }, []);

  return (

    <div className="panel-card">

      <h2>
        Replay Engine
      </h2>

      {data.map(
        (item, index) => (

          <ReplayCard
            key={index}
            incident={item.incident}
            confidence={item.confidence}
            entropy={item.entropy}
          />

        )
      )}

    </div>

  );

};

export default ReplayEngine;