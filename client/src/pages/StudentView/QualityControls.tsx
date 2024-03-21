import React from "react";
import DropDown from "../../components/DropDown";
import NavBar from "../../components/NavBar";

const options = [
  { name: "Chemistry", link: "order_controls" },
  { name: "Hematology/Coag", link: "" },
  { name: "Microbiology", link: "" },
  { name: "Serology", link: "" },
  { name: "UA/Body Fluids", link: "" },
  { name: "Blood Bank", link: "" },
  { name: "Molecular", link: "" },
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
