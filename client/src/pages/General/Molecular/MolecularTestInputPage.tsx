import { DatePicker } from "antd";
import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';
import NavBar from '../../../components/NavBar';
import dayjs from 'dayjs';
import { MolecularQCTemplateBatch, MolecularQCTemplateBatchAnalyte, ReportType, QualitativeMolecularQCTemplateBatchAnalyte } from "../../../utils/indexedDB/IDBSchema";
import { qcTypeLinkListMolecular } from "../../../utils/utils";
import { saveToDB, removeFromDB, getMolecularQCRangeByDetails } from "../../../utils/indexedDB/getData";

interface Ranges {
  [key: string]: string;
}

const MolecularTestingInputPage = () => {
  const [currentAnalytes, setCurrentAnalytes] = useState<MolecularQCTemplateBatchAnalyte[]>([]);
  const [formTitle, setFormTitle] = useState<string>('');
  const [ranges, setRanges] = useState<Ranges>({});
  const [QCLotInput, setQCLotInput] = useState<string>('');
  const [expDateInput, setExpDateInput] = useState<string>('');
  const [fileDateInput, setFileDateInput] = useState<string>('');
	const qcPanelRef = useRef<MolecularQCTemplateBatch>({} as MolecularQCTemplateBatch);


	const loadQCData = async () => {
    const currentPath = window.location.pathname; 
    const lastSegment = currentPath.split('/').pop() || "";

		const canonicalPanelName = qcTypeLinkListMolecular.find(item => item.link === lastSegment)?.name ?? "";
		const res = await getMolecularQCRangeByDetails(canonicalPanelName, "0", "");

    if (res) {
			qcPanelRef.current = res as MolecularQCTemplateBatch;
			const panelAnalytes = qcPanelRef.current.analytes;
      setCurrentAnalytes(panelAnalytes);
			setQCLotInput(qcPanelRef.current.lotNumber);
			setExpDateInput(qcPanelRef.current.closedDate);
			setFileDateInput(qcPanelRef.current.openDate);
      setFormTitle(capitalizeWords(lastSegment));
      const initialRanges = panelAnalytes.reduce((acc, item) => {
				if (item.reportType === ReportType.Qualitative) {
					acc[item.analyteName] = (item as QualitativeMolecularQCTemplateBatchAnalyte).expectedRange;
				}
				else {
        	acc[item.analyteName] = "";
				}
        return acc;
      }, {} as Ranges);
      setRanges(initialRanges);
    } else {
      console.error(`No analytes found for ${lastSegment}`);
    }
	};

  useEffect(() => {
		loadQCData();
  }, []);

  const capitalizeWords = (str: string) => {
    return str
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
		// TODO(not functional)
    if (Object.values(ranges).some(range => !range)) {
      alert("Please fill in all fields before submitting.");
      return;
    }
		const oldLotNumber = qcPanelRef.current.lotNumber;
		qcPanelRef.current.lotNumber = QCLotInput;
		const oldClosedDate = qcPanelRef.current.closedDate;
		qcPanelRef.current.closedDate = (new Date(expDateInput)).toISOString();
		qcPanelRef.current.openDate = (new Date(fileDateInput)).toISOString();
		for (let i = 0; i < qcPanelRef.current.analytes.length; i++) {
			let analyte = qcPanelRef.current.analytes[i];
			if (analyte.reportType === ReportType.Qualitative) {
				let concreteAnalyte = analyte as QualitativeMolecularQCTemplateBatchAnalyte;
				concreteAnalyte.expectedRange = ranges[concreteAnalyte.analyteName];
			}
		}
		removeFromDB('qc_store', {fileName: qcPanelRef.current.fileName, lotNumber: oldLotNumber, closedDate: oldClosedDate});
		saveToDB('qc_store', qcPanelRef.current);
  };

  const handleInputChange = (name: string, value: string) => {
    setRanges((prevRanges) => ({
      ...prevRanges,
      [name]: value,
    }));
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
              value={expDateInput ? dayjs(expDateInput) : dayjs()}
              format="MM/DD/YYYY"
              onChange={(value) => {
								value && setExpDateInput(value.toISOString());}
							}
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
              value={fileDateInput ? dayjs(fileDateInput) : dayjs()}
              format="MM/DD/YYYY"
              onChange={(value) => {
								value && setFileDateInput(value.toISOString());}
							}
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

export default MolecularTestingInputPage;
