import React, { useEffect, useMemo, useRef, useState } from "react"; //this is the test input page
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
} from "../components/ui/table";
import { CMP, Cardiac, Thyroid } from "../utils/MOCK_DATA";
import { renderSubString } from "../utils/utils";
import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";
import addData from "../utils/indexedDB/addData";
import { QCTemplateBatch } from "../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../utils/indexedDB/getData";
import { deleteData } from "../utils/indexedDB/deleteData";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  unit_of_measure: string;
  min_level: string;
  max_level: string;
  mean: string;
  std_devi: string;
  electrolyte: boolean;
}

const CustomQCBuild = (props: { name: string; link: string }) => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(true); 

  const [numRows, setNumRows] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const [QCElements, setQCElements] = useState<QCRangeElements[]>(CMP);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<QCTemplateBatch>();
  const [showFinalTable, setShowFinalTable] = useState(false); 
  const [showInputForm, setShowInputForm] = useState(true); 
  const saveQC: SubmitHandler<QCTemplateBatch> = async (data) => {
    const check = await getDataByKey<QCTemplateBatch>("qc_store", props.name);

    if (check) {
      const deleteStatus = await deleteData("qc_store", props.name);

      console.log(deleteStatus ? "Delete success" : "Delete failed");
    }

    const savedAnalyte = QCElements.map(
      ({
        analyteName,
        analyteAcronym,
        unit_of_measure,
        electrolyte,
        mean,
        std_devi,
        min_level,
        max_level,
      }) => ({
        analyteName,
        analyteAcronym,
        unit_of_measure,
        electrolyte,
        mean,
        std_devi,
        min_level,
        max_level,
      })
    );
    const res = await addData<QCTemplateBatch>("qc_store", {
      fileName: props.name,
      lotNumber: data.lotNumber || "",
      openDate: data.openDate || "",
      closedDate: data.closedDate || "",
      analytes: [...savedAnalyte],
    });

    console.log("Save result: ", res);
  };

  const inputRefs = useRef<HTMLInputElement[]>([]);

  function moveToNextInputOnEnter(e: React.KeyboardEvent) {
    if (
      e.key === "Enter" &&
      inputRefs.current.find((ele) => ele === e.target)
    ) {
      const currentFocus = inputRefs.current.find((ele) => ele === e.target);
      if (
        currentFocus &&
        inputRefs.current.indexOf(currentFocus) < inputRefs.current.length
      ) {
        const currentIndex = inputRefs.current.indexOf(currentFocus);
        inputRefs.current[currentIndex + 1]?.focus();
      } else return;
    }
  }

  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "electrolyte",
      header: "Electrolyte",
      cell: (info) => <></>,
    },
    {
      accessorKey: "analyteName",
      header: "Name",
      cell: (info) => <></>,
    },
    {
      accessorKey: "analyteAcronym",
      header: "Abbreviation",
      cell: (info) => (
        <></>
      ),
    },
    {
      accessorKey: "unit_of_measure",
      header: "Units of Measure",
      cell: (info) => (
        // <input type="text" className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center" value={QCElements.find((item) => item.unit_of_measure === info.getValue())?.unit_of_measure || ''} onChange={(e) => {
        //     e.preventDefault();

        //     setQCElements(prevState => {
        //         const newState = prevState.map(item => {
        //             if (item.analyteName === info.row.getAllCells().find(subItem => subItem.id.includes("analyteName"))?.getValue())
        //                 return { ...item, unit_of_measure: e.target.value }
        //             else return item
        //         })

        //         return newState
        //     })
        // }}/>
        <></>
      ),
    },
    {
      accessorKey: "min_level",
      header: "Min Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "max_level",
      header: "Max Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "mean",
      header: "QC Mean",
      cell: (info) => <></>,
    },
    {
      accessorKey: "std_devi",
      header: "Standard Deviation",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus1",
      header: "+1 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus1",
      header: "-1 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus2",
      header: "+2 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus2",
      header: "-2 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus3",
      header: "+3 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus3",
      header: "-3 SD",
      cell: (info) => <></>,
    },
  ];

  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    setQCElements(
      new Array(numRows)
        .fill({})
        .map(() => ({
          analyteName: "",
          analyteAcronym: "",
          unit_of_measure: "",
          min_level: "",
          max_level: "",
          mean: "",
          std_devi: "",
          electrolyte: false,
        }))
    );
  }, [numRows]);

  useEffect(() => {
    if (!checkSession() || checkUserType() === "student")
      navigate("/unauthorized");
  }, []);



  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setNumRows(value);
    setShowControls(false); 
    setDropdownVisible(false); 
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); 
  };







  useEffect(() => {
    (async () => {
      const res = await getDataByKey<QCTemplateBatch>("qc_store", props.name);

      if (res && typeof res !== "string") setQCElements(res.analytes);
    })();
  }, []);

  useEffect(() => {
    console.log(inputRefs);
  }, [inputRefs]);

  return (
    <>
      <div
        className={`bg-[${theme.primaryColor}] relative`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <Icon
          icon="fa6-solid:bars"
          className="absolute px-2 text-white text-5xl top-[20%] left-4 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
          onClick={() => openDrawer(true)}
        />
        <div className="navbar-title sm:leading-loose text-center text-white font-bold sm:text-4xl text-3xl my-0 mx-auto max-sm:w-1/2 max-sm:leading-10">
          {props.name} QC Builder
        </div>
        <div className="home-icon">
          <Link to="/home">
            <Icon
              icon="material-symbols:home"
              className="absolute p-1 text-white text-5xl top-[20%] right-16 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md"
            />
          </Link>
        </div>
        {isAuthenticated && (
          <div className="logout-icon">
            <Icon
              icon="mdi:logout"
              className="absolute text-white sm:text-5xl self-center sm:right-4 sm:top-4 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md p-1"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            />
          </div>
        )}
      </div>

      
      <div className="relative mt-8 sm:w-[94svw] sm:mx-auto bg-[#CFD5EA]">
        {" "}
        {/* This container should be relative */}
        {showControls && (
          <div
            className="relative top-0 left-0 right-0 flex flex-col items-center justify-center"
            style={{ zIndex: 2 }}
          >
            <ButtonBase
              onClick={toggleDropdown}
              className="!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[#C5E0B4] !border-[1px] !border-solid !border-[#6A89A0] transition ease-in-out hover:!bg-[#00B050] hover:!border-[#385723] hover:!border-[4px] !px-1"
              style={{ zIndex: 2, margin: 0, padding: 0 }} // Added margin and padding reset
            >
              <div className="font-bold text-2xl">
                {numRows === 0 ? "Select number of rows" : `Rows: ${numRows}`}
              </div>
            </ButtonBase>
            {dropdownVisible && (
              <select
                onChange={handleDropdownChange}
                className="!rounded-lg !bg-white !border-[1px] !border-solid !border-[#000000] !text-[#000000] !font-medium !text-lg !px-3 !py-2 !cursor-pointer !w-80"
                size={11}
                style={{ zIndex: 3, margin: 0, padding: 0 }} // Added margin and padding reset
              >
                <option value="0">Select number of rows</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                  <option key={number} value={number} className="text-center">
                    {number}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>


      
      {numRows !== 0 && showInputForm &&(
        <div className="basic-container relative sm:space-y-4 pb-24">
          <div className="table-container flex flex-col mt-8 sm:w-[40svw] sm:mx-auto w-[46svw] bg-[#CFD5EA] relative">
            <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200 w-full">
              <TableHeader>
                <TableRow className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7]">
                  <TableHead className="text-white text-center">
                    Analyte Name
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Analyte Abbreviation
                  </TableHead>
                </TableRow>
              </TableHeader>
             <TableBody
            >
                {Array(numRows).fill(null).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="text"
                        className="w-full p-2 border border-solid border-gray-300 rounded-md"
                        value={QCElements[index]?.analyteName || ""}
                        onChange={(e) => {
                          const newQCElements = [...QCElements];
                          newQCElements[index].analyteName = e.target.value;
                          setQCElements(newQCElements);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        className="w-full p-2 border border-solid border-gray-300 rounded-md"
                        value={QCElements[index]?.analyteAcronym || ""}
                        onChange={(e) => {
                          const newQCElements = [...QCElements];
                          newQCElements[index ].analyteAcronym = e.target.value;
                          setQCElements(newQCElements);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
         <ButtonBase
            onClick={() => {
              setShowFinalTable(true);  
              setShowInputForm(false);  
            }}
          className="Proceed-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
          >
            Proceed       
         </ButtonBase>
        </div>
      )}







      { numRows !==0  && showFinalTable && (<div className="final-container relative sm:space-y-4 pb-24">
        <div className="table-container flex flex-col mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
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
            <TableBody
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const minInputArray = inputRefs.current.filter(
                    (item) => inputRefs.current.indexOf(item) % 4 === 1
                  );

                  // console.log(minInputArray);

                  minInputArray.forEach((item) => {
                    if (
                      +inputRefs.current[inputRefs.current.indexOf(item) + 1]
                        .value < +item.value ||
                      item.value === "" ||
                      (inputRefs.current[inputRefs.current.indexOf(item) + 1]
                        .value === "0" &&
                        item.value === "0")
                    ) {
                      item.classList.remove("bg-green-500");
                      inputRefs.current[
                        inputRefs.current.indexOf(item) + 1
                      ].classList.remove("bg-green-500");
                      item.classList.add("bg-red-500");
                      inputRefs.current[
                        inputRefs.current.indexOf(item) + 1
                      ].classList.add("bg-red-500");
                    } else {
                      // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
                      item.classList.remove("bg-red-500");
                      inputRefs.current[
                        inputRefs.current.indexOf(item) + 1
                      ].classList.remove("bg-red-500");
                      item.classList.add("bg-green-500");
                      inputRefs.current[
                        inputRefs.current.indexOf(item) + 1
                      ].classList.add("bg-green-500");
                    }
                  });

                  setIsValid(
                    !inputRefs.current.some((item) =>
                      item.classList.contains("bg-red-500")
                    )
                  );
                  moveToNextInputOnEnter(e);
                }
              }}
            >
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
                <TableRow
                  key={row.analyteName}
                  className="text-center sm:h-[10%] border-none"
                >
                  <TableCell>
                    <Checkbox
                      sx={{ "&.Mui-checked": { color: "#3A62A7" } }}
                      checked={row.electrolyte}
                      onChange={(e) => {
                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (item.analyteName === row.analyteName)
                              return { ...item, electrolyte: e.target.checked };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>{row.analyteName}</div>
                  </TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderSubString(row.analyteAcronym),
                      }}
                    />
                  </TableCell>
                  <TableCell className="unit_of_measure">
                    <input
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4] = el;
                        }
                      }}
                      type="text"
                      className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={
                        row.unit_of_measure === ""
                          ? ""
                          : row.unit_of_measure.toString()
                      }
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^[a-zA-Z\/]+$/.test(e.target.value)
                            )
                              return {
                                ...item,
                                unit_of_measure: e.target.value,
                              };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="min_level">
                    <input
                      type="text"
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 1] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.min_level || ""}
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            ) {
                              return { ...item, min_level: e.target.value };
                            } else return item;
                          });

                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        // e.preventDefault();
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
                                const new_level = (+item.min_level)
                                  .toFixed(2)
                                  .replace(/^0+(?!\.|$)/, "");
                                return { ...item, min_level: new_level };
                              } else return item;
                            });

                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="max_level">
                    <input
                      type="text"
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 2] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.max_level || ""}
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            )
                              return { ...item, max_level: e.target.value };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        // e.preventDefault();
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
                                const new_level = (+item.max_level)
                                  .toFixed(2)
                                  .replace(/^0+(?!\.|$)/, "");
                                return { ...item, max_level: new_level };
                              } else return item;
                            });

                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="mean">
                    <input
                      type="text"
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 3] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.mean || ""}
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            )
                              return { ...item, mean: e.target.value };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                      onKeyDown={(e) => {
                        // e.preventDefault();
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
                                const new_level = (+item.mean)
                                  .toFixed(2)
                                  .replace(/^0+(?!\.|$)/, "");
                                return { ...item, mean: new_level };
                              } else return item;
                            });

                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="standard-deviation sm:w-32">
                    <div>
                      {((+row.max_level - +row.min_level) / 4).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+1 sm:w-20">
                    <div>
                      {(
                        +row.mean +
                        (+row.max_level - +row.min_level) / 4
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-1 sm:w-20">
                    <div>
                      {(
                        +row.mean -
                        (+row.max_level - +row.min_level) / 4
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+2 sm:w-20">
                    <div>
                      {(
                        +row.mean +
                        ((+row.max_level - +row.min_level) / 4) * 2
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-2 sm:w-20">
                    <div>
                      {(
                        +row.mean -
                        ((+row.max_level - +row.min_level) / 4) * 2
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+3 sm:w-20">
                    <div>
                      {(
                        +row.mean +
                        ((+row.max_level - +row.min_level) / 4) * 3
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-3 sm:w-20">
                    <div>
                      {(
                        +row.mean -
                        ((+row.max_level - +row.min_level) / 4) * 3
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* <TableRow className="flex justify-center">
                <ButtonBase>
                  <div className="text-2xl font-semibold text-white bg-[#3A62A7] rounded-lg p-2">
                    Add New Row
                  </div>
                </ButtonBase>
              </TableRow> */}
            </TableBody>
          </Table>
        </div>
        <ButtonBase
          disabled={!isValid}
          className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
          onClick={handleSubmit(saveQC)}
        >
          Save QC File
        </ButtonBase>
      </div>)}


      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => openDrawer(false)}
      >
        <div className="drawer-container sm:w-[18svw] sm:h-full bg-[#CFD5EA] flex flex-col items-center py-4 sm:space-y-6">
          <div className="filename-label sm:text-3xl font-semibold">
            {props.name}
          </div>
          {/* <div className="filename-input sm:w-[70%] flex flex-col items-center sm:space-y-2">
            <input type="text" name="filename" className="p-2 rounded-lg border border-solid border-[#548235] text-center"/>
          </div> */}
          <div className="lotnumber-input flex flex-col items-center sm:w-[86%] py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2">
            <div className="lotnumber-label sm:text-xl font-semibold text-white">
              QC Lot Number
            </div>
            <input
              type="text"
              className="p-1 rounded-lg border border-solid border-[#548235] text-center"
              {...register("lotNumber")}
            />
          </div>
          <div className="expiration-box sm:w-[86%] sm:h-64 bg-[#3A6CC6] rounded-xl">
            <div className="expiration-title w-full text-center font-semibold text-lg text-white py-1 bg-[#3A62A7] rounded-t-xl">
              Expiration date
            </div>
            <div className="divider-line w-full h-[1px] bg-black" />
            <div className="expiration-fields flex flex-col items-center py-2 sm:space-y-4">
              <div className="expiration-input sm:space-y-2">
                <div className="open-title text-center sm:text-lg text-white">
                  Open Date
                </div>
                <input
                  type="text"
                  className="p-1 rounded-lg border border-solid border-[#000] text-center"
                  {...register("openDate")}
                />
              </div>
              <div className="expiration-input sm:space-y-2">
                <div className="closed-title text-center sm:text-lg text-white">
                  Closed Date
                </div>
                <input
                  type="text"
                  className="p-1 rounded-lg border border-solid border-[#000] text-center"
                  {...register("closedDate")}
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CustomQCBuild;
