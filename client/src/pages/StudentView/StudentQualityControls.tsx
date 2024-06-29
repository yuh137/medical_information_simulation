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

const ReviewOptions = [
  { name: "Chemistry", link: "review_controls" },
  { name: "Hematology/Coag", link: "" },
  { name: "Microbiology", link: "" },
  { name: "Serology", link: "" },
  { name: "UA/Body Fluids", link: "" },
  { name: "Blood Bank", link: "" },
  { name: "Molecular", link: "" },
];
const StudentQualityControls = () => {
  return (
    <>
      <NavBar name="Quality Control" />
      <div
        className=" flex items-center justify-center gap-48 *:-translate-y-16"
        style={{ minWidth: "100svw", minHeight: "90svh" }}  
      >
        <DropDown name="Order Controls" options={options} />
        <DropDown name="Review Controls" options={ReviewOptions} />
      </div>
    </>
  );
};

export default StudentQualityControls;
