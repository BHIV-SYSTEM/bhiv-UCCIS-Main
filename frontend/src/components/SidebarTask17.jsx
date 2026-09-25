import { Link } from "react-router-dom";

export default function SidebarTask17() {

  return (

    <div className="sidebar">

      <h1 className="logo">
        UCCIS
      </h1>

      <Link to="/">
        Executive Overview
      </Link>

      <Link to="/replay">
        Replay & Reconstruction
      </Link>

      <Link to="/stress">
        Operational Stress
      </Link>

      <Link to="/entropy">
        Entropy / Failure
      </Link>

      <Link to="/escalation">
        Escalation Visibility
      </Link>

      <Link to="/field">
        Field Continuity
      </Link>

    </div>

  );
}