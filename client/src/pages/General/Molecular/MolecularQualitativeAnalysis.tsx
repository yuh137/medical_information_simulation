import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData';
import { QCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
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

interface AnalyteData {closedDate: string; value: number; mean: number; stdDevi: number; analyteName: string; minLevel: number; maxLevel: number;}

interface TableData {runDateTime: string; result: string; tech: string; comments: string;}

const MolecularQualitativeAnalysis = () => {
  const { fileName, lotNumber, analyteName } = useParams<{ fileName: string; lotNumber: string; analyteName: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const [analyteData, setAnalyteData] = useState<AnalyteData[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [qcStatus, setQcStatus] = useState<string | null>(null);
  const [qcComment, setQcComment] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyteData = async () => {
      try {
        const data = (await getAllDataFromStore('qc_store')) as unknown as QCTemplateBatch[];

        const matchingRecords = data.filter(
          (item) => item.fileName === fileName && item.lotNumber === lotNumber
        );

        const analyteValues = matchingRecords.map((record) => {
          const analyte = record.analytes.find((a) => a.analyteName === analyteName);
          if (analyte) {
            return {
              closedDate: record.closedDate,
              value: analyte.value ? parseFloat(analyte.value) : parseFloat(analyte.mean),
              mean: parseFloat(analyte.mean),
              stdDevi: parseFloat(analyte.stdDevi),
              analyteName: analyte.analyteName,
              minLevel: parseFloat(analyte.minLevel),  
              maxLevel: parseFloat(analyte.maxLevel),  
            };
          }
          return null;
        }).filter((d): d is AnalyteData => d !== null); 

        setAnalyteData(analyteValues);

        const tableRows = analyteValues.map((analyte) => ({runDateTime: analyte.closedDate, result: analyte.value.toFixed(2), tech: '', comments: '', }));
  
          setTableData(tableRows);
        } catch (error) {
          console.error("Error fetching analyte data:", error);
        }
      };
  
      fetchAnalyteData();
    }, [fileName, lotNumber, analyteName]);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
  
    const handleQcStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {setQcStatus(event.target.value);
      if (event.target.value === 'approved') {setQcComment(''); }};
  
    const saveComment = () => {
      if (qcStatus === 'concern') {} handleModalClose();};
  
  
  const columns: ColumnDef<TableData>[] = [
    {accessorKey: 'runDateTime', header: 'Run Date/Time', cell: (info) => info.getValue(), minSize: 50, maxSize: 50,},
    {accessorKey: 'result', header: 'Result', cell: (info) => info.getValue(), minSize: 20, maxSize: 20,},
    {accessorKey: 'tech', header: 'Tech', cell: (info) => info.getValue(), minSize: 20, maxSize: 20,},
    {accessorKey: 'comments', header: 'Comments', cell: (info) => info.getValue(), minSize: 300, maxSize: 500,},
  ];

  const table = useReactTable({data: tableData, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),});

  return (
    <div>
      <NavBar name = "Review Controls: Molecular"/>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
        <div style={{ flex: '0 0 180px', marginRight: '20px' }}>
          <div style={{ fontWeight: 'bold', marginTop: '30px' }}>
            <div>QC Panel: {fileName}</div>
            <div >Lot #: {lotNumber}</div>
            <div style = {{fontWeight: 'normal'}}>Closed Date: {analyteData.length > 0 ? analyteData[0].closedDate : ''}</div>
            <div>Analyte: {analyteName}</div>
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
              onChange={(e) => setQcComment(e.target.value)}
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