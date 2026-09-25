import "./Side.css";

export default function SidebarTask28({
  active,
  setActive
}) {

  const items = [
    "Dashboard",
    "Phase 1",
    "Phase 2",
    "Phase 3",
    "Phase 4",
    "Phase 5",
    "Phase 6",
    "Phase 7"
  ];

  return (
    <div className="sidebar">

      <h2>UCCIS</h2>

      {items.map(item => (
        <button
          key={item}
          className={
            active === item
            ? "active"
            : ""
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