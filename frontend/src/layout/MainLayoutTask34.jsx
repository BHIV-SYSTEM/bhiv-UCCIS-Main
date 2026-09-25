import SidebarTask34 from "../components/SidebarTask34";
import DashboardHeaderTask34 from "../components/DashboardHeaderTask34";

function MainLayoutTask34({
  children
}) {
  return (
    <div className="layout">
      <SidebarTask34 />

      <div className="main-content">
        <DashboardHeaderTask34 />

        {children}
      </div>
    </div>
  );
}

export default MainLayoutTask34;