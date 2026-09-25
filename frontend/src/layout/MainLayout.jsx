import SidebarTask30 from "../components/SidebarTask30";
import TopBarTask30 from "../components/TopBarTask30";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="layout">
      <SidebarTask30 />

      <div className="main-content">
        <TopBarTask30 />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;