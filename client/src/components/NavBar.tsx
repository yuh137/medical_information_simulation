import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Drawer, Divider } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface NavBarPropsTypes {
  name: string;
}

const NavBar = (props: NavBarPropsTypes) => {
  const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { initials, logout, username, checkUserType } = useAuth();

  return (
    <>
      <div
        className={`bg-[${theme.primaryColor}] relative flex items-center`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <button className="absolute text-white sm:left-2 text-5xl hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => navigate(-1)}>
          <Icon icon="material-symbols:arrow-left-alt-rounded" />
        </button>
        <Icon
          icon="fa6-solid:bars"
          className="absolute px-2 text-white text-5xl left-14 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
          onClick={() => openDrawer(true)}
        />
        <div className="navbar-title sm:leading-loose text-center text-white font-bold sm:text-4xl text-3xl my-0 mx-auto max-sm:w-1/2 max-sm:leading-10">
          {props.name}
        </div>
        <div className="user-info group absolute sm:top-[55%] sm:-translate-y-[55%] sm:right-[1.25svw] sm:p-3 flex sm:gap-x-2 sm:py-2 sm:px-3 border-2 border-solid border-white rounded-xl drop-shadow-xl hover:bg-[#2F528F] hover:cursor-pointer transition delay-75">
          <div className="text-white">
            <div className="sm:max-w-1/2 truncate">User Initials: {initials}</div>
            <div className="text-right">{checkUserType() === "admin" ? "Admin" : "Student"}</div>
          </div>
          <img src="/user.png" alt="" className="sm:w-[42px] sm:h-[42px]"/>
          <Icon icon="bxs:left-arrow" className="text-white self-center group-hover:-rotate-90 transition duration-150"/>
          <div className="user-info-actions absolute w-full bg-white sm:py-2 sm:px-3 hidden group-hover:flex group-focus:flex flex-col top-full left-0 sm:gap-y-2 rounded-lg sm:translate-y-2 before:content-[''] before:absolute before:left-0 before:-top-2 before:w-full before:h-2">
            <div className="flex sm:gap-x-2 text-black items-center justify-center hover:bg-black/30 hover:cursor-pointer transition delay-75 sm:min-h-8 rounded-lg" onClick={() => {
              navigate("/home");
            }}>
              <div>Home</div>
              <Icon icon="material-symbols:home" />
            </div>
            <div className="flex sm:gap-x-2 text-black items-center justify-center hover:bg-black/30 hover:cursor-pointer transition delay-75 sm:min-h-8 rounded-lg" onClick={() => {
              logout();
              navigate("/login");
            }}>
              <div>Logout</div>
              <Icon icon="mdi:logout" />
            </div>
          </div>
          {location.pathname !== "/home" && <div className="home-icon">
            <Link to="/home">
              <Icon
                icon="material-symbols:home"
                className="absolute sm:p-1 text-white sm:text-5xl sm:top-1/2 sm:-translate-y-1/2 sm:-left-[56px] hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
              />
            </Link>
          </div>}
        </div>
        <Drawer
          anchor='left'
          open={isDrawerOpen}
          onClose={() => openDrawer(false)}
        >
          <div className="drawer-container sm:w-[15svw] sm:h-full bg-[#CFD5EA] flex flex-col items-center sm:space-y-6">
            <ul className="sm:w-full">
              <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
                <Icon icon="fa6-solid:house" className="sm:text-xl"/>
                <div className="sm:text-lg sm:translate-y-[2px]">Home</div>
              </li>
              <Divider />
              <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
                <Icon icon="fa6-solid:house" className="sm:text-xl"/>
                <div className="sm:text-lg sm:translate-y-[2px]">Home</div>
              </li>
              <Divider />
              <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
                <Icon icon="fa6-solid:house" className="sm:text-xl"/>
                <div className="sm:text-lg sm:translate-y-[2px]">Home</div>
              </li>
              <Divider />
              <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
                <Icon icon="fa6-solid:house" className="sm:text-xl"/>
                <div className="sm:text-lg sm:translate-y-[2px]">Home</div>
              </li>
              <Divider />
            </ul>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default NavBar;