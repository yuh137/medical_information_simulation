import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData';
import { QCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';

import { Modal, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import { Document, Page, Text, View, pdf } from '@react-pdf/renderer';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';
import * as d3 from 'd3';

interface AnalyteData {
  closedDate: string;
  value: number;
  mean: number;
  stdDevi: number;
  analyteName: string;
  minLevel: number;
  maxLevel: number;
}

interface TableData {
    runDateTime: string;
    result: string;
    tech: string;
    comments: string;
}

const ChemistryLeveyJennings = () => {
  const { fileName, lotNumber, analyteName } = useParams<{ fileName: string; lotNumber: string; analyteName: string }>();
  const [analyteData, setAnalyteData] = useState<AnalyteData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [qcStatus, setQcStatus] = useState<string | null>(null);
  const [qcComment, setQcComment] = useState<string>('');
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

        const tableRows = analyteValues.map((analyte) => ({
            runDateTime: analyte.closedDate, 
            result: analyte.value.toFixed(2), 
            tech: '', 
            comments: '', 
          }));
  
          setTableData(tableRows);
        } catch (error) {
          console.error("Error fetching analyte data:", error);
        }
      };
  
      fetchAnalyteData();
    }, [fileName, lotNumber, analyteName]);
  
    useEffect(() => {
      if (analyteData.length > 0) {
        drawChart();
      }
    }, [analyteData]);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 70, bottom: 100, left: 50 }; 
    const width = 850; // Reduced width
    const height = 400 - margin.top - margin.bottom;

    const parseDate = d3.timeParse("%m/%d/%Y");

    const xScale = d3.scaleTime()
      .domain([new Date(2024, 0, 1), new Date(2024, 11, 31)])
      .range([0, width]);

    const yMax = d3.max(analyteData, d => d.mean + 3 * d.stdDevi) || 0;
    const yMin = d3.min(analyteData, d => d.mean - 3 * d.stdDevi) || 0;

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0]);

    const xAxis = d3.axisBottom<Date>(xScale)
      .ticks(d3.timeDay.every(5))
      .tickFormat(d3.timeFormat("%m/%d"));

    const yAxis = d3.axisLeft(yScale);

    const svgContainer = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgContainer.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "-0.2em");

    svgContainer.append("g")
      .call(yAxis);
    const yAxisLabels = [
        { label: 'x̅', value: analyteData[0].mean, color: 'grey' },
        { label: '+1 SD', value: analyteData[0].mean + analyteData[0].stdDevi, color: 'green' },
        { label: '-1 SD', value: analyteData[0].mean - analyteData[0].stdDevi, color: 'green' },
        { label: '+2 SD', value: analyteData[0].mean + 2 * analyteData[0].stdDevi, color: 'orange' },
        { label: '-2 SD', value: analyteData[0].mean - 2 * analyteData[0].stdDevi, color: 'orange' },
        { label: '+3 SD', value: analyteData[0].mean + 3 * analyteData[0].stdDevi, color: 'purple' },
        { label: '-3 SD', value: analyteData[0].mean - 3 * analyteData[0].stdDevi, color: 'purple' }
      ];
  
      yAxisLabels.forEach(({ label, value, color }) => {
        svgContainer.append("text")
          .attr("x", width + 20)  
          .attr("y", yScale(value))
          .attr("dy", ".35em")  
          .attr("fill", color)
          .text(label);
      });
  
    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean))
      .attr("y2", yScale(analyteData[0].mean))
      .attr("stroke", "grey")
      .attr("stroke-width", 2);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean + analyteData[0].stdDevi))
      .attr("y2", yScale(analyteData[0].mean + analyteData[0].stdDevi))
      .attr("stroke", "green")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean - analyteData[0].stdDevi))
      .attr("y2", yScale(analyteData[0].mean - analyteData[0].stdDevi))
      .attr("stroke", "green")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean + 2 * analyteData[0].stdDevi))
      .attr("y2", yScale(analyteData[0].mean + 2 * analyteData[0].stdDevi))
      .attr("stroke", "orange")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean - 2 * analyteData[0].stdDevi))
      .attr("y2", yScale(analyteData[0].mean - 2 * analyteData[0].stdDevi))
      .attr("stroke", "orange")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean + 3 * analyteData[0].stdDevi))
      .attr("y2", yScale(analyteData[0].mean + 3 * analyteData[0].stdDevi))
      .attr("stroke", "purple")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(analyteData[0].mean - 3 * analyteData[0].stdDevi))
      .attr("y2", yScale(analyteData[0].mean - 3 * analyteData[0].stdDevi))
      .attr("stroke", "purple")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.selectAll("circle")
      .data(analyteData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(parseDate(d.closedDate) as Date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", (d) => (d.value > d.mean + 2 * d.stdDevi || d.value < d.mean - 2 * d.stdDevi) ? "red" : "blue"); // Red if outside ±2 SD, else blue
  };

  const generatePDF = async () => {
    const input = document.getElementById('pdfContent');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 600, canvas.height * 0.75);
      pdf.save('LeveyJenningsReport.pdf');
    }
  };
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
  
    const handleQcStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQcStatus(event.target.value);
      if (event.target.value === 'approved') {
        setQcComment(''); 
      }
    };
  
    const saveComment = () => {
      if (qcStatus === 'concern') {
      }
      handleModalClose();
    };
  
  
  const columns: ColumnDef<TableData>[] = [
    {
      accessorKey: 'runDateTime',
      header: 'Run Date/Time',
      cell: (info) => info.getValue(),
      minSize: 50, 
      maxSize: 50,
    },
    {
      accessorKey: 'result',
      header: 'Result',
      cell: (info) => info.getValue(),
      minSize: 20, 
      maxSize: 20,
    },
    {
      accessorKey: 'tech',
      header: 'Tech',
      cell: (info) => info.getValue(),
      minSize: 20, 
      maxSize: 20,
    },
    {
      accessorKey: 'comments',
      header: 'Comments',

      cell: (info) => info.getValue(),
      minSize: 300, 
      maxSize: 500,
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <NavBar name={`Review Controls: ${fileName}`} />

      <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        Levey Jennings: {analyteName}
      </h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
        <div style={{ flex: '0 0 180px', marginRight: '20px' }}>
          <div style={{ fontWeight: 'bold', marginTop: '30px' }}>
            <div>QC Panel: {fileName}</div>
            <div >Lot #: {lotNumber}</div>
            <div style = {{fontWeight: 'normal'}}>Closed Date: {analyteData.length > 0 ? analyteData[0].closedDate : ''}</div>
            <div>Analyte: {analyteName}</div>
            <div style = {{fontWeight: 'normal'}}>Minimum Range: {analyteData.length > 0 ? analyteData[0].minLevel : ''}</div>
            <div style = {{fontWeight: 'normal'}} >Maximum : {analyteData.length > 0 ? analyteData[0].maxLevel : ''}</div>
          </div>
        </div>

        <div style={{ flex: '1 1 auto', overflowX: 'scroll', overflowY: 'hidden' }}>
          <svg ref={svgRef}></svg>
        </div>

        <div style={{ flex: '0 0 180px', marginLeft: '20px', marginTop: '30px' }}>
          <div style = {{fontWeight: 'bold'}}>Review Date:</div>
          <div>Start Date: mm/dd/yyyy</div>
          <div>Close Date: mm/dd/yyyy</div>
          <Button variant="outlined" style={{ marginTop: '30px', width: '100%' }}>LEARN</Button>
          <Button variant="outlined" style={{ marginTop: '10px', width: '100%' }}>STUDENT NOTES</Button>
          <Button 
  variant="outlined" 
  style={{ marginTop: '80px', width: '100%' }} 
  onClick={handleModalOpen}
>
  Review Comments
</Button>
          <Button variant="outlined" onClick={generatePDF} style={{ marginTop: '10px', width: '100%' }}>Levey Jennings Report</Button>
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
          <Button variant="contained" onClick={saveComment} style={{ marginTop: '20px' }}>
            Save Comment to Report
          </Button>
        </div>
      </Modal>
    </div>
  );
};


export default ChemistryLeveyJennings;