import CollapsibleSection from "../shared/CollapsibleSection";

export default function ExecutionVisibility() {

  return (
    <div className="execution-panel">

      <div className="zone-header">
        EXECUTION VISIBILITY
      </div>

      <div className="mini-card">
        Pending Assignments: 18
      </div>

      <div className="mini-card">
        Aging Tasks: 7
      </div>

      <div className="mini-card">
        Field Responses: Active
      </div>

      <CollapsibleSection title="Secondary Operational Data">

        <div className="secondary-data">
          Dependency Chains Stable
        </div>

        <div className="secondary-data">
          Replay Reconstruction Active
        </div>

      </CollapsibleSection>

    </div>
  );
}