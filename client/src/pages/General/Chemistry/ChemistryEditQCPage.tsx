import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { useTheme } from "../../../context/ThemeContext";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Department, qcTypeLinkList } from "../../../utils/utils";
import { Backdrop, Button, ButtonBase } from "@mui/material";
import { Icon } from "@iconify/react";

enum NotiType {
  NotSelected
}

const ChemistryEditQC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { checkSession, checkUserType } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState(false);
  const [notiType, setNotiType] = useState<NotiType>(NotiType.NotSelected);

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student")
      navigate("/unauthorized");
  }, []);

  useEffect(() => {
    console.log(selectedItem);
  }, [selectedItem]);

  useEffect(() => {
    //If notification is enabled, disable after 3 seconds
    if (isFeedbackNotiOpen && (notiType === NotiType.NotSelected)) {
      setTimeout(() => {
        setIsFeedbackNotiOpen(false);

      }, 3000);
    }
  }, [isFeedbackNotiOpen])

  return (
    <>
      <NavBar name={`Edit Chemistry QC`} />
      <div className="basic-container relative">
        <div
          className={`edit-qc-options flex flex-wrap sm:justify-center sm:p-24 sm:h-[150svh] sm:w-[100svw] sm:gap-x-4 mx-auto`}
        >
          {qcTypeLinkList.map((item) => (
            <ButtonBase
              key={item.name}
              className={`!rounded-lg sm:w-64 sm:h-28 !border-solid transition ease-in-out ${
                selectedItem === item.link
                  ? `!border-[#2F528F] !border-[4px] !bg-[#8faadc]`
                  : `!border !bg-[${theme.secondaryColor}] !border-[${theme.primaryBorderColor}]`
              } !px-3`}
              onClick={() => {
                setSelectedItem(item.link === selectedItem ? null : item.link);
              }}
            >
              <div className="button-text font-bold text-2xl">{item.name}</div>
            </ButtonBase>
          ))}
        </div>  
        <div className="button-container sticky -bottom-12 flex justify-center sm:-translate-y-12 sm:space-x-36 z-2 bg-white sm:py-6">
          <ButtonBase
            className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
            onClick={() => {
              if (selectedItem) {
                navigate({
                  pathname: `/chemistry/edit_qc/${selectedItem}`,
                  search: createSearchParams({
                    dep: Department.Chemistry.toString(),
                    name: qcTypeLinkList.find(item => item.link == selectedItem)?.name ?? ""
                  }).toString()
                })
              } else {
                setNotiType(NotiType.NotSelected);
                setIsFeedbackNotiOpen(true);
              }
            }}
          >
            Edit QC File
          </ButtonBase>
          <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
            Delete QC File
          </ButtonBase>
        </div>
      </div>

      {/* Notification Popup */}
      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setIsFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl z-3">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            {/* WARNING NOT SELECTED */}
            { notiType === NotiType.NotSelected && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Select a Test!</div>
                  <Icon icon="material-symbols:cancel-outline" className="text-2xl text-red-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export default ChemistryEditQC;
