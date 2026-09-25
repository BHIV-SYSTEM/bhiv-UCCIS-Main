import CompactCard from "../shared/CompactCard";

export default function OperationalGrid() {

  return (
    <div className="ops-grid">

      <CompactCard title="District Stress" value="HIGH" />
      <CompactCard title="Workflow Failures" value="2" />
      <CompactCard title="Execution Chains" value="ACTIVE" />
      <CompactCard title="Replay Sync" value="STABLE" />
      <CompactCard title="Signal Aging" value="7m" />
      <CompactCard title="Response Time" value="2.1s" />

    </div>
  );
}