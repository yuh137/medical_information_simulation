import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AdminQCLot } from '../../../utils/indexedDB/IDBSchema';
import Analyte from '../../../components/Analyte';
import NavBar from '../../../components/NavBar';
import { useParams } from 'react-router-dom';
import { pdf, Document, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import { Button, ButtonBase, Modal } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";

import { saveToDB } from "../../../utils/indexedDB/getData";
import { useAuth } from "../../../context/AuthContext";


const SimpleAnalyteInputPage = (props: { name: string }) => {
  const { theme } = useTheme();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const analyteNameRefs = useRef<HTMLDivElement[]>([]);

  const [qcData, setQcData] = useState<AdminQCLot | null>(null);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{ invalidIndex: number; comment: string }[]>([]);
  const [isValidManual, setIsValidManual] = useState<boolean>(false);
  const [isInputFull, setIsInputFull] = useState<boolean>(false);
  const { fileName, lotNumber, closedDate } = useParams<{ fileName: string; lotNumber: string; closedDate: string }>();

  useEffect(() => {
    const storedQCData = localStorage.getItem('selectedQCData');
    if (storedQCData) {
      setQcData(JSON.parse(storedQCData));
    } else {
      console.error("No QC data found.");
    }
  }, []);

  const detectLevel = (str: string): number => {
    if (str.endsWith("I")) {
      return 1;
    } else if (str.endsWith("II")) {
      return 2;
    } else {
      return 0;
    }
  };

  const handleInputChange = (index: number, value: string, min: number, max: number) => {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);

    if (
      isNaN(parseFloat(value)) ||
      parseFloat(value) < min ||
      parseFloat(value) > max ||
      typeof value === "undefined"
    ) {
      if (!invalidIndexes) {
        let newInvalidIndexes = new Set<number>();
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      } else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
    } else {
      let newInvalidIndexes = new Set<number>(invalidIndexes);
      newInvalidIndexes.delete(index);
      setInvalidIndexes(newInvalidIndexes);
    }
    setIsInputFull(newValues.length === qcData?.analytes.length && newValues.length > 0);
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

  const handleTextareaChange = (index: number, invalidIndex: number, value: string) => {
    setModalData(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[index] = { invalidIndex, comment: value };
      return updatedValues;
    });
  };

  const reportPDF = (analyteValues?: string[], QCData?: AdminQCLot) => {
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
          <Text style={tw("text-[22px] mb-8 text-center")}>{props.name} QC</Text>
          <View style={tw("flex-row justify-around")}>
            <Text style={tw("font-[700] text-[15px]")}>Analytes</Text>
            <Text style={tw("font-[700] text-[15px]")}>Value</Text>
            <Text style={tw("font-[700] text-[15px]")}>Level {detectLevel(props.name) === 1 ? "I" : "II"} Range</Text>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <View style={tw("flex-row justify-between p-5")}>
            <View>
              {analyteValues?.map((value, index) => (
                <Text style={tw(`mb-2 text-[13px] ${invalidIndexes?.has(index) ? "text-red-500" : ""}`)} key={index}>{QCData?.analytes[index].analyteName}</Text>
              ))}
            </View>
            <View>
              {analyteValues?.map((value, index) => (
                <Text style={tw(`mb-2 text-[13px] ${invalidIndexes?.has(index) ? "text-red-500" : ""}`)} key={index}>{parseFloat(value)} {QCData?.analytes[index].unitOfMeasure}</Text>
              ))}
            </View>
            <View>
              {analyteValues?.map((value, index) => (
                <Text style={tw(`mb-2 text-[13px] ${invalidIndexes?.has(index) ? "text-red-500" : ""}`)} key={index}>{QCData?.analytes[index].minLevel} - {QCData?.analytes[index].maxLevel} {QCData?.analytes[index].unitOfMeasure}</Text>
              ))}
            </View>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <Text style={tw("mt-2")}>QC Comments:</Text>
          <View>
            {modalData.map((item, index) => (
              <View style={tw("flex-row items-center")} key={index}>
                <View style={tw("self-center w-[4px] h-[4px] bg-black rounded-full")} />
                <Text style={tw("text-[13px] w-full px-6 text-justify text-wrap mt-2")}>{QCData?.analytes[item.invalidIndex].analyteName}: {item.comment}</Text>
              </View>
            ))}
          </View>
          <Text style={tw("mt-8 text-[13px]")}>Approved by: {}</Text>
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

  const handleAcceptQC = async () => {
    if (!qcData) {
      console.error("No QC data available to save.");
      return;
    }

    const qcDataToSave: AdminQCLot = {
      ...qcData,
      analytes: qcData.analytes.map((analyte, index) => ({
        ...analyte,
        value: analyteValues[index],
      })),
    };

    console.log("Data to save:", qcDataToSave);

    try {
      // await saveToDB("qc_store", qcDataToSave);
      // console.log("QC data saved successfully.");
      setAnalyteValues([]);
      setInvalidIndexes(null);
      setModalData([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving QC data:", error);
    }
  };

  if (!qcData) {
    return <p>No data available for this QC record.</p>;
  }

  return (
    <>
      <NavBar name={`${props.name} QC Results`} />
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
              <Analyte
                name={item.analyteName}
                acronym={item.analyteAcronym}
                minLevel={+item.minLevel}
                maxLevel={+item.maxLevel}
                // level={detectLevel(props.name)}
                measUnit={item.unitOfMeasure}
                value=''
                handleInputChange={(val: string) => {
                  // Convert string to number but pass the string to handleInputChange
                  const numericValue = +val;
                  if (item.minLevel !== "" && item.maxLevel !== "") {
                      handleInputChange(index, val, +item.minLevel, +item.maxLevel);  // Pass `val` as a string
                  } else {
                      handleInputChange(index, val, -1, 9999);  // Pass `val` as a string
                  }
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
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isInputFull ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isInputFull}
              onClick={() => setIsModalOpen(true)}
            >
              Apply QC Comment
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid || isValidManual ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValidManual && !isValid}
              onClick={() => openPDF()}
            >
              Print QC
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
              }`}
             disabled={!isValid}
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

export default SimpleAnalyteInputPage;
