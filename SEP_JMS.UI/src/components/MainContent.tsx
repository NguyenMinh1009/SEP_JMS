import React from "react";
import Sidebar from "./sidebar/Sidebar"; // rname
import { Outlet } from "react-router-dom";
import useSideBarPanel from "../hooks/store/useSideBarPanel";
import BreadCrumb from "./common/BreadCrumb";
import Avatar from "./Avatar";
import { Divider } from "@mui/material";

const MainContent: React.FC<any> = () => {
  const sidebar = useSideBarPanel();

  return (
    <>
      <Sidebar />
      <div className={`${sidebar.isExpand ? "ml-[320px]" : "ml-[66px]"} transition-all`}>
        <header className="text-primary flex h-[75px] items-center justify-between px-6 lg:px-12">
          <BreadCrumb />
          <Avatar />
        </header>
        <Divider />
        <div className="main-content-container h-[calc(100vh-75px)] px-6 lg:px-12 pt-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainContent;
