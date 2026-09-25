export default function Header({ onRun }) {
  return (
    <div className="header">
      <h2>UCCIS Intelligence Dashboard</h2>
      <button onClick={onRun}>Run Intelligence Cycle</button>
    </div>
  );
}