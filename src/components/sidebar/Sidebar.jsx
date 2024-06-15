import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { LuCalendarRange } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { IoLogOutOutline } from "react-icons/io5";
import Timer from "./Timer";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const activeClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const { logout } = useContext(AuthContext);

  return (
    <>
      <div className="header">
        <div className="headerLogo">
          <img src="src/assets/logo.png"></img>
        </div>
        <div className="headerName">
          <h1>Tasker</h1>
          <div>
            <p>plan your day with us</p>
          </div>
        </div>
      </div>
      <div className="side flex flex-col gap-3 items-center">
        <NavLink to="Dashboard" className={` ${activeClass}`}>
          <MdOutlineDashboard className="side-icon" />
          <p className="side-name">DashBoard</p>
        </NavLink>
        <NavLink to="/Calendar" className={` ${activeClass}`}>
          <LuCalendarRange className="side-icon" />
          <p className="side-name">Calendar</p>
        </NavLink>
        <NavLink to="/TaskLists" className={` ${activeClass}`}>
          <TfiLayoutListThumb className="side-icon" />
          <p className="side-name">Task Lists</p>
        </NavLink>
        {/* <NavLink to="/Team" className={` ${activeClass}`}>
          <RiTeamLine className="side-icon" />
          <p className="side-name">Team</p>
        </NavLink> */}
        <NavLink to="/Profile" className={` ${activeClass}`}>
          <CgProfile className="side-icon" />
          <p className="side-name">Profile</p>
        </NavLink>
      </div>
      <button
        className="flex items-center justify-start gap-2 w-full h-14 hover:bg-slate-100 active:bg-slate-300 text-base font-semibold"
        onClick={() => {
          logout();
        }}
      >
        <IoLogOutOutline className="ml-10" />
        <p>Log Out</p>
      </button>
      <div className="footer">
        <div className="footer1">
          <Timer />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
