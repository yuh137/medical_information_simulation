import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import DropDown from "../components/DropDown";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = () => {
  const { theme } = useTheme();
  const results_options = [
    { name: "QC Results", link: "qc_results" },
    { name: "Chemistry", link: "" },
    { name: "Hematology/Coag", link: "" },
    { name: "Microbiology", link: "" },
    { name: "Serology", link: "" },
    { name: "UA/Body Fluids", link: "" },
    { name: "Blood Bank", link: "" },
    { name: "Molecular", link: "" },
  ]

  return (
    <>
      {/* <NavBar name='MIS Home Screen'/> */}
      <div
        className={`container bg-[${theme.primaryColor}] relative`}
        // className={`container bg-[#744700] relative`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <div className="navbar-title leading-loose text-center text-white font-bold text-4xl my-0 mx-auto">
          MIS Home Screen
        </div>
      </div>
      <div
        className="container bg-[#fff] flex flex-wrap justify-center px-24 py-24 gap-12"
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
        <DropDown name="Results In Progress" options={results_options} />
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

export default HomeScreen;
