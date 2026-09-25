import { useEffect, useState } from "react";

const SystemTimestamp = () => {

  const [time, setTime] =
    useState("");

  useEffect(() => {

    const runtime =
      setInterval(() => {

        setTime(
          new Date().toLocaleString()
        );

      }, 1000);

    return () =>
      clearInterval(runtime);

  }, []);

  return (

    <div className="panel-card">

      <h2>
        SYSTEM TIME
      </h2>

      <p>
        {time}
      </p>

    </div>

  );

};

export default SystemTimestamp;