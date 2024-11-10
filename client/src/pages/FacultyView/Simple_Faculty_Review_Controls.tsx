import React, { useEffect, useState, useMemo } from 'react';
import NavBar from "../../components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button, Modal, Box, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { AdminQCLot } from "../../utils/indexedDB/IDBSchema";
import { getAllDataFromStore } from "../../utils/indexedDB/getData";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw', // Make the modal wider
  height: '80vh', // Set a max height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Make the modal scrollable
};

const selectedRowStyle = {
  background: '#0070C0', 
  color: '#fff', 
};

const defaultRowStyle = {
  background: '#E9EBF5', 
  color: '#000', 
};

const tableHeaderStyle = {
  background: '#3A62A7', 
  color: '#fff', 
  textAlign: 'center' as const, 
};

interface QCItem {
  fileName: string;
  lotNumber: string;
  closedDate: string;
  analytes: { analyteName: string }[];  
}

const Simple_Faculty_QC_Review = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedAnalyte, setSelectedAnalyte] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<QCItem | undefined>(undefined);
  const [qcItems, setQcItems] = useState<QCItem[]>([]);
  const [open, setOpen] = useState(false);

  // Fetch all QC items from IndexedDB
  useEffect(() => {
    const fetchQCData = async () => {
      try {
        const data = (await getAllDataFromStore('qc_store')) as unknown as AdminQCLot[];

        // Map over the data and ensure type consistency
        setQcItems(
          data.map((item) => ({
            fileName: String(item.qcName),  // Ensure these are strings
            lotNumber: String(item.lotNumber),
            closedDate: String(item.closedDate),
            analytes: item.analytes.map(analyte => ({ analyteName: analyte.analyteName }))
          }))
        );
      } catch (error) {
        console.error("Error fetching QC data:", error);
      }
    };

    fetchQCData();
  }, []);

  function handleLeveyJenningsClick() {
    if (selectedRowData && selectedAnalyte) {
      navigate(`/chemistry/levey-jennings/${selectedRowData.fileName}/${selectedRowData.lotNumber}/${selectedAnalyte}`);
    }
  }
  
  function handleRowClick(rowId: string, rowData: QCItem) {
    setSelectedRow(rowId === selectedRow ? null : rowId);
    setSelectedRowData(rowId === selectedRow ? undefined : rowData);
  }

  function handleAnalyteClick(analyteName: string) {
    setSelectedAnalyte(analyteName === selectedAnalyte ? null : analyteName);
  }

  const handleRemoveSelected = () => {
    if (selectedRow) {
      setQcItems((prevItems) =>
        prevItems.filter((item) => item.fileName !== selectedRow)
      );
      setSelectedRow(null);
      setSelectedRowData(undefined);
    }
  };

  const columns: ColumnDef<QCItem, string>[] = useMemo(
    () => [
      {
        accessorKey: "fileName",
        header: "File Name",
      },
      {
        accessorKey: "lotNumber",
        header: "Lot Number",
      },
      {
        accessorKey: "closedDate",
        header: "Closed Date",
      },
    ],
    []
  );

  const table = useReactTable({
    data: qcItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <NavBar name={`Chemistry QC Results`} />
      <div className="relative">
        <div className="table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow
                  key={group.id}
                  className="font-bold text-3xl"
                  style={tableHeaderStyle}  // Apply the blue header style
                >
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={tableHeaderStyle}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!table.getRowModel().rows?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      const selected: QCItem = {
                        fileName: String(row.getValue("fileName")),  // Explicit cast to string
                        lotNumber: String(row.getValue("lotNumber")),
                        closedDate: String(row.getValue("closedDate")),
                        analytes: row.original.analytes
                      };
                      handleRowClick(row.id, selected);
                    }}
                    className="text-center sm:h-[10%] hover:cursor-pointer"
                    style={row.id === selectedRow ? selectedRowStyle : defaultRowStyle}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outlined"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Icon icon="mdi:arrow-left-thin" />
          </Button>
          <Button
            variant="outlined"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Icon icon="mdi:arrow-right-thin" />
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-4 py-4">
          <Button
            className="sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black"
            onClick={() => setOpen(true)}
            disabled={!selectedRowData}
          >
            Review Selected
          </Button>
          <Button
            className="sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black"
            onClick={handleRemoveSelected}
            disabled={!selectedRow}
          >
            Remove Selected
          </Button>
        </div>

        {/* Modal for QC Review */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h5" align="center" gutterBottom>
              QC Review - Analytes
            </Typography>
            {selectedRowData && (
              <div>
                <Typography variant="body1" align="center">
                  <strong>File Name:</strong> {selectedRowData.fileName} &nbsp; | &nbsp;
                  <strong>Lot Number:</strong> {selectedRowData.lotNumber} &nbsp; | &nbsp;
                  <strong>Closed Date:</strong> {selectedRowData.closedDate}
                </Typography>

                {/* Table to display analyte names */}
                <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200 mt-4">
                  <TableHeader>
                    <TableRow className='bg-[#3A62A7]'>
                      <TableHead className="text-center text-white">Analyte Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRowData.analytes.map((analyte, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleAnalyteClick(analyte.analyteName)}
                        style={analyte.analyteName === selectedAnalyte ? selectedRowStyle : defaultRowStyle}
                      >
                        <TableCell className="text-center">
                          {analyte.analyteName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Levey Jennings and Qualitative Analysis Buttons */}
                <div className="flex justify-center mt-6">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLeveyJenningsClick}
                    disabled={!selectedAnalyte}
                    className="mr-4"
                  >
                    Levey Jennings
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      console.log("Qualitative Analysis clicked"); // Placeholder for future functionality
                    }}
                  >
                    Qualitative Analysis
                  </Button>
                </div>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Simple_Faculty_QC_Review;
