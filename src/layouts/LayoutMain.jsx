// import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
// import Breadcrumbs from "../components/Breadcrumbs";
const LayoutMain = () => {
  return (
    <div className="main">
      <div className="wrapper">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="main-content">
          {/* <Breadcrumbs /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutMain;
