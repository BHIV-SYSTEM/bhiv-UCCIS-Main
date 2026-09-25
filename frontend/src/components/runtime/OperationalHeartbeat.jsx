import { useEffect, useState } from "react";

const OperationalHeartbeat = () => {

  const [heartbeat, setHeartbeat] =
    useState(false);

  useEffect(() => {

    const pulse =
      setInterval(() => {

        setHeartbeat(prev => !prev);

      }, 1000);

    return () =>
      clearInterval(pulse);

  }, []);

  return (

    <div className="heartbeat-wrapper">

      <div
        className={
          heartbeat
            ? "heartbeat active"
            : "heartbeat"
        }
      />

      <span>
        Operational Runtime Active
      </span>

    </div>

  );

};

export default OperationalHeartbeat;