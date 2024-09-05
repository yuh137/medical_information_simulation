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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.TestInputPage = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("../context/AuthContext");
var react_table_1 = require("@tanstack/react-table");
var table_1 = require("../components/ui/table");
var MOCK_DATA_1 = require("../utils/MOCK_DATA");
var utils_1 = require("../utils/utils");
var material_1 = require("@mui/material");
var ThemeContext_1 = require("../context/ThemeContext");
var addData_1 = require("../utils/indexedDB/addData");
var react_hook_form_1 = require("react-hook-form");
var getData_1 = require("../utils/indexedDB/getData");
var deleteData_1 = require("../utils/indexedDB/deleteData");
var NavBar_1 = require("../components/NavBar");
exports.TestInputPage = function (props) {
    var _a;
    var navigate = react_router_dom_1.useNavigate();
    var _b = AuthContext_1.useAuth(), checkSession = _b.checkSession, checkUserType = _b.checkUserType, isAuthenticated = _b.isAuthenticated, logout = _b.logout;
    var theme = ThemeContext_1.useTheme().theme;
    var dataType = props.dataType;
    var initialData = dataType === 'Cardiac' ? MOCK_DATA_1.Cardiac :
        dataType === 'Lipid' ? MOCK_DATA_1.Lipid :
            dataType === 'Thyroid' ? MOCK_DATA_1.Thyroid :
                dataType === 'Liver' ? MOCK_DATA_1.Liver :
                    dataType === 'Iron' ? MOCK_DATA_1.Iron :
                        dataType === 'Drug' ? MOCK_DATA_1.Drug :
                            dataType === 'Hormone' ? MOCK_DATA_1.Hormone :
                                dataType === 'Cancer' ? MOCK_DATA_1.Cancer :
                                    dataType === 'Pancreatic' ? MOCK_DATA_1.Pancreatic :
                                        dataType === 'Vitamins' ? MOCK_DATA_1.Vitamins :
                                            dataType === 'Diabetes' ? MOCK_DATA_1.Diabetes :
                                                MOCK_DATA_1.CMP;
    console.log("DataType:", dataType);
    var _c = react_1.useState(initialData), QCElements = _c[0], setQCElements = _c[1];
    var _d = react_1.useState(false), isValid = _d[0], setIsValid = _d[1];
    var _e = react_1.useState(false), isDrawerOpen = _e[0], openDrawer = _e[1];
    var _f = react_hook_form_1.useForm(), register = _f.register, handleSubmit = _f.handleSubmit;
    var saveQC = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var check, deleteStatus, savedAnalyte, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getData_1.getDataByKey("qc_store", props.name)];
                case 1:
                    check = _a.sent();
                    if (!check) return [3 /*break*/, 3];
                    return [4 /*yield*/, deleteData_1.deleteData("qc_store", props.name)];
                case 2:
                    deleteStatus = _a.sent();
                    console.log(deleteStatus ? "Delete success" : "Delete failed");
                    _a.label = 3;
                case 3:
                    savedAnalyte = QCElements.map(function (_a) {
                        var analyteName = _a.analyteName, analyteAcronym = _a.analyteAcronym, unit_of_measure = _a.unit_of_measure, electrolyte = _a.electrolyte, mean = _a.mean, std_devi = _a.std_devi, min_level = _a.min_level, max_level = _a.max_level;
                        return ({ analyteName: analyteName, analyteAcronym: analyteAcronym, unit_of_measure: unit_of_measure, electrolyte: electrolyte, mean: mean, std_devi: std_devi, min_level: min_level, max_level: max_level });
                    });
                    return [4 /*yield*/, addData_1["default"]("qc_store", {
                            fileName: props.name,
                            lotNumber: data.lotNumber || "",
                            openDate: data.openDate || "",
                            closedDate: data.closedDate || "",
                            analytes: __spreadArrays(savedAnalyte)
                        })];
                case 4:
                    res = _a.sent();
                    console.log("Save result: ", res);
                    return [2 /*return*/];
            }
        });
    }); };
    var inputRefs = react_1.useRef([]);
    function moveToNextInputOnEnter(e) {
        var _a;
        if (e.key === 'Enter' && inputRefs.current.find(function (ele) { return ele === e.target; })) {
            var currentFocus = inputRefs.current.find(function (ele) { return ele === e.target; });
            if (currentFocus && inputRefs.current.indexOf(currentFocus) < inputRefs.current.length) {
                var currentIndex = inputRefs.current.indexOf(currentFocus);
                (_a = inputRefs.current[currentIndex + 1]) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else
                return;
        }
    }
    var columns = [
        // {
        //   accessorKey: 'electrolyte',
        //   header: 'Electrolyte',
        //   cell: (info) => <></>
        // },
        {
            accessorKey: "analyteName",
            header: "Name",
            cell: function (info) { return (react_1["default"].createElement("div", null, info.getValue())); }
        },
        {
            accessorKey: "analyteAcronym",
            header: "Abbreviation",
            cell: function (info) { return (react_1["default"].createElement("div", { dangerouslySetInnerHTML: { __html: utils_1.renderSubString(info.getValue()) } })); }
        },
        {
            accessorKey: "unit_of_measure",
            header: "Units of Measure",
            cell: function (info) { return (react_1["default"].createElement(react_1["default"].Fragment, null)); }
        },
        {
            accessorKey: "min_level",
            header: "Min Level",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "max_level",
            header: "Max Level",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "mean",
            header: "QC Mean",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "std_devi",
            header: "Standard Deviation",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "sdplus1",
            header: "+1 SD",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "sdminus1",
            header: "-1 SD",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "sdplus2",
            header: "+2 SD",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "sdminus2",
            header: "-2 SD",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "sdplus3",
            header: "+3 SD",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
        {
            accessorKey: "sdminus3",
            header: "-3 SD",
            cell: function (info) { return react_1["default"].createElement(react_1["default"].Fragment, null); }
        },
    ];
    var table = react_table_1.useReactTable({
        data: react_1.useMemo(function () { return QCElements; }, [QCElements]),
        columns: columns,
        getCoreRowModel: react_table_1.getCoreRowModel()
    });
    react_1.useEffect(function () {
        if (!checkSession() || checkUserType() === "student")
            navigate("/unauthorized");
    }, []);
    react_1.useEffect(function () {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getData_1.getDataByKey("qc_store", props.name)];
                    case 1:
                        res = _a.sent();
                        if (res && typeof res !== "string")
                            setQCElements(res.analytes);
                        return [2 /*return*/];
                }
            });
        }); })();
    }, []);
    react_1.useEffect(function () {
        console.log(QCElements);
    }, [QCElements]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(NavBar_1["default"], { name: props.name + " QC Builder" }),
        react_1["default"].createElement("div", { className: "basic-container relative sm:space-y-4 pb-24" },
            react_1["default"].createElement("div", { className: "input-container flex justify-center" },
                react_1["default"].createElement("div", { className: "drawer-container sm:h-full flex items-center py-4 sm:space-x-12" },
                    react_1["default"].createElement("div", { className: "lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2" },
                        react_1["default"].createElement("div", { className: "lotnumber-label sm:text-xl font-semibold text-white" }, "QC Lot Number"),
                        react_1["default"].createElement("input", __assign({ type: "text", className: "p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" }, register("lotNumber")))),
                    react_1["default"].createElement("div", { className: "lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2" },
                        react_1["default"].createElement("div", { className: "lotnumber-label sm:text-xl font-semibold text-white" }, "Expiration Date"),
                        react_1["default"].createElement("input", __assign({ type: "text", className: "p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" }, register("closedDate")))),
                    react_1["default"].createElement("div", { className: "lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2" },
                        react_1["default"].createElement("div", { className: "lotnumber-label sm:text-xl font-semibold text-white" }, "File Date"),
                        react_1["default"].createElement("input", { type: "text", className: "p-1 rounded-lg border border-solid border-[#548235] sm:w-[250px] text-center" })))),
            react_1["default"].createElement("div", { className: "table-container flex flex-col mt-8 sm:w-[94svw] sm:h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative" },
                react_1["default"].createElement(table_1.Table, { className: "p-8 rounded-lg border-solid border-[1px] border-slate-200" },
                    react_1["default"].createElement(table_1.TableHeader, null, table.getHeaderGroups().map(function (group) { return (react_1["default"].createElement(table_1.TableRow, { key: group.id, className: "font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0 z-20" }, group.headers.map(function (header) { return (react_1["default"].createElement(table_1.TableHead, { key: header.id, className: "text-white text-center" }, react_table_1.flexRender(header.column.columnDef.header, header.getContext()))); }))); })),
                    react_1["default"].createElement(table_1.TableBody, { onKeyDown: function (e) {
                            if (e.key === 'Enter') {
                                var minInputArray = inputRefs.current.filter(function (item) { return inputRefs.current.indexOf(item) % 4 === 1; });
                                // console.log(minInputArray);
                                minInputArray.forEach(function (item) {
                                    if (+inputRefs.current[inputRefs.current.indexOf(item) + 1].value < +item.value || item.value === '' || (inputRefs.current[inputRefs.current.indexOf(item) + 1].value === '0' && item.value === '0')) {
                                        item.classList.remove('bg-green-500');
                                        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-green-500');
                                        item.classList.add('bg-red-500');
                                        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-red-500');
                                    }
                                    else {
                                        // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
                                        item.classList.remove('bg-red-500');
                                        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove('bg-red-500');
                                        item.classList.add('bg-green-500');
                                        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add('bg-green-500');
                                    }
                                });
                                setIsValid(!inputRefs.current.some(function (item) { return item.classList.contains("bg-red-500"); }));
                                moveToNextInputOnEnter(e);
                            }
                        } },
                        !((_a = table.getRowModel().rows) === null || _a === void 0 ? void 0 : _a.length) ? (react_1["default"].createElement(table_1.TableRow, null,
                            react_1["default"].createElement(table_1.TableCell, { colSpan: columns.length, className: "sm:h-32 !p-2 text-center" }, "No data"))) : (react_1["default"].createElement(react_1["default"].Fragment, null)),
                        QCElements.map(function (row, index) { return (react_1["default"].createElement(table_1.TableRow, { key: row.analyteName, className: "text-center sm:h-[10%] border-none" },
                            react_1["default"].createElement(table_1.TableCell, null,
                                react_1["default"].createElement("div", null, row.analyteName)),
                            react_1["default"].createElement(table_1.TableCell, null,
                                react_1["default"].createElement("div", { dangerouslySetInnerHTML: { __html: utils_1.renderSubString(row.analyteAcronym) } })),
                            react_1["default"].createElement(table_1.TableCell, { className: "unit_of_measure" },
                                react_1["default"].createElement("input", { ref: function (el) { if (el && inputRefs.current.length < QCElements.length * 4) {
                                        inputRefs.current[index * 4] = el;
                                    } }, type: "text", className: "sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center", value: row.unit_of_measure === "" ? "" : row.unit_of_measure.toString(), onChange: function (e) {
                                        e.preventDefault();
                                        setQCElements(function (prevState) {
                                            var newState = prevState.map(function (item) {
                                                if (item.analyteName === row.analyteName && /^[a-zA-Z\/]+$/.test(e.target.value))
                                                    return __assign(__assign({}, item), { unit_of_measure: e.target.value });
                                                else
                                                    return item;
                                            });
                                            return newState;
                                        });
                                    } })),
                            react_1["default"].createElement(table_1.TableCell, { className: "min_level" },
                                react_1["default"].createElement("input", { type: "text", ref: function (el) { if (el && inputRefs.current.length < QCElements.length * 4) {
                                        inputRefs.current[index * 4 + 1] = el;
                                    } }, className: "sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center", value: row.min_level || '', onChange: function (e) {
                                        e.preventDefault();
                                        setQCElements(function (prevState) {
                                            var newState = prevState.map(function (item) {
                                                if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value)) {
                                                    return __assign(__assign({}, item), { min_level: e.target.value });
                                                }
                                                else
                                                    return item;
                                            });
                                            return newState;
                                        });
                                    }, onKeyDown: function (e) {
                                        // e.preventDefault();
                                        if (e.key === 'Enter') {
                                            console.log(e.currentTarget.value);
                                            setQCElements(function (prevState) {
                                                var newState = prevState.map(function (item) {
                                                    if (item.analyteName === row.analyteName) {
                                                        var new_level = (+item.min_level).toFixed(2).replace(/^0+(?!\.|$)/, "");
                                                        return __assign(__assign({}, item), { min_level: new_level });
                                                    }
                                                    else
                                                        return item;
                                                });
                                                return newState;
                                            });
                                        }
                                    } })),
                            react_1["default"].createElement(table_1.TableCell, { className: "max_level" },
                                react_1["default"].createElement("input", { type: "text", ref: function (el) { if (el && inputRefs.current.length < QCElements.length * 4) {
                                        inputRefs.current[index * 4 + 2] = el;
                                    } }, className: "sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center", value: row.max_level || '', onChange: function (e) {
                                        e.preventDefault();
                                        setQCElements(function (prevState) {
                                            var newState = prevState.map(function (item) {
                                                if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value))
                                                    return __assign(__assign({}, item), { max_level: e.target.value });
                                                else
                                                    return item;
                                            });
                                            return newState;
                                        });
                                    }, onKeyDown: function (e) {
                                        // e.preventDefault();
                                        if (e.key === 'Enter') {
                                            console.log(e.currentTarget.value);
                                            setQCElements(function (prevState) {
                                                var newState = prevState.map(function (item) {
                                                    if (item.analyteName === row.analyteName) {
                                                        var new_level = (+item.max_level).toFixed(2).replace(/^0+(?!\.|$)/, "");
                                                        return __assign(__assign({}, item), { max_level: new_level });
                                                    }
                                                    else
                                                        return item;
                                                });
                                                return newState;
                                            });
                                        }
                                    } })),
                            react_1["default"].createElement(table_1.TableCell, { className: "mean" },
                                react_1["default"].createElement("input", { type: "text", ref: function (el) { if (el && inputRefs.current.length < QCElements.length * 4) {
                                        inputRefs.current[index * 4 + 3] = el;
                                    } }, className: "sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center", value: row.mean || '', onChange: function (e) {
                                        e.preventDefault();
                                        setQCElements(function (prevState) {
                                            var newState = prevState.map(function (item) {
                                                if (item.analyteName === row.analyteName && /^\d*\.?\d*$/.test(e.target.value))
                                                    return __assign(__assign({}, item), { mean: e.target.value });
                                                else
                                                    return item;
                                            });
                                            return newState;
                                        });
                                    }, onKeyDown: function (e) {
                                        // e.preventDefault();
                                        if (e.key === 'Enter') {
                                            console.log(e.currentTarget.value);
                                            setQCElements(function (prevState) {
                                                var newState = prevState.map(function (item) {
                                                    if (item.analyteName === row.analyteName) {
                                                        var new_level = (+item.mean).toFixed(2).replace(/^0+(?!\.|$)/, "");
                                                        return __assign(__assign({}, item), { mean: new_level });
                                                    }
                                                    else
                                                        return item;
                                                });
                                                return newState;
                                            });
                                        }
                                    } })),
                            react_1["default"].createElement(table_1.TableCell, { className: "standard-deviation sm:w-32" },
                                react_1["default"].createElement("div", null, ((+row.max_level - +row.min_level) / 4).toFixed(2))),
                            react_1["default"].createElement(table_1.TableCell, { className: "sd+1 sm:w-20" },
                                react_1["default"].createElement("div", null, (+row.mean + (+row.max_level - +row.min_level) / 4).toFixed(2))),
                            react_1["default"].createElement(table_1.TableCell, { className: "sd-1 sm:w-20" },
                                react_1["default"].createElement("div", null, (+row.mean - (+row.max_level - +row.min_level) / 4).toFixed(2))),
                            react_1["default"].createElement(table_1.TableCell, { className: "sd+2 sm:w-20" },
                                react_1["default"].createElement("div", null, (+row.mean + ((+row.max_level - +row.min_level) / 4) * 2).toFixed(2))),
                            react_1["default"].createElement(table_1.TableCell, { className: "sd-2 sm:w-20" },
                                react_1["default"].createElement("div", null, (+row.mean - ((+row.max_level - +row.min_level) / 4) * 2).toFixed(2))),
                            react_1["default"].createElement(table_1.TableCell, { className: "sd+3 sm:w-20" },
                                react_1["default"].createElement("div", null, (+row.mean + ((+row.max_level - +row.min_level) / 4) * 3).toFixed(2))),
                            react_1["default"].createElement(table_1.TableCell, { className: "sd-3 sm:w-20" },
                                react_1["default"].createElement("div", null, (+row.mean - ((+row.max_level - +row.min_level) / 4) * 3).toFixed(2))))); })))),
            react_1["default"].createElement(material_1.ButtonBase, { disabled: !isValid, className: "save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold", onClick: handleSubmit(saveQC) }, "Save QC File"))));
};
