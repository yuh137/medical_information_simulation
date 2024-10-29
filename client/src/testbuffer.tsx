import React, { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { data } from "../../../utils/MOCK_DATA_MICRO.js"; // Ensure this path is correct
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';
import NavBar from '../../../components/NavBar';
import { DatePicker } from "antd";
import dayjs from 'dayjs';

interface Ranges {
  [key: string]: string;
}

interface Analyte {
  analyteName: string;
  analyteAcronym: string;
}

const App: React.FC = () => {
  const loaderData = useLoaderData() as { lotNumber: string; expirationDate: string; fileDate: string };
  const [ranges, setRanges] = useState<Ranges>({});
  const [currentAnalytes, setCurrentAnalytes] = useState<Analyte[]>([]);
  const [formTitle, setFormTitle] = useState<string>(''); // State to hold the title

  const [QCLotInput, setQCLotInput] = useState<string>(loaderData ? loaderData.lotNumber : "");
  const [expDate, setExpDate] = useState(dayjs(loaderData ? loaderData.expirationDate : undefined));
  const [fileDate, setFileDate] = useState(dayjs(loaderData ? loaderData.fileDate : undefined));

  useEffect(() => {
    const currentPath = window.location.pathname; 
    const lastSegment = currentPath.split('/').pop() || "";

    const panelAnalytes = data[lastSegment as keyof typeof data] as Analyte[] | undefined;

    if (panelAnalytes) {
      setCurrentAnalytes(panelAnalytes);
      setFormTitle(capitalizeWords(lastSegment));
      const initialRanges = panelAnalytes.reduce((acc, item) => {
        acc[item.analyteName] = ""; // Set to empty string or a default value
        return acc;
      }, {} as Ranges);
      setRanges(initialRanges);
    } else {
      console.error(`No analytes found for ${lastSegment}`);
    }
  }, []);

  const capitalizeWords = (str: string) => {
    return str
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleInputChange = (name: string, value: string) => {
    setRanges((prevRanges) => ({
      ...prevRanges,
      [name]: value,
    }));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Expected Ranges Report", 10, 10);
    doc.setFontSize(12);
    doc.text("Analyte Name", 10, 20);
    doc.text("Expected Range", 100, 20);

    let y = 30; 
    Object.entries(ranges).forEach(([name, range]) => {
      doc.text(name, 10, y);
      doc.text(range, 100, y);
      y += 10; 
    });

    doc.save("report.pdf");
  };

  const handleSubmit = () => {
    // Check if all fields are filled
    if (!QCLotInput || !expDate || !fileDate || Object.values(ranges).some(range => !range)) {
      alert("Please fill in all fields before submitting.");
      return;
    } 

    // Call the function to save data to the database (indexedDB or another method)
    console.log("Submitting data:", {
      lotNumber: QCLotInput,
      expirationDate: expDate?.toISOString(),
      fileDate: fileDate?.toISOString(),
      ranges,
    });
  };

  return (
    <>
      <NavBar name={``} />
      <div className="drawer-container flex flex-col items-center py-4 space-y-4">
        <div className="flex flex-row space-x-4">
          <div className="lotnumber-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
            <div className="lotnumber-label sm:text-xl font-semibold text-white text-center">QC Lot Number</div>
            <input
              type="text"
              className="sm:p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center"
              value={QCLotInput}
              onChange={(e) => setQCLotInput(e.target.value)}
            />
          </div>
          <div className="expdate-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
            <div className="expdate-label sm:text-xl font-semibold text-white text-center">Expiration Date</div>
            <DatePicker
              showTime
              style={{
                padding: "0.25rem",
                border: "solid 1px #548235",
                width: "150px",
                height: "34px",
              }}
              value={expDate}
              format="MM/DD/YYYY"
              onChange={(value) => setExpDate(value)}
            />
          </div>

          <div className="filedate-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
            <div className="filedate-label sm:text-xl font-semibold text-white text-center">File Date</div>
            <DatePicker
              showTime
              style={{
                padding: "0.25rem",
                border: "solid 1px #548235",
                width: "150px",
                height: "34px",
              }}
              value={fileDate}
              format="MM/DD/YYYY"
              onChange={(value) => setFileDate(value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
        <h1>{formTitle || 'Data Table'}</h1>
        <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Name</th>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Abbreviation</th>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Expected Range</th>
            </tr>
          </thead>
          <tbody>
            {currentAnalytes.map((item) => (
              <tr key={item.analyteName}>
                <td style={{ textAlign: 'center', padding: '10px' }}>{item.analyteName}</td>
                <td style={{ textAlign: 'center', padding: '10px' }}>{item.analyteAcronym}</td>
                <td style={{ textAlign: 'center', padding: '10px' }}>
                  <input
                    type="text"
                    value={ranges[item.analyteName] || ""}
                    onChange={(e) => handleInputChange(item.analyteName, e.target.value)}
                    aria-label={`Expected range for ${item.analyteName}`}
                    style={{ textAlign: 'center', width: '100%' }} // Center the input text
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <Button variant="contained" onClick={handleDownloadPDF}>Download PDF</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
};

export default App;
