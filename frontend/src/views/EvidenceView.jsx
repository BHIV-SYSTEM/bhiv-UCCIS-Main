import EvidenceTable from
"../components/EvidenceTable";

function EvidenceView({
  evidence
}) {

  return (
    <div>

      <h2>
        Runtime Evidence
      </h2>

      <EvidenceTable
        evidence={evidence}
      />

    </div>
  );

}

export default EvidenceView;