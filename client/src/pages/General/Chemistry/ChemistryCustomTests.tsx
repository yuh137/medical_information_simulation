import React, { useEffect, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { ButtonBase, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { AdminQCLot } from "../../../utils/indexedDB/IDBSchema";
import NavBar from "../../../components/NavBar";
import { useTheme } from "../../../context/ThemeContext";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minLevel: string;
  maxLevel: string;
  mean: string;
  stdDevi: string;
  electrolyte: boolean;
}

interface CustomPanel {
  name: string;
  tests: QCRangeElements[];
  isOngoing: boolean;
}

const ChemistryCustomTests = () => {
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; index: number | null }>({ visible: false, x: 0, y: 0, index: null });
  const [panelName, setPanelName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPanelIndex, setCurrentPanelIndex] = useState<number | null>(null);
  const [customPanels, setCustomPanels] = useState<CustomPanel[]>([]);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    const savedPanels: CustomPanel[] = JSON.parse(localStorage.getItem("customTests") || "[]");
    setCustomPanels(savedPanels.filter(panel => panel.tests && panel.tests.length > 0)); 
  }, []);

  const handleContextMenu = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, index });
  };

  const handleDelete = () => {
    if (contextMenu.index !== null && currentPanelIndex !== null && customPanels[currentPanelIndex].isOngoing) {
      const updatedTests = customPanels[currentPanelIndex].tests.filter((_, i) => i !== contextMenu.index);
      const updatedPanels = customPanels.map((panel, idx) =>
        idx === currentPanelIndex ? { ...panel, tests: updatedTests } : panel
      );
      setCustomPanels(updatedPanels);
      localStorage.setItem("customTests", JSON.stringify(updatedPanels));
      setContextMenu({ visible: false, x: 0, y: 0, index: null });
    }
  };

  const handleFinalize = () => {
    setIsDialogOpen(true);
  };

  const finalizePanel = () => {
    const updatedPanels = customPanels.map((panel, index) =>
      index === currentPanelIndex ? { ...panel, name: panelName, isOngoing: false } : panel
    );
    setCustomPanels(updatedPanels);
    localStorage.setItem("customTests", JSON.stringify(updatedPanels));
    setIsDialogOpen(false);
    alert("Panel finalized and renamed successfully");
    setCurrentPanelIndex(null);
  };

  const columns: ColumnDef<QCRangeElements, string>[] = [
    { accessorKey: "analyteName", header: "Name" },
    { accessorKey: "analyteAcronym", header: "Abbreviation" },
    { accessorKey: "unitOfMeasure", header: "Units of Measure" },
    { accessorKey: "minLevel", header: "Min Level" },
    { accessorKey: "maxLevel", header: "Max Level" },
    { accessorKey: "mean", header: "Mean" },
    { accessorKey: "stdDevi", header: "Standard Deviation" },
    { accessorKey: "sdplus1", header: "+1 SD" },
    { accessorKey: "sdminus1", header: "-1 SD" },
    { accessorKey: "sdplus2", header: "+2 SD" },
    { accessorKey: "sdminus2", header: "-2 SD" },
    { accessorKey: "sdplus3", header: "+3 SD" },
    { accessorKey: "sdminus3", header: "-3 SD" },
  ];

  const table = useReactTable({
    data: currentPanelIndex !== null ? customPanels[currentPanelIndex].tests : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const openTableDialog = (index: number) => {
    setCurrentPanelIndex(index);
    setIsTableDialogOpen(true);
  };

  const closeTableDialog = () => {
    setIsTableDialogOpen(false);
    setCurrentPanelIndex(null);
  };

  return (
    <>
      <NavBar name="Custom QC Tests" />
      <div className="custom-tests-container" onClick={() => setContextMenu({ visible: false, x: 0, y: 0, index: null })}>
        <div className="button-container flex flex-wrap gap-4 mb-8 p-4" style={{ minWidth: "100svw", minHeight: "10svh" }}>
          {customPanels.map((panel, index) => (
            <ButtonBase
              key={index}
              className={`!rounded-lg sm:w-80 sm:h-36 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] hover:!border-[4px] font-semibold leading-[4rem]`}
              onClick={() => openTableDialog(index)}
            >
              <div className="button-text font-bold text-2xl">{panel.name}</div>
            </ButtonBase>
          ))}
        </div>

        <Dialog open={isTableDialogOpen} onClose={closeTableDialog} maxWidth="lg" fullWidth>
          <DialogTitle>
            <div className="flex justify-between items-center">
              <span>Panel Details</span>
              <button onClick={closeTableDialog} className="text-2xl font-bold">X</button>
            </div>
          </DialogTitle>
          <DialogContent>
            {currentPanelIndex !== null && (
              <div className="table-container flex flex-col mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
                <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
                  <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                      <TableRow key={group.id} className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0 z-20">
                        {group.headers.map((header) => (
                          <TableHead key={header.id} className="text-white text-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {!table.getRowModel().rows?.length ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="sm:h-32 !p-2 text-center">
                          No data
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getRowModel().rows.map((row, index) => (
                        <TableRow key={row.id} className={`text-center sm:h-[10%] border-none ${contextMenu.index === index ? 'bg-red-200' : ''}`} onContextMenu={(e) => handleContextMenu(e, index)}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {customPanels[currentPanelIndex].isOngoing && (
                  <div className="buttons-container flex justify-center gap-4 mt-4">
                    <ButtonBase
                      className="finalize-button sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
                      onClick={handleFinalize}
                    >
                      Finalize Panel
                    </ButtonBase>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {contextMenu.visible && (
          <div style={{ position: 'absolute', top: contextMenu.y, left: contextMenu.x, backgroundColor: 'white', border: '1px solid black', padding: '5px', zIndex: 1000 }}>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Enter Panel Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Panel Name"
              type="text"
              fullWidth
              variant="standard"
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => setIsDialogOpen(false)}>Cancel</ButtonBase>
            <ButtonBase onClick={finalizePanel}>Save</ButtonBase>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ChemistryCustomTests;
