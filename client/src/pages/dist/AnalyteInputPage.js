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
var react_1 = require("react");
var Analyte_1 = require("../components/Analyte");
var NavBar_1 = require("../components/NavBar");
var material_1 = require("@mui/material");
var ThemeContext_1 = require("../context/ThemeContext");
var utils_1 = require("../utils/utils");
var getData_1 = require("../utils/indexedDB/getData");
var renderer_1 = require("@react-pdf/renderer");
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
var AuthContext_1 = require("../context/AuthContext");
var react_router_dom_1 = require("react-router-dom");
var AnalyteInputPage = function (props) {
    var theme = ThemeContext_1.useTheme().theme;
    var inputRefs = react_1.useRef([]);
    var analyteNameRefs = react_1.useRef([]);
    var _a = react_1.useState([]), records = _a[0], setRecords = _a[1];
    var _b = react_1.useState(null), selectedRecord = _b[0], setSelectedRecord = _b[1];
    var username = AuthContext_1.useAuth().username;
    // Function to print out the report pdf file
    var reportPDF = function (analyteValues, QCData) {
        var currentDate = new Date();
        var tw = react_pdf_tailwind_1.createTw({
            theme: {},
            extend: {}
        });
        var monthNames = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(renderer_1.Document, { style: tw("border border-sold border-black") },
                react_1["default"].createElement(renderer_1.Page, { style: tw("py-8 px-16 border border-sold border-black") },
                    react_1["default"].createElement(renderer_1.Text, { style: tw("sm:text-[24px] text-center") }, "Quality Controls Report"),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mt-8 mb-2 text-[13px]") },
                        "Date: ",
                        monthNames[currentDate.getMonth()],
                        " ",
                        currentDate.getDate(),
                        ", ",
                        currentDate.getFullYear()),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mb-2 text-[13px]") },
                        "Lot Number: ",
                        (QCData === null || QCData === void 0 ? void 0 : QCData.lotNumber) || "error"),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mb-8 text-[13px]") },
                        "QC Duration: ",
                        (QCData === null || QCData === void 0 ? void 0 : QCData.openDate) || "undetermined",
                        " - ",
                        (QCData === null || QCData === void 0 ? void 0 : QCData.closedDate) || "undetermined"),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("text-[22px] mb-8 text-center") },
                        props.name,
                        " QC"),
                    react_1["default"].createElement(renderer_1.View, { style: tw("flex-row justify-around") },
                        react_1["default"].createElement(renderer_1.Text, { style: tw("font-[700] text-[15px]") }, "Analytes"),
                        react_1["default"].createElement(renderer_1.Text, { style: tw("font-[700] text-[15px]") }, "Value"),
                        react_1["default"].createElement(renderer_1.Text, { style: tw("font-[700] text-[15px]") },
                            "Level ",
                            detectLevel(props.name) === 1 ? "I" : "II",
                            " Range")),
                    react_1["default"].createElement(renderer_1.View, { style: tw("w-full h-[1px] bg-black mt-2") }),
                    react_1["default"].createElement(renderer_1.View, { style: tw("flex-row justify-between p-5") },
                        react_1["default"].createElement(renderer_1.View, null, analyteValues === null || analyteValues === void 0 ? void 0 : analyteValues.map(function (value, index) { return (react_1["default"].createElement(renderer_1.Text, { style: tw("mb-2 text-[13px] " + ((invalidIndexArray === null || invalidIndexArray === void 0 ? void 0 : invalidIndexArray.includes(index)) ? "text-red-500" : "")), key: index }, QCData === null || QCData === void 0 ? void 0 : QCData.analytes[index].analyteName)); })),
                        react_1["default"].createElement(renderer_1.View, null, analyteValues === null || analyteValues === void 0 ? void 0 : analyteValues.map(function (value, index) { return (react_1["default"].createElement(renderer_1.Text, { style: tw("mb-2 text-[13px] " + ((invalidIndexArray === null || invalidIndexArray === void 0 ? void 0 : invalidIndexArray.includes(index)) ? "text-red-500" : "")), key: index },
                            parseFloat(value),
                            " ", QCData === null || QCData === void 0 ? void 0 :
                            QCData.analytes[index].unit_of_measure)); })),
                        react_1["default"].createElement(renderer_1.View, null, analyteValues === null || analyteValues === void 0 ? void 0 : analyteValues.map(function (value, index) { return (react_1["default"].createElement(renderer_1.Text, { style: tw("mb-2 text-[13px] " + ((invalidIndexArray === null || invalidIndexArray === void 0 ? void 0 : invalidIndexArray.includes(index)) ? "text-red-500" : "")), key: index }, QCData === null || QCData === void 0 ? void 0 :
                            QCData.analytes[index].min_level,
                            " - ", QCData === null || QCData === void 0 ? void 0 :
                            QCData.analytes[index].max_level,
                            " ", QCData === null || QCData === void 0 ? void 0 :
                            QCData.analytes[index].unit_of_measure)); }))),
                    react_1["default"].createElement(renderer_1.View, { style: tw("w-full h-[1px] bg-black mt-2") }),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mt-2") }, "QC Comments:"),
                    react_1["default"].createElement(renderer_1.View, null, modalData.map(function (item, index) { return (react_1["default"].createElement(renderer_1.View, { style: tw("flex-row items-center") },
                        react_1["default"].createElement(renderer_1.View, { style: tw("self-center w-[4px] h-[4px] bg-black rounded-full") }),
                        react_1["default"].createElement(renderer_1.Text, { style: tw("text-[13px] w-full px-6 text-justify text-wrap mt-2"), key: index }, QCData === null || QCData === void 0 ? void 0 :
                            QCData.analytes[item.invalidIndex].analyteName,
                            ": ",
                            item.comment))); })),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mt-8 text-[13px]") },
                        "Approved by: ",
                        username),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mt-2 text-[13px]") },
                        "Date: ",
                        currentDate.getMonth() + 1,
                        "/",
                        currentDate.getDate(),
                        "/",
                        currentDate.getFullYear()),
                    react_1["default"].createElement(renderer_1.Text, { style: tw("mt-2 text-[13px]") },
                        "Time: ",
                        currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))))));
    };
    /*const openPDF = async () => {
       const blob = await pdf(reportPDF(analyteValues, QCData)).toBlob();
       const pdfUrl = URL.createObjectURL(blob);
       window.open(pdfUrl, "_blank");
     }*/
    // const [isValid, setIsValid] = useState<boolean>(false);
    var _c = react_1.useState(false), isInputFull = _c[0], setIsInputFull = _c[1];
    var _d = react_1.useState([]), analyteValues = _d[0], setAnalyteValues = _d[1];
    var _e = react_1.useState(null), invalidIndexes = _e[0], setInvalidIndexes = _e[1];
    var _f = react_1.useState(false), isModalOpen = _f[0], setIsModalOpen = _f[1];
    var _g = react_1.useState([]), modalData = _g[0], setModalData = _g[1];
    var _h = react_router_dom_1.useParams(), fileName = _h.fileName, lotNumber = _h.lotNumber, closedDate = _h.closedDate;
    var _j = react_1.useState(null), QCData = _j[0], setQCData = _j[1];
    var invalidIndexArray = react_1.useMemo(function () {
        if (!invalidIndexes)
            return null;
        var newArray = [];
        invalidIndexes.forEach(function (value) { return newArray.push(value); });
        return newArray;
    }, [invalidIndexes]);
    var isValid = react_1.useMemo(function () {
        if ((!invalidIndexes || invalidIndexes.size === 0) && analyteValues.length === (QCData === null || QCData === void 0 ? void 0 : QCData.analytes.length))
            return true;
        else
            return false;
    }, [analyteValues]);
    var _k = react_1.useState(false), isValidManual = _k[0], setIsValidManual = _k[1];
    function detectLevel(str) {
        if (str.endsWith("I")) {
            return 1;
        }
        else if (str.endsWith("II")) {
            return 2;
        }
        else {
            return 0;
        }
    }
    function handleKeyPress(event, index) {
        var _a;
        // console.log("From handleKeyPress function: ", inputRefs.current[index]);
        if (event.key === "Enter" &&
            index < inputRefs.current.length - 1 &&
            inputRefs.current[index + 1]) {
            (_a = inputRefs.current[index + 1]) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }
    function handleTextareaChange(index, invalidIndex, value) {
        setModalData(function (prevValues) {
            var updatedValues = __spreadArrays(prevValues);
            updatedValues[index] = { invalidIndex: 0, comment: "" };
            // console.log(updatedValues)
            updatedValues[index].invalidIndex = invalidIndex;
            updatedValues[index].comment = value;
            return updatedValues;
        });
    }
    var handleAcceptQC = function () { return __awaiter(void 0, void 0, void 0, function () {
        var qcDataToSave, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!QCData) {
                        console.error("No QC data available to save.");
                        return [2 /*return*/];
                    }
                    qcDataToSave = __assign(__assign({}, QCData), { analytes: QCData.analytes.map(function (analyte, index) { return (__assign(__assign({}, analyte), { value: analyteValues[index] })); }) });
                    console.log("Data to save:", qcDataToSave); // Debug log
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getData_1.saveToDB("qc_store", qcDataToSave)];
                case 2:
                    _a.sent();
                    console.log("QC data saved successfully.");
                    // Optionally, you might want to reset or clear the form after saving
                    setAnalyteValues([]);
                    setInvalidIndexes(null);
                    setModalData([]);
                    setIsModalOpen(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error saving QC data:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    function handleInputChange(index, value, min, max) {
        var newValues = __spreadArrays(analyteValues);
        newValues[index] = value;
        setAnalyteValues(newValues);
        if (isNaN(parseFloat(value)) ||
            parseFloat(value) < min ||
            parseFloat(value) > max ||
            typeof value === "undefined"
        // newValues.length !== data.length
        ) {
            if (!invalidIndexes) {
                var newInvalidIndexes = new Set();
                newInvalidIndexes.add(index);
                setInvalidIndexes(newInvalidIndexes);
            }
            else {
                var newInvalidIndexes = new Set(invalidIndexes);
                newInvalidIndexes.add(index);
                setInvalidIndexes(newInvalidIndexes);
            }
        }
        else {
            var newInvalidIndexes = new Set(invalidIndexes);
            newInvalidIndexes["delete"](index);
            setInvalidIndexes(newInvalidIndexes);
        }
        setIsInputFull(newValues.length === (QCData === null || QCData === void 0 ? void 0 : QCData.analytes.length) && newValues.length > 0);
    }
    react_1.useEffect(function () {
        var storedQCData = localStorage.getItem('selectedQCData');
        if (storedQCData) {
            setQCData(JSON.parse(storedQCData));
        }
        else {
            console.error("No QC data found.");
        }
    }, []);
    react_1.useEffect(function () {
        console.log(invalidIndexes, invalidIndexArray, isValid);
    }, [analyteValues]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(NavBar_1["default"], { name: props.name + " QC Results" }),
        !QCData ? react_1["default"].createElement("div", null, "No data recorded") : react_1["default"].createElement(react_1["default"].Fragment, null),
        QCData && react_1["default"].createElement("div", { className: " flex flex-col space-y-12 pb-8 justify-center px-[100px] relative", style: { minWidth: "100svw", minHeight: "100svh" } },
            react_1["default"].createElement("div", { className: "analyte-list-container flex flex-wrap gap-14 sm:w-[90svw] sm:px-[149.5px] max-sm:flex-col mt-8 px-3 justify-center" }, QCData === null || QCData === void 0 ? void 0 : QCData.analytes.map(function (item, index) { return (react_1["default"].createElement("div", { onKeyDown: function (event) {
                    handleKeyPress(event, index);
                }, key: item.analyteName },
                react_1["default"].createElement(Analyte_1["default"], { name: item.analyteName, acronym: item.analyteAcronym, electro: item.electrolyte, min_level: +item.min_level, max_level: +item.max_level, level: detectLevel(props.name), measUnit: item.unit_of_measure, handleInputChange: function (val) {
                        if (item.min_level !== "" && item.max_level !== "") {
                            // console.log("First condition");
                            handleInputChange(index, val, +item.min_level, +item.max_level);
                        }
                        else {
                            // console.log("Second condition")
                            handleInputChange(index, val, -1, 9999);
                        }
                    }, ref: function (childRef) {
                        // console.log(childRef);
                        if (childRef) {
                            inputRefs.current.push(childRef.inputRef.current);
                            analyteNameRefs.current.push(childRef.nameRef.current);
                        }
                    } }))); })),
            react_1["default"].createElement("div", { className: "analyte-control-container sm:w-[90svw] w-[100svw] flex justify-between max-sm:flex-col max-sm:w-[100%] max-sm:space-y-4" },
                react_1["default"].createElement(material_1.Button, { className: "shadow-lg sm:w-fit sm:h-[50px] sm:!px-4 !bg-[#DAE3F3] !text-black !font-semibold !border !border-solid !border-[#6781AF]" }, "QC Function Overview"),
                react_1["default"].createElement("div", { className: "sm:space-x-16 max-sm:w-full max-sm:space-y-4" },
                    react_1["default"].createElement(material_1.Button, { className: "sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full " + (isInputFull
                            ? "!bg-[#DAE3F3] !text-black"
                            : "!bg-[#AFABAB] !text-white"), disabled: !isInputFull, onClick: function () { return setIsModalOpen(true); } }, "Apply QC Comment"),
                    react_1["default"].createElement(material_1.Button, { className: "sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full " + (isValid || isValidManual
                            ? "!bg-[#DAE3F3] !text-black"
                            : "!bg-[#AFABAB] !text-white"), disabled: !isValidManual && !isValid }, "Print QC"),
                    react_1["default"].createElement(material_1.Button, { className: "sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full " + (isValid
                            ? "!bg-[#DAE3F3] !text-black"
                            : "!bg-[#AFABAB] !text-white"), disabled: !isValid, onClick: function () { return handleAcceptQC(); } }, "Accept QC")))),
        react_1["default"].createElement(material_1.Modal, { open: isModalOpen, onClose: function () { return setIsModalOpen(false); } },
            react_1["default"].createElement("div", { className: "modal-conatiner absolute top-1/1 left-1/2 sm:w-[50svw] sm:h-[80svh] bg-[" + theme.secondaryColor + "] border-2 border-solid border-[#6781AF] rounded-xl sm:-translate-x-1/2 sm:translate-y-12 flex flex-col items-center sm:py-6 relative overflow-scroll sm:space-y-4" },
                react_1["default"].createElement("div", { className: "modal-title sm:text-2xl font-semibold" }, "QC Comment"),
                react_1["default"].createElement("div", { className: "invalid-items sm:w-[80%]" },
                    !invalidIndexArray || invalidIndexArray.length === 0 && react_1["default"].createElement("div", { className: "absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2" }, "No invalid items"),
                    invalidIndexArray && invalidIndexArray.length > 0 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("div", { className: "invalid-items-comments flex flex-col sm:space-y-6" },
                            invalidIndexArray.map(function (invalidItem, index) {
                                var _a;
                                return (react_1["default"].createElement("div", { className: "comment flex sm:space-x-12 h-fit", key: invalidItem },
                                    react_1["default"].createElement("div", { className: "comment-name w-[5%] sm:text-xl font-semibold self-center", dangerouslySetInnerHTML: { __html: utils_1.renderSubString(analyteNameRefs.current[invalidItem].innerHTML) } }),
                                    react_1["default"].createElement("textarea", { className: "grow sm:h-16 p-1", value: ((_a = modalData[index]) === null || _a === void 0 ? void 0 : _a.comment) || "", onChange: function (e) { return handleTextareaChange(index, invalidItem, e.target.value); }, required: true })));
                            }),
                            react_1["default"].createElement(material_1.ButtonBase, { className: "!rounded-lg sm!my-10 sm:!py-6 sm:!px-10 !bg-[" + theme.secondaryColor + "] !border-[1px] !border-solid !border-[" + theme.primaryBorderColor + "] transition ease-in-out hover:!bg-[" + theme.primaryHoverColor + "] hover:!border-[#2F528F] sm:w-1/2 self-center", onClick: (function (e) {
                                    e.preventDefault();
                                    // console.log(modalData)
                                    setIsValidManual(modalData.every(function (item) { return item.comment !== ""; }));
                                }) }, "Apply Comments")))))))));
};
exports["default"] = AnalyteInputPage;
