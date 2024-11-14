import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getQCRangeByDetails } from '../../../utils/indexedDB/getData';
import { Analyte, MolecularQCTemplateBatch, QCPanel } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import { Modal, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import { Button } from '@mui/material';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';

interface TableData { creationDate: string; creationTime: string; tech: string; value: string; comment: string; }

const MolecularQualitativeAnalysis = () => {
  const { encodedSelectedAnalyteId, encodedStartDate, encodedEndDate } = useParams<{ encodedSelectedAnalyteId: string; encodedStartDate: string; encodedEndDate: string }>();
  const selectedAnalyteId = decodeURIComponent(encodedSelectedAnalyteId as string);
  const startDate = decodeURIComponent(encodedStartDate as string);
  const endDate = decodeURIComponent(encodedEndDate as string);
  const [dbData, setDBData] = useState<QCPanel | undefined>(undefined);
  const [analyte, setAnalyte] = useState<Analyte | undefined>(undefined);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [qcStatus, setQCStatus] = useState<string>('concern');
  const [qcComment, setQCComment] = useState<string>('');
  const navigate = useNavigate();

  const isoFormatDate = (date: string) => {
    const splitDate = date.split("/");
    return (`${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`);
  };

  useEffect(() => {
    const fetchAnalyteData = async () => {
      try {
        const dbData = JSON.parse(localStorage.getItem("selectedQCData") as string) as QCPanel;
        const analyte = dbData.analytes.find((element) => element.analyteName === selectedAnalyteId);
        if (dbData) {
          const qcData = ((await getQCRangeByDetails(dbData.qcName, dbData.lotNumber, dbData.closedDate || "")) as unknown) as MolecularQCTemplateBatch;
          const isoStartDate = isoFormatDate(startDate as string);
          const isoEndDate = isoFormatDate(endDate as string);
          const inRangeReports = qcData?.reports.filter(report => ((new Date(isoStartDate)).getTime() <= (new Date(report.creationDate)).getTime()) && ((new Date(report.creationDate)).getTime() <= (new Date(isoEndDate)).getTime()) && report.analyteInputs.some(input => input.analyteName === selectedAnalyteId)) || [];
          const analyteReports = [];
          for (const report of inRangeReports) {
            const reportAnalyteInputs = report.analyteInputs.filter(input => input.analyteName === selectedAnalyteId);
            for (const input of reportAnalyteInputs) {
              const creationDate = new Date(report.creationDate)
              analyteReports.push({ creationDate: creationDate.toDateString(), creationTime: creationDate.toTimeString(), tech: report.studentID, value: input.value, comment: input.comment });
            }
          }
          setDBData(dbData);
          setAnalyte(analyte);
          setTableData(analyteReports);
        }
      } catch (error) {
        console.error("Error fetching analyte data:", error);
      }
    };
    fetchAnalyteData();
  }, []);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleQcStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQCStatus(event.target.value);
    if (event.target.value === 'approved') { setQCComment(''); }
  };
  const saveComment = () => {
    if (qcStatus === 'concern') { } handleModalClose();
  };


  const columns: ColumnDef<TableData>[] = [
    {accessorKey: 'creationDate', header: 'Run Date', cell: (info) => info.getValue(), minSize: 50, maxSize: 50,},
    {accessorKey: 'creationTime', header: 'Run Time', cell: (info) => info.getValue(), minSize: 50, maxSize: 50,},
    {accessorKey: 'tech', header: 'Tech', cell: (info) => info.getValue(), minSize: 20, maxSize: 20,},
    {accessorKey: 'value', header: 'Test Range', cell: (info) => info.getValue(), minSize: 20, maxSize: 20,},
    {accessorKey: 'comment', header: 'QC Comments', cell: (info) => info.getValue(), minSize: 300, maxSize: 500,},
  ];

  const table = useReactTable({ data: tableData, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), });

  return (
    <div>
      <NavBar name="Review Controls: Molecular" />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginLeft: '15px', marginRight: '15px' }}>
        <div style={{ flex: '0 0 320px', marginRight: '20px' }}>
          <div style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '18px' }}>
            <div style={{ marginBottom: '3px' }}>QC Panel: {dbData?.qcName}</div>
          </div>
          <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
            <div>Lot #: {dbData?.lotNumber}</div>
          </div>
          <div style={{ marginBottom: '3px' }}>
            <div>Expiration Date: {dbData?.expirationDate}</div>
            <div>Open Date: {dbData?.openDate}</div>
            <div>Closed Date: {dbData?.closedDate}</div>
          </div>
          <div style={{ marginTop: '40px', fontWeight: 'bold' }}>
            <div>Analyte: {selectedAnalyteId}</div>
          </div>
          <div style={{ marginTop: '1px', fontWeight: 'bold', textDecoration: 'underline' }}>
            <div>Expected Range: {analyte?.expectedRange}</div>
          </div>
          <div>
          </div>

        </div>
        <div style={{ flex: '1', margin: '0 20px' }}>
          <div style={{ marginTop: '30px', marginBottom: '120px', textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '22px' }}>Qualitative Analysis:</span> <span style={{ fontSize: '22px' }}>{selectedAnalyteId}</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #ccc',
                        textAlign: 'left',
                        backgroundColor: '#3A6CC6',
                        color: 'white',
                        border: '1px solid #ccc',
                        width: header.column.columnDef.minSize || 100, 
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? '#DAE3F3' : '#B0C4DE',
                    height: '40px',
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #ccc',
                        border: '1px solid #ccc',
                        width: cell.column.columnDef.minSize || 100,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: '0 0 180px', marginLeft: '20px', marginTop: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>Review Date:</div>
          <div>Start Date: {startDate}</div>
          <div>End Date: {endDate}</div>
          <Button
            variant="outlined"
            style={{
              width: '200px',
              backgroundColor: '#DAE3F3',
              color: 'black',
              borderRadius: '10px',
              textAlign: 'center',
              padding: '10px 0',
              border: '1px solid #3A6CC6',
              marginTop: '50px'
            }}>LEARN
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
              border: '1px solid #3A6CC6',
              marginTop: '20px'
            }}>STUDENT NOTES
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
              border: '1px solid #3A6CC6',
              marginTop: '325px'
            }}
            onClick={handleModalOpen}>Review Comments
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
              border: '1px solid #3A6CC6',
              marginTop: '20px'
            }}
            onClick={() => { navigate('/molecular/qc_analysis_report') }}>Qualitative Analysis Report
          </Button>
        </div>
      </div>

      {/* Modal for review comments */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div style={{ backgroundColor: 'white', padding: '20px', margin: 'auto', marginTop: '100px', width: '400px', borderRadius: '8px' }}>
          <h3>REVIEW COMMENT OPTIONS:</h3>
          <RadioGroup value={qcStatus} onChange={handleQcStatusChange}>
            <FormControlLabel value="approved" control={<Radio />} label="QC Approved" />
            <FormControlLabel value="concern" control={<Radio />} label="QC Concern/Corrective Action" />
          </RadioGroup>
          {qcStatus === 'concern' && (
            <TextField
              label="Concern/Corrective Action"
              multiline
              rows={4}
              value={qcComment}
              onChange={(e) => setQCComment(e.target.value)}
              variant="outlined"
              fullWidth
              style={{ marginTop: '20px' }}
            />
          )}
          <Button variant="contained" onClick={saveComment} style={{ marginTop: '20px' }}>Save Comment to Report</Button>
        </div>
      </Modal>
    </div>
  );
};


export default MolecularQualitativeAnalysis;
