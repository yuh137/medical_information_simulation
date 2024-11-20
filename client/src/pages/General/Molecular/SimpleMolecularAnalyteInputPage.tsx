import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MolecularQCTemplateBatch, MolecularQCTemplateBatchAnalyte, QualitativeMolecularQCTemplateBatchAnalyte, QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte, AnalyteReportType, MolecularQCReport, Analyte } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import MolecularAnalyte from '../../../components/MolecularAnalyte';
import { AuthToken } from "../../../context/AuthContext";
import { QCPanel } from "../../../utils/indexedDB/IDBSchema";
import { Button, ButtonBase, Modal } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { saveToDB, getQCRangeByDetails } from "../../../utils/indexedDB/getData";
import { min } from 'd3';
import { pdf, Document, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';


const SimpleMolecularAnalyteInputPage = () => {
  const { theme } = useTheme();
  const [qcData, setQcData] = useState<QCPanel | null>(null);
  const [modalData, setModalData] = useState<{ invalidIndex: number; comment: string }[]>([]);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [isInputFull, setIsInputFull] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isValidManual, setIsValidManual] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const analyteNameRefs = useRef<HTMLDivElement[]>([]);

  const getUsername = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const authToken: AuthToken = JSON.parse(token);
      const role = authToken.roles[0];
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/${role + "s"}/${authToken.userID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken.jwtToken}`,
          },
        });

        if (res.ok) {
          const user = await res.json();
          console.log(`User ${user}`);
          setUsername(user.username);
        }
      } catch (e) {
        console.error("Error fetching user data: ", e);
      }
    }
  }

  useEffect(() => {
    getUsername();
    const storedQCData = localStorage.getItem('selectedQCData');
    if (storedQCData) {
      setQcData(JSON.parse(storedQCData));
    } else {
      console.error("No QC data found.");
    }
  }, []);

  const invalidIndexArray: number[] | null = useMemo(() => {
    if (!invalidIndexes) return null;
    let newArray: number[] = [];
    invalidIndexes.forEach(value => newArray.push(value));
    return newArray;
  }, [invalidIndexes]);

  const isValid = useMemo(() => {
    if ((!invalidIndexes || invalidIndexes.size === 0) && analyteValues.length === qcData?.analytes.length) return true;
    else return false;
  }, [analyteValues, invalidIndexes, qcData]);

  const setInvalidIndex = (index: number) => {
    if (!invalidIndexes) {
      let newInvalidIndexes = new Set<number>();
      newInvalidIndexes.add(index);
      setInvalidIndexes(newInvalidIndexes);
    } else {
      let newInvalidIndexes = new Set<number>(invalidIndexes);
      newInvalidIndexes.add(index);
      setInvalidIndexes(newInvalidIndexes);
    }
  }

  const handleAcceptQC = async () => {
    if (!qcData) {
      console.error("No QC data available to save.");
      return;
    }
    const report: MolecularQCReport = { studentID: username, creationDate: new Date(), analyteInputs: qcData.analytes.map((analyte, index) => ({ analyteName: analyte.analyteName, value: analyteValues[index], comment: modalData.find(element => element.invalidIndex === index)?.comment || "" })) };
    let data = ((await getQCRangeByDetails(qcData.qcName, qcData.lotNumber, '')) as unknown) as MolecularQCTemplateBatch;
    if (!data) {
      data = { fileName: qcData.qcName, lotNumber: qcData.lotNumber, closedDate: '', reports: [], openDate: '', analytes: [] };
    }
    data.reports.push(report);
    console.log("Data to save:", qcData);
    try {
      await saveToDB("qc_store", data);
      console.log("QC data saved successfully.");
      setAnalyteValues([]);
      setInvalidIndexes(null);
      setModalData([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving QC data:", error);
    }
  };

  const handleInputChange = (index: number, value: string, old_analyte: Analyte) => {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
    if (old_analyte.type === 'QuanitativeAnalyte') {
      let minLevel = -1;
      if (old_analyte.minLevel) {
        minLevel = old_analyte.minLevel;
      }
      let maxLevel = -1;
      if (old_analyte.maxLevel) {
        maxLevel = old_analyte.maxLevel;
      }
      if (isNaN(parseFloat(value)) ||
        (parseFloat(value) < minLevel) ||
        (parseFloat(value) > maxLevel)) {
        setInvalidIndex(index);
      } else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.delete(index);
        setInvalidIndexes(newInvalidIndexes);
      }
    } else if (old_analyte.type === 'QualitativeAnalyte') {
      if (old_analyte.expectedRange !== value) {
        setInvalidIndex(index);
      } else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.delete(index);
        setInvalidIndexes(newInvalidIndexes);
      }
    } else if (typeof value === 'undefined') {
      setInvalidIndex(index);
    }
    setIsInputFull(newValues.length === qcData?.analytes.length && newValues.length > 0);
  };

  const handleTextareaChange = (index: number, invalidIndex: number, value: string) => {
    setModalData(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[index] = { invalidIndex, comment: value };
      return updatedValues;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent, index: number) => {
    if (
      event.key === "Enter" &&
      index < inputRefs.current.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const detectLevel = (str: string): number => {
    if (str.endsWith("I")) {
      return 1;
    } else if (str.endsWith("II")) {
      return 2;
    } else {
      return 0;
    }
  };

  const reportPDF = (analyteValues?: string[], QCData?: QCPanel) => {
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
      <Document style={tw("border border-solid border-black")}>
        <Page style={tw("py-8 px-16 border border-solid border-black")}>
          <Text style={tw("sm:text-[24px] text-center")}>Quality Controls Report</Text>
          <Text style={tw("mt-8 mb-2 text-[13px]")}>Date: {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}</Text>
          <Text style={tw("mb-2 text-[13px]")}>Lot Number: {QCData?.lotNumber || "error"}</Text>
          <Text style={tw("mb-8 text-[13px]")}>QC Duration: {QCData?.openDate || "undetermined"} - {QCData?.closedDate || "undetermined"}</Text>
          <Text style={tw("text-[22px] mb-8 text-center")}>Molecular QC</Text>
          <View style={tw("flex-row justify-between")}>
            <Text style={tw("w-[33%] text-center text-[15px]")}>Analytes</Text>
            <Text style={tw("w-[33%] text-center text-[15px]")}>Value</Text>
            <Text style={tw("w-[33%] text-center text-[15px]")}>Expected Value</Text>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <View style={tw("flex-col")}>
            {analyteValues?.map((value, index) => (
              <View key={index} style={tw("m-2") }> {/*Print the analyte on one row with 33% width for each field*/}
                <View style={tw("flex-row justify-between")}>
                  <Text style={tw(`w-[33%] text-[13px] ${invalidIndexes?.has(index) ? "text-red-500" : ""}`)}>{QCData?.analytes[index].analyteName}</Text>
                  <Text style={tw(`w-[33%] text-center text-[13px] ${invalidIndexes?.has(index) ? "text-red-500" : ""}`)}>{value}</Text>
                  <Text style={tw(`w-[33%] text-center text-[13px] ${invalidIndexes?.has(index) ? "text-red-500" : ""}`)}>{QCData?.analytes[index].expectedRange}</Text>
                </View>
                <View style={tw("border-b border-gray-300 mt-3 mb-3")} /> {/*Add a thin grey line between each row */}
              </View>
            ))}
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <Text style={tw("mt-2")}>QC Comments:</Text>
          <View style={tw("flex-col")}>
            {modalData.map((item, index) => (
              <View key={index} style={tw("m-2")}>
                <View style={tw("flex-row items-center border border-gray-300 p-3")} key={index}>
                  <View style={tw("self-center w-[4px] h-[4px] bg-black rounded-full")} />
                  <Text style={tw("text-[13px] w-[50%] px-6 text-justify mt-2")}>{QCData?.analytes[item.invalidIndex].analyteName}:</Text>
                  <Text style={tw("text-[11px] w-[50%] px-6 text-justify mt-2")}>{item.comment}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={tw("mt-8 text-[13px]")}>Approved by: {username}</Text>
          <Text style={tw("mt-2 text-[13px]")}>Date: {currentDate.getMonth() + 1}/{currentDate.getDate()}/{currentDate.getFullYear()}</Text>
          <Text style={tw("mt-2 text-[13px]")}>Time: {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
        </Page>
      </Document>
    );
  };

  const openPDF = async () => {
    const blob = await pdf(reportPDF(analyteValues, qcData || undefined)).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
  };

  if (!qcData) {
    return <p>No data available for this QC record.</p>;
  }

  return (
    <>
      <NavBar name={`Molecular QC Results`} />
      <div
        className="flex flex-col space-y-12 pb-8 justify-center px-[100px] relative"
        style={{ minWidth: "100svw", minHeight: "100svh" }}
      >
        <div className="analyte-list-container flex flex-wrap gap-14 sm:w-[90svw] sm:px-[149.5px] max-sm:flex-col mt-8 px-3 justify-center">
          {qcData.analytes.map((item, index) => (
            <div
              onKeyDown={(event) => {
                handleKeyPress(event, index);
              }}
              key={item.analyteName}
            >
              <MolecularAnalyte
                analyte={item}
                handleInputChange={(val: string) => {
                  handleInputChange(index, val, item);
                }}

                ref={(childRef: { inputRef: React.RefObject<HTMLInputElement>; nameRef: React.RefObject<HTMLDivElement> }) => {
                  if (childRef) {
                    inputRefs.current.push(childRef.inputRef.current as HTMLInputElement);
                    analyteNameRefs.current.push(childRef.nameRef.current as HTMLDivElement);
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
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${isInputFull ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
                }`}
              disabled={!isInputFull}
              onClick={() => setIsModalOpen(true)}
            >
              Apply QC Comment
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${isValid || isValidManual ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
                }`}
              disabled={!isValidManual && !isValid}
              onClick={() => openPDF()}
            >
              Print QC
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${(isValid || isValidManual) ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
                }`}
              disabled={!isValid && !isValidManual}
              onClick={() => handleAcceptQC()}
            >
              Accept QC
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={`modal-conatiner absolute top-1/1 left-1/2 sm:w-[50svw] sm:h-[80svh] bg-[${theme.secondaryColor}] border-2 border-solid border-[#6781AF] rounded-xl sm:-translate-x-1/2 sm:translate-y-12 flex flex-col items-center sm:py-6 relative overflow-scroll sm:space-y-4`}>
          <div className="modal-title sm:text-2xl font-semibold">QC Comment</div>
          <div className="invalid-items sm:w-[80%]">
            {!invalidIndexArray || invalidIndexArray.length === 0 && (
              <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">No invalid items</div>
            )}
            {invalidIndexArray && invalidIndexArray.length > 0 && (
              <div className="invalid-items-comments flex flex-col sm:space-y-6">
                {invalidIndexArray.map((invalidItem, index) => (
                  <div className="comment flex sm:space-x-12 h-fit" key={invalidItem}>
                    <div className="comment-name w-[5%] sm:text-xl font-semibold self-center" dangerouslySetInnerHTML={{ __html: analyteNameRefs.current[invalidItem]?.innerHTML }} />
                    <textarea className="grow sm:h-16 p-1" value={modalData[index]?.comment || ""} onChange={(e) => handleTextareaChange(index, invalidItem, e.target.value)} required></textarea>
                  </div>
                ))}
                <ButtonBase className={`!rounded-lg sm!my-10 sm:!py-6 sm:!px-10 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] sm:w-1/2 self-center`} onClick={() => {
                  setIsValidManual(modalData.every(item => item.comment !== ""));
                }}>
                  Apply Comments
                </ButtonBase>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SimpleMolecularAnalyteInputPage;
