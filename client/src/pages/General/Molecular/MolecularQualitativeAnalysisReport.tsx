import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MolecularQCTemplateBatch, QCPanel, Analyte } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import { getQCRangeByDetails } from '../../../utils/indexedDB/getData';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';

interface TableData { creationDate: string; creationTime: string; tech: string; value: string; comment: string; }
interface QCTableData { qcName: string, expectedRange: string }

const MolecularQualitativeAnalysisReport = () => {
  const { encodedSelectedAnalyteId, encodedStartDate, encodedEndDate } = useParams<{ encodedSelectedAnalyteId: string; encodedStartDate: string; encodedEndDate: string }>();
  const selectedAnalyteId = decodeURIComponent(encodedSelectedAnalyteId as string);
  const startDate = decodeURIComponent(encodedStartDate as string);
  const endDate = decodeURIComponent(encodedEndDate as string);

  const [reviewerName, setReviewerName] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [dbData, setDBData] = useState<QCPanel | undefined>(undefined);
  const [analyte, setAnalyte] = useState<Analyte | undefined>(undefined);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [qcTableData, setQCTableData] = useState<QCTableData[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [qcStatus, setQCStatus] = useState<string>('concern');
  const [qcComment, setQCComment] = useState<string>('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const isoFormatDate = (date: string) => {
    const splitDate = date.split("/");
    return (`${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`);
  };

  useEffect(() => {
    const fetchAnalyteData = async () => {
      try {
        const dbData = JSON.parse(localStorage.getItem("selectedQCData") as string) as QCPanel;
        const reviewComment = localStorage.getItem('reviewComment') as string;
        const analyte = dbData.analytes.find((element) => element.analyteName === selectedAnalyteId);
        if (dbData) {
          const qcData = ((await getQCRangeByDetails(dbData.qcName, dbData.lotNumber, dbData.closedDate || "")) as unknown) as MolecularQCTemplateBatch;
          const isoStartDate = isoFormatDate(startDate as string);
          const isoEndDate = isoFormatDate(endDate as string);
          const inRangeReports = qcData?.reports.filter(report => ((new Date(isoStartDate)).getTime() <= (new Date(report.createdDate)).getTime()) && ((new Date(report.createdDate)).getTime() <= (new Date(isoEndDate)).getTime()) && report.analyteInputs.some(input => input.analyteName === selectedAnalyteId)) || [];
          const analyteReports = [];
          for (const report of inRangeReports) {
            const reportAnalyteInputs = report.analyteInputs.filter(input => input.analyteName === selectedAnalyteId);
            for (const input of reportAnalyteInputs) {
              const creationDate = new Date(report.createdDate)
              analyteReports.push({ creationDate: creationDate.toDateString(), creationTime: creationDate.toTimeString(), tech: report.studentID, value: input.analyteValue, comment: input.comment });
            }
          }
          setDBData(dbData);
          setAnalyte(analyte);
          setTableData(analyteReports);
          setQCTableData([{
            qcName: dbData.qcName,
            expectedRange: analyte?.expectedRange || ""
          }]);
        }
      } catch (error) {
        console.error("Error fetching analyte data:", error);
      }
    }
    fetchAnalyteData();
  }, []);



  const columns: ColumnDef<TableData>[] = [
    { accessorKey: 'creationDate', header: 'Run Date', cell: (info) => info.getValue(), minSize: 50, maxSize: 50, },
    { accessorKey: 'creationTime', header: 'Run Time', cell: (info) => info.getValue(), minSize: 50, maxSize: 50, },
    { accessorKey: 'tech', header: 'Tech', cell: (info) => info.getValue(), minSize: 20, maxSize: 20, },
    { accessorKey: 'value', header: 'Test Range', cell: (info) => info.getValue(), minSize: 20, maxSize: 20, },
    { accessorKey: 'comment', header: 'Comments', cell: (info) => info.getValue(), minSize: 300, maxSize: 500, },
  ];

  const qcColumns: ColumnDef<QCTableData>[] = [
    { accessorKey: 'qcName', header: 'Test Name', cell: (info) => info.getValue(), minSize: 50, maxSize: 50, },
    { accessorKey: 'expectedRange', header: 'Expected Range', cell: (info) => info.getValue(), minSize: 50, maxSize: 50, },
  ];

  const table = useReactTable({ data: tableData, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), });
  const qcTable = useReactTable({ data: qcTableData, columns: qcColumns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), });

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
      try {
        // Increase the scale to enhance resolution and ensure the content fills the page
        const canvas = await html2canvas(input, {
          scale: 5, // Adjust this value to control resolution (higher value gives better resolution)
          useCORS: true // Handle cross-origin issues for external assets if needed
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Standard A4 page size in portrait mode

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth; // Set image width to page width
        const imgHeight = (canvas.height * pageWidth) / canvas.width; // Maintain aspect ratio

        // If the image height exceeds the page height, scale it to fit
        const yOffset = 0; // Start Y position for rendering the image
        if (imgHeight > pageHeight) {
          pdf.addImage(imgData, 'PNG', 0, yOffset, pageWidth, pageHeight); // Stretch to fit page height
        } else {
          pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight); // Maintain aspect ratio
        }

        pdf.save('Qualitative_Analysis_Report.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    } else {
      console.error('Failed to find content to print');
    }
  };


  const submitReport = () => {
    alert("Report submitted to assignment successfully!");
    // Logic to actually submit report to the assignment or backend API
  };

  return (
    <div>
      <NavBar name="Review Controls: Molecular" />

      {/* Main Content Box */}
      <div id="pdfContent" style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}><div
        style={{
          maxWidth: '800px',
          width: '90%',
          height: 'calc(100vh - 150px)', // Adjust to fit content within viewport
          border: '1px solid #ccc',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden', // Prevent scrolling
          position: 'relative' // Added for positioning elements
        }}
      >
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'gray', textDecoration: 'underline' }}>Quality Control: Qualitative Analysis Report</h1>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>Molecular</h2>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1px' }}>
          <h2 style={{ fontSize: '20px', color: 'black' }}>{selectedAnalyteId}</h2>
        </div>

        {/* Top Section with QC Panel, Lot #, and Dates */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ flex: '0 0 180px', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>
              <div>QC Panel: {dbData?.qcName}</div>
              <div>Lot #: {dbData?.lotNumber}</div>
              <div>Expiration Date: {dbData?.expirationDate}</div>
              <div>Open Date: {dbData?.openDate}</div>
              <div>Closed Date: {dbData?.closedDate}</div>
            </div>
          </div>

          <div style={{ flex: '0 0 120px', textAlign: 'left', fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '1px' }}>Review Date:</div> {/* Added margin for spacing */}
            <div style={{ marginBottom: '0px' }}>Start Date: {startDate}</div>
            <div>End Date: {endDate}</div>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} style={{ backgroundColor: '#3A6CC6', color: 'white' }}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{
                        padding: '10px', // Increase padding if needed
                        border: '1px solid #ccc', // Add border to match desired style
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '14px', // Adjust font size
                        textTransform: 'uppercase' // Optional: make text uppercase
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? '#F5F5F5' : 'white', // Light grey alternating row color
                      height: '40px',
                      borderBottom: '1px solid #ccc' // Bottom border for rows
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{
                          padding: '8px 12px', // Adjust padding for cells
                          border: '1px solid #ccc', // Add border for cell separation
                          textAlign: 'left',
                          fontSize: '12px' // Adjust font size
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '10px' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {qcTable.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} style={{ backgroundColor: '#3A6CC6', color: 'white' }}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{
                        padding: '10px', // Increase padding if needed
                        border: '1px solid #ccc', // Add border to match desired style
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '14px', // Adjust font size
                        textTransform: 'uppercase' // Optional: make text uppercase
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {qcTableData.length > 0 ? (
                qcTable.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? '#F5F5F5' : 'white', // Light grey alternating row color
                      height: '40px',
                      borderBottom: '1px solid #ccc' // Bottom border for rows
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{
                          padding: '8px 12px', // Adjust padding for cells
                          border: '1px solid #ccc', // Add border for cell separation
                          textAlign: 'left',
                          fontSize: '12px' // Adjust font size
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={qcColumns.length} style={{ textAlign: 'center', padding: '10px' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        { /* Digital Signature Section */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', textAlign: 'center' }}>
          {!isSigned ? (
            <>
              {!isInputVisible ? (
                // Display as a button initially
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#DAE3F3',
                    border: '1px solid #3A6CC6',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginTop: '10px',
                    width: 'fit-content',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                  onClick={() => setIsInputVisible(true)} // Toggle input visibility
                >
                  Digital Signature
                </div>
              ) : (
                // Display input for entering name when button is clicked
                <>
                  <label className="block text-lg font-semibold mb-2" style={{ marginBottom: '10px' }}>
                    Enter Reviewer Name to Digitally Sign:
                  </label>
                  <input
                    type="text"
                    className="p-2 border rounded-md"
                    style={{ width: '250px', marginBottom: '10px' }}
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSignature(); // Call the signature function on Enter key press
                      }
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'pacifico', fontSize: '18px', marginBottom: '5px' }}>
                {reviewerName}
              </p>
              <div style={{ borderTop: '1px solid #000', width: '100px', margin: '0 auto', marginBottom: '5px' }}></div>
              <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Reviewer Signature</p>
            </div>
          )}
        </div>

        {/* Centered Approver Message */}
        {isSigned && (
          <div style={{ textAlign: 'left', marginTop: '275px' }}>
            <p style={{ marginBottom: '5px' }}>
              <strong>Approved By:</strong> {reviewerName} <br />
              <strong>Date:</strong> {currentDate} <br />
              <strong>Time:</strong> {currentTime}
            </p>
          </div>
        )}
      </div>
      </div>

      {/* Buttons placed at the bottom-right corner of the screen */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}
      >
        <Button
          variant="outlined"
          style={{
            width: '200px',
            backgroundColor: '#DAE3F3',
            color: 'black',
            borderRadius: '10px',
            marginBottom: '10px',
            textAlign: 'center',
            padding: '10px 0',
            border: '1px solid #3A6CC6'
          }}
          onClick={printReport}
        >
          Print Report as PDF
        </Button>
        <Button
          variant="outlined"
          style={{
            width: '200px',
            backgroundColor: '#DAE3F3',
            color: 'black',
            borderRadius: '10px',
            textAlign: 'center',
            padding: '10px 0',
            border: '1px solid #3A6CC6'
          }}
          onClick={submitReport}
          disabled={!isSigned}
        >
          Submit Report Assignment
        </Button>
      </div>
    </div>
  );
};

export default MolecularQualitativeAnalysisReport;
