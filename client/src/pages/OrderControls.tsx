import React, { useState, useCallback } from "react";
import NavBar from "../components/NavBar";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { ButtonBase } from "@mui/material"

const OrderControls = () => {
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>([
    "CMP Level I QC",
    "CMP Level II QC",
    "Cardiac Level I QC",
    "Cardiac Level II QC",
    "Thyroid Level I QC",
    "Thyroid Level II QC",
    "Liver Level I QC",
    "Liver Level II QC",
    "Lipid Level I QC",
    "Lipid Level II QC",
    "Iron Studies Level I QC",
    "Iron Studies Level II QC",
    "Drug Screen Level I QC",
    "Drug Screen Level II QC",
    "Hormone Level I QC",
    "Hormone Level II QC",
  ]);

  const onDragEnd = (results: DropResult) => {
    // console.log(results);
    const { source, destination, type } = results;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    if (type === "group") {
      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      if (source.droppableId === "Order_QC") {
        let sourceItems = [...OrderControlsItems];
        let destItems = [...SelectedQCItems];

        const [deletedItem] = sourceItems.splice(sourceIndex, 1);
        destItems.splice(destinationIndex, 0, deletedItem);

        setOrderControlsItems(sourceItems);
        setSelectedQCItems(destItems);
      }

      if (source.droppableId === "QC_Selected") {
        let sourceItems = [...SelectedQCItems];
        let destItems = [...OrderControlsItems];

        const [deletedItem] = sourceItems.splice(sourceIndex, 1);
        destItems.splice(destinationIndex, 0, deletedItem);

        setSelectedQCItems(sourceItems);
        setOrderControlsItems(destItems);
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NavBar name="Order Controls" />
        <div
          className="container flex justify-center gap-32 items-center"
          style={{ minWidth: "100svw", minHeight: "90svh" }}
        >
          <Droppable droppableId="Order_QC" type="group">
            {(drop_provided) => (
              <div
                ref={drop_provided.innerRef}
                {...drop_provided.droppableProps}
                className="w-[20%] h-[80svh]"
              >
                <div className="order-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4">
                  <div className="order-qc-title sm:text-4xl text-center font-semibold">Order QC</div>
                  <div className="order-qc-items-container flex flex-col gap-4 overflow-scroll">
                    {OrderControlsItems.length === 0 ? (<div className="text-center">All items selected</div>) : (<></>)}
                    {OrderControlsItems.map((item, index) => (
                        <Draggable
                        draggableId={`${item}`}
                        index={index}
                        key={`${item}`}
                        >
                        {(drag_provided) => (
                            <div
                              ref={drag_provided.innerRef}
                              {...drag_provided.dragHandleProps}
                              {...drag_provided.draggableProps}
                              className="order-qc-item bg-[#47669C] p-4 rounded-md text-white"
                              onClick={() => {
                                  let orderQCs = [...OrderControlsItems];
                                  let selectedQCs = [...SelectedQCItems];

                                  const [deletedQC] = orderQCs.splice(index, 1);
                                  selectedQCs.push(deletedQC);

                                  setOrderControlsItems(orderQCs);
                                  setSelectedQCItems(selectedQCs);
                              }}
                            >
                              {item}
                              {/* <div className="order-qc-item bg-[#47669C] p-4 rounded-md text-white">
                                  {item}
                              </div> */}
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {drop_provided.placeholder}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
          <div className="control-buttons flex flex-col gap-10">
            <ButtonBase>
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Clear Selection</div>
            </ButtonBase>
            <ButtonBase>
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Order Selected QC</div>
            </ButtonBase>
          </div>
          <Droppable droppableId="QC_Selected" type="group">
            {(drop_provided) => (
              <div
                ref={drop_provided.innerRef}
                {...drop_provided.droppableProps}
                className="w-[20%]"
              >
                <div className="selected-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4">
                    <div className="selected-qc-title sm:text-4xl text-center font-semibold">Selected QC</div>
                    <div className="selected-qc-items-container flex flex-col gap-4 overflow-scroll">
                        {SelectedQCItems.length === 0 ? (<div className="text-center">No selected items</div>) : (<></>)}
                        {SelectedQCItems.map((item, index) => (
                            <Draggable
                            draggableId={`${item}`}
                            index={index}
                            key={`${item}`}
                            >
                            {(drag_provided) => (
                                <div
                                ref={drag_provided.innerRef}
                                {...drag_provided.dragHandleProps}
                                {...drag_provided.draggableProps}
                                className="selected-qc-item bg-[#47669C] p-4 rounded-md text-white"
                                onClick={() => {
                                    let orderQCs = [...OrderControlsItems];
                                    let selectedQCs = [...SelectedQCItems];

                                    const [deletedQC] = selectedQCs.splice(index, 1);
                                    orderQCs.push(deletedQC);

                                    setOrderControlsItems(orderQCs);
                                    setSelectedQCItems(selectedQCs);
                                }}
                                >
                                {item}
                                {/* <div className="order-qc-item bg-[#47669C] p-4 rounded-md text-white">
                                    {item}
                                </div> */}
                                </div>
                            )}
                            </Draggable>
                        ))}
                        {drop_provided.placeholder}
                    </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};

export default OrderControls;
