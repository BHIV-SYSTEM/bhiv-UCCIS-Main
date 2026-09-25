import React from "react";

function ReplayViewerTask29({ replay }) {
  return (
    <div className="card">
      <h2>Replay Sessions</h2>

      <pre>
        {JSON.stringify(replay, null, 2)}
      </pre>
    </div>
  );
}

export default ReplayViewerTask29;