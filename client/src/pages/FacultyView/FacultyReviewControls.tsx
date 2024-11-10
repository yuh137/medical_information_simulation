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
import { Button, Checkbox, Modal, Box } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { AdminQCLot } from "../../utils/indexedDB/IDBSchema";
import { getAllDataFromStore } from "../../utils/indexedDB/getData";  // Use this function
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface QCItem {
  dep: string;
  test: string;
  id: string;
  status: string;
  openDate: string;
  closeDate: string;
  reviewed: boolean;
}

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  value: string;
}

interface FacultyQCReviewProps {
  name: string;
}

const Faculty_QC_Review: React.FC<FacultyQCReviewProps> = (props) => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<QCItem | undefined>(undefined);
  const [qcItems, setQcItems] = useState<QCItem[]>([]);
  const [open, setOpen] = useState(false);
  const [analyteData, setAnalyteData] = useState<QCRangeElements[]>([]);

  // Fetch selected QC data from localStorage and set filename and lotNumber
  useEffect(() => {
    const storedQCData = localStorage.getItem("selectedQCData");
    if (storedQCData) {
      const qcData = JSON.parse(storedQCData) as AdminQCLot[];
      console.log(qcData);

      // Convert the saved QC data into the format required by the table
      const items = qcData.map((qc) => ({
        id: `${qc.qcName}-${qc.lotNumber}`,
        dep: props.name,
        test: qc.qcName,  // Assuming `fileName` is used for the test column
        status: "Open",  // You can adjust this based on the actual status
        openDate: qc.openDate,
        closeDate: qc.closedDate || "",
        reviewed: false,
      }));
      setQcItems(items);
    } else {
      console.error("No QC data found.");
    }
  }, [props.name]);

  function handleRowClick(rowId: string, rowData: QCItem) {
    setSelectedRow(rowId === selectedRow ? null : rowId);
    setSelectedRowData(rowId === selectedRow ? undefined : rowData);
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
      setQcItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedRow)
      );
      setSelectedRow(null);
      setSelectedRowData(undefined);
    }
  };

  const handleOpen = async () => {
    if (selectedRowData?.test) {
      try {
        const storedQCData = localStorage.getItem("selectedQCData");
        if (storedQCData) {
          const qcData = JSON.parse(storedQCData) as AdminQCLot[];

          const selectedQC = qcData.find(
            (qc) => qc.qcName === selectedRowData.test
          );

          if (selectedQC) {
            setAnalyteData(
              selectedQC.analytes.map((analyte) => ({
                analyteName: analyte.analyteName,
                analyteAcronym: analyte.analyteAcronym,
                value: "", // This is where you'd add the value if you need it
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching analyte data:", error);
        setAnalyteData([]);
      }
    }
    setOpen(true);
  };

  const handleAnalyteClick = (analyteName: string) => {
    navigate(
      `/LeveyJennings?name=${encodeURIComponent(
        props.name
      )}&analyteName=${encodeURIComponent(analyteName)}`
    );
  };

  const handleClose = () => setOpen(false);

  const columns: ColumnDef<QCItem, string>[] = useMemo(
    () => [
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
            onChange={(e) =>
              handleCheckboxChange(info.row.getValue("id"), e.target.checked)
            }
          />
        ),
      },
    ],
    [handleCheckboxChange]
  );

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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      const selected: QCItem = {
                        id: row.getValue("id"),
                        dep: row.getValue("dep"),
                        test: row.getValue("test"),
                        status: row.getValue("status"),
                        openDate: row.getValue("openDate"),
                        closeDate: row.getValue("closeDate"),
                        reviewed: row.getValue("reviewed"),
                      };
                      handleRowClick(row.id, selected);
                    }}
                    className="text-center sm:h-[10%] hover:cursor-pointer"
                    style={{
                      background: row.id === selectedRow ? "#0070C0" : "#E9EBF5",
                      color: row.id === selectedRow ? "#fff" : "#000",
                    }}
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
            className="sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black"
            onClick={handleOpen}
            disabled={!selectedRowData}
          >
            Review Selected
          </Button>
          <Button
            className="sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black"
            onClick={handleRemoveSelected}
            disabled={!selectedRow}
          >
            Remove Selected
          </Button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <h2 id="modal-title">Analyte Details</h2>
          <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              <TableRow className="font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0">
                <TableHead className="text-white text-center">Analyte Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyteData.map((analyte) => (
                <TableRow
                  key={analyte.analyteName}
                  onClick={() => handleAnalyteClick(analyte.analyteName)}
                >
                  <TableCell>{analyte.analyteName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </>
  );
};

export default Faculty_QC_Review;
