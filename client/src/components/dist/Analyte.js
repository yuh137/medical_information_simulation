"use strict";
exports.__esModule = true;
var react_1 = require("react");
var utils_1 = require("../utils/utils");
var Analyte = react_1.forwardRef(function (props, ref) {
    var _a = react_1.useState(''), inputValue = _a[0], setInputValue = _a[1];
    var inputRef = react_1.useRef(null);
    var nameRef = react_1.useRef(null);
    react_1.useImperativeHandle(ref, function () { return ({
        inputRef: inputRef,
        nameRef: nameRef
    }); });
    // console.log(props.measUnit)
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "\n            analyte-container sm:w-56 sm:h-fit px-4 sm:space-y-3 w-48 space-y-2\n            bg-[#B4C7E7]\n            border-2 border-solid border-[#7F9458] rounded-xl relative\n        " },
            react_1["default"].createElement("input", { type: "text", ref: inputRef, value: inputValue, className: "text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]", onKeyDown: function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        var newInput = (+inputValue).toFixed(2).replace(/^0+(?!\.|$)/, "");
                        // console.log(+event.currentTarget.value);
                        if (isNaN(+event.currentTarget.value) ||
                            +event.currentTarget.value < +props.min_level ||
                            +event.currentTarget.value > +props.max_level) {
                            event.currentTarget.classList.remove("bg-[#00FF00]");
                            event.currentTarget.classList.add("bg-[#FF0000]");
                        }
                        else {
                            event.currentTarget.classList.remove("bg-[#FF0000]");
                            event.currentTarget.classList.add("bg-[#00FF00]");
                        }
                        setInputValue(newInput);
                        props.handleInputChange(event.currentTarget.value);
                    }
                }, 
                // onChange={(event) => props.handleInputChange(event.target.value)}
                onChange: function (event) {
                    event.preventDefault();
                    var newValue = event.target.value;
                    var isValid = /^\d*\.?\d*$/.test(newValue);
                    if (isValid) {
                        setInputValue(newValue);
                    }
                } }),
            react_1["default"].createElement("div", { className: "analyte-acronym text-2xl font-semibold", dangerouslySetInnerHTML: { __html: utils_1.renderSubString(props.acronym) }, ref: nameRef }),
            react_1["default"].createElement("div", { className: "ananlyte-desc" },
                react_1["default"].createElement("div", { className: "analyte-name peer text-base truncate" }, props.name),
                react_1["default"].createElement("div", { className: "absolute invisible transition-all ease-in delay-100 peer-hover:visible text-white text-sm bg-slate-500 max-sm:text-center border border-solid border-gray-300 rounded-lg p-2" }, props.name),
                react_1["default"].createElement("div", { className: "analyte-range text-xs" }, props.level === 1 || props.level === 2 ? "Level " + (props.level === 1 ? "I" : "II") + " range: " + props.min_level + " -" + " " + "\n            " + props.max_level + " " + props.measUnit : "Range: " + props.min_level + " -" + " " + " " + props.max_level + " " + props.measUnit)))));
});
exports["default"] = Analyte;
