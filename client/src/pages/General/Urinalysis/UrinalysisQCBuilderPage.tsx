import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const UrinalysisQCBuilder = () => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'Student') navigate("/unauthorized");
  }, [checkSession, checkUserType, navigate]);

  return (
    <>
      <NavBar name={`Urinalysis/Body Fluid QC Builder​`} />
      <div className="flex items-center justify-center gap-48" style={{ minWidth: "100svw", minHeight: "90svh" }}>
        <Link to={`/UA_fluids/edit_qc`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">UA QC Panels</div>
          </ButtonBase>
        </Link>
        <Link to={`/UA_fluids/BFEdit_qc`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">BF QC Panels</div>
          </ButtonBase>
        </Link>
        {/* <Link to={`/UA_fluids/qc_types`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">BF QC Panels</div>
          </ButtonBase>
        </Link> */}
        <Link to={`/UA_fluids/custom_tests`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Create New panel</div>
          </ButtonBase>
        </Link>
      </div>
    </>
  );
};

export default UrinalysisQCBuilder;
