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
var NavBar_1 = require("../../components/NavBar");
var table_1 = require("../../components/ui/table");
var material_1 = require("@mui/material");
var react_2 = require("@iconify/react");
var react_router_dom_1 = require("react-router-dom");
var getData_1 = require("../../utils/indexedDB/getData");
var react_table_1 = require("@tanstack/react-table");
var modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    height: '80vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto'
};
var selectedRowStyle = {
    background: '#0070C0',
    color: '#fff'
};
var defaultRowStyle = {
    background: '#E9EBF5',
    color: '#000'
};
var tableHeaderStyle = {
    background: '#3A62A7',
    color: '#fff',
    textAlign: 'center'
};
var Simple_Faculty_QC_Review = function (props) {
    var _a;
    var navigate = react_router_dom_1.useNavigate();
    var _b = react_1.useState(null), selectedRow = _b[0], setSelectedRow = _b[1];
    var _c = react_1.useState(null), selectedAnalyte = _c[0], setSelectedAnalyte = _c[1];
    var _d = react_1.useState(undefined), selectedRowData = _d[0], setSelectedRowData = _d[1];
    var _e = react_1.useState([]), qcItems = _e[0], setQcItems = _e[1];
    var _f = react_1.useState(false), open = _f[0], setOpen = _f[1];
    // Fetch all QC items from IndexedDB
    react_1.useEffect(function () {
        var fetchQCData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getData_1.getAllDataFromStore('qc_store')];
                    case 1:
                        data = (_a.sent());
                        // Map over the data and ensure type consistency
                        setQcItems(data.map(function (item) { return ({
                            fileName: String(item.fileName),
                            lotNumber: String(item.lotNumber),
                            closedDate: String(item.closedDate),
                            analytes: item.analytes.map(function (analyte) { return ({ analyteName: analyte.analyteName }); })
                        }); }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching QC data:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchQCData();
    }, []);
    function handleLeveyJenningsClick() {
        if (selectedRowData && selectedAnalyte) {
            navigate("/levey-jennings/" + selectedRowData.fileName + "/" + selectedRowData.lotNumber + "/" + selectedAnalyte);
        }
    }
    function handleRowClick(rowId, rowData) {
        setSelectedRow(rowId === selectedRow ? null : rowId);
        setSelectedRowData(rowId === selectedRow ? undefined : rowData);
    }
    function handleAnalyteClick(analyteName) {
        setSelectedAnalyte(analyteName === selectedAnalyte ? null : analyteName);
    }
    var handleRemoveSelected = function () {
        if (selectedRow) {
            setQcItems(function (prevItems) {
                return prevItems.filter(function (item) { return item.fileName !== selectedRow; });
            });
            setSelectedRow(null);
            setSelectedRowData(undefined);
        }
    };
    var columns = react_1.useMemo(function () { return [
        {
            accessorKey: "fileName",
            header: "File Name"
        },
        {
            accessorKey: "lotNumber",
            header: "Lot Number"
        },
        {
            accessorKey: "closedDate",
            header: "Closed Date"
        },
    ]; }, []);
    var table = react_table_1.useReactTable({
        data: qcItems,
        columns: columns,
        getCoreRowModel: react_table_1.getCoreRowModel(),
        getPaginationRowModel: react_table_1.getPaginationRowModel()
    });
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(NavBar_1["default"], { name: props.name + " QC Results" }),
        react_1["default"].createElement("div", { className: "relative" },
            react_1["default"].createElement("div", { className: "table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]" },
                react_1["default"].createElement(table_1.Table, { className: "p-8 rounded-lg border-solid border-[1px] border-slate-200" },
                    react_1["default"].createElement(table_1.TableHeader, null, table.getHeaderGroups().map(function (group) { return (react_1["default"].createElement(table_1.TableRow, { key: group.id, className: "font-bold text-3xl", style: tableHeaderStyle }, group.headers.map(function (header) { return (react_1["default"].createElement(table_1.TableHead, { key: header.id, style: tableHeaderStyle }, react_table_1.flexRender(header.column.columnDef.header, header.getContext()))); }))); })),
                    react_1["default"].createElement(table_1.TableBody, null, !((_a = table.getRowModel().rows) === null || _a === void 0 ? void 0 : _a.length) ? (react_1["default"].createElement(table_1.TableRow, null,
                        react_1["default"].createElement(table_1.TableCell, { colSpan: columns.length, className: "h-24 text-center" }, "No data"))) : (table.getRowModel().rows.map(function (row) { return (react_1["default"].createElement(table_1.TableRow, { key: row.id, onClick: function () {
                            var selected = {
                                fileName: String(row.getValue("fileName")),
                                lotNumber: String(row.getValue("lotNumber")),
                                closedDate: String(row.getValue("closedDate")),
                                analytes: row.original.analytes
                            };
                            handleRowClick(row.id, selected);
                        }, className: "text-center sm:h-[10%] hover:cursor-pointer", style: row.id === selectedRow ? selectedRowStyle : defaultRowStyle }, row.getVisibleCells().map(function (cell) { return (react_1["default"].createElement(table_1.TableCell, { key: cell.id }, react_table_1.flexRender(cell.column.columnDef.cell, cell.getContext()))); }))); }))))),
            react_1["default"].createElement("div", { className: "flex items-center justify-center space-x-2 py-4" },
                react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return table.previousPage(); }, disabled: !table.getCanPreviousPage() },
                    react_1["default"].createElement(react_2.Icon, { icon: "mdi:arrow-left-thin" })),
                react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return table.nextPage(); }, disabled: !table.getCanNextPage() },
                    react_1["default"].createElement(react_2.Icon, { icon: "mdi:arrow-right-thin" }))),
            react_1["default"].createElement("div", { className: "flex items-center justify-center space-x-4 py-4" },
                react_1["default"].createElement(material_1.Button, { className: "sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black", onClick: function () { return setOpen(true); }, disabled: !selectedRowData }, "Review Selected"),
                react_1["default"].createElement(material_1.Button, { className: "sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black", onClick: handleRemoveSelected, disabled: !selectedRow }, "Remove Selected")),
            react_1["default"].createElement(material_1.Modal, { open: open, onClose: function () { return setOpen(false); } },
                react_1["default"].createElement(material_1.Box, { sx: modalStyle },
                    react_1["default"].createElement(material_1.Typography, { variant: "h5", align: "center", gutterBottom: true }, "QC Review - Analytes"),
                    selectedRowData && (react_1["default"].createElement("div", null,
                        react_1["default"].createElement(material_1.Typography, { variant: "body1", align: "center" },
                            react_1["default"].createElement("strong", null, "File Name:"),
                            " ",
                            selectedRowData.fileName,
                            " \u00A0 | \u00A0",
                            react_1["default"].createElement("strong", null, "Lot Number:"),
                            " ",
                            selectedRowData.lotNumber,
                            " \u00A0 | \u00A0",
                            react_1["default"].createElement("strong", null, "Closed Date:"),
                            " ",
                            selectedRowData.closedDate),
                        react_1["default"].createElement(table_1.Table, { className: "p-8 rounded-lg border-solid border-[1px] border-slate-200 mt-4" },
                            react_1["default"].createElement(table_1.TableHeader, null,
                                react_1["default"].createElement(table_1.TableRow, { style: tableHeaderStyle },
                                    react_1["default"].createElement(table_1.TableHead, { className: "text-center" }, "Analyte Name"))),
                            react_1["default"].createElement(table_1.TableBody, null, selectedRowData.analytes.map(function (analyte, index) { return (react_1["default"].createElement(table_1.TableRow, { key: index, onClick: function () { return handleAnalyteClick(analyte.analyteName); }, style: analyte.analyteName === selectedAnalyte ? selectedRowStyle : defaultRowStyle },
                                react_1["default"].createElement(table_1.TableCell, { className: "text-center" }, analyte.analyteName))); }))),
                        react_1["default"].createElement("div", { className: "flex justify-center mt-6" },
                            react_1["default"].createElement(material_1.Button, { variant: "contained", color: "primary", onClick: handleLeveyJenningsClick, disabled: !selectedAnalyte, className: "mr-4" }, "Levey Jennings"),
                            react_1["default"].createElement(material_1.Button, { variant: "contained", color: "primary", onClick: function () {
                                    console.log("Qualitative Analysis clicked"); // Placeholder for future functionality
                                } }, "Qualitative Analysis")))))))));
};
exports["default"] = Simple_Faculty_QC_Review;
