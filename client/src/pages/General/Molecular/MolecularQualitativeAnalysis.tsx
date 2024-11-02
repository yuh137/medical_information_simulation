import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData';
import { MolecularQCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
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

interface TableData {creationDate: string; creationTime: string; tech: string; value: string; comment: string;}

const MolecularQualitativeAnalysis = () => {
  const { encodedSelectedAnalyteId, encodedStartDate, encodedEndDate } = useParams<{ encodedSelectedAnalyteId: string; encodedStartDate: string; encodedEndDate: string }>();
  const selectedAnalyteId = decodeURIComponent(encodedSelectedAnalyteId as string);
  const startDate = decodeURIComponent(encodedStartDate as string);
  const endDate = decodeURIComponent(encodedEndDate as string);
  const [qcData, setQCData] = useState<MolecularQCTemplateBatch | undefined>(undefined);
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
        const data = localStorage.getItem("selectedQCData");
        if (data) {
          const qcData = JSON.parse(data) as MolecularQCTemplateBatch;
          const isoStartDate = isoFormatDate(startDate as string);
          const isoEndDate = isoFormatDate(endDate as string);
          const inRangeReports = qcData.reports.filter(report => ((new Date(isoStartDate)).getTime() <= (new Date(report.creationDate)).getTime()) && ((new Date(report.creationDate)).getTime() <= (new Date(isoEndDate)).getTime()) && report.analyteInputs.some(input => input.analyteName === selectedAnalyteId));
          const analyteReports = [];
          for (const report of inRangeReports) {
            const reportAnalyteInputs = report.analyteInputs.filter(input => input.analyteName === selectedAnalyteId);
            for (const input of reportAnalyteInputs) {
              const creationDate = new Date(report.creationDate)
              analyteReports.push({ creationDate: creationDate.toDateString(), creationTime: creationDate.toTimeString(), tech: report.studentID, value: input.value, comment: input.comment });
            }
          }
          setQCData(qcData);
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
  
    const handleQcStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {setQCStatus(event.target.value);
      if (event.target.value === 'approved') {setQCComment('');}};
    const saveComment = () => {
      if (qcStatus === 'concern') {} handleModalClose();};
  
  
  const columns: ColumnDef<TableData>[] = [
    {accessorKey: 'creationDate', header: 'Run Date', cell: (info) => info.getValue(), minSize: 50, maxSize: 50,},
    {accessorKey: 'creationTime', header: 'Run Time', cell: (info) => info.getValue(), minSize: 50, maxSize: 50,},
    {accessorKey: 'tech', header: 'Tech', cell: (info) => info.getValue(), minSize: 20, maxSize: 20,},
    {accessorKey: 'value', header: 'Test Range', cell: (info) => info.getValue(), minSize: 20, maxSize: 20,},
    {accessorKey: 'comment', header: 'Comments', cell: (info) => info.getValue(), minSize: 300, maxSize: 500,},
  ];

  const table = useReactTable({data: tableData, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),});

  return (
    <div>
      <NavBar name = "Review Controls: Molecular"/>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
        <div style={{ flex: '0 0 180px', marginRight: '20px' }}>
          <div style={{ fontWeight: 'bold', marginTop: '30px' }}>
            <div>QC Panel: {qcData?.fileName}</div>
            <div >Lot #: {qcData?.lotNumber}</div>
            <div style = {{fontWeight: 'normal'}}>Closed Date: {qcData?.closedDate}</div>
            <div>Analyte: {selectedAnalyteId}</div>
          </div>
        </div>
        <div style={{ flex: '0 0 180px', marginLeft: '20px', marginTop: '30px' }}>
          <div style = {{fontWeight: 'bold'}}>Review Date:</div>
          <div>Start Date: {startDate}</div>
          <div>Close Date: {endDate}</div>
          <Button variant="outlined" style={{ marginTop: '30px', width: '100%' }}>LEARN</Button>
          <Button variant="outlined" style={{ marginTop: '10px', width: '100%' }}>STUDENT NOTES</Button>
          <Button variant="outlined" style={{ marginTop: '80px', width: '100%' }} onClick={handleModalOpen}>Review Comments</Button>
          <Button variant="outlined" style={{ marginTop: '80px', width: '100%' }} onClick={() => {navigate('/molecular/qc_analysis_report')}}>Qualitative Analysis Report</Button>
        </div>
      </div>
      <div style={{ marginTop: '40px', width: '70%', marginLeft: 'auto', marginRight: 'auto' }}>
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
