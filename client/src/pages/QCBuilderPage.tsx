import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const QCBuilder = (props: { name: string; link: string }) => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'student') navigate("/unauthorized");
  }, [checkSession, checkUserType, navigate]);

  return (
    <>
      <NavBar name={`${props.name} QC Builder`} />
      <div className="flex items-center justify-center gap-48" style={{ minWidth: "100svw", minHeight: "90svh" }}>
        <Link to={`/${props.link}/edit_qc`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">QC Panels</div>
          </ButtonBase>
        </Link>
        <Link to={`/${props.link}/qc_types`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Custom QC Panels</div>
          </ButtonBase>
        </Link>
        <Link to={`/${props.link}/custom_tests`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Custom Tests</div>
          </ButtonBase>
        </Link>
      </div>
    </>
  );
};

export default QCBuilder;
