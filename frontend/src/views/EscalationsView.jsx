import EscalationTable from
"../components/EscalationTable";

function EscalationsView({
  escalations
}) {

  return (
    <div>

      <h2>
        Escalations
      </h2>

      <EscalationTable
        escalations={
          escalations
        }
      />

    </div>
  );

}

export default EscalationsView;