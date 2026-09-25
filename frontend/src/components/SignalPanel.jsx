import { useEffect, useState } from "react";
import api from "../services/api";

function SignalPanel() {
  return (
    <div className="panel signal-panel">

      {/* Header */}
      <h2>Signal Dashboard</h2>

      {/* Signal Cards */}
      <div className="panel-grid">

        {/* Total Signals */}
        <div className="signal-card total">
          <h4>Total Signals</h4>
        </div>

        {/* Active Signals */}
        <div className="signal-card active">
          <h4>Active Signals</h4>
        </div>

        {/* Critical Signals */}
        <div className="signal-card critical">
          <h4>Critical Signals</h4>
        </div>

      </div>

    </div>
  );
}

export default SignalPanel;