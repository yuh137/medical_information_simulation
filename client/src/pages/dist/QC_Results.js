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
var material_1 = require("@mui/material");
var react_2 = require("@iconify/react");
var NavBar_1 = require("../components/NavBar");
var table_1 = require("../components/ui/table");
var getData_1 = require("../utils/indexedDB/getData");
var react_table_1 = require("@tanstack/react-table");
var columns = [
    {
        accessorKey: "fileName",
        header: function () { return react_1["default"].createElement("span", null, "Test Name"); },
        cell: function (info) { return info.getValue(); }
    },
    {
        accessorKey: "lotNumber",
        header: function () { return react_1["default"].createElement("span", null, "Lot Number"); },
        cell: function (info) { return info.getValue(); }
    },
    {
        accessorKey: "closedDate",
        header: function () { return react_1["default"].createElement("span", null, "Expiration Date"); },
        cell: function (info) { return info.getValue(); }
    },
];
var QC_Results = function (props) {
    var navigate = react_router_dom_1.useNavigate();
    var _a = react_1.useState([]), qcData = _a[0], setQcData = _a[1];
    var _b = react_1.useState(null), selectedQC = _b[0], setSelectedQC = _b[1];
    react_1.useEffect(function () {
        var fetchQCData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var selectedQCs, allDataPromises, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Fetching QC data...");
                        selectedQCs = JSON.parse(localStorage.getItem('selectedQCItems') || '[]');
                        allDataPromises = selectedQCs.map(function (qcName) { return getData_1.getAllDataByFileName("qc_store", qcName); });
                        return [4 /*yield*/, Promise.all(allDataPromises)];
                    case 1:
                        results = _a.sent();
                        setQcData(results.flat());
                        console.log("Fetched QC data:", results.flat());
                        return [2 /*return*/];
                }
            });
        }); };
        fetchQCData();
    }, []);
    var handleSelectQC = function () { return __awaiter(void 0, void 0, void 0, function () {
        var qcData_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedQC) return [3 /*break*/, 5];
                    console.log("Selected QC:", selectedQC);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getData_1.getQCRangeByDetails(selectedQC.fileName, selectedQC.lotNumber, selectedQC.closedDate)];
                case 2:
                    qcData_1 = _a.sent();
                    if (qcData_1) {
                        console.log("QC Data found:", qcData_1);
                        // Save the qcData to localStorage
                        localStorage.setItem('selectedQCData', JSON.stringify(qcData_1));
                        // Navigate to the AnalyteInputPage
                        navigate("/simple-analyte-input-page");
                    }
                    else {
                        console.warn('No matching QC data found in the database.');
                        alert('No matching QC data found in the database.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching QC data:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    alert('Please select a QC record to proceed.');
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var table = react_table_1.useReactTable({
        data: qcData,
        columns: columns,
        getCoreRowModel: react_table_1.getCoreRowModel(),
        getPaginationRowModel: react_table_1.getPaginationRowModel()
    });
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(NavBar_1["default"], { name: props.name + " QC Results" }),
        react_1["default"].createElement("div", { className: "relative" },
            react_1["default"].createElement("div", { className: "table-container flex flex-col mt-8 sm:max-w-[75svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA]" },
                react_1["default"].createElement(table_1.Table, { className: "p-8 rounded-lg border-solid border-[1px] border-slate-200" },
                    react_1["default"].createElement(table_1.TableHeader, null, table.getHeaderGroups().map(function (group) { return (react_1["default"].createElement(table_1.TableRow, { key: group.id, className: "font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0" }, group.headers.map(function (header) { return (react_1["default"].createElement(table_1.TableHead, { key: header.id, className: "text-white text-center" }, react_table_1.flexRender(header.column.columnDef.header, header.getContext()))); }))); })),
                    react_1["default"].createElement(table_1.TableBody, null,
                        table.getRowModel().rows.map(function (row) { return (react_1["default"].createElement(table_1.TableRow, { key: row.id, onClick: function () { return setSelectedQC(row.original); }, style: { backgroundColor: row.original === selectedQC ? '#3A62A7' : undefined, color: row.original === selectedQC ? 'white' : undefined } }, row.getVisibleCells().map(function (cell) { return (react_1["default"].createElement(table_1.TableCell, { key: cell.id }, react_table_1.flexRender(cell.column.columnDef.cell, cell.getContext()))); }))); }),
                        qcData.length === 0 && (react_1["default"].createElement(table_1.TableRow, null,
                            react_1["default"].createElement(table_1.TableCell, { colSpan: 3, style: { textAlign: 'center' } }, "No data available")))))),
            react_1["default"].createElement("div", { className: "flex items-center justify-center space-x-2 py-4" },
                react_1["default"].createElement("div", { className: "space-x-2" },
                    react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return table.previousPage(); }, disabled: !table.getCanPreviousPage() },
                        react_1["default"].createElement(react_2.Icon, { icon: "mdi:arrow-left-thin" })),
                    react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return table.nextPage(); }, disabled: !table.getCanNextPage() },
                        react_1["default"].createElement(react_2.Icon, { icon: "mdi:arrow-right-thin" })))),
            react_1["default"].createElement(material_1.Button, { className: "sm:!absolute sm:w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] right-3 -bottom-3 !border !border-solid !border-blue-500 font-medium !text-black", onClick: handleSelectQC, disabled: !selectedQC }, "Select QC"))));
};
exports["default"] = QC_Results;
