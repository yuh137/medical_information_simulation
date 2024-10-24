import React, { useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const MicrobiologyTestInput = () => {
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'Student') navigate("/unauthorized");
  }, [checkSession, checkUserType, navigate]);

  return (
    <>
      <NavBar name={`Catalase QC Builder`} />
      <div className="basic-container relative sm:space-y-4 pb-24">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-12">
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Lot Number</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Expiration Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Open Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"/>
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Close Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MicrobiologyTestInput;