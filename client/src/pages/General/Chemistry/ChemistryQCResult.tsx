import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Backdrop, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import NavBar from "../../../components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "../../../components/ui/table";
import { getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { AdminQCLot, StudentReport } from "../../../utils/utils";
import { AuthToken } from "../../../context/AuthContext";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import { useTheme } from "../../../context/ThemeContext";

interface QCItem {
  reportId: string;
  qcName: string;
  lotNumber: string;
  expDate: string;
  createdDate: string;
}

enum NotiType {
  Default,
  NotSelected,
  ReportDeleted
}

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
];

const ChemistryQCResult = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState<boolean>(false);
  const [notiType, setNotiType] = useState<NotiType>(NotiType.Default);

  async function fetchQCData() {
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

        // console.log("Reports:", reports, qcLotIds);

        const queryParams = new URLSearchParams();
        qcLotIds.forEach(item => queryParams.append("lotId", item));

        console.log("Query Params: ", queryParams.toString());

        const qcDataRes = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByIdList?${queryParams.toString()}`);

        if (qcDataRes.ok) {
          const qcData: AdminQCLot[] = await qcDataRes.json();
          console.log("QC Data: ", qcData);
          const returnData = reports.map(item => ({
            reportId: item.reportID,
            qcName: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.qcName ?? "",
            lotNumber: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.lotNumber ?? "",
            expDate: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.expirationDate ?? "",
            createdDate: item.createdDate,
          }))
          console.log("Return data: ", returnData);

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
  }
  
  useEffect(() => {
    fetchQCData();

    console.log("QC Data:", qcData);
  }, []);
  
  
  const handleSelectQC = async () => {
    if (selectedQC === null) {
      setNotiType(NotiType.NotSelected);
      setIsFeedbackNotiOpen(true);
      return;
    }

    // console.log("Selected QC:", selectedQC);  
    try {
      navigate(`/chemistry/qc_results/${selectedQC.reportId}`)
    } catch (error) {
      console.error("Error fetching QC data:", error);
    }
  };

  const handleDeleteQC = async () => {
    if (selectedQC === null) {
      setNotiType(NotiType.NotSelected);
      setIsFeedbackNotiOpen(true);
      return;
    }
    
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
        setNotiType(NotiType.ReportDeleted);
        setIsFeedbackNotiOpen(true);
      }
    } catch (e) {
      console.error("Error deleting QC:", e);
    }
  };
  
  const table = useReactTable({
    data: qcData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <NavBar name={`Chemistry QC Results`} />
      <div className="relative">
        { isFetchingData && (<div className="sm:w-[80svw] flex justify-center items-center sm:mt-4 my-0 mx-auto">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>)}
        { !isFetchingData && (
          <>
            <div className="table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]">
              <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
                <TableHeader>
                  {table.getHeaderGroups().map(group => (
                    <TableRow key={group.id} className="font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0">
                      {group.headers.map(header => (
                        <TableHead
                          key={header.id}
                          className="text-white text-center"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      onClick={() => setSelectedQC(prevSelected => row.original === prevSelected ? null : row.original)}
                      style={{ backgroundColor: row.original === selectedQC ? '#3A62A7' : undefined, color: row.original === selectedQC ? 'white' : undefined }}
                      className="hover:cursor-pointer"
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {qcData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
              <div className="space-x-2">
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
            </div>
            <div className="flex items-center justify-center sm:gap-x-2">
              <Button
                className={`sm:w-36 sm:h-12 sm:!text-lg font-medium ${selectedQC !== null ? "!bg-[#DAE3F3] !text-black !border !border-solid !border-blue-500" : "!bg-[#AFABAB] !text-white !border !border-solid !border-gray-500"}`}
                onClick={handleSelectQC}
                disabled={!selectedQC}
              >
                Select QC
              </Button>
              <Button
                className={`sm:w-36 sm:h-12 sm:!text-lg font-medium ${selectedQC !== null ? "!bg-[#DAE3F3] !text-black !border !border-solid !border-blue-500" : "!bg-[#AFABAB] !text-white !border !border-solid !border-gray-500"}`}
                onClick={handleDeleteQC}
                disabled={!selectedQC}
              >
                Delete QC
              </Button>
            </div>
          </>
        )}
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
            {/* WARNING NO CHANGES MADE */}
            { notiType === NotiType.Default && (
                <div className="flex flex-col sm:gap-y-2 items-center sm:max-w-[480px]">
                  <div className="text-2xl font-semibold">Notification Error</div>
                  <Icon icon="hugeicons:sad-dizzy" className="text-2xl text-yellow-500 sm:w-20 sm:h-20"/>
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
              { notiType === NotiType.NotSelected && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Please Select a Report</div>
                  <Icon icon="ph:warning-octagon-bold" className="text-2xl text-yellow-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                      // navigate("/admin-home");
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }

              {/* OTHER ERRORS */}
              { notiType === NotiType.ReportDeleted && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Report Successfully Deleted</div>
                  <Icon icon="clarity:success-standard-line" className="text-2xl text-green-500 sm:w-20 sm:h-20"/>
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

export default ChemistryQCResult;
