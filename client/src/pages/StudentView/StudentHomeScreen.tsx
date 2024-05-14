import React, { useEffect, useState } from "react";
import { ButtonBase } from "@mui/material";
import DropDown from "../../components/DropDown";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { testTypeLinkList } from "../../utils/utils";

const StudentHomeScreen = () => {
  const { isAuthenticated, logout, changeUserType, changeUsername, checkSession } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dropdownOptions = testTypeLinkList.map(({ link, name }) => ({ name, link: link + '/qc_results' }));

  useEffect(() => {
    if (!checkSession()) navigate('/unauthorized');
  }, []);

  return (
    <>
      {/* <NavBar name='MIS Home Screen'/> */}
      <div
        className={` bg-[${theme.primaryColor}] relative flex items-center`}
        // className={` bg-[#744700] relative`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <div className="navbar-title leading-loose text-center text-white font-bold text-4xl my-0 mx-auto">
          MIS Home Screen
        </div>
        {isAuthenticated && (
          <>
            <Icon icon="mdi:logout" className="absolute text-white sm:text-5xl self-center sm:right-4 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md p-1" onClick={() => {
              logout();
              changeUserType(null);
              changeUsername("");
              navigate("/login");
            }}/>
          </>
        )}
      </div>
      <div
        className=" bg-[#fff] flex flex-wrap justify-center px-24 py-24 gap-12"
        style={{ minHeight: "90svh", minWidth: "100svw" }}
      >
        <Link to='/qc'>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
            <div className="button-text font-bold text-2xl">Quality Controls</div>
          </ButtonBase>
        </Link>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Order Entry</div>
        </ButtonBase>
        {/* <DropDown name="Results In Progress" options={dropdownOptions} /> */}
        <Link to="/results">
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
            <div className="button-text font-bold text-2xl">Results In Progress</div>
          </ButtonBase>
        </Link>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Patients Reports</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Quizzes</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}>
          <div className="button-text font-bold text-2xl">Case Studies</div>
        </ButtonBase>
      </div>
    </>
  );
};

export default StudentHomeScreen;
