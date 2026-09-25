function SidebarTask33({
  active,
  setActive
}) {

  const menuItems = [
    "Signals",
    "Telemetry",
    "Incidents",
    "Escalations",
    "Replay",
    "Evidence",
    "Health"
  ];

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        UCCIS
      </div>

      {menuItems.map((item) => (

        <button
          key={item}
          className={
            active === item
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={() =>
            setActive(item)
          }
        >
          {item}
        </button>

      ))}

    </div>
  );
}

export default SidebarTask33;