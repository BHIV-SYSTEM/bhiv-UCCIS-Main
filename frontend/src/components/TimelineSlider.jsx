export default function TimelineSlider({ logs }) {
  return (
    <div className="timeline">
      <h3>State Evolution</h3>

      {logs.map((l, i) => (
        <div key={i}>
          {l.previous_state || "INIT"} → {l.current_state}
        </div>
      ))}
    </div>
  );
}