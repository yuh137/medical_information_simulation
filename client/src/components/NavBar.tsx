import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { ButtonBase } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

interface NavBarPropsTypes {
  name: string;
}

const NavBar = (props: NavBarPropsTypes) => {
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`container bg-[${theme.primaryColor}] relative`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <div className="navbar-title sm:leading-loose text-center text-white font-bold sm:text-4xl text-3xl my-0 mx-auto max-sm:w-1/2 max-sm:leading-10">
          {props.name}
        </div>
        <div className="home-icon">
          <Link to="/home">
            <Icon
              icon="material-symbols:home"
              className="absolute p-1 text-white text-5xl top-[20%] right-6 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
