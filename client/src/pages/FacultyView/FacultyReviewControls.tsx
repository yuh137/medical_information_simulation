import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import NavBar from "../../components/NavBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button, Checkbox } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { generateRandomId } from "../../utils/utils";
import { qcTypeLinkList } from "../../utils/utils";

interface QCItem {
  dep: string;
  test: string;
  id: string;
  status: string;
  openDate: string;
  closeDate: string;
  reviewed: boolean;
}

const Faculty_QC_Review = (props: { name: string; link: string }) => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<{ [key: string]: any } | undefined>(undefined);
  const [selectedQCs, setSelectedQCs] = useState<string[]>([]);
  const [qcItems, setQcItems] = useState<QCItem[]>([]);

  useEffect(() => {
    const storedQCs = localStorage.getItem("selectedQCItems");
    if (storedQCs) {
      setSelectedQCs(JSON.parse(storedQCs));
    }
  }, []);

  useEffect(() => {
    const items = qcTypeLinkList.filter((qc) => selectedQCs.includes(qc.name)).map((qc) => ({
      id: generateRandomId(),
      dep: props.name,
      test: qc.name,
      status: "Open",
      openDate: new Date().toLocaleDateString(),
      closeDate: "",
      reviewed: false,
    }));
    setQcItems(items);
  }, [selectedQCs, props.name]);

  function handleRowClick(key: string) {
    setSelectedRow(key === selectedRow ? null : key);
  }

  const handleCheckboxChange = useCallback((id: string, checked: boolean) => {
    setQcItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, reviewed: checked } : item
      )
    );
  }, []);

  const handleRemoveSelected = () => {
    if (selectedRow) {
      setQcItems((prevItems) => prevItems.filter((item) => item.id !== selectedRow));
      setSelectedRow(null);
      setSelectedRowData(undefined);
    }
  };

  const columns: ColumnDef<QCItem, string>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: "QC Lot #",
      cell: (info) => <div>{info.row.getValue("id")}</div>,
    },
    {
      accessorKey: "dep",
      header: "Department",
      cell: (info) => <div>{info.row.getValue("dep")}</div>,
    },
    {
      accessorKey: "test",
      header: "Test",
      cell: (info) => <div>{info.row.getValue("test")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => <div>{info.row.getValue("status")}</div>,
    },
    {
      accessorKey: "openDate",
      header: "Open Date",
      cell: (info) => <div>{info.row.getValue("openDate")}</div>,
    },
    {
      accessorKey: "closeDate",
      header: "Close Date",
      cell: (info) => <div>{info.row.getValue("closeDate")}</div>,
    },
    {
      accessorKey: "reviewed",
      header: "Reviewed",
      cell: (info) => (
        <Checkbox
          checked={info.row.getValue("reviewed")}
          onChange={(e) => handleCheckboxChange(info.row.getValue("id"), e.target.checked)}
        />
      ),
    },
  ], [handleCheckboxChange]);

  const table = useReactTable({
    data: qcItems,
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
              {table.getHeaderGroups().map((group) => (
                <TableRow
                  key={group.id}
                  className="font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0"
                >
                  {group.headers.map((header) => (
                    <TableHead key={header.id} className="text-white text-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!table.getRowModel().rows?.length ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      let selected: { [key: string]: any } = {};
                      row.getVisibleCells().forEach((cell) => (selected[cell.column.id] = cell.getValue()));
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
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="space-x-2">
            <Button variant="outlined" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <Icon icon="mdi:arrow-left-thin" />
            </Button>
            <Button variant="outlined" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <Icon icon="mdi:arrow-right-thin" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4 py-4">
          <Button
            className="sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black"
            onClick={() => {
              const qcTypeLink = qcTypeLinkList.find((item) => item.name === selectedRowData?.test)?.link;
              navigate(`/${props.link}/qc_results/${qcTypeLink}`);
            }}
          >
            Review Selected
          </Button>
          <Button
            className="sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black"
            onClick={handleRemoveSelected}
          >
            Remove Selected
          </Button>
        </div>
      </div>
    </>
  );
};

export default Faculty_QC_Review;
