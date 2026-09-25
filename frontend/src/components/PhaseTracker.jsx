export default function PhaseTracker() {

  const phases = [
    "Database Engineering",
    "Relationship Validation",
    "Runtime Engine",
    "TTG Dataset",
    "Master DB",
    "Demo Chain",
    "Runtime Proof"
  ];

  return (
    <div className="panel">

      <h3>Sprint Status</h3>

      {phases.map((p) => (
        <div key={p}>
          ✅ {p}
        </div>
      ))}

    </div>
  );
}