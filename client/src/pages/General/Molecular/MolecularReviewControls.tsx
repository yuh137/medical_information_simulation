import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import NavBar from "../../../components/NavBar";
import { useState, useEffect } from "react";
import { MolecularQCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
import { AuthToken } from '../../../context/AuthContext';
import { QCPanel } from "../../../utils/indexedDB/IDBSchema";
import { useNavigate } from "react-router-dom";
import { getAllDataFromStore, getAllDataByFileName, getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "../../../components/ui/table";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel
} from "@tanstack/react-table";

interface QCItem {
  fileName: string;
  lotNumber: string;
  closedDate: string;
}

const columns: ColumnDef<QCPanel>[] = [
  {
    id: 'departmentColumn',
    header: () => <span>Department</span>,
    cell: () => <span>Molecular</span>
  },
  {
    accessorKey: "qcName",
    header: () => <span>Test</span>,
    cell: info => info.getValue(),
  },
];

const MolecularReviewControls = () => {
  const [qcData, setQcData] = useState<QCPanel[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCPanel | null>(null);
  const navigate = useNavigate();

  const fetchQCData = async () => {
    console.log("Fetching QC Panels...");
    const results = await getAllDataFromStore<MolecularQCTemplateBatch>('qc_store');
    console.log("Fetched QC Panels:", results);
    const token = localStorage.getItem("token");
    const authToken: AuthToken = JSON.parse(token as string);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken.jwtToken}`,
      },
    });
    const retyped_results = ((await res.json()) as unknown) as QCPanel[];
    console.log(`Results ${retyped_results}`);
    setQcData(retyped_results);
  };

  useEffect(() => {

    fetchQCData();
  }, []);

  const handleSelectQC = async () => {
    if (selectedQC) {
      console.log("Selected QC:", selectedQC);
      // Save the qcData to localStorage
      localStorage.setItem('selectedQCData', JSON.stringify(selectedQC));
      // Navigate to the AnalyteInputPage
      navigate(`/molecular/analyte_selection`);
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
      <NavBar name="Review Controls: Molecular" />

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

export default MolecularReviewControls;
