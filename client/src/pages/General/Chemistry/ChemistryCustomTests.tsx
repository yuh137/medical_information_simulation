import React, { useEffect, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { ButtonBase, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Backdrop, Button } from "@mui/material";
import NavBar from "../../../components/NavBar";
import { useTheme } from "../../../context/ThemeContext";
import { createSearchParams, useLoaderData, useNavigate } from "react-router-dom";
import { AdminQCTemplate, Department } from "../../../utils/utils";
import { Icon } from "@iconify/react";

enum NotiType {
  NotSelected,
  DeletedSuccessfully,
  AreYouSure
}

const ChemistryCustomTests = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const loaderData = useLoaderData() as AdminQCTemplate[];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState(false);
  const [notiType, setNotiType] = useState<NotiType>(NotiType.NotSelected);
  const [isDeleteingTemplate, setIsDeletingTemplate] = useState<boolean>(false);

  async function handleDeleteCustomTemplate() {
    if (!selectedItem) {
      setNotiType(NotiType.NotSelected);
      setIsFeedbackNotiOpen(true);
      return;
    }

    const selectedTemplate = loaderData.find(item => item.slug === selectedItem);
    console.log("Selected Template:", selectedTemplate);
    if (!selectedTemplate) {
      setNotiType(NotiType.NotSelected);
      setIsFeedbackNotiOpen(true);
      return;
    }

    setIsDeletingTemplate(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/DeleteCustomTemplate/${selectedTemplate.adminQCLotID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (res.ok) {
      setNotiType(NotiType.DeletedSuccessfully);
      setIsFeedbackNotiOpen(true);
      setSelectedItem(null);
      setIsDeletingTemplate(false);
    } else {
      setNotiType(NotiType.NotSelected);
      setIsFeedbackNotiOpen(true);
      setIsDeletingTemplate(false);
    }
  }

  useEffect(() => {
    console.log("Loader Data:", loaderData);
  }, [])

  return (
    <>
      <NavBar name="Custom Quality Control" />
      <div className="basic-container relative sm:h-[150svh] sm:w-[100svw]">
        { loaderData.length === 0 && (
          <>
            <div className="text-center text-2xl font-semibold sm:mt-12">No Custom Tests</div>
          </>
        )}
        <div
          className="edit-qc-options flex flex-wrap sm:justify-center sm:px-[10svw] sm:py-[5svw] sm:gap-x-4 sm:gap-y-2"
        >
          {loaderData.map((item) => (
            <ButtonBase
              key={item.qcName}
              className={`!rounded-lg sm:w-64 sm:h-28 !border-solid transition ease-in-out ${
                selectedItem === item.slug
                  ? `!border-[#2F528F] !border-[4px] !bg-[#8faadc]`
                  : `!border !bg-[#dae3f3] !border-[#47669C]`
              } !px-3`}
              onClick={() => {
                setSelectedItem(item.slug === selectedItem ? null : item.slug);
              }}
            >
              <div className="button-text font-bold text-2xl">{item.qcName}</div>
            </ButtonBase>
          ))}
        </div>  
        <div className="button-container sticky sm:-bottom-12 flex justify-center sm:-translate-y-12 sm:space-x-36 z-2 bg-white sm:py-6">
          <ButtonBase
            className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
            onClick={() => {
              if (selectedItem) {
                navigate({
                  pathname: `/chemistry/edit_qc/${selectedItem}`,
                  search: createSearchParams({
                    dep: Department.Chemistry.toString(),
                    name: loaderData.find(item => item.slug == selectedItem)?.qcName ?? ""
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
          <ButtonBase
            className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
            onClick={() => {
              if (selectedItem) {
                setNotiType(NotiType.AreYouSure);
                setIsFeedbackNotiOpen(true);
              } else {
                setNotiType(NotiType.NotSelected);
                setIsFeedbackNotiOpen(true);
              }
            }}
            disabled={isDeleteingTemplate}
          >
            { isDeleteingTemplate ? <Icon icon="eos-icons:three-dots-loading" /> : "Delete QC File" }
          </ButtonBase>
        </div>
      </div>

      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setIsFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl z-3">
          <div className="sm:p-8 flex flex-col sm:gap-4">
              { notiType === NotiType.NotSelected && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Please Select An Item</div>
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

              { notiType === NotiType.DeletedSuccessfully && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Custom Template Deleted Successfully</div>
                  <Icon icon="clarity:success-standard-line" className="text-2xl text-green-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                      navigate(0);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }

              { notiType === NotiType.AreYouSure && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Do you want to delete this item?</div>
                  <div className="text-base text-slate-500/75 font-semibold">This will permanently delete all your lots.</div>
                  <Icon icon="ph:warning-octagon-bold" className="text-2xl text-yellow-500 sm:w-20 sm:h-20"/>
                  <div className='button-container flex sm:gap-x-4'>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleDeleteCustomTemplate();
                        setIsFeedbackNotiOpen(false);
                      }}
                      sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'green',
                          color: 'white',
                        }
                      }}
                      className={`transition ease-in-out`}
                    >
                      OK
                    </Button>
                    <Button
                      variant='contained'
                      onClick={() => {
                        setIsFeedbackNotiOpen(false);
                      }}
                      sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'red',
                          color: 'white',
                        }
                      }}
                      className='transition ease-in-out'
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) }
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export default ChemistryCustomTests;
