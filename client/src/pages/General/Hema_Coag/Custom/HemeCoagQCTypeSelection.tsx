import React from 'react';
import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from '../../../../components/NavBar';
import { useTheme } from '../../../../context/ThemeContext';
import { qcHemeLinkList } from '../../../../utils/utils';

const HemeCoagQCTypeButtonsPage = () => {
  const { theme } = useTheme();

  return (
    <>
      <NavBar name="Custom QC Builder" />
      <div className="flex flex-wrap items-center justify-center gap-4 p-4" style={{ minWidth: "100svw", minHeight: "90svh" }}>
        {qcHemeLinkList.map(type => (
          <Link key={type.link} to={`/hema_coag/custom/create_custom/${type.link}`}>
            <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
              <div className="button-text font-bold text-2xl">{type.name}</div>
            </ButtonBase>
          </Link>   
        ))}
      </div>
    </>
  );
};

export default HemeCoagQCTypeButtonsPage;
