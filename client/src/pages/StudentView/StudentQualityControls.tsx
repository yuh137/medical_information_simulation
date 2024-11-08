import React from "react";
import DropDown from "../../components/DropDown";
import NavBar from "../../components/NavBar";
import { testTypeLinkList } from "../../utils/utils";

const OC_options: { name: string, link: string }[] = testTypeLinkList.map(item => Object({ name: item.name, link: item.link + "/order_controls" }));
const RC_options: { name: string, link: string }[] = testTypeLinkList.map(item => Object({ name: item.name, link: item.link + "/student-review_controls" }));
// NOTE(DNAlytics): Generic Simple_Student_QC_Review incompatible with Molecular page specification. Routing for this link changed to /molecular/student-review_controls
RC_options[RC_options.findIndex(element => element.name === "molecular")] = { name: 'molecular', link: 'molecular/student-review_controls' };
//

const StudentQualityControls = () => {
  return (
    <>
      <NavBar name="Quality Control" />
      <div
        className=" flex items-center justify-center gap-48 *:-translate-y-16"
        style={{ minWidth: "100svw", minHeight: "90svh" }}
      >
        <DropDown name="Order Controls" options={OC_options} />
        <DropDown name="Review Controls" options={RC_options} />
      </div>
    </>
  );
};

export default StudentQualityControls;
