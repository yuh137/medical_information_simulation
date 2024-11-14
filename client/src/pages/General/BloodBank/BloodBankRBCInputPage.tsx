import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { saveToDB } from "../../../utils/indexedDB/getData";
import { bloodBankRBC_QC } from "../../../utils/utils";
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
import { kell, rh,duffy, p1, lutheran, mnss, lewis} from "../../../utils/BB_DATA";
import { renderSubString } from "../../../utils/utils";
import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { BloodBankRBC } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import { Button, Backdrop } from "@mui/material";
import NavBar from "../../../components/NavBar";

interface QCRangeElements {
  reagentName: string,
  Abbreviation: string,
  AntiSeraLot: string,
  reagentExpDate: string,
  ExpImmSpinRange: string,
  Exp37Range: string,
  ExpAHGRange: string,
  ExpCheckCellsRange: string
}

// This is used to get what the file name should be from the link
function NameFromLink(link: string): string {
  for (let item of bloodBankRBC_QC) {
    let link_name: string = item["link"];
    if (link_name === link) {
      return item["name"];
    }
  }
  return link;
}

export const BloodBankRBCEdit = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const fileName_Item = item || "default_file_name";
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const initialData = item?.includes("Rh") ? rh :item?.includes("Duffy") ? duffy:item?.includes("P1") ? p1:item?.includes("Lutheran") ? lutheran:item?.includes("MNSs") ? mnss:item?.includes("Lewis") ? lewis: kell;
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);  // For feedback
  console.log("DataType:", item);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isHeaderValid, setHeaderValid] = useState<boolean>(false);
  // const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const validValues = ["W+", "1+", "2+", "3+", "4+", "H+", "0", "TNP"]

  const { setValue, register, handleSubmit,watch } = useForm<BloodBankRBC>();
  const lotNumber = watch("lotNumber");
  const qcExpDate = watch("qcExpDate");
  const openDate = watch("openDate");
  const closedDate = watch("closedDate");
  const reportType = watch("reportType");

  useEffect(() => {
    // Disable the button if any required field is empty
    const isAnyFieldEmpty = !lotNumber || !qcExpDate || !openDate || !closedDate || !reportType;
    setHeaderValid(!isAnyFieldEmpty);
  }, [lotNumber, qcExpDate, openDate, closedDate,reportType]);
  
  const saveQC: SubmitHandler<BloodBankRBC> = async (data) => {
    const qcDataToSave: BloodBankRBC = {
      fileName: NameFromLink(fileName_Item), // fileName_Item,
      lotNumber: data.lotNumber || "",
      qcExpDate: data.qcExpDate || "",
      openDate: data.openDate || "",
      closedDate: data.closedDate || "",
      reportType: data.reportType || "",
      reagents: QCElements.map(({ reagentName, Abbreviation, AntiSeraLot, reagentExpDate, ExpImmSpinRange, Exp37Range, ExpAHGRange, ExpCheckCellsRange }) => ({ reagentName, Abbreviation, AntiSeraLot, reagentExpDate, ExpImmSpinRange, Exp37Range, ExpAHGRange, ExpCheckCellsRange })),
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
  const validateInput = () => {
    const minInputArray = inputRefs.current;

    minInputArray.forEach((item, index) => {
      const inputValue = item.value.trim();
      // Check if the input value is blank
      if (inputValue === '') {
        item.classList.remove('bg-yellow-500');
        item.classList.add('bg-red-500'); // Add red background if blank

      }
      else if (
        (index % 6 >= 2 &&
        !validValues.includes(inputValue))||         // Invalid for other values
        (item.name==="ExpectedCheckCells" && inputValue==="0") // Invalid for other values

      ) {
        item.classList.remove('bg-red-500'); 
        item.classList.add('bg-yellow-500'); // Add yellow background for invalid input
      } else {
        // Remove background if input is valid
        item.classList.remove('bg-red-500');
        item.classList.remove('bg-yellow-500');
      }
    });

    // Set isValid based on whether any invalid (red or yellow) inputs exist
    setIsValid(!inputRefs.current.some(
      item => item.classList.contains('bg-red-500') || item.classList.contains('bg-yellow-500')
    ));
  };
  const columns: ColumnDef<QCRangeElements, string>[] = [

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
    if (isFeedbackNotiOpen) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);
      }, 4000);
    }
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
              <input
                type="text"
                className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center"
                {...register("lotNumber")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Perform an action, like focusing the next input
                    document.getElementById("qcExpDateInput")?.focus();
                  }
                }}
              />
            </div>

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Exp. Date</div>
              <input
                id="qcExpDateInput" // Assign an ID to this input to focus later
                type="text"
                placeholder="mm/dd/yyyy"
                maxLength={10} // Limits input to mm/dd/yyyy format
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  if (input.length >= 3 && input.length <= 4) {
                    input = input.slice(0, 2) + "/" + input.slice(2); // Insert first /
                  } else if (input.length >= 5) {
                    input = input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4); // Insert second /
                  }
                  e.target.value = input;
                  setValue("qcExpDate", input); // Set formatted date for react-hook-form
                }}
                className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Move focus to the next field (Open Date)
                    document.getElementById("openDateInput")?.focus();
                  }
                }}
              />
            </div>

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Open Date</div>
              <input
                id="openDateInput" // Assign an ID to this input
                type="text"
                placeholder="mm/dd/yyyy"
                maxLength={10} // Limits input to mm/dd/yyyy format
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  if (input.length >= 3 && input.length <= 4) {
                    input = input.slice(0, 2) + "/" + input.slice(2); // Insert first /
                  } else if (input.length >= 5) {
                    input = input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4); // Insert second /
                  }
                  e.target.value = input;
                  setValue("openDate", input); // Set formatted date for react-hook-form
                }}
                className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Move focus to the next field (Closed Date)
                    document.getElementById("closedDateInput")?.focus();
                  }
                }}
              />
            </div>

            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Closed Date</div>
              <input
                id="closedDateInput" // Assign an ID to this input
                type="text"
                placeholder="mm/dd/yyyy"
                maxLength={10} // Limits input to mm/dd/yyyy format
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  if (input.length >= 3 && input.length <= 4) {
                    input = input.slice(0, 2) + "/" + input.slice(2); // Insert first /
                  } else if (input.length >= 5) {
                    input = input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4); // Insert second /
                  }
                  e.target.value = input;
                  setValue("closedDate", input); // Set formatted date for react-hook-form
                }}
                className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Perform the desired action when Enter is pressed (e.g., submit the form)
                    e.preventDefault(); // Prevent form submission if you're doing other actions
                    console.log("Form submitted or another action here!");
                  }
                }}
              />
            </div>



            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-4 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Report Type:</div>
              <div className="flex space-x-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="qualitative"
                    className="form-radio text-[#548235] focus:ring-[#3A6CC6]"{...register("reportType")}
                  />
                  <span className="ml-2 text-white">Qualitative</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="levey-jennings"
                    className="form-radio text-[#548235] focus:ring-[#3A6CC6]"{...register("reportType")}
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
            <TableBody
              onKeyDown={(e) => {
                validateInput();
                moveToNextInputOnEnter(e);
              }
              }
              onBlur={(e) => {
                validateInput();
              }}
              onChange={(e)=>{
                validateInput();
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
                                const new_level = item.AntiSeraLot;

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

                      maxLength={10}
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 1] = el;
                        }
                      }}
                      className="sm:w-21.5 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.reagentExpDate || ''}
                      onChange={(e) => {
                        e.preventDefault();

                        // Format the date input with slashes
                        let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                        if (input.length >= 3 && input.length <= 4) {
                          input = input.slice(0, 2) + "/" + input.slice(2); // Insert first /
                        } else if (input.length >= 5) {
                          input = input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4); // Insert second /
                        }

                        // Update the value of the input field
                        e.target.value = input;

                        // Update state with the formatted date
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, reagentExpDate: input }; // Set formatted date
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
                                const expValue = item.reagentExpDate.trim();
                                return { ...item, reagentExpDate: expValue };
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
                      maxLength={4} // Limit input to 4 characters
                      placeholder="0,W+,H+,1-4+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 2] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpImmSpinRange || ''}
                      onChange={(e) => {

                        e.preventDefault();
                        const input = e.target.value.slice(0, 4); // Ensure max 4 characters
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpImmSpinRange: input };
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
                                const ExpImmSpinRange = item.ExpImmSpinRange.trim();
                                return { ...item, ExpImmSpinRange };
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
                      maxLength={4} // Limit input to 4 characters
                      placeholder="0,W+,H+,1-4+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 3] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.Exp37Range || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        const input = e.target.value.slice(0, 4); // Ensure max 4 characters
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, Exp37Range: input };
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
                                return { ...item, Exp37Range };
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
                      maxLength={4} // Limit input to 4 characters
                      placeholder="0,W+,H+,1-4+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 4] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpAHGRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        const input = e.target.value.slice(0, 4); // Ensure max 4 characters
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpAHGRange: input };
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
                                const ExpAHGRange = item.ExpAHGRange.trim();
                                return { ...item, ExpAHGRange };
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
                      name = "ExpectedCheckCells"
                      maxLength={4} // Limit input to 4 characters
                      placeholder="0,W+,H+,1-4+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 5] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpCheckCellsRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        const input = e.target.value.slice(0, 4); // Ensure max 4 characters
                        setQCElements(prevState => {
                          const newState = prevState.map(item => {
                            if (item.reagentName === row.reagentName) {
                              return { ...item, ExpCheckCellsRange: input };
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
                                const ExpCheckCellsRange = item.ExpCheckCellsRange.trim();
                                return { ...item, ExpCheckCellsRange };
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
        <ButtonBase
          className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
          onClick={async () => {
            handleSubmit(saveQC)();

            setFeedbackNotiOpen(true);
          }}
          disabled={!isValid || !isHeaderValid}>

          Save QC File
        </ButtonBase>
      </div>
      <Backdrop // OK BACKDROP
        open={isFeedbackNotiOpen}

        onClick={() => {
          setFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              {
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>Successfully Saved</div>
                  </div>
                </>
              }
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setFeedbackNotiOpen(false);
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
