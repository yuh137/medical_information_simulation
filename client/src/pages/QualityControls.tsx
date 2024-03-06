import React from "react";
import DropDown from "../components/DropDown";
import NavBar from "../components/NavBar";

const options = [
  "Chemistry",
  "Hematology/Coag",
  "Microbiology",
  "Serology",
  "UA/Body Fluids",
  "Blood Bank",
  "Molecular",
];

const QualityControls = () => {
  return (
    <>
      <NavBar name="Quality Control" />
      <div
        className="container flex items-center justify-center gap-48"
        style={{ minWidth: "100svw", minHeight: "90svh" }}  
      >
        <DropDown name="Order Controls" options={options} />
        <DropDown name="Review Controls" options={options} />
      </div>
    </>
  );
};

export default QualityControls;
