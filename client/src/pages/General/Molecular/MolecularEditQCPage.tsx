import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { useTheme } from "../../../context/ThemeContext";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Department, microTypeLinkList } from "../../../utils/utils";
import { Backdrop, Button, ButtonBase } from "@mui/material";


const MicrobiologyEditQC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { checkSession, checkUserType } = useAuth();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  
    useEffect(() => {
      if (!checkSession() || checkUserType() === "Student")
        navigate("/unauthorized");
    }, []);
  
    useEffect(() => {
      console.log(selectedItem);
    }, [selectedItem]);
  
    const handleButtonClick = (link: string) => {
      const newSelectedItem = selectedItem === link ? null : link;
      
      setSelectedItem(newSelectedItem);
    };
    
  
    return (
    <>
    <NavBar name="Edit"></NavBar>

    <div className={`edit-qc-options flex flex-wrap sm:justify-center sm:p-24 sm:h-[150svh] sm:w-[100svw] sm:gap-x-4 mx-auto`}>
        {microTypeLinkList.map((item) => (
            <ButtonBase
            className={`!rounded-lg sm:w-64 sm:h-28 !border-solid transition ease-in-out ${
                selectedItem === item.link
                  ? `!border-[#2F528F] !border-[4px] !bg-[#8faadc]`
                  : `!border !bg-[${theme.secondaryColor}] !border-[${theme.primaryBorderColor}]`
              } !px-3`}
              onClick={() => {
                handleButtonClick(item.link)
              }}>
                {item.name}
            </ButtonBase>
        ))}
    </div>
    
    <div className="button-container sticky -bottom-12 flex justify-center sm:-translate-y-12 sm:space-x-36 z-2 bg-white sm:py-6">
          <ButtonBase
            className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
            onClick={() => {
              if (selectedItem) {
                navigate({
                  pathname: `/microbiology/edit_qc/${selectedItem}`,
                  search: createSearchParams({
                    dep: Department.Microbiology.toString(),
                    name: microTypeLinkList.find(item => item.link == selectedItem)?.name ?? ""
                  }).toString()
                })
              } 
            }}
          >
            Edit QC File
          </ButtonBase>
          <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
            Delete QC File
          </ButtonBase>
        </div>

    </>
    );
};

export default MicrobiologyEditQC;