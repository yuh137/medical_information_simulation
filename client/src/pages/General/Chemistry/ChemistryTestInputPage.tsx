import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  ColumnDef,
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
import {
  CMP,
  Cardiac,
  Thyroid,
  Liver,
  Lipid,
  Iron,
  Drug,
  Hormone,
  Cancer,
  Pancreatic,
  Vitamins,
  Diabetes,
} from "../../../utils/MOCK_DATA";
import { DefinedRequestError, Department, ErrorCode, qcTypeLinkList, renderSubString } from "../../../utils/utils";
import { Backdrop, Button, ButtonBase } from "@mui/material";
import { AdminQCLot } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import NavBar from "../../../components/NavBar";
import { DatePicker } from "antd";
import { Icon } from "@iconify/react";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "../../../context/ThemeContext";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minLevel: string;
  maxLevel: string;
  mean: string;
  stdDevi: string;
}

// Manage what type of notifications are displayed
enum NotiType {
  SaveQC,
  QCAlreadyExist,
  LotNumberTaken,
  NoChangesMade,
  UpdateQC
};

enum SaveButtonActionType {
  Save,
  Update,
  Idle
};

export const ChemistryTestInputPage = () => {
  // Managing states
  const [isSavingQCLot, setIsSavingQCLot] = useState<boolean>(false);
  const [isSavingQCLotSuccessful, setIsSavingQCLotSuccessful] = useState<boolean>(false);
  const [isUpdatingQCLotSuccessful, setIsUpdatingQCLotSuccessful] = useState<boolean>(false);
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState<boolean>(false);
  
  // 
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { item } = useParams() as { item: string };
  const loaderData = useLoaderData() as AdminQCLot;
  const { checkSession, checkUserType } = useAuth();

  // Placeholder data if the database is empty
  const mockData = item?.includes("cardiac")
    ? Cardiac
    : item?.includes("lipid")
    ? Lipid
    : item?.includes("thyroid")
    ? Thyroid
    : item?.includes("liver")
    ? Liver
    : item?.includes("iron")
    ? Iron
    : item?.includes("drug")
    ? Drug
    : item?.includes("hormone")
    ? Hormone
    : item?.includes("cancer")
    ? Cancer
    : item?.includes("pancreatic")
    ? Pancreatic
    : item?.includes("vitamins")
    ? Vitamins
    : item?.includes("diabetes")
    ? Diabetes
    : CMP;

  // Set the initial value for QCPanel table, taken from the database. If none exist, use the mock data.
  const [QCElements, setQCElements] = useState<QCRangeElements[]>(loaderData ? loaderData.analytes : mockData);

  // State to manage what clicking the Save button does
  const [saveButtonActionType, setSaveButtonActionType] = useState<SaveButtonActionType>(SaveButtonActionType.Idle);

  // State to validate if the max and min constraints are met
  const [isValid, setIsValid] = useState<boolean>(false);

  // State to manage the type of notification to display
  const [feedbackNotiType, setFeedbackNotiType] = useState<NotiType>(NotiType.NoChangesMade);

  // State to manage the QCLot input 
  const [QCLotInput, setQCLotInput] = useState<string>(loaderData ? loaderData.lotNumber : "");

  // States for the Date inputs
  const [expDate, setExpDate] = useState<Dayjs>(loaderData ? dayjs(loaderData.expirationDate) : dayjs());
  const [fileDate, setFileDate] = useState<Dayjs>(loaderData ? dayjs(loaderData.fileDate) : dayjs());

  // Refs to check whether the data has changed to initiate update or creation of new QC
  const prevExpDate = useRef(expDate);
  const prevFileDate = useRef(fileDate);
  const prevQCLotInput = useRef(QCLotInput);
  const prevQCElements = useRef(QCElements);

  // React-hook-form states
  const { register, handleSubmit, setValue } = useForm<AdminQCLot>();

  // Function to handle the Save QC Button
  const saveQC: SubmitHandler<AdminQCLot> = async (data) => {
    // console.log("Entered save QC button", data);

    if (loaderData && loaderData.lotNumber === data.lotNumber) {
      setFeedbackNotiType(NotiType.LotNumberTaken);
      setFeedbackNotiOpen(true);
      return;
    }

    // Map the input data to AdminQCLot
    const qcDataToSave: AdminQCLot = {
      qcName:
        qcTypeLinkList.find((qcType) => qcType.link.includes(item))?.name ?? "",
      lotNumber: data.lotNumber || "",
      openDate: dayjs().toISOString(),
      fileDate: data.fileDate || "",
      closedDate: data.closedDate || "",
      expirationDate: data.expirationDate || "",
      analytes: QCElements.map(
        ({
          analyteName,
          analyteAcronym,
          unitOfMeasure,
          mean,
          stdDevi,
          minLevel,
          maxLevel,
        }) => ({
          analyteName,
          analyteAcronym,
          unitOfMeasure,
          mean,
          stdDevi,
          minLevel,
          maxLevel,
        })
      ),
    };

    console.log("Attempt to save data: ", qcDataToSave);

    // Send request to the server to save the data
    setIsSavingQCLot(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "lotNumber": qcDataToSave.lotNumber,
          "qcName": qcDataToSave.qcName,
          "openDate": qcDataToSave.openDate ?? dayjs().toISOString(),
          "expirationDate": qcDataToSave.expirationDate,
          "fileDate": qcDataToSave.fileDate ?? dayjs().toISOString(),
          "department": Department.Chemistry,
          "analytes": qcDataToSave.analytes.map(analyte => ({
            "analyteName": analyte.analyteName,
            "analyteAcronym": analyte.analyteAcronym,
            "unitOfMeasure": analyte.unitOfMeasure,
            "minLevel": parseFloat(parseFloat(analyte.minLevel).toFixed(2)),
            "maxLevel": parseFloat(parseFloat(analyte.maxLevel).toFixed(2)),
            "mean": parseFloat(parseFloat(analyte.mean).toFixed(2)),
            "stdDevi": parseFloat(((+analyte.maxLevel - +analyte.minLevel) / 4).toFixed(2)),
          })),
        }),
      })

      if (res.ok) {
        console.log("Saved:", res.json());
        setFeedbackNotiType(NotiType.SaveQC);
        setIsSavingQCLotSuccessful(true);
        setFeedbackNotiOpen(true);
      } else {
        const error: DefinedRequestError = await res.json();
        console.log("Failed to save data: ", error.errorCode);

        if (error.errorCode === ErrorCode.AlreadyExist){
          setFeedbackNotiType(NotiType.LotNumberTaken);
          setFeedbackNotiOpen(true);
          setIsSavingQCLot(false);
          return;
        }
      }
      setIsSavingQCLot(false);
    } catch (error) {
      console.error("Failed to save data:", error);
      setIsSavingQCLot(false);
    }

    setSaveButtonActionType(SaveButtonActionType.Idle);
  };

  async function handleUpdateQC(){
    const qcDataToUpdate = {
      expDate: expDate.toISOString(),
      fileDate: fileDate.toISOString(),
      analytes: QCElements.map(
        ({
          analyteName,
          analyteAcronym,
          unitOfMeasure,
          mean,
          stdDevi,
          minLevel,
          maxLevel,
        }) => ({
          analyteName,
          analyteAcronym,
          unitOfMeasure,
          mean,
          stdDevi,
          minLevel,
          maxLevel,
        })
      ),
    }

    console.log("Attempt to update data: ", qcDataToUpdate);

    setIsSavingQCLot(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/UpdateQCLot/${loaderData.adminQCLotID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "expirationDate": qcDataToUpdate.expDate,
          "fileDate": qcDataToUpdate.fileDate ?? dayjs().toISOString(),
          "analytes": qcDataToUpdate.analytes.map(analyte => ({
            "analyteName": analyte.analyteName,
            "analyteAcronym": analyte.analyteAcronym,
            "unitOfMeasure": analyte.unitOfMeasure,
            "minLevel": parseFloat(parseFloat(analyte.minLevel).toFixed(2)),
            "maxLevel": parseFloat(parseFloat(analyte.maxLevel).toFixed(2)),
            "mean": parseFloat(parseFloat(analyte.mean).toFixed(2)),
            "stdDevi": parseFloat(((+analyte.maxLevel - +analyte.minLevel) / 4).toFixed(2)),
          })),
        }),
      });

      if (res.ok) {
        console.log("Saved:", res.json());
        setFeedbackNotiType(NotiType.UpdateQC);
        setIsUpdatingQCLotSuccessful(true);
        setFeedbackNotiOpen(true);
      } else {
        const error: DefinedRequestError = await res.json();
        console.log("Failed to update data: ", error.errorCode);

        if (error.errorCode === ErrorCode.NotFound){
          setFeedbackNotiType(NotiType.UpdateQC);
          setIsUpdatingQCLotSuccessful(false);
          setFeedbackNotiOpen(true);
          setIsSavingQCLot(false);
          return;
        }
      }
      setIsSavingQCLot(false);
    } catch (e) {
      console.error("Failed to save data:", e);
      setIsSavingQCLot(false);
    }

    setSaveButtonActionType(SaveButtonActionType.Idle);
  }

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

  function validateInputRange() {
    const minInputArray = inputRefs.current.filter(
      (item) => inputRefs.current.indexOf(item) % 4 === 1
    );

    minInputArray.forEach((item) => {
      if (
        +inputRefs.current[inputRefs.current.indexOf(item) + 1].value <
          +item.value ||
        item.value === "" ||
        (inputRefs.current[inputRefs.current.indexOf(item) + 1].value === "0" &&
          item.value === "0")
      ) {
        item.classList.remove("bg-green-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove(
          "bg-green-500"
        );
        item.classList.add("bg-red-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add(
          "bg-red-500"
        );
      } else {
        // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
        item.classList.remove("bg-red-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove(
          "bg-red-500"
        );
        item.classList.add("bg-green-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add(
          "bg-green-500"
        );
      }
    });

    setIsValid(
      !inputRefs.current.some((item) => item.classList.contains("bg-red-500"))
    );
  }

  useEffect(() => {
    register("lotNumber", { required: true });
    register("expirationDate", { required: true });
    register("fileDate", { required: true })
  }, [register])

  useEffect(() => {
    //If notification is enabled, disable after 5 seconds
    if (isFeedbackNotiOpen && (feedbackNotiType === NotiType.SaveQC || feedbackNotiType === NotiType.UpdateQC)) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);

        if (isSavingQCLotSuccessful) {
          navigate("/admin-home");
        }
      }, 5000);
    }
  }, [isFeedbackNotiOpen])

  useEffect(() => {
    validateInputRange();
  }, []);

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student") {
    }
    // navigate("/unauthorized");
  }, []);

  useEffect(() => {
    if (!loaderData) {
      setSaveButtonActionType(SaveButtonActionType.Save);
      return;
    }
    if (loaderData.lotNumber !== QCLotInput) {
      setSaveButtonActionType(SaveButtonActionType.Save);
    } else if (loaderData.lotNumber === QCLotInput && (loaderData.expirationDate === expDate.toISOString() || loaderData.fileDate === fileDate.toISOString() || prevQCElements.current !== QCElements)) {
      setSaveButtonActionType(SaveButtonActionType.Update);
    } else {
      setSaveButtonActionType(SaveButtonActionType.Idle);
    }

    if (prevExpDate.current !== expDate) {
      console.log('expDate changed');
    }

    if (prevFileDate.current !== fileDate) {
      console.log('fileDate changed');
    }

    if (prevQCLotInput.current !== QCLotInput) {
      console.log('QCLotInput changed');
    }

    // Update the refs with the current values
    prevExpDate.current = expDate;
    prevFileDate.current = fileDate;
    prevQCLotInput.current = QCLotInput;
    prevQCElements.current = QCElements;
  }, [expDate, fileDate, QCLotInput, QCElements])

  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "analyteName",
      header: "Name",
      cell: (info) => <div>{info.getValue()}</div>,
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
      accessorKey: "unitOfMeasure",
      header: "Units of Measure",
      cell: (info) => <></>,
    },
    {
      accessorKey: "minLevel",
      header: "Min Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "maxLevel",
      header: "Max Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "mean",
      header: "QC Mean",
      cell: (info) => <></>,
    },
    {
      accessorKey: "stdDevi",
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

  return (
    <>
      <NavBar
        name={`${
          qcTypeLinkList.find((qcType) => qcType.link.includes(item))?.name ??
          "Chemistry"
        } QC Builder`}
      />
      <div className="basic-container relative sm:space-y-4 pb-24">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-12">
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">
                QC Lot Number
              </div>
              <input
                type="text"
                className="sm:p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center"
                value={QCLotInput}
                onChange={(e) => {
                  e.preventDefault();

                  setQCLotInput(e.target.value);
                  setValue("lotNumber", e.target.value);
                }}
              />
            </div>
            <div className="expdate-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="expdate-label sm:text-xl font-semibold text-white">
                Expiration Date
              </div>
              <DatePicker
                showTime
                popupStyle={{ color: "black" }}
                style={{
                  padding: "0.25rem",
                  border: "solid 1px #548235",
                  width: "250px",
                  height: "34px",
                }}
                // defaultValue={loaderData ? dayjs(loaderData.expirationDate) : dayjs()}
                value={expDate}
                format="MM/DD/YYYY"
                onChange={(value) => {
                  setValue("expirationDate", value.toISOString());
                  setExpDate(value);
                }}
              />
            </div>
            <div className="filedate-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="filedate-label sm:text-xl font-semibold text-white">
                File Date
              </div>
              <DatePicker
                showTime
                style={{
                  padding: "0.25rem",
                  border: "solid 1px #548235",
                  width: "250px",
                  height: "34px",
                }}
                // defaultValue={loaderData ? dayjs(loaderData.fileDate) : dayjs()}
                value={fileDate}
                format="MM/DD/YYYY"
                onChange={(value) => {
                  setValue("fileDate", value.toISOString());
                  setFileDate(value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="table-container flex flex-col sm:mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
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
                  // Validate if all the input fall under constraints
                  validateInputRange();

                  // Move cursor to next input field
                  moveToNextInputOnEnter(e);
                }
              }}
            >
              {/* NO DATA */}
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

              {/* DISPLAY TABLE */}
              {QCElements.map((row, index) => (
                <TableRow
                  key={row.analyteName}
                  className="text-center sm:h-[10%] border-none"
                >
                  {/* ANALYTE NAME COLUMN */}
                  <TableCell>
                    <div>{row.analyteName}</div>
                  </TableCell>

                  {/* ANALYTE ACRONYM COLUMN */}
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderSubString(row.analyteAcronym),
                      }}
                    />
                  </TableCell>

                  {/* UNIT OF MEASURE COLUMN */}
                  <TableCell className="unitOfMeasure">
                    <input
                      // Set the ref for the input field in ref list
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
                        row.unitOfMeasure === ""
                          ? ""
                          : row.unitOfMeasure.toString()
                      }

                      // Update value of the input field, use regex to test the conformity of the value
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^[a-zA-Z\u0370-\u03FF\/% ]+$/.test(e.target.value)
                            )
                              return {
                                ...item,
                                unitOfMeasure: e.target.value,
                              };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="minLevel">
                    <input
                      type="text"

                      // Set the ref for the input field in ref list
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 1] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.minLevel || ""}

                      // Update value of the input field, use regex to test the conformity of the value
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            ) {
                              return { ...item, minLevel: e.target.value };
                            } else return item;
                          });

                          return newState;
                        });
                      }}

                      // Set the value to two fixed decimal places
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
                                const new_level = (+item.minLevel)
                                  .toFixed(2)
                                  .replace(/^0+(?!\.|$)/, "");
                                return { ...item, minLevel: new_level };
                              } else return item;
                            });

                            return newState;
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="maxLevel">
                    <input
                      type="text"

                      // Set the ref for the input field in ref list
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 2] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.maxLevel || ""}

                      // Update value of the input field, use regex to test the conformity of the value
                      onChange={(e) => {
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            )
                              return { ...item, maxLevel: e.target.value };
                            else return item;
                          });

                          return newState;
                        });
                      }}

                      // Set the value to two fixed decimal places
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
                                const new_level = (+item.maxLevel)
                                  .toFixed(2)
                                  .replace(/^0+(?!\.|$)/, "");
                                return { ...item, maxLevel: new_level };
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

                      // Set the ref for the input field in ref list
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

                      // Update value of the input field, use regex to test the conformity of the value
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

                      // Set the value to two fixed decimal places
                      onKeyDown={(e) => {
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
                    {/* Calculate the displayed value using input values */}
                    <div>
                      {((+row.maxLevel - +row.minLevel) / 4).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+1 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean +
                        (+row.maxLevel - +row.minLevel) / 4
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-1 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean -
                        (+row.maxLevel - +row.minLevel) / 4
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+2 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean +
                        ((+row.maxLevel - +row.minLevel) / 4) * 2
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-2 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean -
                        ((+row.maxLevel - +row.minLevel) / 4) * 2
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+3 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean +
                        ((+row.maxLevel - +row.minLevel) / 4) * 3
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-3 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean -
                        ((+row.maxLevel - +row.minLevel) / 4) * 3
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ButtonBase
          disabled={!isValid || isSavingQCLot}
          className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
          onClick={() => {
            if (saveButtonActionType === SaveButtonActionType.Save) {
              // Check if the QCLot already exists in the database, display warning
              if (loaderData) {
                setFeedbackNotiType(NotiType.QCAlreadyExist);
                setFeedbackNotiOpen(true);
                return;
              }

              // handleSubmit returns a function
              handleSubmit(saveQC)();
            }
            else if (saveButtonActionType === SaveButtonActionType.Update) {
              handleUpdateQC();
            } else {
              setFeedbackNotiType(NotiType.NoChangesMade);
              setFeedbackNotiOpen(true);
              return;
            }
          }}
        >
          {isSavingQCLot ? (<Icon icon="eos-icons:three-dots-loading" />) : "Save QC File"}
        </ButtonBase>
      </div>

      {/* Notification Popup */}
      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            {/* Select the type of notification to appear */}
            {/* NOTI WHEN SAVING QC */}
            { feedbackNotiType === NotiType.SaveQC && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  { isSavingQCLotSuccessful ? (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                        <div>Saved QC Successfully</div>
                        <div className="text-md text-gray-500">Redirecting to Homepage...</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                        <div>Error Occurred</div>
                      </div>
                    </>
                  ) }
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
              </>) 
            }

            {/* WARNING NOTI FOR ANOTHER EXISTING ENTRY IS IN ORDER */}
            { feedbackNotiType === NotiType.QCAlreadyExist && (
              <div className="flex flex-col gap-y-2 items-center">
                <div className="text-2xl font-semibold">Another QC is in order!</div>
                <div className="text-lg font-semibold">Proceed?</div>
                <Icon icon="ph:warning-octagon-bold" className="text-2xl text-yellow-400 sm:w-20 sm:h-20"/>
                <div className="flex gap-x-2">
                  <Button variant="contained" className="!bg-[#22C55E]" onClick={() => {
                    handleSubmit(saveQC)();
                  }}>Confirm</Button>
                  <Button variant="contained" className="!bg-red-500" onClick={() => {
                    setFeedbackNotiOpen(false);
                  }}>Decline</Button>
                </div>
              </div>
            ) }

            {/* WARNING LOT NUMBER TAKEN */}
            { feedbackNotiType === NotiType.LotNumberTaken && (
              <div className="flex flex-col sm:gap-y-2 items-center">
                <div className="text-2xl font-semibold">Lot Number already exists!</div>
                <Icon icon="ph:warning-octagon-bold" className="text-2xl text-yellow-400 sm:w-20 sm:h-20"/>
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
            ) }

            {/* NOTI WHEN UPDATING QC */}
            { feedbackNotiType === NotiType.UpdateQC && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  { isUpdatingQCLotSuccessful ? (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                        <div>Updated QC Successfully</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                        <div>Error Occurred</div>
                      </div>
                    </>
                  ) }
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
              </>
            ) }

            {/* NOTI WHEN NO CHANGES WERE MADE */}
            { feedbackNotiType === NotiType.NoChangesMade && (
              <div className="flex flex-col sm:gap-y-2 items-center">
                <div className="text-2xl font-semibold">No changes were made!</div>
                <Icon icon="ph:warning-octagon-bold" className="text-2xl text-yellow-400 sm:w-20 sm:h-20"/>
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
            ) }
          </div>
        </div>
      </Backdrop>
    </>
  );
};
