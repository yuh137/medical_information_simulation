import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { qcTypeLinkList } from "../utils/utils";
import { ButtonBase } from "@mui/material";

const EditQC = (props: { name: string; link: string }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!checkSession() || checkUserType() === "student") navigate("/unauthorized");
  }, []);

  return (
    <>
      <NavBar name={`Edit ${props.name} QC`} />
      <div className="basic-container">
        <div className={`edit-qc-options flex flex-wrap sm:justify-center px-24 sm:h-[150svh] sm:w-[100svw] gap-6 mx-auto`}>
          {qcTypeLinkList.map((item) => (
            <ButtonBase
              key={item.name}
              className={`!rounded-lg sm:w-64 sm:h-28 sm:!my-12 !border-solid transition ease-in-out ${
                selectedItem === item.link
                  ? `!border-[#2F528F] !border-[4px] !bg-[#8faadc]`
                  : `!border !bg-[${theme.secondaryColor}] !border-[${theme.primaryBorderColor}]`
              } !px-3`}
              onClick={(e) =>{
                  setSelectedItem(item.link === selectedItem ? null : item.link);
                }
              }
            >
              <div className="button-text font-bold text-2xl">{item.name}</div>
            </ButtonBase>
          ))}
        </div>
        <div className="button-container flex justify-center sm:-translate-y-12 sm:space-x-36 sm:pb-6">
          <Link to={`/${props.link}/edit_qc/${selectedItem}`}>
              <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
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

export default EditQC;
