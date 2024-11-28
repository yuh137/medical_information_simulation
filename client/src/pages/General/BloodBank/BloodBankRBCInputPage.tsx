import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { saveToDB } from "../../../utils/indexedDB/getData";
import { bloodBankRBC_QC } from "../../../utils/utils";
import { qcData } from "../../../utils/BB_QC";
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
import { kell, rh,duffy, p1, lutheran, mnss, lewis, TWO_CELL, THREE_CELL} from "../../../utils/BB_DATA";
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
import { BloodBankQCLot } from "../../../utils/indexedDB/IDBSchema";
import { bloodBankQC } from "../../../utils/utils";
import { ExpandIcon } from "lucide-react";

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

interface QCDataDict {
  [key: string]: QCRangeElements[];
}

// This is used to get what the file name should be from the link
function NameFromLink(link: string): string {
  console.log(link);
  for (let item of bloodBankRBC_QC) {
    let link_name: string = item["link"];
    if (link_name === link) {
      const qcName: string = item["name"];
      const result: string = qcName.substring(0, qcName.indexOf(" QC"));
      return result;
    }
  }
  for (let item of bloodBankQC) {
    let link_name: string = item["link"];
    if (link_name === link) {
      const qcName: string = item["name"];
      return qcName;
    }
  }
  return link;
}

// To change the date format to what is needed for back-end requests
function formatDate(dateString: string): string {
  // Split the input string by "/"
  const [month, day, year] = dateString.split("/");

  // Goes to YYYY-MM-DD
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}


// Compares two dates to see if the second one comes after
function dateAfter(dateString1: string, dateString2: string): boolean {
  if (!validateDate(dateString1) || !validateDate(dateString2)) {
    return false;
  }
  const [month, day, year] = dateString1.split("/");
  let monthD1 = +month;
  let dayD1 = +day;
  let yearD1 = +year;
  const [month2, day2, year2] = dateString2.split("/");
  let monthD2 = +month2;
  let dayD2 = +day2;
  let yearD2 = +year2;
  if (yearD2 > yearD1) {
    return true;
  }
  if (yearD2 < yearD1) {
    return false;
  }
  if (monthD2 > monthD1) {
    return true;
  }
  if (monthD1 < monthD2) {
    return false;
  }
  return dayD2 >= dayD1;
}

// Changes from default date format to //
function unformatDate(dateString: string): string {
  const subDate = dateString.substring(0, dateString.indexOf("T"));
  const [year, month, day] = subDate.split("-");
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
}

function validateDate(dateString: string): boolean {
  const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    
  const [month, day, year] = dateString.split("/");
  if (month == null || day == null || year == null) {
    return false;
  }
  if (month.length != 2 || day.length != 2 || year.length != 4) {
      return false;
  }
  let monthD: number = +month;
  if (monthD < 1 || monthD > 12) {
      return false;
  }
  let dayD: number = +day;
  if (dayD < 1 || dayD > monthDays[monthD - 1]) {
      return false;
  }
  let yearD: number = +year;
  if (yearD < 2000 || yearD > 2040) {
      return false;
  }
  return true;
}


export const BloodBankRBCEdit = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const loaderData = useLoaderData() as string;
  const fileName_Item = item || "default_file_name";
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const initialData = item?.includes("Rh") ? rh :item?.includes("Duffy") ? duffy:item?.includes("P1") ? p1:item?.includes("Lutheran") ? lutheran:item?.includes("MNSs") ? mnss:item?.includes("Lewis")?lewis: item?.includes("Two") ? TWO_CELL : item?.includes("Three")? THREE_CELL : kell;
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);  // For feedback
  console.log("DataType:", item);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isHeaderValid, setHeaderValid] = useState<boolean>(false);
  // const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const validValues = ["W+", "1+", "2+", "3+", "4+", "H+", "0", "TNP"];
  const partialValues = ["W", "1", "2", "3", "4", "H", "T", "TN"];

  const { setValue, register, handleSubmit,watch } = useForm<BloodBankRBC>();
  const lotNumber = watch("lotNumber");
  const qcExpDate = watch("qcExpDate");
  const openDate = watch("openDate");
  const closedDate = watch("closedDate");
  const reportType = watch("reportType");

  useEffect(() => {
    // Disable the button if any required field is empty
    inputRefs.current = [];
    const isAnyFieldEmpty = !lotNumber || !qcExpDate || !openDate || !closedDate || !reportType;
    let todayDate = unformatDate(new Date().toISOString());
    setHeaderValid(!isAnyFieldEmpty && dateAfter(todayDate, qcExpDate) && dateAfter(openDate, closedDate));
  }, [lotNumber, qcExpDate, openDate, closedDate,reportType]);
  
  function getReagents(){
    const rows = table.getRowModel().rows;
    const reagents: dbReagent[] = [];
    console.log(QCElements);
    QCElements.forEach(function (row) {  // Iterate through each row of the React Table
     const reag: dbReagent = {reagentName: row['reagentName'], abbreviation: row['Abbreviation'], reagentLotNum: row['AntiSeraLot'], expirationDate: formatDate(row['reagentExpDate']), immediateSpin: row['ExpImmSpinRange'], thirtySevenDegree: row['Exp37Range'], checkCell: row['ExpCheckCellsRange'], aHG: row['ExpAHGRange']};
      reagents.push(reag);
    })
    return reagents;
  }

  const saveQC: SubmitHandler<BloodBankRBC> = async (data) => {
    getReagents();
    const reags = getReagents();
    const qcLotName = NameFromLink(fileName_Item);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots/ByName?name=${qcLotName}`);
      console.log(res);
      if (res.ok) { // It already exists, so update the existing one!
        const savedQCItem: BloodBankQCLot = await res.json();
        const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots/UpdateQCLot/${savedQCItem.bloodBankQCLotID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'  
          },
          body: JSON.stringify({ qcName: qcLotName, lotNumber: data.lotNumber, openDate: formatDate(data.openDate), closedDate: formatDate(data.closedDate), expirationDate: formatDate(data.qcExpDate), reagents: reags }),
          })
        console.log(checkServer);
      } else { // This does not exist, so create one
        const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'  // application/json
          },
          body: JSON.stringify({ qcName: qcLotName, lotNumber: data.lotNumber, openDate: formatDate(data.openDate), closedDate: formatDate(data.closedDate), expirationDate: formatDate(data.qcExpDate), reagents: reags }),  
        })
        console.log(checkServer);
      }
    } catch (e) {
      console.log("Request to get QC lot failed: ", e);
    }
    
    /*
    getReagents();
    const reags = getReagents();
    const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'  // application/json
      },
      body: JSON.stringify({ qcName: fileName_Item, lotNumber: data.lotNumber, openDate: formatDate(data.openDate), closedDate: formatDate(data.closedDate), expirationDate: formatDate(data.qcExpDate), reagents: reags }),
      })
    console.log(checkServer);
    */
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
        item.classList.remove('bg-red-500');
        item.classList.add('bg-yellow-500'); // Add red background if blank
      }
      else if (index % 6 == 1 && !validateDate(inputValue)) {
        item.classList.remove('bg-red-500'); 
        item.classList.add('bg-yellow-500'); // Add yellow background for invalid date
      }
      else if (index % 6 >= 2 && partialValues.includes(inputValue)) {
        item.classList.remove('bg-red-500'); 
        item.classList.add('bg-yellow-500'); // Add yellow background for incomplete value
      }
      else if (index % 6 >= 2 && !validValues.includes(inputValue)) {
        item.classList.remove('bg-yellow-500'); 
        item.classList.add('bg-red-500'); // Add red background for invalid value
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
      header: "Reagent Lot #",
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

  interface dbReagent {  // Used to add reagents in JSON format
    reagentName: string,
    abbreviation: string,
    reagentLotNum: string,
    expirationDate: string,
    // posExpectedRange: string,
    // negExpectedRange: string
    immediateSpin: string,
    thirtySevenDegree: string,
    aHG: string,
    checkCell: string
  }

  useEffect(() => {
    (async () => {
      console.log(item);
      if (item != null) {
        const adjName: string = item.replace(" ", "").replace("_","");
        const dataDict: QCDataDict = qcData; // Type-check the structure
        if (adjName in dataDict) {
          const reagents: QCRangeElements[] = dataDict[adjName as keyof typeof dataDict];
          setQCElements(reagents);
        }
      } 
      // const res = await getDataByKey<BloodBankRBC>("qc_store", props.name);

      // if (res && typeof res !== "string") setQCElements(res.reagents)
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
                      maxLength={3} // Limit input to 4 characters
                      placeholder="1+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 2] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpImmSpinRange || ''}
                      onChange={(e) => {

                        e.preventDefault();
                        const input = e.target.value.slice(0, 8); // Ensure max 4 characters
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
                      maxLength={3} // Limit input to 4 characters
                      placeholder="1+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 3] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.Exp37Range || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        const input = e.target.value.slice(0, 8); // Ensure max 8 characters
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
                      maxLength={3} // Limit input to 4 characters
                      placeholder="1+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 4] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpAHGRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        const input = e.target.value.slice(0, 8); // Ensure max 8 characters
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
                      maxLength={3} // Limit input to 8 characters
                      placeholder="1+"
                      ref={el => {
                        if (el && inputRefs.current.length < QCElements.length * 6) {
                          inputRefs.current[index * 6 + 5] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.ExpCheckCellsRange || ''}
                      onChange={(e) => {
                        e.preventDefault();
                        const input = e.target.value.slice(0, 8); // Ensure max 8 characters
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
