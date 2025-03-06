import React, { useEffect, useState, useMemo } from 'react';
import NavBar from "../../../components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button, Modal, Box, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from 'dayjs';
import { AuthToken } from '../../../context/AuthContext';
import { AdminQCLot, StudentReport } from '../../../utils/utils';
import { ReportProvider, useReport } from '../../../context/ReportContext';

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
  reportId: string;
  qcName: string;
  lotNumber: string;
  expDate: string;
  createdDate: string;
}

const ChemistryReviewControls = () => {
  const navigate = useNavigate();
  const { changeReportId } = useReport();
  // const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedAnalyte, setSelectedAnalyte] = useState<string | null>(null);
  // const [selectedRowData, setSelectedRowData] = useState<QCItem | undefined>(undefined);
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [qcLots, setQCLots] = useState<AdminQCLot[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);
  const [open, setOpen] = useState(false);

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  // Fetch all QC items from IndexedDB
  useEffect(() => {
    const fetchQCData = async () => {
      try {
        setIsFetchingData(true);
        const tokenString = localStorage.getItem('token');
        if (!tokenString) {
          return null;
        }
        const token: AuthToken = JSON.parse(tokenString);
    
        if (token.roles.includes("Admin")) {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/ByAdminId/${token.userID}`);
    
          if (res.ok) {
            const reports: StudentReport[] = await res.json();
            const qcLotIds = Array.from(new Set(reports.map(report => report.adminQCLotID))); 
    
            const queryParams = new URLSearchParams();
            qcLotIds.forEach(item => queryParams.append("lotId", item));
    
            const qcDataRes = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByIdList?${queryParams.toString()}`);
    
            if (qcDataRes.ok) {
              const qcData: AdminQCLot[] = await qcDataRes.json();
              setQCLots(qcData);
              const returnData = reports.map(item => ({
                reportId: item.reportID,
                qcName: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.qcName ?? "",
                lotNumber: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.lotNumber ?? "",
                expDate: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.expirationDate ?? "",
                createdDate: item.createdDate,
              }))
    
              setQcData(returnData);
            } 
            setIsFetchingData(false);
            return;
          }
        } else if (token.roles.includes("Student")) {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/ByStudentId/${token.userID}`);
    
          if (res.ok) {
            const reports: StudentReport[] = await res.json();
            const qcLotIds = Array.from(new Set(reports.map(report => report.adminQCLotID)));
    
            const queryParams = new URLSearchParams();
            qcLotIds.forEach(item => queryParams.append("lotId", item));
    
            const qcDataRes = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByIdList?${queryParams.toString()}`);
    
            if (qcDataRes.ok) {
              const qcData: AdminQCLot[] = await qcDataRes.json();
              const returnData = reports.map(item => ({
                reportId: item.reportID,
                qcName: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.qcName ?? "",
                lotNumber: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.lotNumber ?? "",
                expDate: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.expirationDate ?? "",
                createdDate: item.createdDate,
              }))
    
              setQcData(returnData);
            } 
            setIsFetchingData(false);
            return;
          }
        }
        
        setIsFetchingData(false);
        return;
      } catch (error) {
        console.error("Error fetching QC data:", error);
      }
    };

    fetchQCData();
  }, []);

  useEffect(() => {
    // console.log(qcLots, qcLots.find(item => {
    //   if (selectedQC === null) {
    //     return false;
    //   }

    //   return item.qcName === selectedQC.qcName;
    // }));
  }, [qcLots, selectedQC]);

  useEffect(() => {
    console.log(selectedAnalyte);
  }, [selectedAnalyte])

  function handleLeveyJenningsClick() {
    if (selectedAnalyte && selectedQC) {
      changeReportId(selectedQC.reportId);
      navigate(`/chemistry/levey-jennings/${selectedQC.lotNumber}/${selectedQC.reportId}/${selectedAnalyte}`);
    }
  }
  
  function handleRowClick(rowId: string, rowData: QCItem) {
    // setSelectedRow(rowId === selectedRow ? null : rowId);
    // setSelectedRowData(rowId === selectedRow ? undefined : rowData);
  }

  function handleAnalyteClick(analyteName: string) {
    setSelectedAnalyte(analyteName === selectedAnalyte ? null : analyteName);
  }

  const handleRemoveSelected = async () => {
    if (selectedQC) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/Delete/${selectedQC.reportId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (res.ok) {
          console.log("QC deleted successfully.", await res.json());
          setQcData(preValue => {
            const updatedValues = preValue.filter(item => item !== selectedQC);
            return updatedValues;
          });
          setSelectedQC(null);
        }
      } catch (e) {
        console.error("Error deleting QC:", e);
      }
    }
  };

  const columns: ColumnDef<QCItem>[] = [
    {
      accessorKey: "qcName",
      header: () => <span>Test Name</span>,
      cell: info => info.getValue(),
    },
    {
      accessorKey: "lotNumber",
      header: () => <span>Lot Number</span>,
      cell: info => info.getValue(),
    },
    {
      accessorKey: "createdDate",
      header: () => <span>Created Date</span>,
      cell: info => {
        const createdDate = info.getValue() as string;
        return dayjs(createdDate).format("MM/DD/YYYY - hh:mm:ss");
      },
    },
    {
      accessorKey: "expDate",
      header: () => <span>Expiration Date</span>,
      cell: info => {
        const expDate = info.getValue() as string;
        return dayjs(expDate).format("MM/DD/YYYY - hh:mm:ss");
      },
    },
  ];

  const table = useReactTable({
    data: qcData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <NavBar name={`Chemistry Review Controls`} />
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
                      setSelectedQC(prevSelected => row.original === prevSelected ? null : row.original)
                    }}
                    style={{ backgroundColor: row.original === selectedQC ? '#3A62A7' : undefined, color: row.original === selectedQC ? 'white' : undefined }}
                    className="hover:cursor-pointer text-center"
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
            className={`sm:w-36 sm:h-12 sm:!text-lg font-medium ${selectedQC !== null ? "!bg-[#DAE3F3] !text-black !border !border-solid !border-blue-500" : "!bg-[#AFABAB] !text-white !border !border-solid !border-gray-500"}`}
            onClick={() => setOpen(true)}
            disabled={!selectedQC}
          >
            Review Selected
          </Button>
          <Button
            className={`sm:w-36 sm:h-12 sm:!text-lg font-medium ${selectedQC !== null ? "!bg-[#DAE3F3] !text-black !border !border-solid !border-blue-500" : "!bg-[#AFABAB] !text-white !border !border-solid !border-gray-500"}`}
            onClick={handleRemoveSelected}
            disabled={!selectedQC}
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
            {selectedQC && (
              <div>
                <Typography variant="body1" align="center">
                  <strong>File Name:</strong> {selectedQC.qcName} &nbsp; | &nbsp;
                  <strong>Lot Number:</strong> {selectedQC.lotNumber} &nbsp; | &nbsp;
                  <strong>Created Date:</strong> {dayjs(selectedQC.createdDate).format("MM/DD/YYYY - hh:mm:ss")}
                </Typography>

                {/* Table to display analyte names */}
                <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200 mt-4">
                  <TableHeader>
                    <TableRow className='bg-[#3A62A7]'>
                      <TableHead className="text-center text-white">Analyte Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qcLots.find(item => item.qcName === selectedQC.qcName)?.analytes.map((analyte, index) => (
                      <TableRow
                        key={index}
                        onClick={() => {
                          handleAnalyteClick(analyte.analyteName);
                        }}
                        className='hover:cursor-pointer'
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
                <div className="flex justify-center sm:mt-6 sm:gap-x-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLeveyJenningsClick}
                    // disabled={!selectedAnalyte}
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
}

export default ChemistryReviewControls