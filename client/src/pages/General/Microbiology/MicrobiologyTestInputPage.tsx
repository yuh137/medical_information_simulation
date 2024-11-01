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
import { CAT, ESC, GRAM, INDOLE, MUG, OXID, PYR, STER, STAPH} from "../../../utils/MICRO_MOCK_DATA";
import { renderSubString } from "../../../utils/utils";
import { ButtonBase, Checkbox } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { MicroQCTemplateBatch, QCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import NavBar from "../../../components/NavBar";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  expectedRange: string;
}

export const MicrobiologyTestInputPage = (props: { name: string }) => {
  const navigate = useNavigate();
  const {item} = useParams();
  const { checkSession, checkUserType } = useAuth();
  const { theme } = useTheme();
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
  console.log("DataType:", item);

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState(false);
  const { register, handleSubmit } = useForm<MicroQCTemplateBatch>();
  const saveQC: SubmitHandler<MicroQCTemplateBatch> = async (data) => {
    const qcDataToSave: MicroQCTemplateBatch = {
        fileName: props.name,
        lotNumber: data.lotNumber || "",
        openDate: data.openDate || "",
        closedDate: data.closedDate || "",
        analytes: QCElements.map(({ analyteName, analyteAcronym, expectedRange}) => ({
            analyteName, analyteAcronym, expectedRange
        })),
    };

    console.log("Attempting to save:", qcDataToSave);
    
    try {
        await saveToDB("qc_store", qcDataToSave);
        console.log("Data saved successfully.");
    } catch (error) {
        console.error("Failed to save data:", error);
    }
  };

  const inputRefs = useRef<HTMLInputElement[]>([]);

  function moveToNextInputOnEnter(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && inputRefs.current.find(ele => ele === e.target)) {
      const currentFocus = inputRefs.current.find(ele => ele === e.target);
      if (currentFocus && inputRefs.current.indexOf(currentFocus) < inputRefs.current.length) {
        const currentIndex = inputRefs.current.indexOf(currentFocus);
        inputRefs.current[currentIndex + 1]?.focus();
      }
      else return;
    }
  }

  // Column definitions for the table
  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "analyteName",
      header: "Name",
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
    },
    {
      accessorKey: "analyteAcronym",
      header: "Abbreviation",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "expectedRange",
      header: "Expected Range",
      cell: (info) => <></>,
    },
  ];
// ---------------------------------------------------------------------------------------------------
  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!checkSession() || checkUserType() === 'Student') navigate("/unauthorized");
  }, [checkSession, checkUserType, navigate]);

  useEffect(() => {
    (async () => {
      const res = await getDataByKey<MicroQCTemplateBatch>("qc_store", props.name);

      if (res && typeof res !== "string") setQCElements(res.analytes)
    })()
  }, [])

  useEffect(() => {
    console.log(QCElements);
  }, [QCElements]);
  
// ---------------------------------------------------------------------------------------------------
  return (
    <>
      <NavBar name={`Chemistry QC Builder`} />
      <div className="basic-container relative sm:space-y-4 pb-24">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-12">
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Lot Number</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" {...register("lotNumber")}/>
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Expiration Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" {...register("closedDate")}/>
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
        <div className="table-container flex flex-col mt-8 sm:w-[80svw] sm:h-[20svh] sm:mx-auto w-100svw bg-[#FFFFFF] relative">
        <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow
                  key={group.id}
                  className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0 z-20"
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
            <TableBody onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const minInputArray = inputRefs.current.filter(item => inputRefs.current.indexOf(item) % 4 === 1);

                minInputArray.forEach(item => {
                  if (+inputRefs.current[inputRefs.current.indexOf(item) + 1].value < +item.value || item.value === '' || (inputRefs.current[inputRefs.current.indexOf(item) + 1].value === '0' && item.value === '0')) {
                    item.classList.remove('bg-green-600');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-green-500');
                    item.classList.add('bg-red-500');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-red-500');
                  } else {
                    item.classList.remove('bg-red-500');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-red-500');
                    item.classList.add('bg-green-600');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-green-500');
                  }
                });

                setIsValid(!inputRefs.current.some(item => item.classList.contains("bg-red-500")));
                moveToNextInputOnEnter(e);
              }
            }}>
              {!table.getRowModel().rows?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="sm:h-32 !p-2 text-center"
                  >
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                <></>
              )}
              {QCElements.map((row, index) => (
                <TableRow key={row.analyteName} className="text-center sm:h-[10%] border-none">
                  <TableCell>
                    <div>{row.analyteName}</div>
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: renderSubString(row.analyteAcronym) }} />
                  </TableCell>
                  <TableCell className="expectedRange">
      {/* Input field pre-filled with the expectedRange value */}
                    <input
                      type="text"
                      className="sm:w-70 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.expectedRange} // Sets initial value as mock data
                      onChange={(e) => {
          // Updates QCElements state with new input values
                        setQCElements(prevState =>
                          prevState.map(item =>
                            item.analyteName === row.analyteName
                              ? { ...item, expectedRange: e.target.value }
                              : item
                          )
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ButtonBase disabled={!isValid} className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold" onClick={handleSubmit(saveQC)}>
          Save QC File
        </ButtonBase>
        </div>
    </>
  );
};

export default MicrobiologyTestInputPage;