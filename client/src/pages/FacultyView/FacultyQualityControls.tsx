import React, { useEffect, useState } from "react";
import DropDown from "../../components/DropDown";
import NavBar from "../../components/NavBar";
import { testTypeLinkList } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OC_options: { name: string, link: string }[] = testTypeLinkList.map(item => Object({ name: item.name, link: item.link + "/order_controls" }));
const RC_options: { name: string, link: string }[] = testTypeLinkList.map(item => Object({ name: item.name, link: "admin-review_controls" }));
const QB_options: { name: string, link: string }[] = testTypeLinkList.map(item => Object({ name: item.name, link: item.link + "/qc_builder" }));

const FacultyQualityControls = () => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();

  const [selectedDropdown, setSelectedDropdown] = useState<string>("");

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'Student') navigate("/unauthorized");
  }, [])

  return (
    <>
      <NavBar name="Quality Control" />
      <div
        className=" flex items-center justify-center gap-36 *:-translate-y-16"
        style={{ minWidth: "100svw", minHeight: "90svh" }}  
      >
        <DropDown name="Order Controls" options={OC_options} />
        <DropDown name="Review Controls" options={RC_options} />
        <DropDown name="QC Builder" options={QB_options} />
      </div>
    </>
  );
};

export default FacultyQualityControls;
