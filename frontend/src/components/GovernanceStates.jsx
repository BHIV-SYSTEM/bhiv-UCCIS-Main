export default function GovernanceStates({
  states
}) {
  return (
    <div className="card">
      <h2>
        Unresolved Governance States
      </h2>

      {
        states.map(item => (
          <p key={item.trace_id}>
            {item.trace_id}
            :
            {item.unresolved_state}
          </p>
        ))
      }
    </div>
  );
}