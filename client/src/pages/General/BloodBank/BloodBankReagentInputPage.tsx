import React, { useEffect, useState } from 'react';
import { BloodBankRBC } from '../../../utils/indexedDB/IDBSchema';
import Reagent from '../../../components/Reagent';
import NavBar from '../../../components/NavBar';
import { pdf, Document, Page, Text, View } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import { Button, ButtonBase, Modal } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { saveToDB } from '../../../utils/indexedDB/getData';
import { BBStudentReport } from "../../../utils/utils";
import { BloodBankQCLot, Student } from "../../../utils/indexedDB/IDBSchema";
import { useAuth } from "../../../context/AuthContext";


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

const BloodBankReagentInputPage = (props: { name: string }) => {
  const { theme } = useTheme();
  const [qcData, setQcData] = useState<BloodBankQCLot | null>(null);
  const [reagentValues, setReagentValues] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qcComment, setQcComment] = useState<string>("");
  const { type, userId } = useAuth();
  type reagentStats = { [key: string]: string};
  type reagentDictType = { [key: string ]: reagentStats}
  const [reagentDict, setReagentDict] = useState<reagentDictType>({});

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
      let reportData: QCItem = JSON.parse(storedQCData)[0];  // Fetch the report
      const res = await fetch(`${process.env.REACT_APP_API_URL}/BBStudentReport/${reportData.reportId}`);
      if (res.ok) {  // Successfully fetched the report
        const report: BBStudentReport = await res.json();
        const qcLotId = report.bloodBankQCLotID;
        const bbLotRes = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots/${qcLotId}`);
        if (bbLotRes.ok) {  // Successfully fetched the QC Lot
          const bbLot: BloodBankQCLot = await bbLotRes.json();
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

  const posHandleInputChange = (index: number, value: string) => {
    const newValues = [...reagentValues];
    newValues[index] = value;
    const sIndex: string = index.toString();
    const newDict = { ...reagentDict };  // Clone reagent dict
    if (sIndex in newDict ) {  // This already exists
      newDict[sIndex]["Pos"] = value;
    } else {
      newDict[sIndex] = {"Pos": value};
    }
    setReagentDict(newDict)
    setReagentValues(newValues);
  };

  const negHandleInputChange = (index: number, value: string) => {
    const newValues = [...reagentValues];
    newValues[index] = value;
    const sIndex: string = index.toString();
    const newDict = { ...reagentDict };  // Clone reagent dict
    if (sIndex in newDict ) {  // This already exists
      newDict[sIndex]["Neg"] = value;
    } else {
      newDict[sIndex] = {"Neg": value};
    }
    setReagentDict(newDict);
    setReagentValues(newValues);
  };

  const reportPDF = (username: string, reagentValues?: string[], QCData?: BloodBankQCLot) => {
    const currentDate = new Date();
    const tw = createTw({});
    return (
      <Document>
        <Page style={tw("py-8 px-16")}>
          <Text style={tw("text-center sm:text-[24px]")}>Quality Controls Report</Text>
          <Text style={tw("mt-8 text-[13px]")}>Date: {currentDate.toLocaleDateString()}</Text>
          <Text style={tw("mb-8 text-[13px]")}>Lot Number: {QCData?.lotNumber || "N/A"}</Text>
          <Text style={tw("text-[22px] mb-8 text-center")}>{QCData?.qcName} QC</Text>
          <View style={tw("flex-row justify-between")}>
            <Text style={tw("font-[700] text-[15px] w-1/3 text-center")}>Reagents</Text>
            <Text style={tw("font-[700] text-[15px] w-1/3 text-center")}>Value</Text>
            <Text style={tw("font-[700] text-[15px] w-1/3 text-center")}>Expected Value</Text>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <View style={tw("flex-row justify-between p-5")}>
            {/* Reagents Column */}
            <View style={tw("w-1/3")}>
              {Object.entries(reagentDict)?.map(([value], index) => (
                <Text key={index} style={tw("mb-2 text-[13px] text-center")}>
                  {QCData?.reagents[index].reagentName}{" (+)\n"}
                  {QCData?.reagents[index].reagentName}{" (=)"}
                </Text>
              ))}
            </View>
            {/* Values Column */}
            <View style={tw("w-1/3")}>
              {Object.entries(reagentDict)?.map(([value], index) => (
                <Text key={index} style={tw("mb-2 text-[13px] text-center")}>
                  {reagentDict[value]["Pos"]}{"\n"}
                  {reagentDict[value]["Neg"]}
                </Text>
              ))}
            </View>
            {/* Expected Values Column */}
            <View style={tw("w-1/3")}>
              {Object.entries(reagentDict)?.map(([value], index) => (
                <Text key={index} style={tw("mb-2 text-[13px] text-center whitespace-nowrap")}>
                  {QCData?.reagents[index].posExpectedRange}{"\n"}
                  {QCData?.reagents[index].negExpectedRange}
                </Text>
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
    const blob = await pdf(reportPDF(username, reagentValues, qcData || undefined)).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
  };

  const handleAcceptQC = async () => {
    if (!qcData) {
      console.error("No QC data available to save.");
      return;
    }
    console.log(qcData);
    const qcDataToSave = {
      ...qcData,
      reagents: qcData.reagents.map((reagent, index) => ({
        ...reagent,
        value: reagentValues[index],
      })),
      qcComment,
    };

    try {
      // await saveToDB("qc_store", qcDataToSave);
      console.log("QC data saved successfully with comments.");
      setReagentValues([]);
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
      <div className="flex flex-col space-y-6 pb-8 justify-center px-8" style={{ minWidth: "100svw", minHeight: "100svh" }}>
        
        {/* Positive Control Reactions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Positive Control Reactions</h3>
          <div className="flex flex-row space-x-4 items-center">
            {qcData.reagents.map((item, index) => (
              <div key={`${item.reagentName}-${index}`} className="text-center">
                <Reagent
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
                  handleInputChange={(val: string) => posHandleInputChange(index, val)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Negative Control Reactions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Negative Control Reactions</h3>
          <div className="flex flex-row space-x-4 items-center">
            {qcData.reagents.map((item, index) => (
              <div key={`${item.reagentName}-${index}`} className="text-center">
                <Reagent
                  controlType="negative"
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
                  handleInputChange={(val: string) => negHandleInputChange(index, val)}
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
    </>
  );
};

export default BloodBankReagentInputPage;