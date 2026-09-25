import { useState } from "react";

export default function DashboardCard({
  title,
  children,
  graph,
  onClick
}) {

  const [hovered, setHovered] =
    useState(false);

  return (
    <div
      className="card"

      onMouseEnter={() =>
        setHovered(true)
      }

      onMouseLeave={() =>
        setHovered(false)
      }

      onClick={onClick}
    >
      <h2>{title}</h2>

      {
        hovered
          ? graph
          : children
      }
    </div>
  );
}