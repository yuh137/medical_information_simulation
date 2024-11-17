import React, { useState, useCallback, useEffect} from "react";
import NavBar from "../../../components/NavBar";
import { Link } from "react-router-dom";
import { microbiologyQcTypeList } from "../../../utils/utils"; 
import { useTheme } from "../../../context/ThemeContext";
import { Icon } from "@iconify/react";

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { ButtonBase, Backdrop, Button } from "@mui/material"

const MicrobiologyOrderControls = () => {
  const { theme } = useTheme();
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFeedbackErrorOpen, setFeedbackErrorOpen] = useState(false);
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>(
    microbiologyQcTypeList.map(qc => qc.name) // I change this to qctypelinklist from utils from manually defining each draggable
  );

  useEffect(() => {
    //If notification is enabled, disable after 3 seconds
    if (isFeedbackErrorOpen) {
      setTimeout(() => {
        setFeedbackErrorOpen(false);
      }, 3500);
    }
  }, [isFeedbackErrorOpen])

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
    if(SelectedQCItems.length > 0){
    localStorage.setItem('selectedQCItems', JSON.stringify(SelectedQCItems));
    console.log("QC Items ordered: ", SelectedQCItems);
    setFeedbackNotiOpen(true);
    }else{
      setFeedbackErrorOpen(true);
    }
    
  };
  
  const handleClearSelection = () => {
    setSelectedQCItems([]);
    localStorage.removeItem('selectedQCItems');  // Clear local storage
    setOrderControlsItems(microbiologyQcTypeList.map(qc => qc.name));
  };
  
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NavBar name="Microbiology Order Controls" />
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
            <ButtonBase onClick= {handleClearSelection}>
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Clear Selection</div>
            </ButtonBase>
            <ButtonBase onClick={handleOrderSelectedQC}> {/*test*/}
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Order Selected QC</div>
            </ButtonBase>
            {successMessage && (
              <div className="success-message text-green-600 text-center mt-20">
                {successMessage}
              </div>
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
      <Backdrop
        open={isFeedbackNotiOpen}
        
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>QC Order Successful</div>
                  </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                // onClick={() => {
                //   setFeedbackNotiOpen(false);
                // }}
                className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
              >
                <Link to="/microbiology/qc_results">
                  OK
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        open={isFeedbackErrorOpen}
        
        onClick={() => {
          setFeedbackErrorOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>Please Select Tests to Order</div>
                  </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setFeedbackErrorOpen(false);
                }}
                className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export default MicrobiologyOrderControls;
