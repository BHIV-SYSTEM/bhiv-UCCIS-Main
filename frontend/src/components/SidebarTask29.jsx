import React from "react";

function SidebarTask29({ activePage, setActivePage }) {
  const menuItems = [
    {
      label: "Dashboard",
      value: "dashboard",
    },
    {
      label: "Signals",
      value: "signals",
    },
    {
      label: "Telemetry",
      value: "telemetry",
    },
    {
      label: "Incidents",
      value: "incidents",
    },
    {
      label: "Escalations",
      value: "escalations",
    },
    {
      label: "Decisions",
      value: "decisions",
    },
    {
      label: "Replay Sessions",
      value: "replaySessions",
    },
    {
      label: "Runtime Logs",
      value: "runtimeLogs",
    },
    {
      label: "Analytics",
      value: "analytics",
    },
    // {
    //   label: "System Health",
    //   value: "systemHealth",
    // },
  ];

  return (
    <div className="sidebar">

      <div className="logo">
        <h2>UCCIS</h2>
      </div>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item.value}
            className={
              activePage === item.value
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(item.value)
            }
          >
            {item.label}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default SidebarTask29;