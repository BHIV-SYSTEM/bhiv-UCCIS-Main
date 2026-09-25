import React, { useState } from "react";

export default function SidebarTask24() {
  const [active, setActive] = useState("Dashboard");

  const menu = [
    "Dashboard",
    "Master DB",
    "Signals",
    "Telemetry",
    "Runtime Engine",
    "Incident Hub",
    "Escalation Matrix",
    "Replay System",
    "Decision Layer",
    "Workflow State",
    "Audit Logs",
  ];

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <h2>UCCIS</h2>
        <p>Control Panel</p>
      </div>

      {/* STATUS BADGE */}
      <div className="status-box">
        <span className="status-dot"></span>
        <span>LIVE SYSTEM</span>
      </div>

      {/* MENU */}
      <ul className="menu">
        {menu.map((item, index) => (
          <li
            key={index}
            className={active === item ? "active" : ""}
            onClick={() => setActive(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* FOOTER ACTION */}
      <div className="sidebar-footer">
        <button className="btn-danger">Terminate Session</button>
      </div>
    </div>
  );
}