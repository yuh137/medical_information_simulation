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
import { MMD } from "../../../utils/MICRO_MOCK_DATA";
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

  const initialData = MMD;

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState(false);
  const { register, handleSubmit } = useForm<QCTemplateBatch>();

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
    },
  ];

  const table = useReactTable({
    data: QCElements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <>
      <NavBar name={`Catalase QC Builder`} />
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
              {QCElements.map((row, index) => (
                <TableRow key={row.analyteName}>
                  <TableCell>{row.analyteName}</TableCell>
                  <TableCell>{row.analyteAcronym}</TableCell>
                  <TableCell>{row.expectedRange}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default MicrobiologyTestInputPage;