export default function ReplaySlider({
  logs,
  activeIndex,
  setActiveIndex
}) {
  return (
    <div className="card">
      <h3>Replay System</h3>

      <input
        type="range"
        min="0"
        max={logs.length - 1}
        value={activeIndex}
        onChange={(e) => setActiveIndex(Number(e.target.value))}
      />

      <p>
        Viewing cycle: {activeIndex + 1} / {logs.length}
      </p>
    </div>
  );
}