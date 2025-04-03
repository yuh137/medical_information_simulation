import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import NavBar from "../../../components/NavBar";

import {
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";
import _ from "lodash";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useReport } from "../../../context/ReportContext";
import { AdminQCLot, AnalyteInput } from "../../../utils/utils";
import dayjs from "dayjs";
import {
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { DatePicker, DatePickerProps } from "antd";
import { Icon } from "@iconify/react";

interface AnalyteData {
  createdDate: string;
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
  // const { reportId } = useReport();
  const reportId = sessionStorage.getItem("LJReportId");
  const location = useLocation();
  const { lotNumber, analyteName } = useParams<{
    lotNumber: string;
    analyteName: string;
  }>();
  // const [analyteData, setAnalyteData] = useState<AnalyteData[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [qcStatus, setQcStatus] = useState<string | null>(null);
  const [qcComment, setQcComment] = useState<string>("");
  const [chartData, setChartData] = useState<{ x: Date; y: number }[]>([]);

  const [dateType, setDateType] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: dayjs().toISOString(), endDate: dayjs().toISOString() });
  const [singleDate, setSingleDate] = useState<string>(dayjs().toISOString());

  const { type, date } = location.state as {
    type: string;
    date: { startDate: string; endDate: string } | string;
  };

  const qcLot = useLoaderData() as AdminQCLot;
  // console.log("From loader function: ", qcLot);

  const currentAnalyte = qcLot.analytes.find(
    (item) => item.analyteName === analyteName
  );

  const analyteLimits = useMemo(() => {
    if (currentAnalyte) {
      return {
        minusOne: +currentAnalyte.mean - +currentAnalyte.stdDevi,
        plusOne: +currentAnalyte.mean + +currentAnalyte.stdDevi,
        minusTwo: +currentAnalyte.mean - +currentAnalyte.stdDevi * 2,
        plusTwo: +currentAnalyte.mean + +currentAnalyte.stdDevi * 2,
        minusThree: +currentAnalyte.mean - +currentAnalyte.stdDevi * 3,
        plusThree: +currentAnalyte.mean + +currentAnalyte.stdDevi * 3,
      };
    }

    return null;
  }, [currentAnalyte]);
  // console.log(analyteLimits);

  // const xTicks = _.range(xMin, xMax, xStep).map((x) => new Date(x));
  const xTicks = useMemo(() => {
    const xMin =
      dateType === "SingleDate"
        ? dayjs(singleDate).startOf("day").valueOf()
        : dayjs(dateRange.startDate).startOf("day").valueOf();
    const xMax =
      dateType === "SingleDate"
        ? dayjs(singleDate).endOf("day").valueOf()
        : dayjs(dateRange.endDate).endOf("day").valueOf();

    const xStep = (xMax - xMin) / 7;
    return Array.from({ length: 8 }, (_, i) => xMin + i * xStep);
  }, [dateType, dateRange, singleDate]);

  const yTicks = useMemo(() => {
    const minDataValue = _.minBy(chartData, (d) => d.y)?.y ?? Infinity; // Default to Infinity for min
    const maxDataValue = _.maxBy(chartData, (d) => d.y)?.y ?? -Infinity;

    let yMin = Math.min(
      minDataValue,
      analyteLimits
        ? parseFloat(analyteLimits.minusThree?.toString() ?? "0")
        : 0,
      parseFloat(currentAnalyte?.minLevel ?? "0")
    );

    let yMax = Math.max(
      maxDataValue,
      analyteLimits
        ? parseFloat(analyteLimits.plusThree?.toString() ?? "100")
        : 100,
      parseFloat(currentAnalyte?.maxLevel ?? "100")
    );

    const yStep = (yMax - yMin) / 10.0;

    // yMin = yMin <= (analyteLimits?.minusThree ?? Infinity) ? yMin - yStep * 2 : yMin;
    yMin = yMin === minDataValue || yMin === analyteLimits?.minusThree ? yMin - yStep * 2 : yMin;

    // yMax = yMax > (analyteLimits?.plusThree ?? -Infinity) ? yMax : yMax + yStep * 2;
    yMax = yMax === parseFloat(currentAnalyte?.maxLevel ?? "100") ? yMax : yMax + yStep * 2;

    console.log("Y Min: ", yMin, "Y Max: ", yMax, "Y Step: ", yStep);

    return _.concat(
      _.map(_.range(yMin, yMax, yStep), (val) => _.round(val, 2)), // Intermediate ticks
      _.round(yMax, 2) // Ensure the max value is included
    );
  }, [chartData]);

  useEffect(() => {
    const fetchAnalyteData = async () => {
      try {
        if (!reportId) {
          alert("Report not found");
          return;
        }

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/AnalyteInput/${reportId}`
        );
        if (res.ok) {
          const analyteInputs: AnalyteInput[] = await res.json();

          const matchingRecords = analyteInputs.filter(
            (item) => item.analyteName === analyteName
          );

          const analyteValues = matchingRecords
            .map((record) => {
              // const analyte = record.analytes.find((a: any) => a.analyteName === analyteName);
              if (record.analyteName === analyteName) {
                return {
                  createdDate: record.createdDate,
                  value: record.analyteValue,
                  mean: currentAnalyte?.mean,
                  stdDevi: currentAnalyte?.stdDevi,
                  analyteName: record.analyteName,
                  minLevel: currentAnalyte?.minLevel,
                  maxLevel: currentAnalyte?.maxLevel,
                  comments: record.comment,
                };
              }

              return null;
            })
            .filter((d: any): d is AnalyteData => d !== null);

          // setAnalyteData(analyteValues);
          const dataForChart = analyteValues
            .map((d) => {
              return {
                x: d ? new Date(d.createdDate) : new Date(),
                y: d ? d.value : 0,
              };
            })
            .filter((d) => {
              if (dateType === "SingleDate") {
                // console.log(
                //   d.x.getDate() === new Date(singleDate).getDate() &&
                //     d.x.getMonth() === new Date(singleDate).getMonth() &&
                //     d.x.getFullYear() === new Date(singleDate).getFullYear()
                // );
                return (
                  d.x.getDate() === new Date(singleDate).getDate() &&
                  d.x.getMonth() === new Date(singleDate).getMonth() &&
                  d.x.getFullYear() === new Date(singleDate).getFullYear()
                );
              }

              // console.log(
              //   d.x >= new Date(dateRange.startDate) && d.x <= new Date(dateRange.endDate)
              // );
              return (
                d.x >= new Date(dateRange.startDate) &&
                d.x <= new Date(dateRange.endDate)
              );
            });
          setChartData(dataForChart);
          console.log("From first useEffect: ", dataForChart, currentAnalyte);

          const tableRows = analyteValues.map((analyte) => ({
            // runDateTime: analyte.closedDate,
            runDateTime:
              dayjs(analyte?.createdDate).format("MM/DD/YYYY HH:mm") || "",
            result: analyte?.value.toFixed(2) || "",
            tech: sessionStorage.getItem("initials") || "",
            comments: analyte?.comments || "",
          }));

          setTableData(tableRows);
        }
      } catch (e) {}
    };

    fetchAnalyteData();
  }, [lotNumber, analyteName, dateType, dateRange, singleDate]);

  useEffect(() => {
    setDateType(type);
    if (type === "SingleDate") {
      setSingleDate(date as string);
    } else {
      setDateRange(date as { startDate: string; endDate: string });
    }
  }, []);

  useEffect(() => {
    console.log(tableData);
  }, [tableData])

  const generatePDF = async () => {
    const input = document.getElementById("pdfContent");
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 600, canvas.height * 0.75);
      pdf.save("LeveyJenningsReport.pdf");
    }
  };
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleQcStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQcStatus(event.target.value);
    if (event.target.value === "approved") {
      setQcComment("");
    }
  };

  const saveComment = () => {
    if (qcStatus === "concern") {
    }
    handleModalClose();
  };

  const columns: ColumnDef<TableData>[] = [
    {
      accessorKey: "runDateTime",
      header: "Created Date",
      cell: (info) => info.getValue(),
      minSize: 50,
      maxSize: 50,
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: (info) => info.getValue(),
      minSize: 20,
      maxSize: 20,
    },
    {
      accessorKey: "tech",
      header: "Tech",
      cell: (info) => info.getValue(),
      minSize: 20,
      maxSize: 20,
    },
    {
      accessorKey: "comments",
      header: "Comments",

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
    <>
      <NavBar name={`Chemistry Levey Jennings`} />
      <div className="page-container flex-col sm:gap-y-2 sm:py-4">

        <h2
          className="title text-center"
        >
          <span className="font-semibold text-2xl">Levey Jennings: {analyteName}</span><br />
          <span>Unit of measure: {currentAnalyte?.unitOfMeasure}</span>
        </h2>

        <div
          className="chartgroup-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <div style={{ flex: "0 0 180px", marginRight: "20px" }} className="leftpanel-container">
            <div style={{ fontWeight: "bold", marginTop: "30px" }}>
              <div>QC Panel: {qcLot.qcName}</div>
              <div>Lot #: {lotNumber}</div>
              <div style={{ fontWeight: "normal" }}>
                Closed Date:{" "}
                {qcLot.closedDate
                  ? dayjs(qcLot.closedDate).format("MM/DD/YYYY")
                  : dayjs(qcLot.expirationDate).format("MM/DD/YYYY")}
              </div>
              <div>Analyte: {analyteName}</div>
              <div style={{ fontWeight: "normal" }}>
                Min Range: {currentAnalyte?.minLevel}
              </div>
              <div style={{ fontWeight: "normal" }}>
                Max Range: {currentAnalyte?.maxLevel}
              </div>
              <div>Status: {qcLot.isActive ? (<span className="sm:p-1 font-semibold text-white bg-green-500 rounded-md">Active</span>) : (<span className="sm:p-1 font-semibold text-white bg-red-500 rounded-md">Inactive</span>)}</div>
            </div>
          </div>

          <div
            style={{ flex: "1 1 auto", overflowX: "scroll", overflowY: "hidden" }}
            className="chart-container"
          >
            {/* <svg ref={svgRef}></svg> */}
            <VictoryChart theme={VictoryTheme.clean}>
              <VictoryAxis
                dependentAxis
                tickValues={yTicks}
                style={{
                  axis: {
                    stroke: "black",
                    strokeWidth: 2,
                    position: "relative"
                  },
                  axisLabel: {
                    fontSize: 12,
                    angle: 0,
                    paddingBottom: 30,
                  },
                  ticks: {
                    size: 6,
                    stroke: "black",
                    strokeWidth: 2,
                  }
                }}
              />
              <VictoryAxis
                tickValues={xTicks}
                tickFormat={(x: any) =>
                  dateType === "SingleDate"
                    ? dayjs(x).format("HH:mm")
                    : dayjs(x).format("MM/DD")
                }
                scale="time"
                style={{
                  axis: {
                    stroke: "black",
                    strokeWidth: 2,
                    padding: dateType === "SingleDate" ? 30 : 40,
                  },
                  tickLabels: {
                    angle: -45,
                    textAnchor: "start",
                    verticalAnchor: "middle",
                    fontSize: 8,
                  },
                  ticks: {
                    size: 6,
                    stroke: "black",
                    strokeWidth: 2,
                  }
                }}
              />
              <VictoryAxis
                dependentAxis
                orientation="right"
                tickValues={[
                  analyteLimits?.minusThree,
                  analyteLimits?.minusTwo,
                  analyteLimits?.minusOne,
                  currentAnalyte?.mean,
                  analyteLimits?.plusOne,
                  analyteLimits?.plusTwo,
                  analyteLimits?.plusThree,
                ]}
                tickFormat={(tick) => {
                  if (tick === analyteLimits?.minusThree)
                    return `-3SD (${analyteLimits?.minusThree.toFixed(2)})`;
                  if (tick === analyteLimits?.minusTwo)
                    return `-2SD (${analyteLimits?.minusTwo.toFixed(2)})`;
                  if (tick === analyteLimits?.minusOne)
                    return `-1SD (${analyteLimits?.minusOne.toFixed(2)})`;
                  if (tick === currentAnalyte?.mean)
                    return `x̅ (${
                      currentAnalyte?.mean
                        ? parseFloat(currentAnalyte?.mean).toFixed(2)
                        : ""
                    })`;
                  if (tick === analyteLimits?.plusOne)
                    return `+1SD (${analyteLimits?.plusOne.toFixed(2)})`;
                  if (tick === analyteLimits?.plusTwo)
                    return `+2SD (${analyteLimits?.plusTwo.toFixed(2)})`;
                  if (tick === analyteLimits?.plusThree)
                    return `+3SD (${analyteLimits?.plusThree.toFixed(2)})`;
                  return tick; // Default case (if needed)
                }}
                style={{
                  axis: {
                    stroke: "black",
                    strokeWidth: 1,
                  },
                  grid: {
                    stroke: "#222",
                    strokeWidth: 0.5,
                    strokeDasharray: "5.5",
                  },
                  tickLabels: {
                    fontSize: 8,
                  },
                }}
              />
              <VictoryScatter
                data={chartData}
                labels={({ datum }) => {
                  return `Value: ${datum.y}\n Created At: ${dayjs(datum.x).format(
                    "MM/DD/YYYY - HH:mm"
                  )}`;
                }}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      fill: "white",
                      stroke: "black",
                      pointerEvents: "none",
                      width: 60,
                    }}
                    style={{ fontSize: 7.5, fill: "black" }}
                  />
                }
                style={{
                  data: {
                    fill: (datum) => {
                      const minLevel = parseFloat(
                        currentAnalyte?.minLevel ?? "0"
                      ); // Ensure valid number
                      const maxLevel = parseFloat(
                        currentAnalyte?.maxLevel ?? "100"
                      ); // Ensure valid number
                      const yValue = datum.datum.y ?? 0; // Ensure datum.y is defined

                      return yValue < minLevel || yValue > maxLevel
                        ? "red"
                        : "blue";
                    },
                  },
                }}
              />
            </VictoryChart>
          </div>

          <div
            style={{ flex: "0 0 180px", marginLeft: "20px", marginTop: "30px" }}
            className="rightpanel-container sm:space-y-2"
          >
            <div style={{ fontWeight: "bold" }}>Review Date:</div>
            {/* <div>Start Date: mm/dd/yyyy</div>
            <div>Close Date: mm/dd/yyyy</div> */}
            {dateType === "DateRange" ? (
              <DatePicker.RangePicker
                // needConfirm
                style={{ stroke: "#60A1E0" }}
                format={"MM/DD/YYYY"}
                value={
                  dateType === "DateRange"
                    ? [dayjs(dateRange?.startDate), dayjs(dateRange?.endDate)]
                    : [dayjs(), dayjs()]
                }
                onChange={(date) => {
                  if (date) {
                    const newRange = {
                      startDate: date[0]?.toISOString() ?? "",
                      endDate: date[1]?.toISOString() ?? "",
                    };
                    console.log(newRange);
                    setDateRange(newRange);
                  } else {
                    console.warn("Invalid date range");
                  }
                }}
              />
            ) : (
              <DatePicker
                needConfirm
                format={"MM/DD/YY"}
                value={dateType === "SingleDate" ? dayjs(singleDate) : dayjs()}
                onChange={(date) => {
                  if (date) {
                    console.log(date.toISOString());
                    setSingleDate(date.toISOString());
                  } else {
                    console.warn("Invalid date");
                  }
                }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              style={{ fontSize: 12 }}
              onClick={() => {
                console.log(dateType, dateRange, singleDate);
                if (dateType === "DateRange") setDateType("SingleDate");
                else setDateType("DateRange");
              }}
            >
              Toggle: {dateType}
            </Button>
            <Button
              variant="outlined"
              style={{ marginTop: "30px", width: "100%" }}
            >
              LEARN
            </Button>
            <Button
              variant="outlined"
              style={{ marginTop: "10px", width: "100%" }}
            >
              STUDENT NOTES
            </Button>
            <Button
              variant="outlined"
              style={{ marginTop: "80px", width: "100%" }}
              onClick={handleModalOpen}
            >
              Review Comments
            </Button>
            <Button
              variant="outlined"
              onClick={generatePDF}
              style={{ marginTop: "10px", width: "100%" }}
            >
              Levey Jennings Report
            </Button>
          </div>
        </div>

        <div
          className="table-container"
          style={{
            marginTop: "40px",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        textAlign: "left",
                        backgroundColor: "#3A6CC6",
                        color: "white",
                        border: "1px solid #ccc",
                        width: header.column.columnDef.minSize || 100,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {!table.getRowModel().rows.length ? 
                <>
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                </> : 
                <>
                  {table.getRowModel().rows.map((row, rowIndex) => (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: rowIndex % 2 === 0 ? "#DAE3F3" : "#B0C4DE",
                        height: "40px",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            border: "1px solid #ccc",
                            width: cell.column.columnDef.minSize || 100,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              }</tbody>
          </table>
        </div>
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outlined"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Icon icon="mdi:arrow-left-thin" />
            </Button>
            <Button
              variant="outlined"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Icon icon="mdi:arrow-right-thin" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for review comments */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            margin: "auto",
            marginTop: "100px",
            width: "400px",
            borderRadius: "8px",
          }}
        >
          <h3>REVIEW COMMENT OPTIONS:</h3>
          <RadioGroup value={qcStatus} onChange={handleQcStatusChange}>
            <FormControlLabel
              value="approved"
              control={<Radio />}
              label="QC Approved"
            />
            <FormControlLabel
              value="concern"
              control={<Radio />}
              label="QC Concern/Corrective Action"
            />
          </RadioGroup>
          {qcStatus === "concern" && (
            <TextField
              label="Concern/Corrective Action"
              multiline
              rows={4}
              value={qcComment}
              onChange={(e) => setQcComment(e.target.value)}
              variant="outlined"
              fullWidth
              style={{ marginTop: "20px" }}
            />
          )}
          <Button
            variant="contained"
            onClick={saveComment}
            style={{ marginTop: "20px" }}
          >
            Save Comment to Report
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ChemistryLeveyJennings;
