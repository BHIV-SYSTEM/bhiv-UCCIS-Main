import OperationalGrid from "./OperationalGrid";

export default function CentralIntelligence() {

  return (
    <div className="central-zone">

      <div className="zone-header">
        COMMAND INTELLIGENCE
      </div>

      <div className="primary-status">
        Operational Stability: 94%
      </div>

      <OperationalGrid />

    </div>
  );
}