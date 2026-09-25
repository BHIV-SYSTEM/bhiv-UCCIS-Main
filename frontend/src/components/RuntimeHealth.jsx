import React from "react";

const RuntimeHealth = ({
  status,
  onClick,
}) => {

  return (
    <div
      className="
      runtime-health
      clickable
      "
      onClick={onClick}
    >

      <h3>
        System Runtime Health
      </h3>

      <div
        className="
        healthy
        "
      >
        {status}
      </div>

      <p>
        Click to open
        complete runtime
        analytics
      </p>

    </div>
  );
};

export default RuntimeHealth;