  import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
  } from "@tanstack/react-table";
import React, { memo, useState, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";
import { generateRandomId } from "../utils/utils";
import { qcTypeLinkList } from "../utils/utils";
import { QCTemplateBatch } from "../utils/indexedDB/IDBSchema";

interface QCItem {
  lotnum: string;
  test: string;
  expdate: string;
}

const columns: ColumnDef<QCItem | undefined, string>[] = [
  {
    accessorKey: "lotnum",
    header: "Lot number",
    cell: (info) => <div>{info.row.getValue("lotnum")}</div>,
  },
  {
    accessorKey: "expdate",
    header: "Expiration Date",
    cell: (info) => <div>{info.row.getValue("expdate")}</div>,
  },
  {
    accessorKey: "test",
    header: "Test",
    cell: (info) => <div>{info.row.getValue("test")}</div>,
  },
];

const QC_Results = (props: { name: string, link: string }) => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<string | null>();
  const [selectedRowData, setSelectedRowData] = useState<{ [key: string]: any }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [selectedQCs, setSelectedQCs] = useState<string[]>([]);

  const data = useLoaderData() as QCTemplateBatch[] | undefined;

  useEffect(() => {
    const storedQCs = localStorage.getItem('selectedQCItems');
    if (storedQCs) {
        setSelectedQCs(JSON.parse(storedQCs));
    }
    console.log("loader data: ", data);
}, []);

const qc_items = useMemo(() => (
  qcTypeLinkList.filter(qc => selectedQCs.includes(qc.name)).map(qc => ({
      lotnum: "11111111",
      expdate: "12/12/2012",
      test: qc.name
  }))
  // data && data.map(test => ({
  //   lotnum: test.lotNumber,
  //   expdate: test.closedDate,
  //   test: test.fileName
  // }))
), [selectedQCs]);


  function handleRowClick(key: string) {
    setSelectedRow(key === selectedRow ? null : key);
  }

  const table = useReactTable({
    data: qc_items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  //   console.log(table.getRowModel());
  // useEffect(() => {
  //   console.log(selectedRowData);
  // }, [selectedRowData]);

  return (
    <>
      <NavBar name={`${props.name} QC Results`} />
      <div className="relative">
        <div className="table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]">
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow
                  key={group.id}
                  className="font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0"
                >
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white text-center"
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
                <></>
              )}
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    let selected: { [key: string]: any } = {};
                    row.getVisibleCells().forEach(cell => selected[cell.column.id] = cell.getValue());
                    
                    // console.log(selected);
                    setSelectedRowData(selected);

                    handleRowClick(row.id);
                  }}
                  className="text-center sm:h-[10%] hover:cursor-pointer"
                  style={{
                    background: row.id === selectedRow ? "#0070C0" : "#E9EBF5",
                    color: row.id === selectedRow ? "#fff" : "#000",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {/* {cell.getValue()} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
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
          onClick={() => {
            const qcTypeLink = qcTypeLinkList.find(item => item.name === selectedRowData?.test)?.link;
            navigate(`/${props.link}/qc_results/${qcTypeLink}`);
          }}
        >
          Select QC
        </Button>
      </div>
    </>
  );
};

export default QC_Results;
