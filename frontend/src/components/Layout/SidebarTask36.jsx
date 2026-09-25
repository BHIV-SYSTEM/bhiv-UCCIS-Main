import React from "react";

function SidebarTask36({ activePage, setActivePage }) {
  const menus = [
    "Dashboard",
    "Runtime",
    "Signals",
    "Telemetry",
    "Incidents",
    "Escalations",
    "Replay",
    "Evidence",
    "Analytics",
    "Settings"
  ];

  return (
    <div className="sidebar">

      <div className="logo">
        UCCIS
      </div>

      <ul>

        {menus.map(menu => (

          <li
            key={menu}
            className={
              activePage === menu
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage(menu)
            }
          >
            {menu}
          </li>

        ))}

      </ul>

    </div>
  );
}

export default SidebarTask36;