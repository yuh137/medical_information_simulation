import React, { useEffect, useState } from "react";
import { ButtonBase } from "@mui/material";
import DropDown from "../../components/DropDown";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { testTypeLinkList } from "../../utils/utils";
import NavBar from "../../components/NavBar";
import Password from "antd/es/input/Password";

const FacultyHomeScreen = () => {
  const { initials, username, logout, checkUserType, checkSession } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const dropdownOptions = testTypeLinkList.map(({ link, name }) => ({ name, link: link + '/qc_results' }));

  async function validateSession() {
    const status = await checkSession();

    console.log("Session state: ", status);

    if (!status || checkUserType() === 'Student') navigate('/unauthorized');
  }

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <>
      <NavBar name="MIS Home Screen" />
      <div
        className=" bg-[#fff] flex flex-wrap justify-center px-24 py-12 sm:gap-x-6 sm:max-w-[1460px] my-0 mx-auto"
        style={{ minHeight: "90svh" }}
      >
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={() => navigate("/admin-qc")}>
          <div className="button-text font-bold text-2xl">Quality Controls</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Order Entry</div>
        </ButtonBase>
        <DropDown name="Results In Progress" options={dropdownOptions} />
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Patient Reports</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Quizzes</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Case Studies</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Student Report Submissions</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Reference Files</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Student Roster</div>
        </ButtonBase>
        {/* <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={async () => {
          const test = await fetch(`${process.env.REACT_APP_API_URL}/Admins`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ "username": username + '11111111', "password": 'whatever' }),
          });

          
          console.log('Added data: ', await test.json());
        }}>
          <div className="button-text font-bold text-2xl">Test</div>
        </ButtonBase> */}
      </div>
    </>
  );
};

export default FacultyHomeScreen;