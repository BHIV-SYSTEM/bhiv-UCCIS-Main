import { NavLink } from "react-router-dom";

const SidebarTask30 = () => {
  return (
    <div className="sidebar">

      <h2>UCCIS</h2>

      <NavLink to="/">Dashboard</NavLink>

      <NavLink to="/signals">Signals</NavLink>

      {/* <NavLink to="/telemetry">Telemetry</NavLink> */}

      <NavLink to="/incidents">Incidents</NavLink>

      {/* <NavLink to="/escalations">Escalations</NavLink> */}

      {/* <NavLink to="/decisions">Decisions</NavLink> */}

      {/* <NavLink to="/replay">Replay Sessions</NavLink>

      <NavLink to="/runtime">Runtime Logs</NavLink> */}

    </div>
  );
};

export default SidebarTask30;