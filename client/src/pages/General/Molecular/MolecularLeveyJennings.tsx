import React, { useEffect, useState, useRef } from 'react';
import { getAllDataFromStore } from '../../../utils/indexedDB/getData';
import { QCTemplateBatch } from '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import * as d3 from 'd3';
  
const MolecularLeveyJennings = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [analyteData, setAnalyteData] = useState<QCTemplateBatch[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllDataFromStore('qc_store');
            setAnalyteData(data as QCTemplateBatch[]);
        };
        fetchData();
    }, []);
  
  useEffect(() => {
    if (analyteData.length > 0) {
      drawChart();
    }
  }, [analyteData]);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 70, bottom: 100, left: 50 }; 
    const width = 850; 
    const height = 400 - margin.top - margin.bottom;

    const parseDate = d3.timeParse("%m/%d/%Y");

    const xScale = d3.scaleTime()
      .domain([new Date(2024, 0, 1), new Date(2024, 11, 31)])
      .range([0, width]);

    const selectedAnalyte = analyteData[0]?.analytes[0];
    if (!selectedAnalyte) return;

    const mean = parseFloat(selectedAnalyte.mean);
    const stdDevi = parseFloat(selectedAnalyte.stdDevi);

    const yMax = mean + 3 * stdDevi;
    const yMin = mean - 3 * stdDevi;

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
        { label: 'x̅', value: mean, color: 'grey' },
        { label: '+1 SD', value: mean + stdDevi, color: 'green' },
        { label: '-1 SD', value: mean - stdDevi, color: 'green' },
        { label: '+2 SD', value: mean + 2 * stdDevi, color: 'orange' },
        { label: '-2 SD', value: mean - 2 * stdDevi, color: 'orange' },
        { label: '+3 SD', value: mean + 3 * stdDevi, color: 'purple' },
        { label: '-3 SD', value: mean - 3 * stdDevi, color: 'purple' }
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
      .attr("y1", yScale(mean))
      .attr("y2", yScale(mean))
      .attr("stroke", "grey")
      .attr("stroke-width", 2);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mean + stdDevi))
      .attr("y2", yScale(mean + stdDevi))
      .attr("stroke", "green")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mean - stdDevi))
      .attr("y2", yScale(mean - stdDevi))
      .attr("stroke", "green")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mean + 2 * stdDevi))
      .attr("y2", yScale(mean + 2 * stdDevi))
      .attr("stroke", "orange")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mean - 2 * stdDevi))
      .attr("y2", yScale(mean - 2 * stdDevi))
      .attr("stroke", "orange")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mean + 3 * stdDevi))
      .attr("y2", yScale(mean + 3 * stdDevi))
      .attr("stroke", "purple")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

    svgContainer.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mean - 3 * stdDevi))
      .attr("y2", yScale(mean - 3 * stdDevi))
      .attr("stroke", "purple")
      .attr("stroke-dasharray", "4")
      .attr("stroke-width", 1);

      svgContainer.selectAll("circle")
      .data(analyteData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(parseDate(d.closedDate) as Date))
      .attr("cy", (d) => yScale(parseFloat(d.analytes[0].value || "0")))
      .attr("r", 4)
      .attr("fill", (d) => {
        const analyteValue = parseFloat(d.analytes[0].value || "0");
        return (analyteValue > mean + 2 * stdDevi || analyteValue < mean - 2 * stdDevi) ? "red" : "blue";
      });
  };

const generatePDF = async () => {
    const input = document.getElementById('pdfContent');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, canvas.height * 180 / canvas.width);
      pdf.save('LeveyJenningsReport.pdf');
    }
  };

  return (
    <>
      <NavBar name="Levey-Jennings Report" />
      <div id="pdfContent">
        <svg ref={svgRef} width="900" height="400" />
      </div>
      <Button variant="contained" onClick={generatePDF}>Download PDF</Button>
    </>
  );
};

export default MolecularLeveyJennings;