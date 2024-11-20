import React, { useState, useCallback } from "react";
import NavBar from "../../../components/NavBar";
import { UABFtypeLinkList } from "../../../utils/UrinalysisUtils"; 
import { Button, Backdrop } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { ButtonBase } from "@mui/material"

const UrinalysisOrderControls = () => {
  const { theme } = useTheme();
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>(
    UABFtypeLinkList.map(qc => qc.name) // I change this to qctypelinklist from utils from manually defining each draggable
  );

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

  const [isSuccessNotiOpen, setSuccessNotiOpen] = useState(false);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store the specific error message

  const handleOrderSelectedQC = () => {
  // Check if there are items to store
  if (SelectedQCItems.length === 0) {
    // If no items to save, show error notification
    setErrorMessage("No items selected to save.");
    setErrorNotiOpen(true);  // Open error notification
    return;
  }

  // Store the selected items in localStorage
  localStorage.setItem('selectedQCItems', JSON.stringify(SelectedQCItems));

  // Retrieve and log the stored items from localStorage
  const storedItems = localStorage.getItem('selectedQCItems');
  console.log("Stored QC Items in localStorage: ", storedItems);

  // Optionally, parse and log it as an object
  const parsedItems = storedItems ? JSON.parse(storedItems) : null;
  console.log("Parsed QC Items from localStorage: ", parsedItems);

  // If the items were successfully saved, show success notification
  if (storedItems) {
    setSuccessNotiOpen(true);  // Open success notification
  } else {
    // If there was an issue saving the items
    setErrorMessage("Failed to save items.");
    setErrorNotiOpen(true);  // Open error notification
  }
};
  
  const handleClearSelection = () => {
    setSelectedQCItems([]);
    localStorage.removeItem('selectedQCItems');  // Clear local storage
  };
  
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <NavBar name="Urinalysis Body Fluids Order Controls" />
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
            <ButtonBase onClick={handleOrderSelectedQC}>
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
      <Backdrop open={isSuccessNotiOpen || isErrorNotiOpen} onClick={() => {
        setSuccessNotiOpen(false);
        setErrorNotiOpen(false);
      }}>
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              {isSuccessNotiOpen ? (
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>Ordered Successfully</div>
                  </div>
                </>
              ) : isErrorNotiOpen ? (
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>{errorMessage}</div> {/* Display the specific error message */}
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setSuccessNotiOpen(false);
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

export default UrinalysisOrderControls;


// import React, { useState, useCallback } from "react";
// import NavBar from "../../../components/NavBar";
// import { UABFtypeLinkList } from "../../../utils/UrinalysisUtils"; 

// import {
//   DragDropContext,
//   Draggable,
//   DropResult,
//   Droppable,
// } from "react-beautiful-dnd";
// import { ButtonBase} from "@mui/material"

// const UrinalysisOrderControls = () => {
//   const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
//   const [OrderControlsItems, setOrderControlsItems] = useState<string[]>(
//     UABFtypeLinkList.map(qc => qc.name) // I change this to qctypelinklist from utils from manually defining each draggable
//   );

//   const onDragEnd = (results: DropResult) => {
//     // console.log(results);
//     const { source, destination, type } = results;

//     if (!destination) return;

//     if (source.droppableId === destination.droppableId) return;

//     if (type === "group") {
//       const sourceIndex = source.index;
//       const destinationIndex = destination.index;

//       if (source.droppableId === "Order_QC") {
//         let sourceItems = [...OrderControlsItems];
//         let destItems = [...SelectedQCItems];

//         const [deletedItem] = sourceItems.splice(sourceIndex, 1);
//         destItems.splice(destinationIndex, 0, deletedItem);

//         setOrderControlsItems(sourceItems);
//         setSelectedQCItems(destItems);
//       }

//       if (source.droppableId === "QC_Selected") {
//         let sourceItems = [...SelectedQCItems];
//         let destItems = [...OrderControlsItems];

//         const [deletedItem] = sourceItems.splice(sourceIndex, 1);
//         destItems.splice(destinationIndex, 0, deletedItem);

//         setSelectedQCItems(sourceItems);
//         setOrderControlsItems(destItems);
//       }
//     }
//   };
//   const handleOrderSelectedQC = () => {
//     localStorage.setItem('selectedQCItems', JSON.stringify(SelectedQCItems));
//     console.log("QC Items ordered: ", SelectedQCItems);
//   };
  
//   const handleClearSelection = () => {
//     setSelectedQCItems([]);
//     localStorage.removeItem('selectedQCItems');  // Clear local storage
//   };
  
//   return (
//     <>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <NavBar name="Urinalysis Body Fluids Order Controls" />
//         <div
//           className="flex justify-center gap-32 items-center"
//           style={{ minWidth: "100svw", minHeight: "90svh" }}
//         >
//           <Droppable droppableId="Order_QC" type="group">
//             {(drop_provided) => (
//               <div
//                 ref={drop_provided.innerRef}
//                 {...drop_provided.droppableProps}
//                 className="w-[20%] h-[80svh]"
//               >
//                 <div className="order-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4">
//                   <div className="order-qc-title sm:text-4xl text-center font-semibold">Order QC</div>
//                   <div className="order-qc-items-container flex flex-col gap-4 overflow-scroll">
//                     {OrderControlsItems.length === 0 ? (<div className="text-center">All items selected</div>) : (<></>)}
//                     {OrderControlsItems.map((item, index) => (
//                         <Draggable
//                         draggableId={`${item}`}
//                         index={index}
//                         key={`${item}`}
//                         >
//                         {(drag_provided) => (
//                             <div
//                               ref={drag_provided.innerRef}
//                               {...drag_provided.dragHandleProps}
//                               {...drag_provided.draggableProps}
//                               className="order-qc-item bg-[#47669C] p-4 rounded-md text-white"
//                               onClick={() => {
//                                   let orderQCs = [...OrderControlsItems];
//                                   let selectedQCs = [...SelectedQCItems];

//                                   const [deletedQC] = orderQCs.splice(index, 1);
//                                   selectedQCs.push(deletedQC);

//                                   setOrderControlsItems(orderQCs);
//                                   setSelectedQCItems(selectedQCs);
//                               }}
//                             >
//                               {item}
//                               {/* <div className="order-qc-item bg-[#47669C] p-4 rounded-md text-white">
//                                   {item}
//                               </div> */}
//                             </div>
//                         )}
//                         </Draggable>
//                     ))}
//                     {drop_provided.placeholder}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </Droppable>
//           <div className="control-buttons flex flex-col gap-10">
//             <ButtonBase onClick= {handleClearSelection}>
//                 <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Clear Selection</div>
//             </ButtonBase>
//             <ButtonBase onClick={handleOrderSelectedQC}>
//                 <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">Order Selected QC</div>
//             </ButtonBase>
//           </div>
//           <Droppable droppableId="QC_Selected" type="group">
//             {(drop_provided) => (
//               <div
//                 ref={drop_provided.innerRef}
//                 {...drop_provided.droppableProps}
//                 className="w-[20%]"
//               >
//                 <div className="selected-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4">
//                     <div className="selected-qc-title sm:text-4xl text-center font-semibold">Selected QC</div>
//                     <div className="selected-qc-items-container flex flex-col gap-4 overflow-scroll">
//                         {SelectedQCItems.length === 0 ? (<div className="text-center">No selected items</div>) : (<></>)}
//                         {SelectedQCItems.map((item, index) => (
//                             <Draggable
//                             draggableId={`${item}`}
//                             index={index}
//                             key={`${item}`}
//                             >
//                             {(drag_provided) => (
//                                 <div
//                                 ref={drag_provided.innerRef}
//                                 {...drag_provided.dragHandleProps}
//                                 {...drag_provided.draggableProps}
//                                 className="selected-qc-item bg-[#47669C] p-4 rounded-md text-white"
//                                 onClick={() => {
//                                     let orderQCs = [...OrderControlsItems];
//                                     let selectedQCs = [...SelectedQCItems];

//                                     const [deletedQC] = selectedQCs.splice(index, 1);
//                                     orderQCs.push(deletedQC);

//                                     setOrderControlsItems(orderQCs);
//                                     setSelectedQCItems(selectedQCs);
//                                 }}
//                                 >
//                                 {item}
//                                 {/* <div className="order-qc-item bg-[#47669C] p-4 rounded-md text-white">
//                                     {item}
//                                 </div> */}
//                                 </div>
//                             )}
//                             </Draggable>
//                         ))}
//                         {drop_provided.placeholder}
//                     </div>
//                 </div>
//               </div>
//             )}
//           </Droppable>
//         </div>
//       </DragDropContext>
//     </>
//   );
// };

// export default UrinalysisOrderControls;
