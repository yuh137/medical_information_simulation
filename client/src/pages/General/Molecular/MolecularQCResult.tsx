import NavBar from "../../../components/NavBar";
import React, { useState, useEffect } from "react";
import { getAllDataByFileName, getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "../../../components/ui/table";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel
} from "@tanstack/react-table";
import { DEBUG_add_molecular_data_to_idb } from "../../../utils/DNALYTICS_DEBUG_UTIL";

interface QCItem {
  fileName: string;
}

const columns: ColumnDef<QCItem>[] = [
  {
    id: 'departmentColumn',
    header: () => <span>Department</span>,
    cell: () => <span>Molecular</span>
  },
  {
    accessorKey: "fileName",
    header: () => <span>Test Name</span>,
    cell: info => info.getValue(),
  },
];

const MolecularQCResult = () => {
  const [qcData, setQcData] = useState<QCItem[]>([]);
  const [selectedQC, setSelectedQC] = useState<QCItem | null>(null);

  const fetchQCData = async () => {
// TODO(colby): DEBUG
    //insert all from localstorage
    const QCPanels = ['GI Panel Level I', 'GI Panel Level II', 'Respiratory Panel Level I', 'Respiratory Panel Level II', 'STI-PCR Panel Level I', 'STI-PCR Panel Level II', 'HIV Real-Time PCR Panel: Negative Control', 'HIV Real-Time PCR Panel: Low Control'];
    localStorage.setItem('selectedQCItems', JSON.stringify(QCPanels));
    //insert into idb at qc_store 
    await DEBUG_add_molecular_data_to_idb(QCPanels);
//
    console.log("Fetching QC data...");
    const selectedQCs: string[] = JSON.parse(localStorage.getItem('selectedQCItems') || '[]');
    const allDataPromises = selectedQCs.map(qcName => getAllDataByFileName("qc_store", qcName));
    const results = await Promise.all(allDataPromises);
    setQcData(results.flat());
    console.log("Fetched QC data:", results.flat());
  };
  
  useEffect(() => {

    fetchQCData();
  }, []);

  const table = useReactTable({
    data: qcData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <NavBar name={`Molecular QC Results`} />
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
      </div>
    </>
  );
};

export default MolecularQCResult;
