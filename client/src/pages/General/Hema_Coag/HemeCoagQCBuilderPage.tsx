import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import DropDown from "../../../components/DropDown";

const HemeCoagQCBuilderPage = () => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'Student') navigate("/unauthorized");
  }, [checkSession, checkUserType, navigate]);

  const Custom_options = [
    { name: "Select Custom Built", link: "hema_coag/custom/select_custom" },
    { name: "Create New Custom", link: "hema_coag/custom/front_page" },
  ];

  return (
    <>
      <NavBar name={`Heme/Coag QC Builder`} />
      <div className="flex items-center justify-center gap-48" style={{ minWidth: "100svw", minHeight: "90svh" }}>
        <Link to={`/hema_coag/heme/heme_editQC`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Heme QC Panels</div>
          </ButtonBase>
        </Link>
      
              <Link to={`/hema_coag/coag/coag_editQC`}>
          <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
            <div className="button-text font-bold text-2xl">Coag QC Panels</div>
          </ButtonBase>
        </Link>
          <DropDown name = "Custom QC" options={Custom_options} />
        
      </div>
    </>
  );
};

export default HemeCoagQCBuilderPage;
