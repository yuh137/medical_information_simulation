import React from 'react'
import NavBar from '../../components/NavBar'
import DropDown from '../../components/DropDown'
import { testTypeLinkList } from '../../utils/utils';

const options = testTypeLinkList.map(item => ({ name: item.name, link: item.link + '/qc_results' }));

const FacultyResultsInProgress = () => {
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

export default FacultyResultsInProgress