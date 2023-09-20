import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};
export default MainContent;
