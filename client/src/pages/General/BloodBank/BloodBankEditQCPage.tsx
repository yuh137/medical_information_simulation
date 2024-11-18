import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { bloodBankQC } from "../../../utils/utils";
import { ButtonBase } from "@mui/material";


// This is used to get what the file name should be from the link
function NameFromLink(link: string): string {
  for (let item of bloodBankQC) {
    let link_name: string = item["link"];
    if (link_name === link) {
      const qcName: string = item["name"];
      const result: string = qcName.substring(0, qcName.indexOf(" QC"));
      return result;
    }
  }
  return link;
}

const BloodBankEditQC = () => {
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
        <div className={`edit-qc-options flex flex-wrap sm:justify-center sm:p-24 sm:h-[50svh] sm:w-[100svw] sm:gap-x-4 mx-auto`}>
          {bloodBankQC.map((item) => (
            <ButtonBase
              key={item.name}
              className={`!rounded-lg sm:w-64 sm:h-28 !border-solid transition ease-in-out ${
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
        <div className="button-container flex justify-center sm:-translate-y-12 sm:space-x-36 sm:pb-6">
          <Link to={selectedItem? selectedItem === "Reagent_Rack"?'/blood_bank/edit_qc/Reagent_Rack':`/blood_bank/rbc_qc/${selectedItem}` : "#"}>
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

export default BloodBankEditQC;
