import React from "react";
import Sidebar from "./SideBar/Sidebar";
import { Outlet } from "react-router-dom";
import useSideBarPanel from "../hooks/store/useSideBarPanel";

const MainContent: React.FC<any> = () => {
  const sidebar = useSideBarPanel();
  return (
    <>
      <Sidebar />
      <div className={`${sidebar.isExpand ? "ml-[320px]" : "ml-[66px]"} transition-all`}>
        <div className="main-content-container h-[calc(100vh-75px)] overflow-hidden px-6 pt-6 lg:px-12">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default MainContent;
