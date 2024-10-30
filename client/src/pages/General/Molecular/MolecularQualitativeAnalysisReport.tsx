import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData'; 
import { QCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import NavBar from '../../../components/NavBar';

interface QCData {runDateTime: string; result: string; tech: string; testRange: string; comments: string;}

const MolecularQualitativeAnalysisReport = () => {
  const { fileName, lotNumber, analyteName } = useParams<{ fileName: string; lotNumber: string; analyteName: string }>();
  const [qcData, setQcData] = useState<QCData[]>([]);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [closeDate, setCloseDate] = useState<string | null>(null);
  const [expectedRange, setExpectedRange] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(''); 
  const [qcStatus, setQcStatus] = useState(''); 
  const [qcComment, setQcComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getAllDataFromStore('qc_store')) as QCTemplateBatch[];
        const matchingRecords = data.filter(
          (item) => item.fileName === fileName && item.lotNumber === lotNumber
        );

        if (matchingRecords.length > 0) {
          const firstRecord = matchingRecords[0];
          setOpenDate(firstRecord.openDate || 'N/A');
          setCloseDate(firstRecord.closedDate || 'N/A');

          /*const analyte = firstRecord.analytes.find((a) => a.analyteName === analyteName);
          if (analyte) {
            setExpectedRange(analyte.expectedRange || 'Unknown');
          }*/

          const qcResults = matchingRecords.map((record) => {
            const analyte = record.analytes.find((a) => a.analyteName === analyteName);
            if (analyte) {
              return {
                runDateTime: record.closedDate,
                result: analyte.value ? analyte.value.toString() : analyte.mean,
                tech: analyte.tech || 'Unknown',
                testRange: `${analyte.minLevel || 'N/A'} - ${analyte.maxLevel || 'N/A'}`,
                comments: analyte.comments || 'No comments available',
              };
            }
            return null;
          }).filter((d): d is QCData => d !== null);

          setQcData(qcResults);
        }
      } catch (error) {
        console.error('Error fetching QC data:', error);
      }
    };

    fetchData();
  }, [fileName, lotNumber, analyteName]);

  const handleSignature = () => {
    if (reviewerName.trim() !== '') {
      const date = new Date();
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      const formattedTime = `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
      
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
      setIsSigned(true);
    }
  };

  const printReport = async () => {
    const input = document.getElementById('pdfContent');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save('Qualitative_Analysis_Report.pdf');
    }
  };

  const submitReport = () => {
    alert("Report submitted to assignment successfully!");
    // Logic to actually submit report to the assignment or backend API
  };

  return (
    
    <div className="p-6 rounded-md shadow-lg bg-white dark:bg-card text-black dark:text-white" id="pdfContent">

        <NavBar name = "Review Controls: Molecular"/>    

      <h1 className="text-3xl font-bold mb-4 text-gray-500 underline">Quality Control: Qualitative Analysis Report</h1>
      
      <div className="mb-4">
        <p><strong>QC Panel:</strong> {fileName}</p>
        <p><strong>Lot #:</strong> {lotNumber}</p>
        <p><strong>Expiration Date:</strong> mm/dd/yyyy</p>
        <p><strong>Open Date:</strong> {openDate}</p>
        <p><strong>Close Date:</strong> {closeDate}</p>
        <p><strong>Analyte:</strong> {analyteName}</p>
        <p><strong>Expected Range:</strong> {expectedRange || 'Present'}</p>
      </div>

      <div className="mb-4">
        <p><strong>Review Date:</strong></p>
        <p><strong>Start Date:</strong> {startDate}</p>
        <p><strong>End Date:</strong> {endDate}</p>
      </div>

      <table className="min-w-full table-auto border-collapse mb-4">
        <thead className="bg-secondary text-secondary-foreground">
          <tr>
            <th className="p-2 border">Run Date</th>
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Tech</th>
            <th className="p-2 border">Test Range</th>
            <th className="p-2 border">QC Comments</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {qcData.map((row, index) => (
            <tr key={index} className="hover:bg-muted">
              <td className="p-2 border">{row.runDateTime.split(' ')[0]}</td>
              <td className="p-2 border">{row.runDateTime.split(' ')[1]}</td>
              <td className="p-2 border">{row.tech}</td>
              <td className="p-2 border">{row.testRange}</td>
              <td className="p-2 border">{row.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Reviewer Comments: {qcStatus}</h2>
        <p>{qcComment}</p>
      </div>

      <div className="mb-4">
        {!isSigned ? (
          <>
            <label className="block text-lg font-semibold mb-2">Enter Reviewer Name to Digitally Sign:</label>
            <input type="text" className="p-2 border rounded-md w-full mb-2" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)}/>
            <Button className="bg-primary text-white" onClick={handleSignature}>Digital Signature</Button>
          </>
        ) : (
          <p><strong>Approved By:</strong> {reviewerName} <br /><strong>Date:</strong> {currentDate} <br /><strong>Time:</strong> {currentTime}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button className="bg-secondary text-secondary-foreground" onClick={submitReport} disabled={!isSigned}>Submit Report Assignment</Button>
        <Button className="bg-secondary text-secondary-foreground" onClick={printReport}>Print Report as PDF</Button>
      </div>
    </div>
  );
};

export default MolecularQualitativeAnalysisReport;
