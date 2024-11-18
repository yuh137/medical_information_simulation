import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import NavBar from "../../../components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "../../../components/ui/table";
import { getAllDataByFileName, getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import { QCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";
import { AuthToken } from "../../../context/AuthContext";
import { BBStudentReport } from "../../../utils/utils";
import { BloodBankQCLot } from "../../../utils/indexedDB/IDBSchema";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel
} from "@tanstack/react-table";

interface QCItem {
  reportId: string;
  qcName: string;
  lotNumber: string;
  expDate: string;
  createdDate: string;
}

// Used to format dates so that the time isn't shown and it's in mm/dd/yyyy format
function formatDate(dateString: string) {
  const index = dateString.indexOf('T');
  dateString = dateString.substring(0, index);  // Cuts off everything after the "T"
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

const columns: ColumnDef<QCItem>[] = [
  
  {
    accessorKey: "lotNumber",
    header: () => <span>Lot Number</span>,
    cell: info => info.getValue(),
  },
  {
    accessorKey: "expDate",
    header: () => <span>Expiration Date</span>,
    cell: info => formatDate(info.getValue() as string),
  },
  {
    accessorKey: "createdDate",
    header: () => <span>Created Date</span>,
    cell: info => formatDate(info.getValue() as string),
  },
  {
    accessorKey: "qcName",
    header: () => <span>Test Name</span>,
    cell: info => info.getValue(),
  },
];

const BloodBankQCResult = (props: { name: string, link: string }) => {
  const navigate = useNavigate();
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);

  const fetchQCData = async () => {
    console.log("Fetching QC data...");
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      return null;
    }
    const token: AuthToken = JSON.parse(tokenString);
    // const params: string = 
    const res = await fetch(`${process.env.REACT_APP_API_URL}/BBStudentReport/ByStudentId/${token.userID}`);

    if (res.ok) {
      const reports: BBStudentReport[] = await res.json();
      const qcLotIds = Array.from(new Set(reports.map(report => report.bloodBankQCLotID)));

      const queryParams = new URLSearchParams();
      qcLotIds.forEach(item => queryParams.append("lotId", item));

      const qcDataRes = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots/ByIdList?${queryParams.toString()}`);

      if (qcDataRes.ok) {
        const qcData: BloodBankQCLot[] = await qcDataRes.json();
        const returnData = reports.map(item => ({
          reportId: item.reportID,
          qcName: qcData.find(qc => qc.bloodBankQCLotID === item.bloodBankQCLotID)?.qcName ?? "",
          lotNumber: qcData.find(qc => qc.bloodBankQCLotID === item.bloodBankQCLotID)?.lotNumber ?? "",
          expDate: qcData.find(qc => qc.bloodBankQCLotID === item.bloodBankQCLotID)?.expirationDate ?? "",
          createdDate: item.createdDate,
        }))

        setQcData(returnData);
      } 
      // setIsFetchingData(false);
      return;
    }
    // setIsFetchingData(false);
    return;
    /*
    const selectedQCs: string[] = JSON.parse(localStorage.getItem('selectedQCItems') || '[]');
    console.log(selectedQCs);
    const allDataPromises = selectedQCs.map(qcName => getAllDataByFileName("qc_store", qcName));
    const results = await Promise.all(allDataPromises);
    setQcData(results.flat());
    console.log("Fetched QC data:", results.flat());
    */
  };
  
  useEffect(() => {

    fetchQCData();
  }, []);
   
  
  const handleSelectQC = async () => {
    if (selectedQC) {
      console.log("Selected QC:", selectedQC.qcName);  
      localStorage.setItem('selectedQCData', JSON.stringify(qcData));
      if (selectedQC.qcName == 'Reagent Rack') {
        navigate(`/blood_bank/reagent-input-page`);
      } else {
        // Navigate to RBC
        // navigate('/blood_bank/rbc-input-page/${selectedQc.q}');
        // navigate('/blood_bank/qc_results/' + selectedQC.qcName);
        navigate('/blood_bank/qc_results/' + selectedQC.reportId);
      }
      /*
      try {
        const qcData = await getQCRangeByDetails(selectedQC.qcName, selectedQC.lotNumber, selectedQC.expDate);
        if (qcData) {
          console.log("QC Data found:", qcData);
          // Save the qcData to localStorage
          localStorage.setItem('selectedQCData', JSON.stringify(qcData));
  
          // Navigate to the ReagentInputPage
          navigate(`/blood_bank/reagent-input-page`);
        } else {
          console.warn('No matching QC data found in the database.');
          alert('No matching QC data found in the database.');
        }
      } catch (error) {
        console.error("Error fetching QC data:", error);
      }
      */
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
      <NavBar name={`Blood Bank QC Results`} />
      <div className="relative">
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
                  onClick={() => setSelectedQC(row.original)}
                  style={{ backgroundColor: row.original === selectedQC ? '#3A62A7' : undefined, color: row.original === selectedQC ? 'white' : undefined }}
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
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
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
      </div>
    </>
  );
};

export default BloodBankQCResult;
