import ReplayTimeline from "../components/visualization/ReplayTimeline";
import EscalationHeatmap from "../components/visualization/EscalationHeatmap";

export default function DashboardWireframe() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-6">

      {/* =========================================================
      PHASE 1 — KPI STRIP
      ========================================================= */}
      <div className="grid grid-cols-6 gap-3 mb-4">

        <KPI label="Active Critical Alerts" value="12" color="red" />
        <KPI label="Infrastructure Health" value="92%" color="green" />
        <KPI label="Execution Velocity" value="1.8x" color="blue" />
        <KPI label="Pending Escalations" value="7" color="yellow" />
        <KPI label="Project Delays" value="5" color="orange" />
        <KPI label="Dept Efficiency" value="78%" color="purple" />

      </div>

      {/* =========================================================
      PHASE 2 — COMMAND INTELLIGENCE CORE
      ========================================================= */}
      <div className="grid grid-cols-12 gap-4 mb-4">

        <div className="col-span-7 bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-2">
            Operational Intelligence Core
          </h2>
          <p className="text-xs text-gray-400">
            System monitoring active. Telemetry stable. No anomalies detected.
          </p>
        </div>

        <div className="col-span-5 bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-2">
            Command Status Panel
          </h2>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>System Load: Normal</li>
            <li>Data Sync: Active</li>
            <li>Alert Engine: Monitoring</li>
            <li>AI Layer: Standby</li>
          </ul>
        </div>

      </div>

      {/* =========================================================
      PHASE 4 — VISUALIZATION LAYER
      ========================================================= */}
      <div className="grid grid-cols-12 gap-4 mb-4">

        <div className="col-span-8">
          <ReplayTimeline />
        </div>

        <div className="col-span-4">
          <EscalationHeatmap />
        </div>

      </div>

      {/* =========================================================
      PHASE 5 — OPERATIONAL FEED + SUMMARY
      ========================================================= */}
      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-6 bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-2">Live Operational Feed</h2>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>Power fluctuation in Zone 3</li>
            <li>Transport escalation pending approval</li>
            <li>Water system stable</li>
            <li>Health load balanced</li>
          </ul>
        </div>

        <div className="col-span-6 bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-2">
            System Intelligence Summary
          </h2>
          <div className="text-xs text-gray-400 space-y-1">
            <p>System Stability: HIGH</p>
            <p>Risk Clusters: 3</p>
            <p>Escalation Velocity: MODERATE</p>
            <p>Recommendation: Monitor energy sector</p>
          </div>
        </div>

      </div>

    </div>
  );
}

/* =========================================================
KPI COMPONENT
========================================================= */
function KPI({ label, value, color }) {
  const colors = {
    red: "text-red-400",
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    purple: "text-purple-400"
  };

  return (
    <div className="bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}