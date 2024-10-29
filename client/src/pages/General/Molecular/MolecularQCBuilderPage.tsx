import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const MolecularQCBuilder = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { checkSession, checkUserType } = useAuth();

    useEffect(() => {
      if (!checkSession() || checkUserType() === "Student") navigate("/unauthorized");
    }, []);

    return(
        <>
            <NavBar name={`Molecular QC Builder`} />
            <div className="flex items-center justify-center gap-48" style={{ minWidth: "100svw", minHeight: "90svh" }}>
            <Link to="/molecular/editqc">
                <ButtonBase  className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
                    QC Panels
                </ButtonBase>
            </Link>
            <ButtonBase  className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
                Custom QC Panels
            </ButtonBase>
            <ButtonBase  className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
                Custom Tests
            </ButtonBase>
        </div>
        </>
    );
}

export default MolecularQCBuilder;
