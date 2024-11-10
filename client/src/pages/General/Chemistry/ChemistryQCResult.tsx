import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import NavBar from "../../../components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "../../../components/ui/table";
import { getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import { AdminQCLot } from "../../../utils/indexedDB/IDBSchema";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  CellContext
} from "@tanstack/react-table";
import { StudentReport } from "../../../utils/utils";
import { AuthToken } from "../../../context/AuthContext";
import { Skeleton } from "antd";
import dayjs from "dayjs";

interface QCItem {
  reportId: string;
  qcName: string;
  lotNumber: string;
  expDate: string;
  createdDate: string;
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

const ChemistryQCResult = () => {
  const navigate = useNavigate();
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  async function fetchQCData() {
    setIsFetchingData(true);
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      return null;
    }
    const token: AuthToken = JSON.parse(tokenString);
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
    setIsFetchingData(false);
    return;
  }
  
  useEffect(() => {
    fetchQCData();
  }, []);
  
  
  const handleSelectQC = async () => {
    if (selectedQC) {
      console.log("Selected QC:", selectedQC);  
      try {
        // const qcData = await getQCRangeByDetails(selectedQC.qcName, selectedQC.lotNumber, selectedQC.expDate);
        // if (qcData) {
        //   console.log("QC Data found:", qcData);
        //   // Save the qcData to localStorage
        //   localStorage.setItem('selectedQCData', JSON.stringify(qcData));
  
        //   // Navigate to the AnalyteInputPage
        //   navigate(`/chemistry/simple-analyte-input-page`);
        // } else {
        //   console.warn('No matching QC data found in the database.');
        //   alert('No matching QC data found in the database.');
        // }
        navigate(`/chemistry/qc_results/${selectedQC.reportId}`)
      } catch (error) {
        console.error("Error fetching QC data:", error);
      }
    } else {
      alert('Please select a QC record to proceed.');
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
            <Button
              className="sm:!absolute sm:w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] right-3 -bottom-3 !border !border-solid !border-blue-500 font-medium !text-black"
              onClick={handleSelectQC}
              disabled={!selectedQC}
            >
              Select QC
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default ChemistryQCResult;
