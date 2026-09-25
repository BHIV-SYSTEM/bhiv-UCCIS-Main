import { Link } from "react-router-dom";

export default function SidebarTask37() {
  return (
    <div className="sidebar">

      <h2>UCCIS</h2>

      <Link to="/">Dashboard</Link>

      <Link to="/signals">Signals</Link>

      <Link to="/incidents">Incidents</Link>

      <Link to="/escalations">Escalations</Link>

      <Link to="/replay">Replay</Link>

      <Link to="/evidence">Evidence</Link>

      <Link to="/analytics">Analytics</Link>

      <Link to="/historical-ops">
        Historical Ops
      </Link>

      <Link to="/domains">Domains</Link>

      <Link to="/runtime">Runtime</Link>

      <Link to="/settings">Settings</Link>

    </div>
  );
}