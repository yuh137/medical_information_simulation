import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Backdrop } from "@mui/material";
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
import {BFAnalytes, BFcrystals} from "../../../utils/UA_MOCK_DATA";
import { renderSubString } from "../../../utils/utils";
import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { QCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import NavBar from "../../../components/NavBar";
import { UABFtypeLinkList } from "../../../utils/UrinalysisUtils";


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


export const BFTestInputPage = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const initialData = 
    item?.includes('BFAnalytes_1') ? BFAnalytes :
    item?.includes('BFAnalytes_2') ? BFAnalytes :
    item?.includes('BFAnalytes_3') ? BFAnalytes :
    item?.includes('BFcrystals') ? BFcrystals :
    BFcrystals;
    
  console.log("DataType:", item);

  // Find the object with the matching link
  const matchingItem = UABFtypeLinkList.find(linkName => linkName.link === item);
  // Get the name or handle case when no match is found
  const matchingName = matchingItem ? matchingItem.name : "";
  const cleanedmatchingName = matchingName.replace(/[^\x20-\x7E]/g, "").trim();

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData );
  const [isValid, setIsValid] = useState<boolean>(false);
  // const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<QCTemplateBatch>();
  const [isSuccessNotiOpen, setSuccessNotiOpen] = useState(false);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store the specific error message

  const saveQC: SubmitHandler<QCTemplateBatch> = async (data) => {
    const qcDataToSave: QCTemplateBatch = {
        fileName: data.fileName || "",
        lotNumber: data.lotNumber || "",
        openDate: data.openDate || "",
        closedDate: data.closedDate || "",
        analytes: QCElements.map(({ analyteName, analyteAcronym, unit_of_measure, electrolyte, mean, std_devi, min_level, max_level }) => ({
            analyteName, analyteAcronym, unit_of_measure, electrolyte, mean, std_devi, min_level, max_level
        })),
    };

    // Transform structure to match API requirements
    const qcDataForAPI = {
      ...qcDataToSave,
      QCName: data.fileName || "",
      analytes: qcDataToSave.analytes.map((analyte) => ({
          ...analyte,
          UnitOfMeasure: analyte.unit_of_measure, // Convert for API
          maxLevel: analyte.max_level,
          minLEvel: analyte.min_level,
          stdDevi: analyte.std_devi,
      })),
  };

  console.log("Attempting to save:", qcDataForAPI);

  try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(qcDataForAPI),
      });

      if (response.ok) {
        setSuccessNotiOpen(true); // Show success notification
        console.log("Data saved successfully.");
      } else {
        const errorText = await response.text();
        setErrorNotiOpen(true); // Show error notification
        setErrorMessage(`Failed to save data: ${errorText}`);
        console.error("Failed to save data:", errorText);
      }
  } catch (error) {
      console.error("Failed to save data:", error);
  }

  // Saving to LocalStorage
    // try {
    //     await saveToDB("qc_store", qcDataToSave);
    //     console.log("Data saved successfully.");
    // } catch (error) {
    //     console.error("Failed to save data:", error);
    // }
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
      accessorKey: "unit_of_measure",
      header: "Units of Measure",
      cell: (info) => (
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
    if (!checkSession() || checkUserType() === "Student") {}
      // navigate("/unauthorized");
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getDataByKey<QCTemplateBatch>("qc_store", props.name);

      if (res && typeof res !== "string") setQCElements(res.analytes)
    })()
  }, [])

  useEffect(() => {
    console.log(QCElements);
  }, [QCElements]);

  return (
    <>
         <NavBar name={`Body Fluids QC Builder(Levey-Jennings)`} />
      <div className="basic-container relative sm:space-y-2 pb-18">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-4">
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC File Name</div>
              <input type="text" readOnly defaultValue={cleanedmatchingName} className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("fileName")} />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Lot Number</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("lotNumber")} />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Expiration Date</div>
              <input type="date" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("closedDate")} pattern="\d{2}/\d{2}/\d{4}" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Open Date</div>
              <input type="date" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("openDate")} pattern="\d{2}/\d{2}/\d{4}" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Closed Date</div>
              <input type="date" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("closedDate")} pattern="\d{2}/\d{2}/\d{4}" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="basic-container relative sm:space-y-2 pb-18">
        {/* Container for report type buttons */}
        
        <div className="mb-4">
          <h3 className="text-lg font-bold text-center">Report Type</h3>
          <div className="flex justify-center space-x-4 mt-2">
            {/* Button to navigate to LevyJennis version */}

            
            

            <Link to={`/UA_fluids/BFEdit_qc/levyjennings/${item}`}>
              <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
              Levey-Jennings
              </ButtonBase>
          </Link>

            {/* Button to come back to the Qualitative page */}
            <Link to={`/UA_fluids/BFEdit_qc/${item}`}>
              <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
              Qualitative
              </ButtonBase>
          </Link>
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
                <TableRow key={row.analyteName} className="text-center sm:h-[10%] border-none">
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
                    <div>{row.analyteName}</div>
                  </TableCell>
                  <TableCell>
                    <div dangerouslySetInnerHTML={{ __html: renderSubString(row.analyteAcronym) }} />
                  </TableCell>
                  <TableCell className="unit_of_measure">
                    <input ref={el => {if (el && inputRefs.current.length < QCElements.length * 4) {inputRefs.current[index * 4] = el}}} type="text" className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.unit_of_measure === "" ? "" : row.unit_of_measure.toString()} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^[a-zA-Z\/]+$/.test(e.target.value))
                                  return { ...item, unit_of_measure: e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}/>
                  </TableCell>
                  <TableCell className="min_level">
                    <input type="text" ref={el => {if (el && inputRefs.current.length < QCElements.length * 4) {inputRefs.current[index * 4 + 1] = el}}} className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.min_level || ''} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value)) {
                                return { ...item, min_level: e.target.value }
                              }
                              else return item
                          })
          
                          return newState
                      })
                    }}
                    onKeyDown={(e) => {
                      // e.preventDefault();
                      if (e.key === 'Enter') {
                        console.log(e.currentTarget.value)
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                                if (item.analyteName === row.analyteName) {
                                  const new_level = (+item.min_level).toFixed(2).replace(/^0+(?!\.|$)/, "");
                                  return { ...item, min_level: new_level }
                                }
                                else return item
                            })
            
                            return newState
                        })
                      }
                    }}/>
                  </TableCell>
                  <TableCell className="max_level">
                    <input type="text" ref={el => {if (el && inputRefs.current.length < QCElements.length * 4) {inputRefs.current[index * 4 + 2] = el}}} className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.max_level || ''} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value))
                                  return { ...item, max_level: e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}
                    onKeyDown={(e) => {
                      // e.preventDefault();
                      if (e.key === 'Enter') {
                        console.log(e.currentTarget.value)
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                                if (item.analyteName === row.analyteName) {
                                  const new_level = (+item.max_level).toFixed(2).replace(/^0+(?!\.|$)/, "");
                                  return { ...item, max_level: new_level }
                                }
                                else return item
                            })
            
                            return newState
                        })
                      }
                    }}/>
                  </TableCell>
                  <TableCell className="mean">
                  <input type="text" ref={el => {if (el && inputRefs.current.length < QCElements.length * 4) {inputRefs.current[index * 4 + 3] = el}}} className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center" value={row.mean || ''} onChange={(e) => {
                      e.preventDefault();

                      setQCElements(prevState => {
                          const newState = prevState.map(item => {
                              if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value))
                                  return { ...item, mean: e.target.value }
                              else return item
                          })
          
                          return newState
                      })
                    }}
                    onKeyDown={(e) => {
                      // e.preventDefault();
                      if (e.key === 'Enter') {
                        console.log(e.currentTarget.value)
                          setQCElements(prevState => {
                            const newState = prevState.map(item => {
                                if (item.analyteName === row.analyteName) {
                                  const new_level = (+item.mean).toFixed(2).replace(/^0+(?!\.|$)/, "");
                                  return { ...item, mean: new_level }
                                }
                                else return item
                            })
            
                            return newState
                        })
                      }
                    }}/>
                  </TableCell>
                  <TableCell className="standard-deviation sm:w-32">
                    <div>{((+row.max_level - +row.min_level)/4).toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="sd+1 sm:w-20">
                    <div>{(+row.mean + (+row.max_level - +row.min_level)/4).toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="sd-1 sm:w-20">
                    <div>{(+row.mean - (+row.max_level - +row.min_level)/4).toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="sd+2 sm:w-20">
                    <div>{(+row.mean + ((+row.max_level - +row.min_level)/4) * 2).toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="sd-2 sm:w-20">
                    <div>{(+row.mean - ((+row.max_level - +row.min_level)/4) * 2).toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="sd+3 sm:w-20">
                    <div>{(+row.mean + ((+row.max_level - +row.min_level)/4) * 3).toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="sd-3 sm:w-20">
                    <div>{(+row.mean - ((+row.max_level - +row.min_level)/4) * 3).toFixed(2)}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ButtonBase className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold" onClick={handleSubmit(saveQC)}>
          Save QC File
        </ButtonBase>
      </div>
      <Backdrop open={isSuccessNotiOpen || isErrorNotiOpen} onClick={() => {
        setSuccessNotiOpen(false);
        setErrorNotiOpen(false);
      }}>
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              {isSuccessNotiOpen ? (
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>Data Saved Successfully</div>
                  </div>
                </>
              ) : isErrorNotiOpen ? (
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>{errorMessage}</div> {/* Display the specific error message */}
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setSuccessNotiOpen(false);
                  setErrorNotiOpen(false);
                }}
                className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
    </>
  );
};
