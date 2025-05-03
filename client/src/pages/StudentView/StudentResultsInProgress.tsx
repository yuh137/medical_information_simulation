import React from 'react'
import NavBar from '../../components/NavBar';
import DropDown from '../../components/DropDown';
import { testTypeLinkList } from '../../utils/utils';
import { ButtonBase } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();
  return (
    <>
        <NavBar name="Results In Progress" />
        <div
            className=" flex items-center justify-center gap-48 *:-translate-y-16"
            style={{ minWidth: "100svw", minHeight: "90svh" }}  
        >
            <DropDown name="QC Results" options={options} />
            {/* <DropDown name="Patient Results" options={options} /> */}
            <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
              <div className="button-text font-bold text-2xl">Patient Results</div>
            </ButtonBase>
        </div>
    </>
  )
}

export default StudentResultsInProgress