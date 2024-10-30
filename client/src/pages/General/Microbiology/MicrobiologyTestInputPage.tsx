import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { saveToDB } from "../../../utils/indexedDB/getData";
import {
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { CAT, ESC, GRAM, INDOLE, MUG, OXID, PYR, STER, STAPH } from "../../../utils/MICRO_MOCK_DATA";
import { renderSubString } from "../../../utils/utils";
import { ButtonBase, Checkbox } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { QCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import NavBar from "../../../components/NavBar";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  expectedRange: string;
}

export const MicrobiologyTestInputPage = () => {
  const navigate = useNavigate();
  const {item} = useParams();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'Student') navigate("/unauthorized");
  }, [checkSession, checkUserType, navigate]);

  const initialData = 
  item?.includes('escu') ? ESC:
  item?.includes('gram') ? GRAM:
  item?.includes('indo') ? INDOLE:
  item?.includes('mug') ? MUG:
  item?.includes('oxid') ? OXID:
  item?.includes('pyr') ? PYR:
  item?.includes('steri') ? STER:
  item?.includes('staph') ? STAPH:
  CAT;

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState(false);
  const { register, handleSubmit } = useForm<QCTemplateBatch>();

  // Function to handle updates to the expected range field
const handleExpectedRangeChange = (index: number, value: string) => {
  const updatedQCElements = [...QCElements];
  updatedQCElements[index].expectedRange = value;
  setQCElements(updatedQCElements);
};

  // Column definitions for the table
  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "analyteName",
      header: "Analyte Name",
    },
    {
      accessorKey: "analyteAcronym",
      header: "Acronym",
    },
    {
      accessorKey: "expectedRange",
      header: "Expected Range",
      cell: ({ row }) => (
        <input
          type="text"
          value={row.original.expectedRange}
          onChange={(e) => handleExpectedRangeChange(row.index, e.target.value)}
          className="p-1 rounded-lg border border-solid border-[#548235] text-center"
        />
      ),
    },
  ];

  const table = useReactTable({
    data: QCElements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <>
      <NavBar name={`Microbiology QC Builder`} />
      <div className="basic-container relative sm:space-y-4 pb-24">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-12">
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Lot Number</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Expiration Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Open Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"/>
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Close Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"/>
            </div>
          </div>
        </div>
        <div className="table-container">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="button-container flex justify-center sm:-translate-y12 sm:space-x-68 sm:pb-6">
          <ButtonBase className="sm:w-40 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
            Save QC File
          </ButtonBase>
        </div>
      </div>
    </>
  );
};

export default MicrobiologyTestInputPage;