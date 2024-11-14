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
import { BloodBankQCLot } from "../../../utils/indexedDB/IDBSchema";

interface QCItem {  // Used to read from the index DB
  reportId: string;
  qcName: string;
  lotNumber: string;
  expDate: string;
  createdDate: string;
}

const BloodBankReagentInputPage = (props: { name: string }) => {
  const { theme } = useTheme();
  const [qcData, setQcData] = useState<BloodBankQCLot | null>(null);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qcComment, setQcComment] = useState<string>("");

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

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
  };

  const reportPDF = (analyteValues?: string[], QCData?: BloodBankQCLot) => {
    const currentDate = new Date();
    const tw = createTw({});

    return (
      <Document>
        <Page style={tw("py-8 px-16")}>
          <Text style={tw("text-center sm:text-[24px]")}>Quality Controls Report</Text>
          <Text style={tw("mt-8 text-[13px]")}>Date: {currentDate.toLocaleDateString()}</Text>
          <Text style={tw("mb-8 text-[13px]")}>Lot Number: {QCData?.lotNumber || "N/A"}</Text>
          <Text style={tw("text-[22px] mb-8 text-center")}>{props.name} QC</Text>
          <View style={tw("flex-row justify-around")}>
            <Text style={tw("font-[700] text-[15px]")}>Analytes</Text>
            <Text style={tw("font-[700] text-[15px]")}>Value</Text>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <View style={tw("flex-row justify-between p-5")}>
            <View>
              {analyteValues?.map((value, index) => (
                <Text style={tw("mb-2 text-[13px]")} key={index}>
                  {QCData?.reagents[index].reagentName}: {value}
                </Text>
              ))}
            </View>
          </View>
          <View style={tw("w-full h-[1px] bg-black mt-2")} />
          <Text style={tw("mt-2")}>QC Comments: {qcComment || "No comments provided"}</Text>
          <Text style={tw("mt-8 text-[13px]")}>Approved by: [Your Name]</Text>
          <Text style={tw("mt-2 text-[13px]")}>Date: {currentDate.toLocaleDateString()}</Text>
          <Text style={tw("mt-2 text-[13px]")}>Time: {currentDate.toLocaleTimeString()}</Text>
        </Page>
      </Document>
    );
  };

  const openPDF = async () => {
    const blob = await pdf(reportPDF(analyteValues, qcData || undefined)).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, "_blank");
  };

  const handleAcceptQC = async () => {
    if (!qcData) {
      console.error("No QC data available to save.");
      return;
    }

    const qcDataToSave = {
      ...qcData,
      reagents: qcData.reagents.map((reagent, index) => ({
        ...reagent,
        value: analyteValues[index],
      })),
      qcComment,
    };

    try {
      // await saveToDB("qc_store", qcDataToSave);
      console.log("QC data saved successfully with comments.");
      setAnalyteValues([]);
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
                  ExpAHGRange={item.AHG}
                  ExpCheckCellsRange={item.checkCell}
                  handleInputChange={(val: string) => handleInputChange(index, val)}
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
                  ExpAHGRange={item.AHG}
                  ExpCheckCellsRange={item.checkCell}
                  handleInputChange={(val: string) => handleInputChange(index, val)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Sera Lot Table */}
        <div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Anti-Sera Lot</h3>
  <table className="w-full border-collapse border">
    <thead>
      <tr>
        <th className="border px-2 py-1 text-center"></th>
        <th className="border px-2 py-1 text-center">α-A</th>
        <th className="border px-2 py-1 text-center">α-B</th>
        <th className="border px-2 py-1 text-center">α-A,B</th>
        <th className="border px-2 py-1 text-center">α-D</th>
        <th className="border px-2 py-1 text-center">Ctrl</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-2 py-1 text-center font-semibold">Anti-Sera Lot #</td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for α-A" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for α-B" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for α-A,B" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for α-D" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for Ctrl" />
        </td>
      </tr>
      <tr>
        <td className="border px-2 py-1 text-center font-semibold">Exp. Date</td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for α-A" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for α-B" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for α-A,B" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for α-D" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for Ctrl" />
        </td>
      </tr>
    </tbody>
  </table>
</div>


        {/* Reverse Cell Lot Table */}
        <div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Reverse Cell Lot</h3>
  <table className="w-full border-collapse border">
    <thead>
      <tr>
        <th className="border px-2 py-1 text-center"></th>
        <th className="border px-2 py-1 text-center">A1</th>
        <th className="border px-2 py-1 text-center">B</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-2 py-1 text-center font-semibold">Reverse Cell Lot #</td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for A1" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for B" />
        </td>
      </tr>
      <tr>
        <td className="border px-2 py-1 text-center font-semibold">Exp. Date</td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for A1" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for B" />
        </td>
      </tr>
    </tbody>
  </table>
</div>


        {/* Screen Cell Lot Table */}
        <div className="mt-8">
  <h3 className="text-lg font-semibold mb-2">Screen Cell Lot</h3>
  <table className="w-full border-collapse border">
    <thead>
      <tr>
        <th className="border px-2 py-1 text-center"></th>
        <th className="border px-2 py-1 text-center">SC1</th>
        <th className="border px-2 py-1 text-center">SC2</th>
        <th className="border px-2 py-1 text-center">SC3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-2 py-1 text-center font-semibold">Screen Cell Lot #</td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for SC1" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for SC2" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Lot # for SC3" />
        </td>
      </tr>
      <tr>
        <td className="border px-2 py-1 text-center font-semibold">Exp. Date</td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for SC1" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for SC2" />
        </td>
        <td className="border px-2 py-1 text-center">
          <input type="text" className="w-full border p-1 rounded-md" placeholder="Exp. Date for SC3" />
        </td>
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