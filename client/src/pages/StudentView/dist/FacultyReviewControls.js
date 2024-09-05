"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_table_1 = require("@tanstack/react-table");
var modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};
var Faculty_QC_Review = function (props) {
    var _a;
    var navigate = react_router_dom_1.useNavigate();
    var _b = react_1.useState(null), selectedRow = _b[0], setSelectedRow = _b[1];
    var _c = react_1.useState(undefined), selectedRowData = _c[0], setSelectedRowData = _c[1];
    var _d = react_1.useState([]), qcItems = _d[0], setQcItems = _d[1];
    var _e = react_1.useState(false), open = _e[0], setOpen = _e[1];
    var _f = react_1.useState([]), analyteData = _f[0], setAnalyteData = _f[1];
    // Fetch selected QC data from localStorage and set filename and lotNumber
    react_1.useEffect(function () {
        var storedQCData = localStorage.getItem("selectedQCData");
        if (storedQCData) {
            var qcData = JSON.parse(storedQCData);
            // Convert the saved QC data into the format required by the table
            var items = qcData.map(function (qc) { return ({
                id: qc.fileName + "-" + qc.lotNumber,
                dep: props.name,
                test: qc.fileName,
                status: "Open",
                openDate: qc.openDate,
                closeDate: qc.closedDate || "",
                reviewed: false
            }); });
            setQcItems(items);
        }
        else {
            console.error("No QC data found.");
        }
    }, [props.name]);
    function handleRowClick(rowId, rowData) {
        setSelectedRow(rowId === selectedRow ? null : rowId);
        setSelectedRowData(rowId === selectedRow ? undefined : rowData);
    }
    var handleCheckboxChange = react_1.useCallback(function (id, checked) {
        setQcItems(function (prevItems) {
            return prevItems.map(function (item) {
                return item.id === id ? __assign(__assign({}, item), { reviewed: checked }) : item;
            });
        });
    }, []);
    var handleRemoveSelected = function () {
        if (selectedRow) {
            setQcItems(function (prevItems) {
                return prevItems.filter(function (item) { return item.id !== selectedRow; });
            });
            setSelectedRow(null);
            setSelectedRowData(undefined);
        }
    };
    var handleOpen = function () { return __awaiter(void 0, void 0, void 0, function () {
        var storedQCData, qcData, selectedQC;
        return __generator(this, function (_a) {
            if (selectedRowData === null || selectedRowData === void 0 ? void 0 : selectedRowData.test) {
                try {
                    storedQCData = localStorage.getItem("selectedQCData");
                    if (storedQCData) {
                        qcData = JSON.parse(storedQCData);
                        selectedQC = qcData.find(function (qc) { return qc.fileName === selectedRowData.test; });
                        if (selectedQC) {
                            setAnalyteData(selectedQC.analytes.map(function (analyte) { return ({
                                analyteName: analyte.analyteName,
                                analyteAcronym: analyte.analyteAcronym,
                                value: ""
                            }); }));
                        }
                    }
                }
                catch (error) {
                    console.error("Error fetching analyte data:", error);
                    setAnalyteData([]);
                }
            }
            setOpen(true);
            return [2 /*return*/];
        });
    }); };
    var handleAnalyteClick = function (analyteName) {
        navigate("/LeveyJennings?name=" + encodeURIComponent(props.name) + "&analyteName=" + encodeURIComponent(analyteName));
    };
    var handleClose = function () { return setOpen(false); };
    var columns = react_1.useMemo(function () { return [
        {
            accessorKey: "id",
            header: "QC Lot #",
            cell: function (info) { return react_1["default"].createElement("div", null, info.row.getValue("id")); }
        },
        {
            accessorKey: "dep",
            header: "Department",
            cell: function (info) { return react_1["default"].createElement("div", null, info.row.getValue("dep")); }
        },
        {
            accessorKey: "test",
            header: "Test",
            cell: function (info) { return react_1["default"].createElement("div", null, info.row.getValue("test")); }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: function (info) { return react_1["default"].createElement("div", null, info.row.getValue("status")); }
        },
        {
            accessorKey: "openDate",
            header: "Open Date",
            cell: function (info) { return react_1["default"].createElement("div", null, info.row.getValue("openDate")); }
        },
        {
            accessorKey: "closeDate",
            header: "Close Date",
            cell: function (info) { return react_1["default"].createElement("div", null, info.row.getValue("closeDate")); }
        },
        {
            accessorKey: "reviewed",
            header: "Reviewed",
            cell: function (info) { return (react_1["default"].createElement(material_1.Checkbox, { checked: info.row.getValue("reviewed"), onChange: function (e) {
                    return handleCheckboxChange(info.row.getValue("id"), e.target.checked);
                } })); }
        },
    ]; }, [handleCheckboxChange]);
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
                    react_1["default"].createElement(table_1.TableHeader, null, table.getHeaderGroups().map(function (group) { return (react_1["default"].createElement(table_1.TableRow, { key: group.id, className: "font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0" }, group.headers.map(function (header) { return (react_1["default"].createElement(table_1.TableHead, { key: header.id, className: "text-white text-center" }, react_table_1.flexRender(header.column.columnDef.header, header.getContext()))); }))); })),
                    react_1["default"].createElement(table_1.TableBody, null, !((_a = table.getRowModel().rows) === null || _a === void 0 ? void 0 : _a.length) ? (react_1["default"].createElement(table_1.TableRow, null,
                        react_1["default"].createElement(table_1.TableCell, { colSpan: columns.length, className: "h-24 text-center" }, "No data"))) : (table.getRowModel().rows.map(function (row) { return (react_1["default"].createElement(table_1.TableRow, { key: row.id, onClick: function () {
                            var selected = {
                                id: row.getValue("id"),
                                dep: row.getValue("dep"),
                                test: row.getValue("test"),
                                status: row.getValue("status"),
                                openDate: row.getValue("openDate"),
                                closeDate: row.getValue("closeDate"),
                                reviewed: row.getValue("reviewed")
                            };
                            handleRowClick(row.id, selected);
                        }, className: "text-center sm:h-[10%] hover:cursor-pointer", style: {
                            background: row.id === selectedRow ? "#0070C0" : "#E9EBF5",
                            color: row.id === selectedRow ? "#fff" : "#000"
                        } }, row.getVisibleCells().map(function (cell) { return (react_1["default"].createElement(table_1.TableCell, { key: cell.id }, react_table_1.flexRender(cell.column.columnDef.cell, cell.getContext()))); }))); }))))),
            react_1["default"].createElement("div", { className: "flex items-center justify-center space-x-2 py-4" },
                react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return table.previousPage(); }, disabled: !table.getCanPreviousPage() },
                    react_1["default"].createElement(react_2.Icon, { icon: "mdi:arrow-left-thin" })),
                react_1["default"].createElement(material_1.Button, { variant: "outlined", onClick: function () { return table.nextPage(); }, disabled: !table.getCanNextPage() },
                    react_1["default"].createElement(react_2.Icon, { icon: "mdi:arrow-right-thin" }))),
            react_1["default"].createElement("div", { className: "flex items-center justify-center space-x-4 py-4" },
                react_1["default"].createElement(material_1.Button, { className: "sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black", onClick: handleOpen, disabled: !selectedRowData }, "Review Selected"),
                react_1["default"].createElement(material_1.Button, { className: "sm:!w-36 sm:h-12 sm:!text-lg !bg-[#DAE3F3] !border !border-solid !border-blue-500 font-medium !text-black", onClick: handleRemoveSelected, disabled: !selectedRow }, "Remove Selected"))),
        react_1["default"].createElement(material_1.Modal, { open: open, onClose: handleClose, "aria-labelledby": "modal-title", "aria-describedby": "modal-description" },
            react_1["default"].createElement(material_1.Box, { sx: __assign({}, modalStyle) },
                react_1["default"].createElement("h2", { id: "modal-title" }, "Analyte Details"),
                react_1["default"].createElement(table_1.Table, { className: "p-8 rounded-lg border-solid border-[1px] border-slate-200" },
                    react_1["default"].createElement(table_1.TableHeader, null,
                        react_1["default"].createElement(table_1.TableRow, { className: "font-bold text-3xl bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0" },
                            react_1["default"].createElement(table_1.TableHead, { className: "text-white text-center" }, "Analyte Name"))),
                    react_1["default"].createElement(table_1.TableBody, null, analyteData.map(function (analyte) { return (react_1["default"].createElement(table_1.TableRow, { key: analyte.analyteName, onClick: function () { return handleAnalyteClick(analyte.analyteName); } },
                        react_1["default"].createElement(table_1.TableCell, null, analyte.analyteName))); }))),
                react_1["default"].createElement(material_1.Button, { onClick: handleClose }, "Close")))));
};
exports["default"] = Faculty_QC_Review;
