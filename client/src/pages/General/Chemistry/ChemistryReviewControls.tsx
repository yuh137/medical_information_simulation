import React, { useEffect, useState } from 'react';
import NavBar from "../../../components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button, Modal, Box, Typography, Backdrop } from "@mui/material";
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
import { useReport } from '../../../context/ReportContext';
import { DatePicker } from 'antd';
import { useTheme } from '../../../context/ThemeContext';

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
  isActive: boolean;
}

enum NotiType {
  AnalyteNotSelected,
  DateRangeNull,
  SingleDateNull,
  SomethingWrong,
};

enum DateType {
  SingleDate = "SingleDate",
  DateRange = "DateRange",
};

const ChemistryReviewControls = () => {
  const navigate = useNavigate();
  const { changeReportId } = useReport();
  const { theme } = useTheme();
  // const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedAnalyte, setSelectedAnalyte] = useState<string | null>(null);
  // const [selectedRowData, setSelectedRowData] = useState<QCItem | undefined>(undefined);
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [qcLots, setQCLots] = useState<AdminQCLot[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);
  const [dateType, setDateType] = useState<DateType>(DateType.DateRange);
  const [dateRange, setDateRange] = useState<{ startDate: string, endDate: string } | null>(null);
  const [singleDate, setSingleDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState(false);
  const [notiType, setNotiType] = useState<NotiType>(NotiType.SomethingWrong);

  // Fetch all QC items from database
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
                isActive: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.isActive ?? false,
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
              setQCLots(qcData);
              const returnData = reports.map(item => ({
                reportId: item.reportID,
                qcName: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.qcName ?? "",
                lotNumber: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.lotNumber ?? "",
                expDate: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.expirationDate ?? "",
                isActive: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.isActive ?? false,
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
    try {
      if (!selectedAnalyte || !selectedQC) {
        setNotiType(NotiType.AnalyteNotSelected);
        throw new Error("Undefined selectedAnalyte or selectedQC");
      }

      if (dateType === DateType.DateRange && dateRange === null) {
        setNotiType(NotiType.DateRangeNull);
        throw new Error("Undefined dateRange");
      }

      if (dateType === DateType.SingleDate && singleDate === null) {
        setNotiType(NotiType.SingleDateNull);
        throw new Error("Undefined singleDate");
      }

      changeReportId(selectedQC.reportId);
      sessionStorage.setItem("LJReportId", selectedQC.reportId);
      navigate(`/chemistry/levey-jennings/${selectedQC.lotNumber}/${selectedAnalyte}`, { state: { type: dateType, date: dateType === DateType.DateRange ? dateRange : singleDate } });
    } catch (e) {
      console.error(e);
      setIsFeedbackNotiOpen(true);
    }
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
        return dayjs(createdDate).format("MM/DD/YYYY - HH:mm:ss");
      },
    },
    {
      accessorKey: "expDate",
      header: () => <span>Expiration Date</span>,
      cell: info => {
        const expDate = info.getValue() as string;
        return dayjs(expDate).format("MM/DD/YYYY - HH:mm:ss");
      },
    },
    {
      accessorKey: "isActive",
      header: () => <span>Status</span>,
      cell: info => {
        const isActive = info.getValue() as boolean;
        return (
          <div className='flex justify-center'>
            {isActive ? (<Icon className='font-semibold text-lg' icon="charm:tick" />) : (<Icon icon="maki:cross" />)}
          </div>
        )
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
        <div className="table-container flex flex-col mt-8 sm:max-w-[80svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]">
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
                    className="h-24 text-center flex"
                  >
                    <div>No data</div> {
                      isFetchingData && (<div className='flex items-center'><span>...but wait a minute</span> <Icon icon="eos-icons:loading" /></div>)
                    }
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
        <Modal open={open} onClose={() => setOpen(false)} style={{ zIndex: 99 }}>
          <Box sx={modalStyle}>
            <Typography variant="h5" align="center" gutterBottom>
              QC Review - Analytes
            </Typography>
            {selectedQC && (
              <div>
                <Typography variant="body1" align="center">
                  <strong>File Name:</strong> {selectedQC.qcName} &nbsp; | &nbsp;
                  <strong>Lot Number:</strong> {selectedQC.lotNumber} <br/>
                  <strong>Created Date:</strong> {dayjs(selectedQC.createdDate).format("MM/DD/YYYY - HH:mm:ss")} &nbsp; | &nbsp;
                  <strong>Status:</strong> {selectedQC?.isActive ? (<span className="sm:p-1 font-semibold text-white bg-green-500 rounded-md">Active</span>) : (<span className="sm:p-1 font-semibold text-white bg-red-500 rounded-md">Inactive</span>)}
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

                {/* Select date range */}
                {selectedAnalyte && (
                  dateType === DateType.DateRange ? (
                    <>
                      <div className='flex justify-center sm:mt-6 sm:gap-x-2 items-center'>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setDateType(DateType.SingleDate)}
                          className='sm:h-1/2'
                        >Date Range</Button>
                        <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
                          <div className="lotnumber-label sm:text-xl font-semibold text-white">
                            Select Date Range
                          </div>
                          <div>
                            <DatePicker.RangePicker 
                              popupStyle={{ zIndex: 999 }}
                              format={"MM/DD/YYYY"}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                              onChange={(value) => {
                                if (value) {
                                  let dateObject = { startDate: "", endDate: "" };
                                  dateObject["startDate"] = value[0]?.toISOString() ?? "";
                                  dateObject["endDate"] = value[1]?.toISOString() ?? "";
                                  setDateRange(dateObject);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex justify-center sm:mt-6 sm:gap-x-2 items-center'>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setDateType(DateType.DateRange)}
                          className='sm:h-1/2'
                        >Single Date</Button>
                        <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
                          <div className="lotnumber-label sm:text-xl font-semibold text-white">
                            Select Date
                          </div>
                          <div>
                            <DatePicker
                              popupStyle={{ zIndex: 999 }}
                              format={"MM/DD/YYYY"}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                              onChange={(value) => {
                                if (value) {
                                  setSingleDate(value.toISOString());
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )
                )}

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

      {/* Notification Popup */}
      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setIsFeedbackNotiOpen(false);
        }}
        style={{ zIndex: 999 }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            {/* WARNING QC NOT FOUND OR EXPIRED */}
            { notiType === NotiType.AnalyteNotSelected && (
                <div className="flex flex-col sm:gap-y-2 items-center sm:max-w-[480px]">
                  <div className="text-2xl font-semibold">Please select an Analyte</div>
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

              {/* NOTIFYING ORDER CREATED */}
              { notiType === NotiType.DateRangeNull && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Please specify a date range</div>
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

              {/* NOTIFYING ORDER CREATED */}
              { notiType === NotiType.SingleDateNull && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Please specify a date</div>
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

              {/* OTHER ERRORS */}
              { notiType === NotiType.SomethingWrong && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Something Went Wrong</div>
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
}

export default ChemistryReviewControls