export default function EscalationAging({
  escalations
}) {
  return (
    <div className="card">
      <h2>Escalation Aging</h2>

      {
        escalations.map(item => (
          <p key={item.trace_id}>
            {item.trace_id}
            :
            {item.aging_minutes}
            mins
          </p>
        ))
      }
    </div>
  );
}