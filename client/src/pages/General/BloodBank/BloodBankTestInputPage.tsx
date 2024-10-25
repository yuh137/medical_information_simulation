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
import { CMP,RR_QC,TWO_CELL,THREE_CELL} from "../../../utils/BB_DATA";
import { renderSubString } from "../../../utils/utils";
import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { BloodBankQC } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import NavBar from "../../../components/NavBar";

interface QCRangeElements {
  reagentName: string;
  Abbreviation: string;
  AntiSeraLot: string;
  ExpDate: string;
  ExpectedRange: string;
}


export const BloodBankTestInputPage = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const initialData = RR_QC;
  console.log("DataType:", item);

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState<boolean>(false);
  // const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<BloodBankQC>();
  const saveQC: SubmitHandler<BloodBankQC> = async (data) => {
    const qcDataToSave: BloodBankQC = {
        fileName: props.name,
        lotNumber: data.lotNumber || "",
        openDate: data.openDate || "",
        closedDate: data.closedDate || "",
        reagents: QCElements.map(({ reagentName, Abbreviation, AntiSeraLot,ExpDate, ExpectedRange}) => ({
          reagentName, Abbreviation, AntiSeraLot,ExpDate, ExpectedRange
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

  const columns: ColumnDef<QCRangeElements, string>[] = [
    // {
    //   accessorKey: 'electrolyte',
    //   header: 'Electrolyte',
    //   cell: (info) => <></>
    // },
    {
      accessorKey: "reagentName",
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
  ];

  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student") {}
      // navigate("/unauthorized");
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getDataByKey<BloodBankQC>("qc_store", props.name);

      if (res && typeof res !== "string") setQCElements(res.reagents)
    })()
  }, [])

  useEffect(() => {
    console.log(QCElements);
  }, [QCElements]);

  return (
    <>
      <NavBar name={`Blood Bank QC Builder`} />
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
              <div className="lotnumber-label sm:text-xl font-semibold text-white">File Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"/>
            </div>
          </div>
        </div>
        <div className="table-container flex flex-col mt-8 sm:w-[94svw] sm:h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
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
                    item.classList.remove('bg-green-500');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-green-500');
                    item.classList.add('bg-red-500');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-red-500');
                  } else {
                    // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
                    item.classList.remove('bg-red-500');
                    inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-red-500');
                    item.classList.add('bg-green-500');
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
              {/* {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="text-center sm:h-[10%] border-none"
                  onClick={() => console.log(row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue())}
                >
                  <TableCell>
                    <div>{row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue<string>()}</div>
                  </TableCell>
                  <TableCell>
                    <input type="text" className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center" value={QCElements.find(item => item.analyteName === row.getVisibleCells().find(cell => cell.id.includes("analyteName"))?.getValue())?.analyteAcronym || ""} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.getAllCells().find(subItem => subItem.id.includes("analyteName"))?.getValue())
                                  return { ...item, analyteAcronym: e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell>
                </TableRow>
              ))} */}
              {QCElements.map((row, index) => (
                <TableRow key={row.reagentName} className="text-center sm:h-[10%] border-none">
                  {/* <TableCell>
                    <Checkbox sx={{ '&.Mui-checked': {color: '#3A62A7'} }} checked={row.electrolyte} onChange={(e) => {
                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName)
                                  return { ...item, electrolyte: e.target.checked }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell> */}
                  <TableCell>
                    <div>{row.reagentName}</div>
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: renderSubString(row.Abbreviation) }} />
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
