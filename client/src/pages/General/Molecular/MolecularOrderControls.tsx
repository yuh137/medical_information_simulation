import React, { useEffect, useState, useCallback } from "react";
import NavBar from "../../../components/NavBar";
import { qcTypeLinkListMolecular } from "../../../utils/utils";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getAllDataFromStore } from "../../../utils/indexedDB/getData";
import { AuthToken } from '../../../context/AuthContext';
import { QCPanel } from "../../../utils/indexedDB/IDBSchema";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { ButtonBase } from "@mui/material"

const MolecularOrderControls = () => {
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>([]);
  const [OrderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const fetchQCData = async () => {
    console.log("Fetching QC Panels...");
    const results = await getAllDataFromStore<QCPanel>('qc_store');
    console.log("Fetched QC Panels:", results);
    const token = localStorage.getItem("token");
    const authToken: AuthToken = JSON.parse(token as string);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken.jwtToken}`,
      },
    });
    const retyped_results = ((await res.json()) as unknown) as QCPanel[];
    console.log(`Results ${retyped_results}`);
    setOrderControlsItems(retyped_results.map(item => item.qcName));
  };

  useEffect(() => {

    fetchQCData();
  }, []);

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
  const handleOrderSelectedQC = () => {
    localStorage.setItem('selectedQCItems', JSON.stringify(SelectedQCItems));
    console.log("QC Items ordered: ", SelectedQCItems);
    //make the review qc button appear
    setOrderPlaced(true);
  };

  //navigate to review controls
  const handleReviewQC = () => {
    navigate('/student-review_controls');
  };

  const handleClearSelection = () => {
    // Add the selected items back to the order items list
    setOrderControlsItems((prevOrderItems) => [
      ...prevOrderItems,
      ...SelectedQCItems,
    ]);
    setSelectedQCItems([]);
    localStorage.removeItem('selectedQCItems');  // Clear local storage
    setOrderPlaced(false);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NavBar name="Molecular Order Controls" />
        <div
          className="flex justify-center gap-32 items-center"
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
            <ButtonBase onClick={handleClearSelection}>
              <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Clear Selection</div>
            </ButtonBase>
            <ButtonBase onClick={handleOrderSelectedQC}>
              <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Order Selected QC</div>
            </ButtonBase>
            {OrderPlaced && ( //render review QC once an order is placed
              <ButtonBase onClick={handleReviewQC}>
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Review QC</div>
              </ButtonBase>
            )}
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

export default MolecularOrderControls;
