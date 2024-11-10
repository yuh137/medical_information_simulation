import React from 'react'
import NavBar from '../../../components/NavBar'
import { ButtonBase } from '@mui/material';
import { useTheme } from '../../../context/ThemeContext';
import { panelTypeLinkList } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';

const ChemistryPanel = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <>
        <NavBar name='Chemistry Panel' />
        <div className='basic-container relative'>
            <div className='flex flex-wrap sm:justify-center sm:p-24 sm:h-fit sm:w-[100svw] sm:gap-x-16 sm:gap-y-8 mx-auto'>
                {panelTypeLinkList.map((panel, index) => (
                    <ButtonBase
                        key={index}
                        className={`!rounded-lg sm:w-72 sm:h-32 !border-solid transition ease-in-out !bg-[${theme.secondaryColor}] !border-[${theme.primaryBorderColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px]`}
                        onClick={() => navigate(`/chemistry/panel/${panel.link}`)}
                    >
                        <div className="button-text font-bold text-2xl">{panel.name}</div>
                    </ButtonBase>
                ))}
            </div>
        </div>
    </>
  )
}

export default ChemistryPanel