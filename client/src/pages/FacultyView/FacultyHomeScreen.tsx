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
  const { checkUserType, checkSession } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const dropdownOptions = testTypeLinkList.map(({ link, name }) => ({ name, link: link + '/qc_results' }));

  async function validateSession() {
    const status = await checkSession();
    const userType = await checkUserType();

    console.log("Session state: ", status);

    if (!status || userType === 'Student') navigate('/unauthorized');
  }

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <>
      <NavBar name="MIS Home Screen" />
      <div
        className=" bg-[#fff] relative flex flex-wrap justify-center sm:py-12 sm:gap-x-6 sm:gap-y-4 my-0 mx-auto"
        style={{ minHeight: "90svh" }}
      >
        <img src="(MIS)-MidiSims-Main-Logo_Login top left.png" alt="" className="absolute sm:w-[12svw] sm:-left-[0.5svw] sm:bottom-0"/>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={() => navigate("/admin-qc")}>
          <div className="button-text font-bold text-2xl">Quality Controls</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={() => navigate("/admin-order-entry")}>
          <div className="button-text font-bold text-2xl">Order Entry</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={() => navigate("/faculty-results")}>
          <div className="button-text font-bold text-2xl">Results In Progress</div>
        </ButtonBase>
        {/* <DropDown name="Results In Progress" options={dropdownOptions} /> */}
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Patient Lab Results</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Quizzes</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Case Studies</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Student Report Submissions</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Reference Files</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Student Roster</div>
        </ButtonBase>
      </div>
    </>
  );
};

export default FacultyHomeScreen;