import React from 'react'
import NavBar from '../../components/NavBar'
import DropDown from '../../components/DropDown'
import { ButtonBase } from '@mui/material'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { testTypeLinkList } from '../../utils/utils'

const FacultyOrderEntry = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const TB_options: { name: string; link: string; }[] = testTypeLinkList.map(item => Object({ name: item.name, link: item.link + "/panel" }));

  return (
    <>
      <NavBar name="Quality Control" />
      <div
        className=" flex items-center justify-center gap-36 *:-translate-y-16"
        style={{ minWidth: "100svw", minHeight: "90svh" }}  
      >
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Search Existing Patient</div>
        </ButtonBase>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Create New Patient</div>
        </ButtonBase>
        <DropDown name="Test Builder" options={TB_options} />
      </div>
    </>
  )
}

export default FacultyOrderEntry