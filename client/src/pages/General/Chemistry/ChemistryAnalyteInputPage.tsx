import React, { useRef, useState, useEffect, useMemo } from "react";
import NavBar from "../../../components/NavBar";
import { Backdrop, Button, ButtonBase, Modal } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { Admin, AdminQCLot, AnalyteInput, getISOTexasTime, renderSubString, StudentReport } from "../../../utils/utils";
import {
  Document,
  Page,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { AuthToken, useAuth, UserType } from "../../../context/AuthContext";
import { useLoaderData, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import Analyte from "../../../components/Analyte";

enum NotiType {
  SomethingWrong,
  NoChangesMade,
  ReportSaved,
}

const ChemistryAnalyteInputPage = () => {
  
  // Function to print out the report pdf file
  const reportPDF = (analyteValues?: number[], QCData?: AdminQCLot | null) => {
    const currentDate = new Date();

    const tw = createTw({
      theme: {},
      extend: {},
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    return (
      <>
        <Document style={tw("border border-solid border-black")}>
          <Page style={tw("py-8 px-16 border border-solid border-black")}>
            <Text style={tw("sm:text-[24px] text-center")}>Quality Controls Report</Text>
            <Text style={tw("mt-8 mb-2 text-[13px]")}>Date: {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}</Text>
            <Text style={tw("mb-2 text-[13px]")}>Lot Number: {QCData?.lotNumber || "error"}</Text>
            <Text style={tw("mb-8 text-[13px]")}>QC Duration: {dayjs(QCData?.openDate).format("MM/DD/YYYY") || "undetermined"} - {QCData?.closedDate ? dayjs(QCData?.closedDate).format("MM/DD/YYYY") : dayjs(QCData?.expirationDate).format("MM/DD/YYYY") || "undetermined"}</Text>
            <Text style={tw("text-[22px] mb-8 text-center")}>{QCData?.qcName} QC</Text>
            <View style={tw("flex-row justify-around")}>
              <Text style={tw("font-[700] text-[15px]")}>Analytes</Text>
              <Text style={tw("font-[700] text-[15px]")}>Value</Text>
              <Text style={tw("font-[700] text-[15px]")}>Level {QCData?.qcName ? detectLevel(QCData?.qcName) === 1 ? "I" : "II" : "I"} Range</Text>
            </View>
            <View style={tw("w-full h-[1px] bg-black mt-2")}/>
            <View style={tw("flex-row justify-between p-5")}>
              <View>
                {analyteValues?.map((value, index) => (
                  <Text style={tw(`mb-2 text-[13px] ${invalidIndexArray?.includes(index) ? "text-red-500" : ""}`)} key={index}>{QCData?.analytes[index].analyteName}</Text>
                ))}
              </View>
              <View>
                {analyteValues?.map((value, index) => (
                  <Text style={tw(`mb-2 text-[13px] ${invalidIndexArray?.includes(index) ? "text-red-500" : ""}`)} key={index}>{value} {QCData?.analytes[index].unitOfMeasure}</Text>
                ))}
              </View>
              <View>
                {analyteValues?.map((value, index) => (
                  <Text style={tw(`mb-2 text-[13px] ${invalidIndexArray?.includes(index) ? "text-red-500" : ""}`)} key={index}>{QCData?.analytes[index].minLevel} - {QCData?.analytes[index].maxLevel} {QCData?.analytes[index].unitOfMeasure}</Text>
                ))}
              </View>
            </View>
            <View style={tw("w-full h-[1px] bg-black mt-2")}/>
            <Text style={tw("mt-2")}>QC Comments:</Text>
            <View>
              {modalData.map((item, index) => (
                <View style={tw("flex-row items-center")}>
                  <View style={tw("self-center w-[4px] h-[4px] bg-black rounded-full")} />
                  <Text style={tw("text-[13px] w-full px-6 text-justify text-wrap mt-2")} key={index}>{QCData?.analytes[item.invalidIndex].analyteName}: {item.comment}</Text>
                </View>
              ))}
            </View>
            <Text style={tw("mt-8 text-[13px]")}>Approved by: {userFullname}</Text>
            <Text style={tw("mt-2 text-[13px]")}>Date: {currentDate.getMonth() + 1}/{currentDate.getDate()}/{currentDate.getFullYear()}</Text>
            <Text style={tw("mt-2 text-[13px]")}>Time: {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
          </Page>
        </Document>
      </>
    )
  }

  async function fetchQCData() {
    setIsFetchingData(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/${loaderData.adminQCLotID}`);

      if (res.ok) {
        const data = await res.json();
        setQCData(data);
      }
    } catch (error) {
      console.error("Error fetching QC data:", error);
    } finally {
      setIsFetchingData(false);
    }
  }

  async function fetchAnalyteInputs() {
    setIsFetchingData(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AnalyteInput/ActiveInputs/${loaderData.reportID}`);

      if (res.ok) {
        const data: AnalyteInput[] = await res.json();

        // Reindex the data
        let newData: AnalyteInput[] = [];
        if (QCData) {
          newData = QCData.analytes.map((item, index) => {
            let selectedAnalyte = data.find(input => input.analyteName === item.analyteName);
            if (selectedAnalyte) {
              return selectedAnalyte;
            }
  
            return null;
          }).filter((e: AnalyteInput | null): e is AnalyteInput => e !== null);
        };
        console.log("Formatted data: ", newData);

        // console.log("From fetch input function: ", data);
        setAnalyteValues(newData);
        setOriginalAnalyteValues(newData);
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        let isAllCommentsFilled = true;
        newData.forEach(input => {
          if (!input.inRange) {
            if (input.comment === "") {
              isAllCommentsFilled = false;
            }

            let invalidIndex = QCData?.analytes.findIndex(analyte => analyte.analyteName === input.analyteName);
            // console.log("From fetch input function 1: ", invalidIndex);

            if (invalidIndex !== undefined) {
              newInvalidIndexes.add(invalidIndex);
              // console.log("For input ", input, " invalid index: ", newInvalidIndexes);
              let newModalData = { invalidIndex: invalidIndex, comment: input.comment };
              console.log("New modal data: ", newModalData);
              setModalData(prevValue => {
                const updatedValues = [...prevValue];
                if (invalidIndex !== undefined) {
                  updatedValues[invalidIndex] = newModalData;
                }
                return updatedValues;
              });
              setOriginalModalData(prevValue => {
                const updatedValues = [...prevValue];
                if (invalidIndex !== undefined) {
                  updatedValues[invalidIndex] = newModalData;
                }
                return updatedValues;
              });
              // console.log("From fetch input function 2: ", data.length, QCData?.analytes.length);
              setIsInputFull(data.length === QCData?.analytes.length);
            }
          }
        });

        // Handle undefined data in Comments
        setModalData(prevValue => {
          const updatedValues = [...prevValue];
          updatedValues.forEach((item, index) => {
            if (item === undefined) {
              updatedValues[index] = { invalidIndex: index, comment: "" };
            }
          });
          return updatedValues;
        });

        setOriginalModalData(prevValue => {
          const updatedValues = [...prevValue];
          updatedValues.forEach((item, index) => {
            if (item === undefined) {
              updatedValues[index] = { invalidIndex: index, comment: "" };
            }
          });
          return updatedValues;
        });

        setInvalidIndexes(newInvalidIndexes);
        setIsValidManual(isAllCommentsFilled);
      }
    } catch (e) {
      console.error("Error fetching analyte inputs: ", e);
    } finally {
      setIsFetchingData(false);
    }
  }

  const openPDF = async () => {
    const analyteInputs = analyteValues.map(val => val.analyteValue);

    const blob = await pdf(reportPDF(analyteInputs, QCData)).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
  }

  const { link } = useParams();
  const { theme } = useTheme();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const analyteNameRefs = useRef<HTMLDivElement[]>([]);
  const firstRender = useRef(true);
  const { userId, type } = useAuth();

  const [isInputFull, setIsInputFull] = useState<boolean>(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const [notiType, setNotiType] = useState<NotiType>(NotiType.SomethingWrong);
  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState<boolean>(false);

  // Comment modal controlling state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Have all the comments been filled
  const [isValidManual, setIsValidManual] = useState<boolean>(false);

  // To be precise, comments for invalid analytes
  const [modalData, setModalData] = useState<{ invalidIndex: number, comment: string }[]>([]);

  // For comparing the original with any changes made
  const [originalModalData, setOriginalModalData] = useState<{ invalidIndex: number, comment: string }[]>([]);

  // The defined Faculty Template used for this Analyte Report
  const [QCData, setQCData] = useState<AdminQCLot | null>(null);

  // Used for the pdf report
  const [userFullname, setUserFullname] = useState<string>("");

  // State used for input fields, can be modified
  const [analyteValues, setAnalyteValues] = useState<AnalyteInput[]>([]);

  // For comparing the original with any changes made
  const [originalAnalyteValues, setOriginalAnalyteValues] = useState<AnalyteInput[]>([]);

  // A unique set to keep track of the invalid analytes indexes
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);

  const loaderData = useLoaderData() as StudentReport;

  // the invalid index set converted into array
  const invalidIndexArray: number[] = useMemo(() => {
    let newArray: number[] = [];
    if (!invalidIndexes) return newArray;
    invalidIndexes.forEach(value => newArray.push(value));
    return newArray;
  }, [invalidIndexes])

  const isValid = useMemo(() => {
    // if ((!invalidIndexes || invalidIndexes.size === 0) && analyteValues.length === QCData?.analytes.length) return true;
    if (analyteValues.length === QCData?.analytes.length) return true;
    else return false;
  }, [analyteValues])

  function detectLevel(str: string): number {
      if (str.endsWith("I")) {
          return 1;
      } else if (str.endsWith("II")) {
          return 2;
      } else {
        return 0;
      }
  }

  function handleKeyPress(event: React.KeyboardEvent, index: number) {
    // console.log("From handleKeyPress function: ", index);
    if (
      event.key === "Enter" &&
      index < inputRefs.current.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleTextareaChange(invalidIndex: number, value: string) {
    setModalData(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[invalidIndex] = { invalidIndex: 0, comment: "" }
      // console.log(updatedValues)
      updatedValues[invalidIndex].invalidIndex = invalidIndex;
      updatedValues[invalidIndex].comment = value;
      updatedValues.forEach((item, index) => {
        if (item === undefined) {
          updatedValues[index] = { invalidIndex: index, comment: "" }
        }
      })
      return updatedValues;
    });

    setAnalyteValues(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[invalidIndex].comment = value;
      return updatedValues;
    })
  }
  
  const handleAcceptQC = async () => {
    if (!QCData) {
        console.error("No QC data available to save.");
        return;
    }

    if (analyteValues === originalAnalyteValues || modalData === originalModalData) {
      setNotiType(NotiType.NoChangesMade);
      setIsFeedbackNotiOpen(true);
      return;
    }

    if (originalAnalyteValues.length === 0) {
      try {     
          let analyteInputsToSave = QCData.analytes.map((analyte, index) => {
              return {
                  analyteName: analyte.analyteName,
                  analyteAcronym: analyte.analyteAcronym,
                  analyteValue: analyteValues[index].analyteValue,
                  inRange: !invalidIndexArray?.includes(index),
                  isActive: true,
                  createdDate: getISOTexasTime(),
                  comment: analyteValues[index].comment,
              }
          });
  
          const res = await fetch(`${process.env.REACT_APP_API_URL}/AnalyteInput/Create/${loaderData.reportID}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(analyteInputsToSave),
          });
  
          if (res.ok) {
              // console.log("QC data saved successfully.", await res.json());
              setNotiType(NotiType.ReportSaved);
              setIsFeedbackNotiOpen(true);
          }
      } catch (e) {
          console.error("Error saving QC data:", e);
          setNotiType(NotiType.SomethingWrong);
          setIsFeedbackNotiOpen(true);
      }
    } else {
      const updatedElements = originalAnalyteValues.map((ele, index) => {
        if (ele.analyteValue !== analyteValues[index].analyteValue || ele.comment !== analyteValues[index].comment) {
          console.log("entred")
          return index;
        }
      }).filter((e: any): e is number => e !== undefined);

      console.log("Updated elements: ", updatedElements);

      try {
        let analyteInputsToSave = updatedElements.map(item => {
            return {
                analyteName: QCData.analytes[item].analyteName,
                analyteAcronym: QCData.analytes[item].analyteAcronym,
                analyteValue: analyteValues[item].analyteValue,
                inRange: !invalidIndexArray?.includes(item),
                isActive: true,
                createdDate: getISOTexasTime(),
                comment: !invalidIndexArray?.includes(item) ? "" : analyteValues[item].comment,
            }
        });

        console.log("Analyte inputs to update: ", analyteInputsToSave);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/AnalyteInput/Create/${loaderData.reportID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(analyteInputsToSave),
        });

        if (res.ok) {
            // console.log("QC data saved successfully.", await res.json());
            setNotiType(NotiType.ReportSaved);
            setIsFeedbackNotiOpen(true);
        }
      } catch (e) {

      }
    }
  };
  
  function handleInputChange(
    index: number,
    value: string,
    min: number,
    max: number
  ) {
    const newValues: AnalyteInput[] = [...analyteValues];
    newValues[index] = {
      // analyteInputID: "",
      // reportID: "",
      analyteName: "",
      analyteAcronym: "",
      analyteValue: 0,
      inRange: false,
      isActive: true,
      createdDate: "",
      comment: "",
    }

    newValues[index].analyteName = "";
    newValues[index].analyteValue = parseFloat(value);
    newValues[index].createdDate = getISOTexasTime();

    setAnalyteValues(newValues);
    if (
      isNaN(parseFloat(value)) ||
      parseFloat(value) < min ||
      parseFloat(value) > max ||
      typeof value === "undefined" 
      // newValues.length !== data.length
    ) {
      if (!invalidIndexes) {
        let newInvalidIndexes = new Set<number>();
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
      else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
    } else {
      let newInvalidIndexes = new Set<number>(invalidIndexes);
      newInvalidIndexes.delete(index);
      setInvalidIndexes(newInvalidIndexes);
    }
    if (analyteValues.length !== 0) setIsInputFull(newValues.length === QCData?.analytes.length && newValues.length > 0);
  }

  // Get the current user's name for the pdf report
  useEffect(() => {
    async function getUser(): Promise<string> {
      const tokenString = localStorage.getItem('token');
      let token: AuthToken = { jwtToken: "", userID: "", roles: [] };
      if (tokenString && tokenString !== "") {
        token = JSON.parse(tokenString);
      }
      if (type === UserType.Admin) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Admins/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token.jwtToken}`
          }
        });
        if (res.ok) {
          const user: Admin = await res.json();
          return `${user.firstname} ${user.lastname}`;
        }
      } else if (type === UserType.Student) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Students/${userId}`);
        if (res.ok) {
          const user = await res.json();
          return `${user.firstname} ${user.lastname}`;
        }
      }

      return ""
    }
    getUser().then(name => setUserFullname(name));
  }, []);

  useEffect(() => {
    fetchQCData();
  }, []);

  useEffect(() => {
    if (firstRender.current === true) {
      firstRender.current = false;
      return;
    }

    fetchAnalyteInputs();
  }, [QCData])

  useEffect(() => {
    console.log("isValid: ", isValid, "\nisValidManual: ", isValidManual);
  }, [isValid, isValidManual])

  useEffect(() => {
    if (originalAnalyteValues && originalModalData) {
      if (analyteValues === originalAnalyteValues && modalData === originalModalData) {
        setNotiType(NotiType.NoChangesMade);
      }
    }

    console.log("Original data: ", originalAnalyteValues, originalModalData, "\nForm data: ", analyteValues, modalData);
  }, [originalAnalyteValues, originalModalData, analyteValues, modalData])

  useEffect(() => {
    // console.log(originalAnalyteValues);
  }, [originalAnalyteValues])

  return (
    <>
      <NavBar name={`Chemistry QC Results`} />
      {isFetchingData && (
        <div className="sm:w-[80svw] flex justify-center items-center sm:mt-4 my-0 mx-auto">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      )}
      {!QCData ? <div>No data recorded</div> : <></>}
      {QCData && !isFetchingData && <div
        className=" flex flex-col space-y-12 pb-8 justify-center px-[100px] relative"
        style={{ minWidth: "100svw", minHeight: "100svh" }}
      >
        <div className="analyte-list-container flex flex-wrap gap-14 sm:w-[90svw] sm:px-[149.5px] max-sm:flex-col mt-8 px-3 justify-center">
          {QCData?.analytes.map((item, index) => (
            <div
              onKeyDown={(event) => {
                handleKeyPress(event, index);
              }}
              key={item.analyteName}
            >
              <Analyte
                name={item.analyteName}
                acronym={item.analyteAcronym}
                minLevel={+item.minLevel}
                maxLevel={+item.maxLevel}
                inRange={analyteValues[index]?.inRange}
                value={analyteValues[index]?.analyteValue.toString() || ""}
                // level={detectLevel(props.name)}
                measUnit={item.unitOfMeasure}
                handleInputChange={(val) => {
                    if (item.minLevel !== "" && item.maxLevel !== "") {
                      // console.log("First condition");
                      handleInputChange(index, val, +item.minLevel, +item.maxLevel)
                    }
                    else {
                      // console.log("Second condition")
                      handleInputChange(index, val, -1, 9999)
                    }
                  }
                }
                ref={(childRef: { inputRef: { current: HTMLInputElement | null }, nameRef: { current: HTMLDivElement | null } }) => {
                  // console.log(childRef);
                  if (childRef) {
                    // inputRefs.current.push(childRef.inputRef.current as HTMLInputElement);
                    // analyteNameRefs.current.push(childRef.nameRef.current as HTMLDivElement);
                    inputRefs.current[index] = childRef.inputRef.current as HTMLInputElement;
                    analyteNameRefs.current[index] = childRef.nameRef.current as HTMLDivElement;
                  }
                }}
              />
            </div>
          ))}
        </div>
        <div className="analyte-control-container sm:w-[90svw] w-[100svw] flex justify-between max-sm:flex-col max-sm:w-[100%] max-sm:space-y-4">
          <Button className="shadow-lg sm:w-fit sm:h-[50px] sm:!px-4 !bg-[#DAE3F3] !text-black !font-semibold !border !border-solid !border-[#6781AF]">
            QC Function Overview
          </Button>
          <div className="sm:space-x-16 max-sm:w-full max-sm:space-y-4">
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isInputFull
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isInputFull}
              onClick={() => setIsModalOpen(true)}
            >
              Apply QC Comment
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid && isValidManual
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValidManual || !isValid}
              onClick={() => {
                if (userFullname === "" || !userFullname) {
                  console.log("No username: ", userFullname);
                  return;
                }

                openPDF();
              }}
            >
              Print QC
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid && isValidManual
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValidManual || !isValid}
              onClick= {handleAcceptQC}
             >
              Accept QC
            </Button>
          </div>
        </div>
      </div>}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={`modal-container left-1/2 sm:w-[50svw] sm:h-[80svh] bg-[${theme.secondaryColor}] border-2 border-solid border-[#6781AF] rounded-xl sm:-translate-x-1/2 sm:translate-y-12 flex flex-col items-center sm:py-6 relative overflow-scroll sm:space-y-4`}>
          <div className="modal-title sm:text-2xl font-semibold">QC Comment</div>
          <div className="invalid-items sm:w-[80%]">
            {!invalidIndexArray || invalidIndexArray.length === 0 && <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">No invalid items</div>}
            {invalidIndexArray && invalidIndexArray.length > 0 && (
              <>
                <div className="invalid-items-comments flex flex-col sm:space-y-6">
                  {invalidIndexArray.map(invalidItem => (
                    <div className="comment flex sm:space-x-12 h-fit" key={invalidItem}>
                      <div className="comment-name w-[5%] sm:text-xl font-semibold self-center" dangerouslySetInnerHTML={{ __html: renderSubString(analyteNameRefs.current[invalidItem].innerHTML) }} />
                      <textarea className="grow sm:h-16 p-1" value={modalData[invalidItem]?.comment || ""} onChange={(e) => handleTextareaChange(invalidItem, e.target.value)} required></textarea>
                    </div>
                  ))}
                  <ButtonBase className={`!rounded-lg sm!my-10 sm:!py-6 sm:!px-10 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] sm:w-1/2 self-center`} onClick={(e => {
                    e.preventDefault()
                    // console.log(modalData)
                    setIsValidManual(invalidIndexArray.every(item => modalData[item].comment !== ""))
                    setIsModalOpen(false)
                  })}>Apply Comments</ButtonBase>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* Notification Popup */}
      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setIsFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl z-3">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            {/* WARNING NO CHANGES MADE */}
            { notiType === NotiType.NoChangesMade && (
                <div className="flex flex-col sm:gap-y-2 items-center sm:max-w-[480px]">
                  <div className="text-2xl font-semibold">No changes made</div>
                  <Icon icon="ph:warning-octagon-bold" className="text-2xl text-yellow-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }

              {/* NOTIFYING ORDER CREATED */}
              { notiType === NotiType.ReportSaved && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Report Successfully Created/Updated</div>
                  <Icon icon="clarity:success-standard-line" className="text-2xl text-green-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                      // navigate("/admin-home");
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }

              {/* OTHER ERRORS */}
              { notiType === NotiType.SomethingWrong && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Something Went Wrong</div>
                  <Icon icon="material-symbols:cancel-outline" className="text-2xl text-red-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
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

export default ChemistryAnalyteInputPage;
