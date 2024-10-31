import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { useTheme } from "../../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { bloodBankRBC_QC } from "../../../utils/utils";
import { ButtonBase } from "@mui/material";

const BloodBankQCTypeButtonsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student") navigate("/unauthorized");
  }, []);

  useEffect(() => {
    console.log(selectedItem);
  }, [selectedItem])

  return (
    <>
      <NavBar name={`Edit Blood Bank QC`} />
      <div className="basic-container">
        <div className="grid grid-cols-4 gap-4 p-8" style={{ minWidth: "40svw", minHeight: "30svh" }}>
          {bloodBankRBC_QC.map((item) => (
            <ButtonBase
              key={item.name}
              className={`!rounded-lg sm:w-50 sm:h-40 !border-solid transition ease-in-out ${
                selectedItem === item.link
                  ? `!border-[#2F528F] !border-[4px] !bg-[#8faadc]`
                  : `!border !bg-[${theme.secondaryColor}] !border-[${theme.primaryBorderColor}]`
              } !px-3`}
              onClick={() =>{
                  setSelectedItem(item.link === selectedItem ? null : item.link);
                }
              }
            >
              <div className="button-text font-bold text-2xl">{item.name}</div>
            </ButtonBase>
          ))}
        </div>
        <div className="button-container flex justify-center sm:-translate-y-15 sm:space-x-36 sm:pb-6">
          <Link to={`/blood_bank/rbc_qc/${selectedItem}`}>
              <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold" 
              disabled={!selectedItem}>
                Edit QC File
              </ButtonBase>
              
          </Link>
          <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
            Delete QC File
          </ButtonBase>
        </div>
      </div>
    </>
  );
};
export default BloodBankQCTypeButtonsPage;
