import React from 'react'
import NavBar from '../../components/NavBar';
import DropDown from '../../components/DropDown';
import { testTypeLinkList } from '../../utils/utils';

// const options = [
//     { name: "Chemistry", link: "order_controls" },
//     { name: "Hematology/Coag", link: "" },
//     { name: "Microbiology", link: "" },
//     { name: "Serology", link: "" },
//     { name: "UA/Body Fluids", link: "" },
//     { name: "Blood Bank", link: "" },
//     { name: "Molecular", link: "" },
// ];

const options = testTypeLinkList.map(item => ({ name: item.name, link: item.link + '/qc_results' }));

const StudentResultsInProgress = () => {
  return (
    <>
        <NavBar name="Results In Progress" />
        <div
            className=" flex items-center justify-center gap-48 *:-translate-y-16"
            style={{ minWidth: "100svw", minHeight: "90svh" }}  
        >
            <DropDown name="QC Results" options={options} />
            <DropDown name="Patient Results" options={options} />
        </div>
    </>
  )
}

export default StudentResultsInProgress