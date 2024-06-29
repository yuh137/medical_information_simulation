import React, { useEffect } from "react";
import DropDown from "../../components/DropDown";
import NavBar from "../../components/NavBar";
import { testTypeLinkList } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OC_options = [
  { name: "Chemistry", link: "order_controls" },
  { name: "Hematology/Coag", link: "" },
  { name: "Microbiology", link: "" },
  { name: "Serology", link: "" },
  { name: "UA/Body Fluids", link: "" },
  { name: "Blood Bank", link: "" },
  { name: "Molecular", link: "" },
];


const QC_ReviewOptions = [
  { name: "Chemistry", link: "review_controls" },
  { name: "Hematology/Coag", link: "" },
  { name: "Microbiology", link: "" },
  { name: "Serology", link: "" },
  { name: "UA/Body Fluids", link: "" },
  { name: "Blood Bank", link: "" },
  { name: "Molecular", link: "" },
];

const QB_options: { name: string, link: string }[] = testTypeLinkList.map(item => Object({ name: item.name, link: item.link + "/qc_builder" }));

const FacultyQualityControls = () => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'student') navigate("/unauthorized");
  }, [])

  return (
    <>
      <NavBar name="Quality Control" />
      <div
        className=" flex items-center justify-center gap-36 *:-translate-y-16"
        style={{ minWidth: "100svw", minHeight: "90svh" }}  
      >
        <DropDown name="Order Controls" options={OC_options} />
        <DropDown name="Review Controls" options={QC_ReviewOptions} />
        <DropDown name="QC Builder" options={QB_options} />
      </div>
    </>
  );
};

export default FacultyQualityControls;
