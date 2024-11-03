import React from 'react';
import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import { useTheme } from '../../../context/ThemeContext';
import { qcTypeLinkList } from '../../../utils/utils';

const ChemistryQCTypeButtonsPage = () => {
  const { theme } = useTheme();

  return (
    <>
      <NavBar name="QC Type Selection" />
      <div className="flex flex-wrap items-center justify-center gap-4 p-4" style={{ minWidth: "100svw", minHeight: "90svh" }}>
        {qcTypeLinkList.map(type => (
          <Link key={type.link} to={`/chemistry/build_qc/${type.link}`}>
            <ButtonBase className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] !px-3`}>
              <div className="button-text font-bold text-2xl">{type.name}</div>
            </ButtonBase>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ChemistryQCTypeButtonsPage;
