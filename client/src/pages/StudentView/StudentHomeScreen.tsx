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
  const { checkSession } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dropdownOptions = testTypeLinkList.map(({ link, name }) => ({ name, link: link + '/qc_results' }));

  useEffect(() => {
    async function checkUserSession() {
      const check = await checkSession();
      if (!check)
        navigate("/unauthorized");
    }

    checkUserSession();
  }, []);

  return (
    <>
      <NavBar name="MIS Home Screen" />
      <div
        className="bg-[#fff] relative flex flex-wrap justify-center sm:py-10 sm:gap-x-6 my-0 mx-auto"
        style={{ minHeight: "90svh", minWidth: "1060px" }}
      >
        <img src="(MIS)-MidiSims-Main-Logo_Login top left.png" alt="" className="absolute sm:w-48 sm:-left-2 sm:bottom-0"/>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={() => { navigate("/student-qc") }}>
          <div className="button-text font-bold text-2xl">Quality Controls</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Order Entry</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`} onClick={() => navigate("/student-results")}>
          <div className="button-text font-bold text-2xl">Results In Progress</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Patient Lab Results</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Quizzes</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Case Studies</div>
        </ButtonBase>
      </div>
    </>
  );
};

export default StudentHomeScreen;
