import React, { useEffect, useState } from 'react';
import { BloodBankRBC } from '../../../utils/indexedDB/IDBSchema';
import ReagentLine from '../../../components/ReagentLine';
import NavBar from '../../../components/NavBar';
import { pdf, Document, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import { Button, ButtonBase, Modal, Backdrop } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { saveToDB } from '../../../utils/indexedDB/getData';
import { BBStudentReport } from "../../../utils/utils";
import { BloodBankQCLot, Student } from "../../../utils/indexedDB/IDBSchema";
import { useAuth } from "../../../context/AuthContext";
import { useLoaderData, Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
    ColumnDef,
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel
  } from "@tanstack/react-table";

interface QCItem {  // Used to read from the index DB
  reportId: string;
  qcName: string;
  lotNumber: string;
  expDate: string;
  createdDate: string;
}

// Used to format dates so that the time isn't shown and it's in mm/dd/yyyy format
function formatDate(dateString: string) {
  const index = dateString.indexOf('T');
  dateString = dateString.substring(0, index);  // Cuts off everything after the "T"
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

// Given the user input and expected value, returns if this was incorrect
function isIncorrect(val1: string, val2: string) {
  return val1 !== val2 && !val2.includes(val1);
}


const BloodBankRBCResultInput = (props: { name: string }) => {
  const { theme } = useTheme();
  const { item } = useParams();
  const loaderData = useLoaderData() as string;
  const [qcData, setQcData] = useState<BloodBankQCLot | null>(null);
  const [imsValues, setImsValues] = useState<string[]>([]);
  const [thirtyValues, setThirtyValues] = useState<string[]>([]);
  const [ahgValues, setAhgValues] = useState<string[]>([]);
  const [ccValues, setCcValues] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qcComment, setQcComment] = useState<string>("");
  const { type, userId } = useAuth();
  type reagentStats = { [key: string]: string};
  type reagentDictType = { [key: string ]: reagentStats}
  const [reagentDict, setReagentDict] = useState<reagentDictType>({});
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("TBD")

  const getName = async () => {  // Gets the username from ID
    // TEMP: Check if Student or Faculty
    const res = await fetch(`${process.env.REACT_APP_API_URL}/Students/${userId}`);
    if (res.ok ) {
      const studentUser: Student = await res.json();
      return studentUser.firstname + " " + studentUser.lastname;
    } else {  // Student could not be found
      return "User";
    }
  }

  const getReportData = async () => {
    const storedQCData = localStorage.getItem('selectedQCData');
    if (storedQCData) {
      let reportId: string = loaderData;
      // let reportData: QCItem = JSON.parse(storedQCData)[0];  // Fetch the report
      // console.log(reportData);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/BBStudentReport/${reportId}`);
      if (res.ok) {  // Successfully fetched the report
        const report: BBStudentReport = await res.json();
        const qcLotId = report.bloodBankQCLotID;
        const bbLotRes = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots/${qcLotId}`);
        if (bbLotRes.ok) {  // Successfully fetched the QC Lot
          const bbLot: BloodBankQCLot = await bbLotRes.json();
          console.log(bbLot);
          setQcData(bbLot);
        }
      }
    } else {
      console.error("No QC data found.");
    }
  }
  useEffect(() => {
    getReportData();
  }, []);

  const doHandleInputChange = (index: number, ims: string, thirty: string, ahg: string, cc: string) => {
    const enter_values = [ims, thirty, ahg, cc];
    const sIndex: string = index.toString();
    const newDict = { ...reagentDict };  // Clone reagent dict
    if (sIndex in newDict ) {
        newDict[sIndex]["IMS"] = ims;
        newDict[sIndex]["Thirty"] = thirty;
        newDict[sIndex]["AHG"] = ahg;
        newDict[sIndex]["CC"] = cc;
    } else {
        newDict[sIndex] = {"IMS": ims, "Thirty": thirty, "AHG": ahg, "CC": cc};
    }
    setReagentDict(newDict)
  };

  const reportPDF = (username: string, QCData: BloodBankQCLot) => {
    const currentDate = new Date();
    const tw = createTw({}); 
    console.log(reagentDict);
    console.log(QCData?.reagents["0"]);
    console.log("^^^");
    return (
      <Document>
        <Page style={tw("py-8 px-16")}>
          <Text style={tw("text-center sm:text-[24px]")}>Quality Controls Report</Text>
          <Text style={tw("mt-8 text-[13px]")}>Date: {currentDate.toLocaleDateString()}</Text>
          <Text style={tw("mb-8 text-[13px]")}>Lot Number: {QCData?.lotNumber || "N/A"}</Text>
          <Text style={tw("text-[22px] mb-8 text-center")}>{QCData?.qcName} QC</Text>
          <View style={tw("flex-row justify-around")}>
            <Text style={tw("font-[700] text-[15px]")}>Reagents</Text>
            <Text style={tw("font-[700] text-[15px]")}>Value</Text>
            <Text style={tw("font-[700] text-[15px]")}>Expected Value</Text>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <View style={tw("flex-row justify-around p-5")}>
            <View>
              {Object.entries(reagentDict)?.map(([value], index) => (
                <Text style={tw("mb-2 text-[13px]")}>
                  <Text style={tw(isIncorrect(reagentDict[value]["IMS"], QCData?.reagents[index].immediateSpin) ? "text-red-500" : "")}>
                    {QCData?.reagents[index].reagentName}{" (IS)\n"}
                  </Text>
                  <Text style={tw(isIncorrect(reagentDict[value]["Thirty"], QCData?.reagents[index].thirtySevenDegree) ? "" : "")}>
                    {QCData?.reagents[index].reagentName}{" (37*)\n"}
                  </Text>
                  <Text style={tw(isIncorrect(reagentDict[value]["AHG"], QCData?.reagents[index].immediateSpin) ? "" : "")}>
                    {QCData?.reagents[index].reagentName}{" (AHG)\n"}
                  </Text>
                  <Text style={tw(isIncorrect(reagentDict[value]["CC"], QCData?.reagents[index].checkCell) ? "" : "")}>
                    {QCData?.reagents[index].reagentName}{" (CC)"}
                  </Text>
                </Text>
              ))}
            </View>
            <View>
              {Object.entries(reagentDict)?.map(([value], index) => (
                <View style={tw("flex-row")} key={index}>
                  <Text style={tw("mb-2 text-[13px]")}>
                    {reagentDict[value]["IMS"]}{"\n"}
                    {reagentDict[value]["Thirty"]}{"\n"}
                    {reagentDict[value]["AHG"]}{"\n"}
                    {reagentDict[value]["CC"]}
                  </Text>
                </View>
              ))}
            </View>
            <View>
              {Object.entries(reagentDict)?.map(([value], index) => (
                <View style={tw("flex-row")} key={index}>
                  <Text style={tw("mb-2 text-[13px]")}>
                    {QCData?.reagents[index].immediateSpin}{"\n"}
                    {QCData?.reagents[index].thirtySevenDegree}{"\n"}
                    {QCData?.reagents[index].ahg}{"\n"}
                    {QCData?.reagents[index].checkCell}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <Text style={tw("mt-2")}>QC Comments: {qcComment || "No comments provided"}</Text>
          <Text style={tw("mt-8 text-[13px]")}>Approved by: {username}</Text>
          <Text style={tw("mt-2 text-[13px]")}>Date: {currentDate.toLocaleDateString()}</Text>
          <Text style={tw("mt-2 text-[13px]")}>Time: {currentDate.toLocaleTimeString()}</Text>
        </Page>
      </Document>
    );
  };

  const openPDF = async () => {
    const username = await getName();
    if (qcData) {
      const blob = await pdf(reportPDF(username, qcData)).toBlob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    }
  };

  const handleAcceptQC = async () => {
    if (!qcData) {
      console.error("No QC data available to save.");
      return;
    }
    if (Object.keys(reagentDict).length != Object.keys(qcData.reagents).length) {
      setErrorMsg("Data is incomplete");
      setErrorNotiOpen(true);
      console.log("Incomplete data");
      return;
    }
    if (qcComment === "") {  // If we don't have a comment
      for (const [key, value] of Object.entries(reagentDict)) {
        const reag = qcData.reagents[+key];
        if (isIncorrect(value["IMS"], reag.immediateSpin) || isIncorrect(value["AHG"], reag.ahg) || isIncorrect(value["Thirty"], reag.thirtySevenDegree) || isIncorrect(value["CC"], reag.checkCell)) {
          setErrorMsg("You must have a comment to accept results with errors");
          setErrorNotiOpen(true);
          console.log("Must have a comment");
          return;
        }
      }
    }
    /*
    const qcDataToSave = {
      ...qcData,
      reagents: qcData.reagents.map((reagent, index) => ({
        ...reagent,
        value: reagentValues[index],
      })),
      qcComment,
    };
    */

    try {
      console.log("QC data saved successfully with comments.");
      // setReagentValues([]);
      // const res = await fetch(`${process.env.REACT_APP_API_URL}/Students/${userId}`);
      let reportId: string = loaderData;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/BBStudentReport/${reportId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res.status === 404) {
        console.log("Report has already been deleted");
      } else if (res.ok ) {
        console.log("Successful deletion");
      } else {
        console.log("Could not delete student report");
      }
    } catch (error) {
      console.error("Error saving QC data:", error);
    }
  };

  if (!qcData) {
    return <p>No data available for this QC record.</p>;
  }

  return (
    <>
      <NavBar name={`Blood Bank QC Results`} />
      <div className="flex flex-col space-y-6 pb-8 justify-center px-8" style={{ minWidth: "100svw", minHeight: "100svh" }}>
        
        {/* Positive Control Reactions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Reagents</h3>
          <div className="flex flex-col gap-4 items-left">
          <div className="Reagent-container flex flex-row gap-12 items-center h-4 flex-shrink-0 bg-[#B4C7E7] border-2 border-[#7F9458] p-4">
            <div className="Reagent-name flex-1 bg-gray text-center font-bold">Reagent Name</div>
            <div className="Reagent-name flex-1 bg-gray text-center font-bold">Immediate Spin</div>
            <div className="Reagent-name flex-1 bg-gray text-center font-bold">37°</div>
            <div className="Reagent-name flex-1 bg-gray text-center font-bold">AHG</div>
            <div className="Reagent-name flex-1 bg-gray text-center font-bold">Check Cells</div>
          </div>
            {qcData.reagents.map((item, index) => (
              <div key={`${item.reagentName}-${index}`} className="text-center">
                <ReagentLine
                  controlType="positive"
                  reagentName={item.reagentName}
                  Abbreviation={item.abbreviation}
                  AntiSeraLot={item.reagentLotNum}
                  reagentExpDate={item.expirationDate}
                  PosExpectedRange={item.posExpectedRange}
                  NegExpectedRange={item.negExpectedRange}
                  ExpImmSpinRange={item.immediateSpin}
                  Exp37Range={item.thirtySevenDegree}
                  ExpAHGRange={item.ahg}
                  ExpCheckCellsRange={item.checkCell}
                  handleInputChange={(ims: string, thirty: string, ahg: string, cc: string) => doHandleInputChange(index, ims, thirty, ahg, cc)}
                  // handleInputChange={(val: string) => posHandleInputChange(index, val)}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Anti-Sera Lot Table */}
        <div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Reagent Lot</h3>
  <table className="w-full border-collapse border">
    <tbody>
      <tr>
        <td className="border px-4 py-2">Reagent</td>
        {qcData.reagents.map((item, index) => (
        <td key={index} className="border px-4 py-2 text-center">
          {item.reagentName}
        </td>
        ))}
      </tr>
      <tr>
        <td className="border px-4 py-2">Reagent Lot #</td>
        {qcData.reagents.map((item, index) => (
        <td key={index} className="border px-4 py-2 text-center">
          {item.reagentLotNum}
        </td>
        ))}
      </tr>
      <tr>
        <td className="border px-4 py-2">Exp. Date</td>
        {qcData.reagents.map((item, index) => (
        <td key={index} className="border px-4 py-2 text-center">
          {formatDate(item.expirationDate)}
        </td>
        ))}
      </tr>
    </tbody>
  </table>
</div>



        {/* Control Buttons */}
        <div className="flex justify-around mt-8">
          <Button className="bg-blue-300 text-black font-semibold px-4 py-2 rounded-md" onClick={() => setIsModalOpen(true)}>
            Apply QC Comment
          </Button>
          <Button className="bg-blue-300 text-black font-semibold px-4 py-2 rounded-md" onClick={handleAcceptQC}>
            Accept QC
          </Button>
          <Button className="bg-blue-300 text-black font-semibold px-4 py-2 rounded-md" onClick={openPDF}>
            Print QC
          </Button>
        </div>
      </div>

      {/* QC Comment Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={`modal-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:w-[50svw] sm:h-auto bg-[${theme.secondaryColor}] border-2 border-solid border-[#6781AF] rounded-xl sm:py-6 sm:px-10`}>
          <div className="modal-title sm:text-2xl font-semibold text-center">
            QC Comment
          </div>
          <textarea
            className="w-full h-32 mt-4 p-2 border border-gray-300 rounded-md"
            placeholder="Enter comments for the entire QC order here..."
            value={qcComment}
            onChange={(e) => setQcComment(e.target.value)}
          />
          <ButtonBase className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md" onClick={() => setIsModalOpen(false)}>
            Save Comment
          </ButtonBase>
        </div>
      </Modal>
      <Backdrop  // ERROR BACKDROP
        open={isErrorNotiOpen}
        
        onClick={() => {
          setErrorNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              { 
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>{errorMsg}</div>
                  </div>
                </>
              }
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
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

export default BloodBankRBCResultInput;