import React, { useState } from "react";
import NavBar from "../../../components/NavBar";
import { bloodBankQC, bloodBankRBC_QC } from "../../../utils/utils";
import { BloodBankQCLot } from "../../../utils/indexedDB/IDBSchema";
import dayjs from "dayjs";
import { AuthToken, useAuth } from "../../../context/AuthContext";
import { BloodBankRBC } from '../../../utils/indexedDB/IDBSchema';
import { Button, Backdrop, CircularProgress } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { ButtonBase } from "@mui/material";

// This is used to get what the file name should be from the link
function formatFilename(qcName: string): string {
  if (qcName.includes(" QC")) {
    return qcName.substring(0, qcName.indexOf(" QC"));
  }
  return qcName;
}

const BloodBankOrderControls = () => {
  const { userId, checkUserType } = useAuth();
  const { theme } = useTheme();
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [isSuccessNotiOpen, setSuccessNotiOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("TBD")

  // Combine items from both lists and initialize OrderControlsItems
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>(
    [...bloodBankQC, ...bloodBankRBC_QC].map(qc => qc.name)
  );

  const onDragEnd = (results: DropResult) => {
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
  
  const handleOrderSelectedQC = async () => {
    if (checkUserType() !== "Student") {  // Faculty can't currently use this
      setErrorMsg("This feature is currently Student-only");
      setErrorNotiOpen(true);
      return
    }
    if (SelectedQCItems.length == 0 ) {
      setErrorMsg("No QCs have been selected")
      setErrorNotiOpen(true);
      return
    }
    const queryParams = new URLSearchParams();
    SelectedQCItems.forEach(item => queryParams.append("names", formatFilename(item)));
    console.log("QC Items ordered: ", SelectedQCItems);
    // setIsOrderLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/BloodBankQCLots/ByNameList?${queryParams.toString()}`);
      
      if (res.ok){
        const savedQCItems: BloodBankQCLot[] = await res.json();
        
        // If there are QCs that are not found or have expired, return error
        /*
        if (savedQCItems.length !== SelectedQCItems.length) {
          const notFoundItems = SelectedQCItems.filter(item => !savedQCItems.some(qc => qc.qcName.toLowerCase() === item.toLowerCase()));
          console.log("Not found items: ", notFoundItems);
          setNotFoundQCItems(notFoundItems);
          setNotiType(NotiType.QCNotFoundOrExpired);
          setIsFeedbackNotiOpen(true);
          setIsOrderLoading(false);
          return;
        }
          */
        if (savedQCItems.length == 0) {
          console.log("Could not find Blood Bank QC ", queryParams.toString());
          setErrorMsg("This QC Lot has not yet been created")
          setErrorNotiOpen(true);
          return;
        }
        for (const item of savedQCItems)  {
          const dateString: string = dayjs().toISOString();  // dayjs().format("YYYY-MM-DD") + ""
          try {
            const createRes = await fetch(`${process.env.REACT_APP_API_URL}/BBStudentReport/Create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify([{studentId: userId, bloodBankQCLotId: item.bloodBankQCLotID, createdDate: dateString}]),
            })
            if (createRes.ok ) {
              setSuccessNotiOpen(true);
              console.log("Created BB Student Report");
            } else { 
              setErrorMsg("Failed to create report");
              setErrorNotiOpen(true);
              console.log("Failed to create BB Student Report");
            }
          } catch (error) {
            setErrorMsg("An unexpected error occurred")
            setErrorNotiOpen(true);
            console.error("Fetch failed:", error);
          }
        }
        
      }
    } catch (e) {
      console.error("Error ordering QC: ", e);
      // setNotiType(NotiType.SomethingWrong);
      // setIsFeedbackNotiOpen(true);
      // setIsOrderLoading(false);
    }
  }

  const handleClearSelection = () => { 
    let orderQCs = [...OrderControlsItems];
    let selectedQCs = [...SelectedQCItems];
    setSelectedQCItems([]); 
    localStorage.removeItem('selectedQCItems');
    for (let i = 0; i < selectedQCs.length; i++){  // Push every selected QC to orderQCs
      orderQCs.push(selectedQCs[i]);
    }
    setOrderControlsItems(orderQCs);
  };
  
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NavBar name="Blood Bank Order Controls" />
        <div
          className="flex justify-center gap-8 items-start mt-3"
          style={{ minWidth: "100svw", minHeight: "90svh" }}
        >
          <Droppable droppableId="Order_QC" type="group">
            {(drop_provided) => (
              <div
                ref={drop_provided.innerRef}
                {...drop_provided.droppableProps}
                className="w-[25%] h-[75vh] overflow-y-auto" // Larger width and height
              >
                <div className="order-qc-container h-full rounded-lg bg-[#dae3f3] p-4 flex flex-col gap-4">
                  <div className="order-qc-title text-2xl text-center font-semibold">Order QC</div>
                  <div className="order-qc-items-container flex flex-col gap-3 overflow-y-auto">
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
                              className="order-qc-item bg-[#47669C] p-3 rounded-lg text-white text-lg text-center"
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
          <div className="control-buttons flex flex-col gap-4">
            <ButtonBase onClick= {handleClearSelection}>
                <div className="!rounded-lg sm:w-36 sm:h-14 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold text-md leading-[3.5rem]">Clear Selection</div>
            </ButtonBase>
            <ButtonBase onClick={handleOrderSelectedQC}>
                <div className="!rounded-lg sm:w-36 sm:h-14 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold text-md leading-[3.5rem]">Order Selected QC</div>
            </ButtonBase>
          </div>
          <Droppable droppableId="QC_Selected" type="group">
            {(drop_provided) => (
              <div
                ref={drop_provided.innerRef}
                {...drop_provided.droppableProps}
                className="w-[25%] h-[75vh] overflow-y-auto" // Larger width and height
              >
                <div className="selected-qc-container h-full rounded-lg bg-[#dae3f3] p-4 flex flex-col gap-4">
                    <div className="selected-qc-title text-2xl text-center font-semibold">Selected QC</div>
                    <div className="selected-qc-items-container flex flex-col gap-3 overflow-y-auto">
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
                                className="selected-qc-item bg-[#47669C] p-3 rounded-lg text-white text-lg text-center"
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
      {/* Success Notification */}
      <Backdrop // OK BACKDROP
        open={isSuccessNotiOpen}
        
        onClick={() => {
          setSuccessNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              { 
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>Registration Successful</div>
                  </div>
                </>
              }
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setSuccessNotiOpen(false);
                }}
                className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
      <Backdrop  // ERROR BACKDROP
        open={isErrorNotiOpen}
        
        onClick={() => {
          setErrorNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              { 
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>{errorMsg}</div>
                  </div>
                </>
              }
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setErrorNotiOpen(false);
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

export default BloodBankOrderControls;