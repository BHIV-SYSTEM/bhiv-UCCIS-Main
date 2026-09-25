import SidebarTask37 from "./SidebarTask37";
import HeaderTask37 from "./HeaderTask37";

export default function RebuildSprint({ children }) {
  return (
    <div className="layout">
      <SidebarTask37 />

      <div className="main-content">
        <HeaderTask37 />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}