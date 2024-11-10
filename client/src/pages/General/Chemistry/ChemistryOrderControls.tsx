import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar";
import { qcTypeLinkList } from "../../../utils/utils"; 
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { Backdrop, Button, ButtonBase } from "@mui/material"
import { AdminQCLot } from "../../../utils/indexedDB/IDBSchema";
import { AuthToken, useAuth } from "../../../context/AuthContext";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";

enum NotiType {
  QCNotFoundOrExpired,
  OrderCreated,
  SomethingWrong
};

const ChemistryOrderControls = () => {
  const { userId } = useAuth();
  const { theme } = useTheme();
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>(
    qcTypeLinkList.map(qc => qc.name) // I change this to qctypelinklist from utils from manually defining each draggable
  );
  const [NotFoundQCItems, setNotFoundQCItems] = useState<string[]>([]);

  const [isFeedbackNotiOpen, setIsFeedbackNotiOpen] = useState(false);
  const [notiType, setNotiType] = useState<NotiType>(NotiType.SomethingWrong);

  const [isOrderLoading, setIsOrderLoading] = useState(false);

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
  const handleOrderSelectedQC = async () => {
    // localStorage.setItem('selectedQCItems', JSON.stringify(SelectedQCItems));
    const queryParams = new URLSearchParams();
    SelectedQCItems.forEach(item => queryParams.append("names", item));
    console.log("QC Items ordered: ", SelectedQCItems);
    setIsOrderLoading(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByNameList?${queryParams.toString()}`);

      if (res.ok){
        const savedQCItems: AdminQCLot[] = await res.json();
        console.log(savedQCItems);
        // If there are QCs that are not found or have expired, return error
        if (savedQCItems.length !== SelectedQCItems.length) {
          const notFoundItems = SelectedQCItems.filter(item => !savedQCItems.some(qc => qc.qcName.toLowerCase() === item.toLowerCase()));
          console.log("Not found items: ", notFoundItems);
          setNotFoundQCItems(notFoundItems);
          setNotiType(NotiType.QCNotFoundOrExpired);
          setIsFeedbackNotiOpen(true);
          setIsOrderLoading(false);
          return;
        }

        const reportsToSave = savedQCItems.map(item => ({
          studentID: userId,
          adminQCLotID: item.adminQCLotID,
          createdDate: dayjs().toISOString(),
        }));

        const createRes = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/Create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportsToSave),
        })

        if (createRes.ok){
          console.log("Created QC reports successfully");
          setNotiType(NotiType.OrderCreated);
          setIsFeedbackNotiOpen(true);
          setIsOrderLoading(false);
        }
      }
    } catch (e) {
      console.error("Error ordering QC: ", e);
      setNotiType(NotiType.SomethingWrong);
      setIsFeedbackNotiOpen(true);
      setIsOrderLoading(false);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedQCItems([]);
    setNotFoundQCItems([]);
    setOrderControlsItems(qcTypeLinkList.map(qc => qc.name));
    // localStorage.removeItem('selectedQCItems');  // Clear local storage
  };

  // useEffect(() => {
  //   console.log(SelectedQCItems);
  // }, [SelectedQCItems])
  
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NavBar name="Chesmistry Order Controls" />
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
              { isOrderLoading ? (<><div className="sm:w-36 sm:h-16 bg-[#dae3f3] border-[1px] border-solid border-[#47669C] flex justify-center items-center"><Icon icon="eos-icons:loading" /></div></>) : (<div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Order Selected QC</div>) }
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

      {/* Notification Popup */}
      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setIsFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl z-3">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            {/* WARNING QC NOT FOUND OR EXPIRED */}
            { notiType === NotiType.QCNotFoundOrExpired && (
                <div className="flex flex-col sm:gap-y-2 items-center sm:max-w-[480px]">
                  <div className="text-2xl font-semibold">Test Not Found or Expired</div>
                  <div className="font-semibold text-lg text-zinc-500">Tests Affected:</div>
                  <div className="flex flex-wrap justify-center sm:gap-2">
                    {NotFoundQCItems.map((item, index) => (
                      <div key={index} className="text-zinc-500">
                        {item}
                      </div>
                    ))}
                  </div>
                  <Icon icon="material-symbols:cancel-outline" className="text-2xl text-red-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }

              {/* WARNING QC NOT FOUND OR EXPIRED */}
              { notiType === NotiType.OrderCreated && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Order Successfully Created</div>
                  <Icon icon="clarity:success-standard-line" className="text-2xl text-green-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }

              {/* WARNING QC NOT FOUND OR EXPIRED */}
              { notiType === NotiType.SomethingWrong && (
                <div className="flex flex-col sm:gap-y-2 items-center">
                  <div className="text-2xl font-semibold">Something Went Wrong</div>
                  <Icon icon="material-symbols:cancel-outline" className="text-2xl text-red-500 sm:w-20 sm:h-20"/>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setIsFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              ) }
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export default ChemistryOrderControls;
