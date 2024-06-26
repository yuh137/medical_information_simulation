import React, { useEffect, useState } from "react";
import { ButtonBase } from "@mui/material";
import DropDown from "../../components/DropDown";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { testTypeLinkList } from "../../utils/utils";
import NavBar from "../../components/NavBar";

const StudentHomeScreen = () => {
  const { isAuthenticated, logout, username, checkSession, checkUserType } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dropdownOptions = testTypeLinkList.map(({ link, name }) => ({ name, link: link + '/qc_results' }));

  useEffect(() => {
    if (!checkSession()) navigate('/unauthorized');
  }, []);

  return (
    <>
      {/* <NavBar name='MIS Home Screen'/> */}
      {/* <div
        className={` bg-[${theme.primaryColor}] relative flex items-center`}
        // className={` bg-[#744700] relative`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <button className="absolute text-white sm:left-2 text-5xl hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => navigate(-1)}>
          <Icon icon="material-symbols:arrow-left-alt-rounded" />
        </button>
        <div className="navbar-title leading-loose text-center text-white font-bold text-4xl my-0 mx-auto">
          MIS Home Screen
        </div>
        <div className="user-info group absolute sm:top-[55%] sm:-translate-y-[55%] sm:right-[1.25svw] sm:p-3 flex sm:gap-x-2 sm:py-2 sm:px-3 border-2 border-solid border-white rounded-xl drop-shadow-xl hover:bg-[#2F528F] hover:cursor-pointer transition delay-75">
          <div className="text-white">
            <div className="sm:max-w-1/2 truncate">{username}</div>
            <div className="text-right">{checkUserType() === "admin" ? "Admin" : "Student"}</div>
          </div>
          <img src="/user.png" alt="" className="sm:w-[42px] sm:h-[42px]"/>
          <Icon icon="bxs:left-arrow" className="text-white self-center group-hover:-rotate-90 transition duration-150"/>
          <div className="user-info-actions absolute w-full bg-white sm:py-2 sm:px-3 hidden group-hover:flex group-focus:flex flex-col top-full left-0 sm:gap-y-2 rounded-lg sm:translate-y-2 before:content-[''] before:absolute before:left-0 before:-top-2 before:w-full before:h-2">
            
            <div className="flex sm:gap-x-2 text-black items-center justify-center hover:bg-black/30 hover:cursor-pointer transition delay-75 sm:min-h-8 rounded-lg" onClick={() => {
              logout();
              navigate("/login");
            }}>
              <div>Logout</div>
              <Icon icon="mdi:logout" />
            </div>
          </div>
        </div>
        
      </div> */}
      <NavBar name="MIS Home Screen" />
      <div
        className=" bg-[#fff] flex flex-wrap justify-center sm:px-24 sm:py-24 sm:gap-x-6 sm:max-w-[1460px] my-0 mx-auto"
        style={{ minHeight: "90svh", minWidth: "1060px" }}
      >
        <Link to='/qc'>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
            <div className="button-text font-bold text-2xl">Quality Controls</div>
          </ButtonBase>
        </Link>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Order Entry</div>
        </ButtonBase>
        {/* <DropDown name="Results In Progress" options={dropdownOptions} /> */}
        <Link to="/results">
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
            <div className="button-text font-bold text-2xl">Results In Progress</div>
          </ButtonBase>
        </Link>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Patients Reports</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Quizzes</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Case Studies</div>
        </ButtonBase>
      </div>
    </>
  );
};

export default StudentHomeScreen;
