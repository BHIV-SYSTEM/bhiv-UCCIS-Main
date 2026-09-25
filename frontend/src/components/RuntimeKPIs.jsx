export default function RuntimeKPIs() {
  return (
    <div className="cards">

      <div
        className="card"
        style={{
          background: "#16A34A",
          color: "white"
        }}
      >
        <h3>Runtime Health</h3>
        <h1>98%</h1>
      </div>

      <div
        className="card"
        style={{
          background: "#2563EB",
          color: "white"
        }}
      >
        <h3>Open Operations</h3>
        <h1 style={{ color: "black" }}>42</h1>
      </div>

      <div
        className="card"
        style={{
          background: "#F59E0B",
          color: "white"
        }}
      >
        <h3>Resolved Today</h3>
        <h1>17</h1>
      </div>

      <div
        className="card"
        style={{
          background: "#8B5CF6",
          color: "white"
        }}
      >
        <h3>Avg Response</h3>
        <h1>4.2m</h1>
      </div>

    </div>
  );
}