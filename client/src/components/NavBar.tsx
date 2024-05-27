import React from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonBase } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface NavBarPropsTypes {
  name: string;
}

const NavBar = (props: NavBarPropsTypes) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <div
        className={`bg-[${theme.primaryColor}] relative flex items-center`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <button className="absolute text-white sm:left-2 text-5xl hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => navigate(-1)}>
          <Icon icon="material-symbols:arrow-left-alt-rounded" />
        </button>
        <div className="navbar-title sm:leading-loose text-center text-white font-bold sm:text-4xl text-3xl my-0 mx-auto max-sm:w-1/2 max-sm:leading-10">
          {props.name}
        </div>
        <div className="home-icon">
          <Link to="/home">
            <Icon
              icon="material-symbols:home"
              className="absolute p-1 text-white text-5xl top-[20%] sm:right-[4svw] hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
            />
          </Link>
        </div>
        {isAuthenticated && (
          <div className="logout-icon">
            <Icon icon="mdi:logout" className="absolute text-white sm:text-5xl sm:right-[1.25svw] sm:top-1/2 -translate-y-1/2 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md p-1" onClick={() => {
              logout();
              navigate("/login");
            }}/>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
