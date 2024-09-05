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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var NavBar_1 = require("../../components/NavBar");
var utils_1 = require("../../utils/utils");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var material_1 = require("@mui/material");
var OrderControls = function () {
    var _a = react_1.useState([]), SelectedQCItems = _a[0], setSelectedQCItems = _a[1];
    var _b = react_1.useState(utils_1.qcTypeLinkList.map(function (qc) { return qc.name; }) // I change this to qctypelinklist from utils from manually defining each draggable
    ), OrderControlsItems = _b[0], setOrderControlsItems = _b[1];
    var onDragEnd = function (results) {
        // console.log(results);
        var source = results.source, destination = results.destination, type = results.type;
        if (!destination)
            return;
        if (source.droppableId === destination.droppableId)
            return;
        if (type === "group") {
            var sourceIndex = source.index;
            var destinationIndex = destination.index;
            if (source.droppableId === "Order_QC") {
                var sourceItems = __spreadArrays(OrderControlsItems);
                var destItems = __spreadArrays(SelectedQCItems);
                var deletedItem = sourceItems.splice(sourceIndex, 1)[0];
                destItems.splice(destinationIndex, 0, deletedItem);
                setOrderControlsItems(sourceItems);
                setSelectedQCItems(destItems);
            }
            if (source.droppableId === "QC_Selected") {
                var sourceItems = __spreadArrays(SelectedQCItems);
                var destItems = __spreadArrays(OrderControlsItems);
                var deletedItem = sourceItems.splice(sourceIndex, 1)[0];
                destItems.splice(destinationIndex, 0, deletedItem);
                setSelectedQCItems(sourceItems);
                setOrderControlsItems(destItems);
            }
        }
    };
    var handleOrderSelectedQC = function () {
        localStorage.setItem('selectedQCItems', JSON.stringify(SelectedQCItems));
        console.log("QC Items ordered: ", SelectedQCItems);
    };
    var handleClearSelection = function () {
        setSelectedQCItems([]);
        localStorage.removeItem('selectedQCItems'); // Clear local storage
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: onDragEnd },
            react_1["default"].createElement(NavBar_1["default"], { name: "Order Controls" }),
            react_1["default"].createElement("div", { className: "flex justify-center gap-32 items-center", style: { minWidth: "100svw", minHeight: "90svh" } },
                react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "Order_QC", type: "group" }, function (drop_provided) { return (react_1["default"].createElement("div", __assign({ ref: drop_provided.innerRef }, drop_provided.droppableProps, { className: "w-[20%] h-[80svh]" }),
                    react_1["default"].createElement("div", { className: "order-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4" },
                        react_1["default"].createElement("div", { className: "order-qc-title sm:text-4xl text-center font-semibold" }, "Order QC"),
                        react_1["default"].createElement("div", { className: "order-qc-items-container flex flex-col gap-4 overflow-scroll" },
                            OrderControlsItems.length === 0 ? (react_1["default"].createElement("div", { className: "text-center" }, "All items selected")) : (react_1["default"].createElement(react_1["default"].Fragment, null)),
                            OrderControlsItems.map(function (item, index) { return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { draggableId: "" + item, index: index, key: "" + item }, function (drag_provided) { return (react_1["default"].createElement("div", __assign({ ref: drag_provided.innerRef }, drag_provided.dragHandleProps, drag_provided.draggableProps, { className: "order-qc-item bg-[#47669C] p-4 rounded-md text-white", onClick: function () {
                                    var orderQCs = __spreadArrays(OrderControlsItems);
                                    var selectedQCs = __spreadArrays(SelectedQCItems);
                                    var deletedQC = orderQCs.splice(index, 1)[0];
                                    selectedQCs.push(deletedQC);
                                    setOrderControlsItems(orderQCs);
                                    setSelectedQCItems(selectedQCs);
                                } }), item)); })); }),
                            drop_provided.placeholder)))); }),
                react_1["default"].createElement("div", { className: "control-buttons flex flex-col gap-10" },
                    react_1["default"].createElement(material_1.ButtonBase, { onClick: handleClearSelection },
                        react_1["default"].createElement("div", { className: "!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]" }, "Clear Selection")),
                    react_1["default"].createElement(material_1.ButtonBase, { onClick: handleOrderSelectedQC },
                        react_1["default"].createElement("div", { className: "!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]" }, "Order Selected QC"))),
                react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "QC_Selected", type: "group" }, function (drop_provided) { return (react_1["default"].createElement("div", __assign({ ref: drop_provided.innerRef }, drop_provided.droppableProps, { className: "w-[20%]" }),
                    react_1["default"].createElement("div", { className: "selected-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4" },
                        react_1["default"].createElement("div", { className: "selected-qc-title sm:text-4xl text-center font-semibold" }, "Selected QC"),
                        react_1["default"].createElement("div", { className: "selected-qc-items-container flex flex-col gap-4 overflow-scroll" },
                            SelectedQCItems.length === 0 ? (react_1["default"].createElement("div", { className: "text-center" }, "No selected items")) : (react_1["default"].createElement(react_1["default"].Fragment, null)),
                            SelectedQCItems.map(function (item, index) { return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { draggableId: "" + item, index: index, key: "" + item }, function (drag_provided) { return (react_1["default"].createElement("div", __assign({ ref: drag_provided.innerRef }, drag_provided.dragHandleProps, drag_provided.draggableProps, { className: "selected-qc-item bg-[#47669C] p-4 rounded-md text-white", onClick: function () {
                                    var orderQCs = __spreadArrays(OrderControlsItems);
                                    var selectedQCs = __spreadArrays(SelectedQCItems);
                                    var deletedQC = selectedQCs.splice(index, 1)[0];
                                    orderQCs.push(deletedQC);
                                    setOrderControlsItems(orderQCs);
                                    setSelectedQCItems(selectedQCs);
                                } }), item)); })); }),
                            drop_provided.placeholder)))); })))));
};
exports["default"] = OrderControls;
