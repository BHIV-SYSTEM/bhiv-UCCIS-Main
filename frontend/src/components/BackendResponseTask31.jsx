import React from "react";

const BackendResponseTask31 = ({
  title = "Backend Response",
  data = {}
}) => {
  return (
    <div className="backend-response-card">
      <div className="backend-response-header">
        <h2>{title}</h2>
      </div>

      <div className="backend-response-body">
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default BackendResponseTask31;