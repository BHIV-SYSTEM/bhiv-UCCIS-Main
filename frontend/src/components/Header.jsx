export default function Header({ title }) {
  return (
    <div className="header">

      <div>
        <h1>{title}</h1>
      </div>

      <div className="top-status">

        <span>Replay Stable</span>

        <span>Entropy 12%</span>

        <span>Confidence 92%</span>

      </div>

    </div>
  );
}