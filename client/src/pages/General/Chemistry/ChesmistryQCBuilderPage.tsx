import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const ChemistryQCBuilder = () => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    async function checkUserSession() {
      const check = await checkSession();
      if (!check || await checkUserType() === "Student")
        navigate("/unauthorized");
    }

    checkUserSession();
  }, []);

  return (
    <>
      <NavBar name={`Chemistry QC Builder`} />
      <div className="flex items-center justify-center gap-[10svw]" style={{ minWidth: "100svw", minHeight: "90svh" }}>
        <Link to={`/chemistry/edit_qc`}>
          <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">QC Panels</div>
          </ButtonBase>
        </Link>
        <Link to={`/chemistry/custom_qc`}>
          <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Build Custom QC</div>
          </ButtonBase>
        </Link>
        <Link to={`/chemistry/custom_tests`}>
          <ButtonBase className={`!rounded-lg sm:w-[24svw] sm:h-[20svh] !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Custom QC Panels</div>
          </ButtonBase>
        </Link>
      </div>
    </>
  );
};

export default ChemistryQCBuilder;
