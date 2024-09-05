"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var getData_1 = require("../utils/indexedDB/getData");
var NavBar_1 = require("../components/NavBar");
var material_1 = require("@mui/material");
var jspdf_1 = require("jspdf");
var html2canvas_1 = require("html2canvas");
var material_2 = require("@mui/material");
var react_table_1 = require("@tanstack/react-table");
var d3 = require("d3");
var LeveyJennings = function () {
    var _a = react_router_dom_1.useParams(), fileName = _a.fileName, lotNumber = _a.lotNumber, analyteName = _a.analyteName;
    var _b = react_1.useState([]), analyteData = _b[0], setAnalyteData = _b[1];
    var svgRef = react_1.useRef(null);
    var _c = react_1.useState([]), tableData = _c[0], setTableData = _c[1];
    var _d = react_1.useState(false), modalOpen = _d[0], setModalOpen = _d[1];
    var _e = react_1.useState(null), qcStatus = _e[0], setQcStatus = _e[1];
    var _f = react_1.useState(''), qcComment = _f[0], setQcComment = _f[1];
    react_1.useEffect(function () {
        var fetchAnalyteData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, matchingRecords, analyteValues, tableRows, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getData_1.getAllDataFromStore('qc_store')];
                    case 1:
                        data = (_a.sent());
                        matchingRecords = data.filter(function (item) { return item.fileName === fileName && item.lotNumber === lotNumber; });
                        analyteValues = matchingRecords.map(function (record) {
                            var analyte = record.analytes.find(function (a) { return a.analyteName === analyteName; });
                            if (analyte) {
                                return {
                                    closedDate: record.closedDate,
                                    value: analyte.value ? parseFloat(analyte.value) : parseFloat(analyte.mean),
                                    mean: parseFloat(analyte.mean),
                                    std_devi: parseFloat(analyte.std_devi),
                                    analyteName: analyte.analyteName,
                                    min_level: parseFloat(analyte.min_level),
                                    max_level: parseFloat(analyte.max_level)
                                };
                            }
                            return null;
                        }).filter(function (d) { return d !== null; });
                        setAnalyteData(analyteValues);
                        tableRows = analyteValues.map(function (analyte) { return ({
                            runDateTime: analyte.closedDate,
                            result: analyte.value.toFixed(2),
                            tech: '',
                            comments: ''
                        }); });
                        setTableData(tableRows);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching analyte data:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchAnalyteData();
    }, [fileName, lotNumber, analyteName]);
    react_1.useEffect(function () {
        if (analyteData.length > 0) {
            drawChart();
        }
    }, [analyteData]);
    var drawChart = function () {
        var svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        var margin = { top: 20, right: 70, bottom: 100, left: 50 };
        var width = 850; // Reduced width
        var height = 400 - margin.top - margin.bottom;
        var parseDate = d3.timeParse("%m/%d/%Y");
        var xScale = d3.scaleTime()
            .domain([new Date(2024, 0, 1), new Date(2024, 11, 31)])
            .range([0, width]);
        var yMax = d3.max(analyteData, function (d) { return d.mean + 3 * d.std_devi; }) || 0;
        var yMin = d3.min(analyteData, function (d) { return d.mean - 3 * d.std_devi; }) || 0;
        var yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);
        var xAxis = d3.axisBottom(xScale)
            .ticks(d3.timeDay.every(5))
            .tickFormat(d3.timeFormat("%m/%d"));
        var yAxis = d3.axisLeft(yScale);
        var svgContainer = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svgContainer.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "-0.2em");
        svgContainer.append("g")
            .call(yAxis);
        var yAxisLabels = [
            { label: 'x̅', value: analyteData[0].mean, color: 'grey' },
            { label: '+1 SD', value: analyteData[0].mean + analyteData[0].std_devi, color: 'green' },
            { label: '-1 SD', value: analyteData[0].mean - analyteData[0].std_devi, color: 'green' },
            { label: '+2 SD', value: analyteData[0].mean + 2 * analyteData[0].std_devi, color: 'orange' },
            { label: '-2 SD', value: analyteData[0].mean - 2 * analyteData[0].std_devi, color: 'orange' },
            { label: '+3 SD', value: analyteData[0].mean + 3 * analyteData[0].std_devi, color: 'purple' },
            { label: '-3 SD', value: analyteData[0].mean - 3 * analyteData[0].std_devi, color: 'purple' }
        ];
        yAxisLabels.forEach(function (_a) {
            var label = _a.label, value = _a.value, color = _a.color;
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
            .attr("y1", yScale(analyteData[0].mean + analyteData[0].std_devi))
            .attr("y2", yScale(analyteData[0].mean + analyteData[0].std_devi))
            .attr("stroke", "green")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);
        svgContainer.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(analyteData[0].mean - analyteData[0].std_devi))
            .attr("y2", yScale(analyteData[0].mean - analyteData[0].std_devi))
            .attr("stroke", "green")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);
        svgContainer.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(analyteData[0].mean + 2 * analyteData[0].std_devi))
            .attr("y2", yScale(analyteData[0].mean + 2 * analyteData[0].std_devi))
            .attr("stroke", "orange")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);
        svgContainer.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(analyteData[0].mean - 2 * analyteData[0].std_devi))
            .attr("y2", yScale(analyteData[0].mean - 2 * analyteData[0].std_devi))
            .attr("stroke", "orange")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);
        svgContainer.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(analyteData[0].mean + 3 * analyteData[0].std_devi))
            .attr("y2", yScale(analyteData[0].mean + 3 * analyteData[0].std_devi))
            .attr("stroke", "purple")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);
        svgContainer.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(analyteData[0].mean - 3 * analyteData[0].std_devi))
            .attr("y2", yScale(analyteData[0].mean - 3 * analyteData[0].std_devi))
            .attr("stroke", "purple")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", 1);
        svgContainer.selectAll("circle")
            .data(analyteData)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(parseDate(d.closedDate)); })
            .attr("cy", function (d) { return yScale(d.value); })
            .attr("r", 4)
            .attr("fill", function (d) { return (d.value > d.mean + 2 * d.std_devi || d.value < d.mean - 2 * d.std_devi) ? "red" : "blue"; }); // Red if outside ±2 SD, else blue
    };
    var generatePDF = function () { return __awaiter(void 0, void 0, void 0, function () {
        var input, canvas, imgData, pdf_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = document.getElementById('pdfContent');
                    if (!input) return [3 /*break*/, 2];
                    return [4 /*yield*/, html2canvas_1["default"](input)];
                case 1:
                    canvas = _a.sent();
                    imgData = canvas.toDataURL('image/png');
                    pdf_1 = new jspdf_1.jsPDF('p', 'pt', 'a4');
                    pdf_1.addImage(imgData, 'PNG', 0, 0, 600, canvas.height * 0.75);
                    pdf_1.save('LeveyJenningsReport.pdf');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleModalOpen = function () { return setModalOpen(true); };
    var handleModalClose = function () { return setModalOpen(false); };
    var handleQcStatusChange = function (event) {
        setQcStatus(event.target.value);
        if (event.target.value === 'approved') {
            setQcComment('');
        }
    };
    var saveComment = function () {
        if (qcStatus === 'concern') {
        }
        handleModalClose();
    };
    var columns = [
        {
            accessorKey: 'runDateTime',
            header: 'Run Date/Time',
            cell: function (info) { return info.getValue(); },
            minSize: 50,
            maxSize: 50
        },
        {
            accessorKey: 'result',
            header: 'Result',
            cell: function (info) { return info.getValue(); },
            minSize: 20,
            maxSize: 20
        },
        {
            accessorKey: 'tech',
            header: 'Tech',
            cell: function (info) { return info.getValue(); },
            minSize: 20,
            maxSize: 20
        },
        {
            accessorKey: 'comments',
            header: 'Comments',
            cell: function (info) { return info.getValue(); },
            minSize: 300,
            maxSize: 500
        },
    ];
    var table = react_table_1.useReactTable({
        data: tableData,
        columns: columns,
        getCoreRowModel: react_table_1.getCoreRowModel(),
        getPaginationRowModel: react_table_1.getPaginationRowModel()
    });
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(NavBar_1["default"], { name: "Review Controls: " + fileName }),
        react_1["default"].createElement("h2", { style: { textAlign: 'center', marginTop: '40px', marginBottom: '20px' } },
            "Levey Jennings: ",
            analyteName),
        react_1["default"].createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginLeft: '10px', marginRight: '10px' } },
            react_1["default"].createElement("div", { style: { flex: '0 0 180px', marginRight: '20px' } },
                react_1["default"].createElement("div", { style: { fontWeight: 'bold', marginTop: '30px' } },
                    react_1["default"].createElement("div", null,
                        "QC Panel: ",
                        fileName),
                    react_1["default"].createElement("div", null,
                        "Lot #: ",
                        lotNumber),
                    react_1["default"].createElement("div", { style: { fontWeight: 'normal' } },
                        "Closed Date: ",
                        analyteData.length > 0 ? analyteData[0].closedDate : ''),
                    react_1["default"].createElement("div", null,
                        "Analyte: ",
                        analyteName),
                    react_1["default"].createElement("div", { style: { fontWeight: 'normal' } },
                        "Minimum Range: ",
                        analyteData.length > 0 ? analyteData[0].min_level : ''),
                    react_1["default"].createElement("div", { style: { fontWeight: 'normal' } },
                        "Maximum : ",
                        analyteData.length > 0 ? analyteData[0].max_level : ''))),
            react_1["default"].createElement("div", { style: { flex: '1 1 auto', overflowX: 'scroll', overflowY: 'hidden' } },
                react_1["default"].createElement("svg", { ref: svgRef })),
            react_1["default"].createElement("div", { style: { flex: '0 0 180px', marginLeft: '20px', marginTop: '30px' } },
                react_1["default"].createElement("div", { style: { fontWeight: 'bold' } }, "Review Date:"),
                react_1["default"].createElement("div", null, "Start Date: mm/dd/yyyy"),
                react_1["default"].createElement("div", null, "Close Date: mm/dd/yyyy"),
                react_1["default"].createElement(material_2.Button, { variant: "outlined", style: { marginTop: '30px', width: '100%' } }, "LEARN"),
                react_1["default"].createElement(material_2.Button, { variant: "outlined", style: { marginTop: '10px', width: '100%' } }, "STUDENT NOTES"),
                react_1["default"].createElement(material_2.Button, { variant: "outlined", style: { marginTop: '80px', width: '100%' }, onClick: handleModalOpen }, "Review Comments"),
                react_1["default"].createElement(material_2.Button, { variant: "outlined", onClick: generatePDF, style: { marginTop: '10px', width: '100%' } }, "Levey Jennings Report"))),
        react_1["default"].createElement("div", { style: { marginTop: '40px', width: '70%', marginLeft: 'auto', marginRight: 'auto' } },
            react_1["default"].createElement("table", { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' } },
                react_1["default"].createElement("thead", null, table.getHeaderGroups().map(function (headerGroup) { return (react_1["default"].createElement("tr", { key: headerGroup.id }, headerGroup.headers.map(function (header) { return (react_1["default"].createElement("th", { key: header.id, style: {
                        padding: '10px',
                        borderBottom: '1px solid #ccc',
                        textAlign: 'left',
                        backgroundColor: '#3A6CC6',
                        color: 'white',
                        border: '1px solid #ccc',
                        width: header.column.columnDef.minSize || 100
                    } }, react_table_1.flexRender(header.column.columnDef.header, header.getContext()))); }))); })),
                react_1["default"].createElement("tbody", null, table.getRowModel().rows.map(function (row, rowIndex) { return (react_1["default"].createElement("tr", { key: row.id, style: {
                        backgroundColor: rowIndex % 2 === 0 ? '#DAE3F3' : '#B0C4DE',
                        height: '40px'
                    } }, row.getVisibleCells().map(function (cell) { return (react_1["default"].createElement("td", { key: cell.id, style: {
                        padding: '10px',
                        borderBottom: '1px solid #ccc',
                        border: '1px solid #ccc',
                        width: cell.column.columnDef.minSize || 100
                    } }, react_table_1.flexRender(cell.column.columnDef.cell, cell.getContext()))); }))); })))),
        react_1["default"].createElement(material_1.Modal, { open: modalOpen, onClose: handleModalClose },
            react_1["default"].createElement("div", { style: { backgroundColor: 'white', padding: '20px', margin: 'auto', marginTop: '100px', width: '400px', borderRadius: '8px' } },
                react_1["default"].createElement("h3", null, "REVIEW COMMENT OPTIONS:"),
                react_1["default"].createElement(material_1.RadioGroup, { value: qcStatus, onChange: handleQcStatusChange },
                    react_1["default"].createElement(material_1.FormControlLabel, { value: "approved", control: react_1["default"].createElement(material_1.Radio, null), label: "QC Approved" }),
                    react_1["default"].createElement(material_1.FormControlLabel, { value: "concern", control: react_1["default"].createElement(material_1.Radio, null), label: "QC Concern/Corrective Action" })),
                qcStatus === 'concern' && (react_1["default"].createElement(material_1.TextField, { label: "Concern/Corrective Action", multiline: true, rows: 4, value: qcComment, onChange: function (e) { return setQcComment(e.target.value); }, variant: "outlined", fullWidth: true, style: { marginTop: '20px' } })),
                react_1["default"].createElement(material_2.Button, { variant: "contained", onClick: saveComment, style: { marginTop: '20px' } }, "Save Comment to Report")))));
};
exports["default"] = LeveyJennings;
