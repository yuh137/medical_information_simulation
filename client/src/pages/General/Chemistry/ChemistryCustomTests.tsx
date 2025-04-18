import React, { useEffect, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { ButtonBase, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import NavBar from "../../../components/NavBar";
import { useTheme } from "../../../context/ThemeContext";
import { createSearchParams, useLoaderData, useNavigate } from "react-router-dom";
import { AdminQCLot, Department } from "../../../utils/utils";

enum NotiType {
  NotSelected,
}

const ChemistryCustomTests = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as AdminQCLot[];

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState(false);
  const [notiType, setNotiType] = useState<NotiType>(NotiType.NotSelected);

  useEffect(() => {
    console.log("Loader Data:", loaderData);
  }, [])

  // Geethika old stuffs
  // useEffect(() => {
  //   const savedPanels: CustomPanel[] = JSON.parse(localStorage.getItem("customTests") || "[]");
  //   setCustomPanels(savedPanels.filter(panel => panel.tests && panel.tests.length > 0)); 
  // }, []);

  // const handleContextMenu = (event: React.MouseEvent, index: number) => {
  //   event.preventDefault();
  //   setContextMenu({ visible: true, x: event.clientX, y: event.clientY, index });
  // };

  // const handleDelete = () => {
  //   if (contextMenu.index !== null && currentPanelIndex !== null && customPanels[currentPanelIndex].isOngoing) {
  //     const updatedTests = customPanels[currentPanelIndex].tests.filter((_, i) => i !== contextMenu.index);
  //     const updatedPanels = customPanels.map((panel, idx) =>
  //       idx === currentPanelIndex ? { ...panel, tests: updatedTests } : panel
  //     );
  //     setCustomPanels(updatedPanels);
  //     localStorage.setItem("customTests", JSON.stringify(updatedPanels));
  //     setContextMenu({ visible: false, x: 0, y: 0, index: null });
  //   }
  // };

  // const handleFinalize = () => {
  //   setIsDialogOpen(true);
  // };

  // const finalizePanel = () => {
  //   const updatedPanels = customPanels.map((panel, index) =>
  //     index === currentPanelIndex ? { ...panel, name: panelName, isOngoing: false } : panel
  //   );
  //   setCustomPanels(updatedPanels);
  //   localStorage.setItem("customTests", JSON.stringify(updatedPanels));
  //   setIsDialogOpen(false);
  //   alert("Panel finalized and renamed successfully");
  //   setCurrentPanelIndex(null);
  // };

  // const columns: ColumnDef<QCRangeElements, string>[] = [
  //   { accessorKey: "analyteName", header: "Name" },
  //   { accessorKey: "analyteAcronym", header: "Abbreviation" },
  //   { accessorKey: "unitOfMeasure", header: "Units of Measure" },
  //   { accessorKey: "minLevel", header: "Min Level" },
  //   { accessorKey: "maxLevel", header: "Max Level" },
  //   { accessorKey: "mean", header: "Mean" },
  //   { accessorKey: "stdDevi", header: "Standard Deviation" },
  //   { accessorKey: "sdplus1", header: "+1 SD" },
  //   { accessorKey: "sdminus1", header: "-1 SD" },
  //   { accessorKey: "sdplus2", header: "+2 SD" },
  //   { accessorKey: "sdminus2", header: "-2 SD" },
  //   { accessorKey: "sdplus3", header: "+3 SD" },
  //   { accessorKey: "sdminus3", header: "-3 SD" },
  // ];

  // const table = useReactTable({
  //   data: currentPanelIndex !== null ? customPanels[currentPanelIndex].tests : [],
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  // const openTableDialog = (index: number) => {
  //   setCurrentPanelIndex(index);
  //   setIsTableDialogOpen(true);
  // };

  // const closeTableDialog = () => {
  //   setIsTableDialogOpen(false);
  //   setCurrentPanelIndex(null);
  // };

  return (
    <>
      <NavBar name="Custom Quality Control" />
      <div className="basic-container relative sm:h-[150svh] sm:w-[100svw]">
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
        </div>
      </div>
    </>
  );
};

export default ChemistryCustomTests;
