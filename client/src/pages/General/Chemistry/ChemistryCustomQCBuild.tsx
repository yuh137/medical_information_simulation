import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { CMP, Cardiac, Thyroid, Iron, Lipid, Liver, Drug, Hormone, Pancreatic, Diabetes, Cancer, Vitamins } from "../../../utils/MOCK_DATA";
import { renderSubString } from "../../../utils/utils";
import { CMPLevelList, CardiacLevelList, HormoneLevelList, ThyroidLevelList, LipidLevelList, LiverLevelList, IronLevelList, DrugLevelList, PancreaticLevelList, DiabetesLevelList, CancerLevelList, VitaminsLevelList } from "../../../utils/utils";
import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { AdminQCLot } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import NavBar from "../../../components/NavBar";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minLevel: string;
  maxLevel: string;
  mean: string;
  stdDevi: string;
  electrolyte: boolean;
}

interface CustomPanel {
  name: string;
  tests: QCRangeElements[];
  isOngoing: boolean;
}

interface DraggableItem {
  name: string;
  acronymName: string;
}

const ChemistryCustomQCBuild = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
  const [SelectedQCItems, setSelectedQCItems] = useState<string[]>([]);
  const [OrderControlsItems, setOrderControlsItems] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [showDrag, setShowDrag] = useState(true);

  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const [QCElements, setQCElements] = useState<QCRangeElements[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<AdminQCLot>();

  const saveQC: SubmitHandler<AdminQCLot> = async (data) => {
    const check = await getDataByKey<AdminQCLot>("qc_store", props.name);

    if (check) {
      const deleteStatus = await deleteData("qc_store", props.name);
      console.log(deleteStatus ? "Delete success" : "Delete failed");
    }

    const savedAnalyte = QCElements.map(
      ({
        analyteName,
        analyteAcronym,
        unitOfMeasure,
        mean,
        stdDevi,
        minLevel,
        maxLevel,
      }) => ({
        analyteName,
        analyteAcronym,
        unitOfMeasure,
        mean,
        stdDevi,
        minLevel,
        maxLevel,
      })
    );

    const res = await addData<AdminQCLot>("qc_store", {
      qcName: props.name,
      lotNumber: data.lotNumber || "",
      openDate: data.openDate || "",
      fileDate: data.fileDate || "",
      closedDate: data.closedDate || "",
      expirationDate: data.expirationDate || "",
      analytes: [...savedAnalyte],
    });

    console.log("Save result: ", res);
  };

  const saveToCustomList = () => {
    const customTests: CustomPanel[] = JSON.parse(localStorage.getItem("customTests") || "[]");
    const selectedTests = QCElements.filter(item => SelectedQCItems.includes(item.analyteName));

    let ongoingPanel = customTests.find(panel => panel.isOngoing);

    if (ongoingPanel) {
      ongoingPanel.tests.push(...selectedTests);
    } else {
      ongoingPanel = { name: 'Custom1', tests: selectedTests, isOngoing: true };
      customTests.push(ongoingPanel);
    }

    localStorage.setItem("customTests", JSON.stringify(customTests));
    alert("Tests saved to custom list");
  };

  const inputRefs = useRef<HTMLInputElement[]>([]);

  function moveToNextInputOnEnter(e: React.KeyboardEvent) {
    if (
      e.key === "Enter" &&
      inputRefs.current.find((ele) => ele === e.target)
    ) {
      const currentFocus = inputRefs.current.find((ele) => ele === e.target);
      if (
        currentFocus &&
        inputRefs.current.indexOf(currentFocus) < inputRefs.current.length
      ) {
        const currentIndex = inputRefs.current.indexOf(currentFocus);
        inputRefs.current[currentIndex + 1]?.focus();
      } else return;
    }
  }

  const columns: ColumnDef<QCRangeElements, string>[] = [
    
    {
      accessorKey: "analyteName",
      header: "Name",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      accessorKey: "analyteAcronym",
      header: "Abbreviation",
      cell: (info) => (
        <div
          dangerouslySetInnerHTML={{
            __html: renderSubString(info.getValue() as string),
          }}
        />
      ),
    },
    {
      accessorKey: "unitOfMeasure",
      header: "Units of Measure",
      cell: (info) => (
        <input
          ref={(el) => {
            if (el && inputRefs.current.length < QCElements.length * 4) {
              inputRefs.current[info.row.index * 4] = el;
            }
          }}
          type="text"
          className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
          value={
            info.row.original.unitOfMeasure === ""
              ? ""
              : info.row.original.unitOfMeasure.toString()
          }
          onChange={(e) => {
            e.preventDefault();

            setQCElements((prevState) => {
              const newState = prevState.map((item) => {
                if (
                  item.analyteName === info.row.original.analyteName &&
                  /^[a-zA-Z\/]+$/.test(e.target.value)
                )
                  return { ...item, unitOfMeasure: e.target.value };
                else return item;
              });
              return newState;
            });
          }}
        />
      ),
    },
    {
      accessorKey: "minLevel",
      header: "Min Level",
      cell: (info) => (
        <input
          type="text"
          ref={(el) => {
            if (el && inputRefs.current.length < QCElements.length * 4) {
              inputRefs.current[info.row.index * 4 + 1] = el;
            }
          }}
          className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
          value={info.row.original.minLevel || ""}
          onChange={(e) => {
            e.preventDefault();

            setQCElements((prevState) => {
              const newState = prevState.map((item) => {
                if (
                  item.analyteName === info.row.original.analyteName &&
                  /^\d*\.?\d*$/.test(e.target.value)
                ) {
                  return { ...item, minLevel: e.target.value };
                } else return item;
              });
              return newState;
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(e.currentTarget.value);
              setQCElements((prevState) => {
                const newState = prevState.map((item) => {
                  if (item.analyteName === info.row.original.analyteName) {
                    const new_level = (+item.minLevel)
                      .toFixed(2)
                      .replace(/^0+(?!\.|$)/, "");
                    return { ...item, minLevel: new_level };
                  } else return item;
                });
                return newState;
              });
            }
          }}
        />
      ),
    },
    {
      accessorKey: "maxLevel",
      header: "Max Level",
      cell: (info) => (
        <input
          type="text"
          ref={(el) => {
            if (el && inputRefs.current.length < QCElements.length * 4) {
              inputRefs.current[info.row.index * 4 + 2] = el;
            }
          }}
          className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
          value={info.row.original.maxLevel || ""}
          onChange={(e) => {
            e.preventDefault();

            setQCElements((prevState) => {
              const newState = prevState.map((item) => {
                if (
                  item.analyteName === info.row.original.analyteName &&
                  /^\d*\.?\d*$/.test(e.target.value)
                )
                  return { ...item, maxLevel: e.target.value };
                else return item;
              });
              return newState;
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(e.currentTarget.value);
              setQCElements((prevState) => {
                const newState = prevState.map((item) => {
                  if (item.analyteName === info.row.original.analyteName) {
                    const new_level = (+item.maxLevel)
                      .toFixed(2)
                      .replace(/^0+(?!\.|$)/, "");
                    return { ...item, maxLevel: new_level };
                  } else return item;
                });
                return newState;
              });
            }
          }}
        />
      ),
    },
    {
      accessorKey: "mean",
      header: "QC Mean",
      cell: (info) => (
        <input
          type="text"
          ref={(el) => {
            if (el && inputRefs.current.length < QCElements.length * 4) {
              inputRefs.current[info.row.index * 4 + 3] = el;
            }
          }}
          className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
          value={info.row.original.mean || ""}
          onChange={(e) => {
            e.preventDefault();

            setQCElements((prevState) => {
              const newState = prevState.map((item) => {
                if (
                  item.analyteName === info.row.original.analyteName &&
                  /^\d*\.?\d*$/.test(e.target.value)
                )
                  return { ...item, mean: e.target.value };
                else return item;
              });
              return newState;
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log(e.currentTarget.value);
              setQCElements((prevState) => {
                const newState = prevState.map((item) => {
                  if (item.analyteName === info.row.original.analyteName) {
                    const new_level = (+item.mean)
                      .toFixed(2)
                      .replace(/^0+(?!\.|$)/, "");
                    return { ...item, mean: new_level };
                  } else return item;
                });
                return newState;
              });
            }
          }}
        />
      ),
    },
    {
      accessorKey: "stdDevi",
      header: "Standard Deviation",
      cell: (info) => (
        <div>
          {((+info.row.original.maxLevel - +info.row.original.minLevel) / 4).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sdplus1",
      header: "+1 SD",
      cell: (info) => (
        <div>
          {(
            +info.row.original.mean +
            (+info.row.original.maxLevel - +info.row.original.minLevel) / 4
          ).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sdminus1",
      header: "-1 SD",
      cell: (info) => (
        <div>
          {(
            +info.row.original.mean -
            (+info.row.original.maxLevel - +info.row.original.minLevel) / 4
          ).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sdplus2",
      header: "+2 SD",
      cell: (info) => (
        <div>
          {(
            +info.row.original.mean +
            ((+info.row.original.maxLevel - +info.row.original.minLevel) / 4) * 2
          ).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sdminus2",
      header: "-2 SD",
      cell: (info) => (
        <div>
          {(
            +info.row.original.mean -
            ((+info.row.original.maxLevel - +info.row.original.minLevel) / 4) * 2
          ).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sdplus3",
      header: "+3 SD",
      cell: (info) => (
        <div>
          {(
            +info.row.original.mean +
            ((+info.row.original.maxLevel - +info.row.original.minLevel) / 4) * 3
          ).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sdminus3",
      header: "-3 SD",
      cell: (info) => (
        <div>
          {(
            +info.row.original.mean -
            ((+info.row.original.maxLevel - +info.row.original.minLevel) / 4) * 3
          ).toFixed(2)}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: useMemo(
      () => QCElements.filter((item) => SelectedQCItems.includes(item.analyteName)),
      [QCElements, SelectedQCItems]
    ),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student") {
      navigate("/unauthorized");
    }
  }, []);

  useEffect(() => {
    switch (item) {
      case "Cmp_1":
      case "cmp_2":
        setOrderControlsItems(CMPLevelList.map((item) => item.name));
        setDraggableItems(CMPLevelList);
        setQCElements(CMP);
        break;
      case "cardiac_1":
      case "cardiac_2":
        setOrderControlsItems(CardiacLevelList.map((item) => item.name));
        setDraggableItems(CardiacLevelList);
        setQCElements(Cardiac);
        break;
      case "thyroid_1":
      case "thyroid_2":
        setOrderControlsItems(ThyroidLevelList.map((item) => item.name));
        setDraggableItems(ThyroidLevelList);
        setQCElements(Thyroid);
        break;
      case "lipid_1":
      case "lipid_2":
        setOrderControlsItems(LipidLevelList.map((item) => item.name));
        setDraggableItems(LipidLevelList);
        setQCElements(Lipid);
        break;
      case "liver_1":
      case "liver_2":
        setOrderControlsItems(LiverLevelList.map((item) => item.name));
        setDraggableItems(LiverLevelList);
        setQCElements(Liver);
        break;
      case "iron_1":
      case "iron_2":
        setOrderControlsItems(IronLevelList.map((item) => item.name));
        setDraggableItems(IronLevelList);
        setQCElements(Iron);
        break;
      case "drug_1":
      case "drug_2":
        setOrderControlsItems(DrugLevelList.map((item) => item.name));
        setDraggableItems(DrugLevelList);
        setQCElements(Drug);
        break;
      case "hormone_1":
      case "hormone_2":
        setOrderControlsItems(HormoneLevelList.map((item) => item.name));
        setDraggableItems(HormoneLevelList);
        setQCElements(Hormone);
        break;
      case "pancreatic_1":
      case "pancreatic_2":
        setOrderControlsItems(PancreaticLevelList.map((item) => item.name));
        setDraggableItems(PancreaticLevelList);
        setQCElements(Pancreatic);
        break;
      case "diabetes_1":
      case "diabetes_2":
        setOrderControlsItems(DiabetesLevelList.map((item) => item.name));
        setDraggableItems(DiabetesLevelList);
        setQCElements(Diabetes);
        break;
      case "cancer_1":
      case "cancer_2":
        setOrderControlsItems(CancerLevelList.map((item) => item.name));
        setDraggableItems(CancerLevelList);
        setQCElements(Cancer);
        break;
      case "vitamins_1":
      case "vitamins_2":
        setOrderControlsItems(VitaminsLevelList.map((item) => item.name));
        setDraggableItems(VitaminsLevelList);
        setQCElements(Vitamins);
        break;
      default:
        setOrderControlsItems([]);
        setDraggableItems([]);
        setQCElements([]);
    }
  }, [item]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    let sourceItems = Array.from(OrderControlsItems);
    let destItems = Array.from(SelectedQCItems);

    if (source.droppableId === "Order_QC") {
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);
      setOrderControlsItems(sourceItems);
      setSelectedQCItems(destItems);
    } else if (source.droppableId === "QC_Selected") {
      const [movedItem] = destItems.splice(source.index, 1);
      sourceItems.splice(destination.index, 0, movedItem);
      setOrderControlsItems(sourceItems);
      setSelectedQCItems(destItems);
    }
  };

  const handleClearSelection = () => {
    setOrderControlsItems([...OrderControlsItems, ...SelectedQCItems]);
    setSelectedQCItems([]);
  };

  const handleChooseAll = () => {
    setSelectedQCItems([...SelectedQCItems, ...OrderControlsItems]);
    setOrderControlsItems([]);
  };

  const handleOrderSelectedQC = () => {
    localStorage.setItem("selectedQCItems", JSON.stringify(SelectedQCItems));
    setShowTable(true);
    setShowDrag(false);
  };

  return (
    <>
      <NavBar name="Custom QC Builder" />
      {showDrag && (
        <DragDropContext onDragEnd={onDragEnd}>
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
                    <div className="order-qc-title sm:text-4xl text-center font-semibold">
                      Order QC
                    </div>
                    <div className="order-qc-items-container flex flex-col gap-4 overflow-scroll">
                      {OrderControlsItems.length === 0 ? (
                        <div className="text-center">All items selected</div>
                      ) : (
                        <></>
                      )}
                      {OrderControlsItems.map((item, index) => (
                        <Draggable draggableId={`${item}`} index={index} key={`${item}`}>
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
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">
                  Clear Selection
                </div>
              </ButtonBase>
              <ButtonBase onClick={handleChooseAll}>
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">
                  Choose All
                </div>
              </ButtonBase>
              <ButtonBase onClick={handleOrderSelectedQC}>
                <div className="!rounded-lg sm:w-36 sm:h-16 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[2px] font-semibold leading-[4rem]">
                  Select
                </div>
              </ButtonBase>
            </div>
            <Droppable droppableId="QC_Selected" type="group">
              {(drop_provided) => (
                <div ref={drop_provided.innerRef} {...drop_provided.droppableProps} className="w-[20%]">
                  <div className="selected-qc-container h-[80svh] rounded-lg bg-[#dae3f3] px-6 py-4 flex flex-col gap-4">
                    <div className="selected-qc-title sm:text-4xl text-center font-semibold">
                      Selected QC
                    </div>
                    <div className="selected-qc-items-container flex flex-col gap-4 overflow-scroll">
                      {SelectedQCItems.length === 0 ? (
                        <div className="text-center">No selected items</div>
                      ) : (
                        <></>
                      )}
                      {SelectedQCItems.map((item, index) => (
                        <Draggable draggableId={`${item}`} index={index} key={`${item}`}>
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
      )}
      {!showDrag && (
        <div className="final-container relative sm:space-y-4 pb-24">
          <div className="table-container flex flex-col mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
            <Table className="p-8 rounded-lg border-solid border-[1px] border-slate-200">
              <TableHeader>
                {table.getHeaderGroups().map((group) => (
                  <TableRow
                    key={group.id}
                    className="font-bold text-base bg-[#3A62A7] hover:bg-[#3A62A7] sticky top-0 z-20"
                  >
                    {group.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-white text-center"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {!table.getRowModel().rows?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="sm:h-32 !p-2 text-center"
                    >
                      No data
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="text-center sm:h-[10%] border-none">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="buttons-container flex justify-center gap-4">
            <ButtonBase
              disabled={!isValid}
              className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
              onClick={handleSubmit(saveQC)}
            >
              Save QC File
            </ButtonBase>
            <ButtonBase
              className="save-to-custom-button sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold"
              onClick={saveToCustomList}
            >
              Save to Custom
            </ButtonBase>
          </div>
        </div>
      )}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => openDrawer(false)}
      >
        <div className="drawer-container sm:w-[18svw] sm:h-full bg-[#CFD5EA] flex flex-col items-center py-4 sm:space-y-6">
          <div className="filename-label sm:text-3xl font-semibold">
            Chemistry
          </div>
          <div className="lotnumber-input flex flex-col items-center sm:w-[86%] py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2">
            <div className="lotnumber-label sm:text-xl font-semibold text-white">
              QC Lot Number
            </div>
            <input
              type="text"
              className="p-1 rounded-lg border border-solid border-[#548235] text-center"
              {...register("lotNumber")}
            />
          </div>
          <div className="expiration-box sm:w-[86%] sm:h-64 bg-[#3A6CC6] rounded-xl">
            <div className="expiration-title w-full text-center font-semibold text-lg text-white py-1 bg-[#3A62A7] rounded-t-xl">
              Expiration date
            </div>
            <div className="divider-line w-full h-[1px] bg-black" />
            <div className="expiration-fields flex flex-col items-center py-2 sm:space-y-4">
              <div className="expiration-input sm:space-y-2">
                <div className="open-title text-center sm:text-lg text-white">
                  Open Date
                </div>
                <input
                  type="text"
                  className="p-1 rounded-lg border border-solid border-[#000] text-center"
                  {...register("openDate")}
                />
              </div>
              <div className="expiration-input sm:space-y-2">
                <div className="closed-title text-center sm:text-lg text-white">
                  Closed Date
                </div>
                <input
                  type="text"
                  className="p-1 rounded-lg border border-solid border-[#000] text-center"
                  {...register("closedDate")}
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ChemistryCustomQCBuild;