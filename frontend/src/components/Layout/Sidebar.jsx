import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  "dashboard",
  "incidents",
  "escalations",
  "replay",
  "evidence",
  "analytics",
  "observability",
  "runtime",
  "domains",
  "settings",
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>UCCIS</h2>
      {links.map((l) => (
        <NavLink key={l} to={`/${l === "dashboard" ? "" : l}`}>
          {l.toUpperCase()}
        </NavLink>
      ))}
    </div>
  );
}