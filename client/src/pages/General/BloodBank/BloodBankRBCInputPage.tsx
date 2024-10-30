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
import { kell, rh } from "../../../utils/BB_DATA";
import { renderSubString } from "../../../utils/utils";
import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { BloodBankRBC } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import NavBar from "../../../components/NavBar";

interface QCRangeElements {
  reagentName:string,
  Abbreviation:string,
  AntiSeraLot:string,
  ExpDate:string,
  ExpImmSpinRange:string,
  Exp37Range:string,
  ExpAHGRange:string,
  ExpCheckCellsRange:string
}


export const BloodBankRBCEdit = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const initialData = item?.includes("Rh") ? rh : kell;
  console.log("DataType:", item);

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState<boolean>(false);
  // const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<BloodBankRBC>();
  const saveQC: SubmitHandler<BloodBankRBC> = async (data) => {
    const qcDataToSave: BloodBankRBC = {
      fileName: props.name,
      lotNumber: data.lotNumber || "",
      expDate: data.expDate || "",
      openDate: data.openDate || "",
      closedDate: data.closedDate || "",
      reportType: data.reportType || "",
      reagents: QCElements.map(({reagentName,Abbreviation,AntiSeraLot,ExpDate,ExpImmSpinRange,Exp37Range,ExpAHGRange, ExpCheckCellsRange}) => ({reagentName,Abbreviation,AntiSeraLot,ExpDate,ExpImmSpinRange,Exp37Range,ExpAHGRange, ExpCheckCellsRange})),
    };
//reagentName:string,
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
      header: "Reagents",
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
      accessorKey: "AntiSeraLot",
      header: "Anti-Sera Lot #",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "ExpDate",
      header: "Exp. Date",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "ExpImmSpinRange",
      header: "Expected Immediate Spin Range",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "Exp37Range",
      header: "Expected 37 Degrees Range",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "ExpAHGRange",
      header: "Expected AHG Range",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "ExpCheckCellsRange",
      header: "Expected Check Cells Range",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    }
  ];

  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student") { }
    // navigate("/unauthorized");
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getDataByKey<BloodBankRBC>("qc_store", props.name);

      if (res && typeof res !== "string") setQCElements(res.reagents)
    })()
  }, [])

  useEffect(() => {
    console.log(QCElements);
  }, [QCElements]);

  return (
    <>
      <NavBar name={`Blood Bank QC Builder`} />
      <div className="basic-container relative sm:space-y-5 pb-20 ">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-5">

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC File Name:</div>
              <div className="p-1 sm:w-[250px] text-center font-semibold text-white sm:w-[170px]">{item}</div>
            </div>

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Lot Number</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center" {...register("lotNumber")} />
            </div>

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Exp. Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center" {...register("expDate")} />
            </div>

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Open Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center" {...register("openDate")} />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Close Date</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center" {...register("closedDate")} />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-4 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Report Type:</div>
              <div className="flex space-x-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="qualitative"
                    className="form-radio text-[#548235] focus:ring-[#3A6CC6]"
                    {...register("reportType")}
                  />
                  <span className="ml-2 text-white">Qualitative</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="levey-jennings"
                    className="form-radio text-[#548235] focus:ring-[#3A6CC6]"
                    {...register("reportType")}
                  />
                  <span className="ml-2 text-white">Levey-Jennings</span>
                </label>
              </div>
            </div>
          </div>



        </div>
        <div className="table-container flex flex-col mt-5 sm:w-[94svw]  sm:mx-auto w-100svw bg-[#CFD5EA] relative">
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
                // const minInputArray = inputRefs.current.filter(item => inputRefs.current.indexOf(item) % 4 === 1);

                // minInputArray.forEach(item => {
                //   if (+inputRefs.current[inputRefs.current.indexOf(item) + 1].value < +item.value || item.value === '' || (inputRefs.current[inputRefs.current.indexOf(item) + 1].value === '0' && item.value === '0')) {
                //     item.classList.remove('bg-green-500');
                //     inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-green-500');
                //     item.classList.add('bg-red-500');
                //     inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-red-500');
                //   } else {
                //     // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
                //     item.classList.remove('bg-red-500');
                //     inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-red-500');
                //     item.classList.add('bg-green-500');
                //     inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-green-500');
                //   }
                // });

                // setIsValid(!inputRefs.current.some(item => item.classList.contains("bg-red-500")));
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
                <TableRow key={row.reagentName} className="text-center sm:h-[10%] border-none">
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: renderSubString(row.reagentName) }} />
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: renderSubString(row.Abbreviation) }} />
                  </TableCell>
                  <TableCell className="anti-sera">
                    <input
                      type="text"
                      ref={(el) => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.AntiSeraLot || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.reagentName === row.reagentName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            ) {
                              return { ...item, AntiSeraLot: e.target.value };
                            } else return item;
                          });
                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.reagentName === row.reagentName) {
                                const new_level = (+item.AntiSeraLot)
                                  .toFixed(2)
                                  .replace(/^0+(?!\.|$)/, '');
                                return { ...item, AntiSeraLot: new_level };
                              } else return item;
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="ExpDate">
                    <input
                      type="text"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6 ) {
                          inputRefs.current[index * 6 + 1] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpDate || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpDate: e.target.value };
                            }
                            return item;
                          });
                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                              if (item.reagentName === row.reagentName) {
                                const newDate = item.ExpDate.trim();
                                return { ...item, ExpDate: newDate }; // Removing unnecessary spaces
                              }
                              return item;
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="expImmSpin">
                    <input
                      type="text"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6 ) {
                          inputRefs.current[index * 6 + 2] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpImmSpinRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpImmSpinRange: e.target.value };
                            }
                            return item;
                          });
                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                              if (item.reagentName === row.reagentName) {
                                const ExpImmValue = item.ExpImmSpinRange.trim();
                                return { ...item, ExpImmSpinRange: ExpImmValue }; // Removing unnecessary spaces
                              }
                              return item;
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="Exp37Range">
                    <input
                      type="text"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 3] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.Exp37Range || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, Exp37Range: e.target.value };
                            }
                            return item;
                          });
                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                              if (item.reagentName === row.reagentName) {
                                const Exp37Range = item.Exp37Range.trim();
                                return { ...item, Exp37Range: Exp37Range }; // Removing unnecessary spaces
                              }
                              return item;
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="ExpAHG">
                    <input
                      type="text"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 4] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpAHGRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpAHGRange: e.target.value };
                            }
                            return item;
                          });
                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                              if (item.reagentName === row.reagentName) {
                                const ExpAHGRange_value = item.ExpAHGRange.trim();
                                return { ...item, ExpAHGRange: ExpAHGRange_value }; // Removing unnecessary spaces
                              }
                              return item;
                            });
                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="ExpectedCheckCells">
                    <input
                      type="text"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 5] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpCheckCellsRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpCheckCellsRange: e.target.value };
                            }
                            return item;
                          });
                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                              if (item.reagentName === row.reagentName) {
                                const ExpCheckCellsRange_value = item.ExpCheckCellsRange.trim();
                                return { ...item, ExpCheckCellsRange: ExpCheckCellsRange_value }; // Removing unnecessary spaces
                              }
                              return item;
                            });
                            return newState;
                          });
                        }
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
