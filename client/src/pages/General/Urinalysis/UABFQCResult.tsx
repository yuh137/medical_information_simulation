import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import NavBar from "../../../components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "../../../components/ui/table";
import { getAllDataByFileName, getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import { QCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";
import { UABFQCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";

import { ColumnDef, useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";

interface QCItem {
  fileName: string;
  lotNumber: string;
  closedDate: string;
}

const columns: ColumnDef<QCItem>[] = [
  {
    accessorKey: "fileName",
    header: () => <span>Test Name</span>,
    cell: info => info.getValue(),
  },
  {
    accessorKey: "lotNumber",
    header: () => <span>Lot Number</span>,
    cell: info => info.getValue(),
  },
  {
    accessorKey: "closedDate",
    header: () => <span>Expiration Date</span>,
    cell: info => info.getValue(),
  },
];

const UrinalysisQCResult = (props: { name: string, link: string }) => {
  const navigate = useNavigate();
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);


const fetchQCData = async () => {
  console.log("Fetching QC data...");

  // Retrieve selected QC names from local storage
  const selectedQCs: string[] = JSON.parse(localStorage.getItem('selectedQCItems') || '[]');
  console.log("Selected QC data:", selectedQCs);

  if (selectedQCs.length === 0) {
      console.log("No selected QCs found in local storage.");
      return;
  }

  try {
      // API call to fetch data for the selected QCs
      const apiUrl = `${process.env.REACT_APP_API_URL}/AdminQCLots/ByNameList`;
      const queryString = selectedQCs.map((name: string) => `names=${encodeURIComponent(name)}`).join('&');

      const response = await fetch(`${apiUrl}?${queryString}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });
      if (response.ok) {
        try {
          // Parse the response data
          const data = await response.json();
      
          // Process the data to match the UABFQCTemplateBatch interface
          const processedData: UABFQCTemplateBatch[] = data.map((item: any) => ({
            isQualitative: item.isQualitative ?? false, // Default to false if null
            fileName: item.qcName, // Map 'qcName' from API response to 'fileName'
            lotNumber: String(item.lotNumber),
            openDate: String(item.openDate),
            closedDate: String(item.closedDate),
            analytes: item.analytes.map((analyte: any) => ({
              analyteName: analyte.analyteName,
              analyteAcronym: analyte.analyteAcronym,
              unit_of_measure: analyte.unitOfMeasure || "", // Default to empty string if missing
              min_level: String(analyte.minLevel),
              max_level: String(analyte.maxLevel),
              mean: String(analyte.mean),
              std_devi: String(analyte.stdDevi),
              electrolyte: analyte.electrolyte ?? false, // Default to false if null
              value: analyte.value, // Optional value field
              expected_range: analyte.expectedRange, // Default to empty array if null
              selectedExpectedRange: analyte.selectedExpectedRange,
            })),
          }));

          // Optionally update your state (if required)
          setQcData(processedData);

          console.log("Data processed and stored in local storage:", processedData);
        } catch (error) {
          console.error("Error processing QC data:", error);
        }
      } else {
        console.error("Failed to fetch data:", await response.text());
      }

  } catch (error) {
      console.error("Error fetching QC data:", error);
  }
};


  useEffect(() => {
    fetchQCData();
  }, []);

  const handleSelectQC = () => {
    if (!selectedQC) {
      alert('Please select a QC record to proceed.');
      return;
    }
  
    console.log("Selected QC:", selectedQC);
  
    // Find the matching QC data from `qcData`
    const matchingQC = qcData.find(
      qc =>
        qc.fileName === selectedQC.fileName &&
        qc.lotNumber === selectedQC.lotNumber &&
        qc.closedDate === selectedQC.closedDate
    );
  
    if (matchingQC) {
      console.log("Matching QC Data found:", matchingQC);
  
      // Save the QC data to localStorage
      localStorage.setItem('selectedQCData', JSON.stringify(matchingQC));
  
      // Determine the QC type and navigate accordingly
      if ('isQualitative' in matchingQC && matchingQC.isQualitative) {
        navigate(`/UA_fluids/qualitative-analyte-input-page`);
      } else {
        navigate(`/UA_fluids/qc_results/:link`);
      }
    } else {
      console.warn('No matching QC data found in the current dataset.');
      alert('No matching QC data found.');
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
      <NavBar name={`${props.name} QC Results`} />
      <div className="relative">
        <div className="table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              {table.getHeaderGroups().map(group => (
                <TableRow key={group.id} className="font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0">
                  {group.headers.map(header => (
                    <TableHead key={header.id} className="text-white text-center">
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

export default UrinalysisQCResult;
