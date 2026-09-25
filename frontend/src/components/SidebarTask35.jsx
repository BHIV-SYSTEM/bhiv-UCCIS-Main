export default function SidebarTask35({
  selectedModule,
  setSelectedModule
}) {
  const menuItems = [
    "Dashboard",
    "Signals",
    "Telemetry",
    "Incidents",
    "Escalations",
    "Replay",
    "Runtime Logs",
    "Evidence",
    "Trace IDs"
  ];

  return (
    <div className="sidebar">
      <h2>UCCIS</h2>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className={
              selectedModule === item
                ? "sidebar-active"
                : ""
            }
            onClick={() =>
              setSelectedModule(item)
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}