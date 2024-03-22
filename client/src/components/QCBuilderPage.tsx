import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { ButtonBase } from '@mui/material'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const QCBuilder = (props: { name: string, link: string }) => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'student') navigate("/unauthorized");
  })

  return (
    <>
        <NavBar name={`${props.name} QC Builder`} />
        <div
            className=" flex items-center justify-center gap-48 *:-translate-y-16"
            style={{ minWidth: "100svw", minHeight: "90svh" }}  
      >
        <Link to={`/${props.link}/edit_qc`}>
            <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
                <div className="button-text font-bold text-2xl">QC Panels</div>
            </ButtonBase>
        </Link>
        <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
          <div className="button-text font-bold text-2xl">Create New Panel</div>
        </ButtonBase>
      </div>
    </>
  )
}

export default QCBuilder