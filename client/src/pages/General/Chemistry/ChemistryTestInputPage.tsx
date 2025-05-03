import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useNavigate, useNavigation, useParams } from "react-router-dom";
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
import {
  CMP,
  Cardiac,
  Thyroid,
  Liver,
  Lipid,
  Iron,
  Drug,
  Hormone,
  Cancer,
  Pancreatic,
  Vitamins,
  Diabetes,
} from "../../../utils/MOCK_DATA";
import {
  AdminQCLot,
  AdminQCTemplate,
  DefinedRequestError,
  Department,
  ErrorCode,
  getISOTexasTime,
  qcTypeLinkList,
  renderSubString,
} from "../../../utils/utils";
import { Backdrop, Button, ButtonBase, Menu, MenuItem } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import NavBar from "../../../components/NavBar";
import { DatePicker, Modal, Select, Skeleton, Switch } from "antd";
import { Icon } from "@iconify/react";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "../../../context/ThemeContext";
import { set } from "lodash";

interface QCRangeElements {
  analyteName: string;
  analyteAcronym: string;
  unitOfMeasure: string;
  minLevel: string;
  maxLevel: string;
  mean: string;
  stdDevi: string;
}

// Manage what type of notifications are displayed
enum NotiType {
  SaveQC,
  QCAlreadyExist,
  LotNumberTaken,
  NoChangesMade,
  UpdateQC,
  UpdateOrderOptionSuccess,
  UpdateOrderOptionFailure,
  DeactivateQC,
  DeactivateResponse,
}

enum SaveButtonActionType {
  Save,
  Update,
  Idle,
}

enum InteractionMode {
  View,
  Create,
  Edit,
}

export const ChemistryTestInputPage = () => {
  // Managing states
  const [isSavingQCLot, setIsSavingQCLot] = useState<boolean>(false);
  const [isSavingQCLotSuccessful, setIsSavingQCLotSuccessful] =
    useState<boolean>(false);
  const [isUpdatingQCLotSuccessful, setIsUpdatingQCLotSuccessful] =
    useState<boolean>(false);
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState<boolean>(false);
  const [didUserDeactivate, setDidUserDeactivate] = useState<boolean>(false);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const { item } = useParams() as { item: string };
  const loaderData = useLoaderData() as { qcLotList: AdminQCLot[], qcTemplate: AdminQCTemplate };
  const activeQCLot: AdminQCLot | undefined = useMemo(() => loaderData.qcLotList.find((item) => item.isActive), [loaderData]);

  // Placeholder data if the database is empty
  // const mockData = item?.includes("cardiac")
  //   ? Cardiac
  //   : item?.includes("lipid")
  //   ? Lipid
  //   : item?.includes("thyroid")
  //   ? Thyroid
  //   : item?.includes("liver")
  //   ? Liver
  //   : item?.includes("iron")
  //   ? Iron
  //   : item?.includes("drug")
  //   ? Drug
  //   : item?.includes("hormone")
  //   ? Hormone
  //   : item?.includes("cancer")
  //   ? Cancer
  //   : item?.includes("pancreatic")
  //   ? Pancreatic
  //   : item?.includes("vitamins")
  //   ? Vitamins
  //   : item?.includes("diabetes")
  //   ? Diabetes
  //   : CMP;

  // Currently displayed QC
  const [currentQCLot, setCurrentQCLot] = useState<AdminQCLot | null>(
    activeQCLot ? activeQCLot : loaderData.qcLotList[0]
  );

  // State to manage if the QCLot is orderable
  const [isOrderable, setIsOrderable] = useState<boolean>(loaderData.qcTemplate.isOrderable);

  // Set the initial value for QCPanel table, taken from the database. If none exist, use the mock data.
  const [QCElements, setQCElements] = useState<QCRangeElements[]>(
    currentQCLot ? currentQCLot.analytes : loaderData.qcTemplate.analyteTemplates.map(item => ({ ...item, minLevel: "", maxLevel: "", mean: "", stdDevi: "" }))
  );

  // State to manage what clicking the Save button does
  const [saveButtonActionType, setSaveButtonActionType] =
    useState<SaveButtonActionType>(SaveButtonActionType.Idle);

  // State to validate if the max and min constraints are met
  const [isValid, setIsValid] = useState<boolean>(false);

  // State to manage the type of notification to display
  const [feedbackNotiType, setFeedbackNotiType] = useState<NotiType>(
    NotiType.NoChangesMade
  );

  // State to manage what interaction mode the user is in
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.View
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [intModeDropdownAnchor, setIntModeDropdownAnchor] =
    useState<null | HTMLElement>(null);
  const isIntModeDropdownOpen = Boolean(intModeDropdownAnchor);

  // State to manage the QCLot input
  const [QCLotInput, setQCLotInput] = useState<string>(
    currentQCLot ? currentQCLot.lotNumber : ""
  );

  // State to create a new QC Lot Number
  const [newQCLotInput, setNewQCLotInput] = useState<string>("");

  // States for the Date inputs
  const [expDate, setExpDate] = useState<Dayjs | null>(
    currentQCLot ? dayjs(currentQCLot.expirationDate) : null
  );
  const [fileDate, setFileDate] = useState<Dayjs>(
    currentQCLot ? dayjs(currentQCLot.fileDate) : dayjs()
  );
  const [fileDateRange, setFileDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    currentQCLot ? currentQCLot.closedDate ? [dayjs(currentQCLot.openDate), dayjs(currentQCLot.closedDate)] : [dayjs(currentQCLot.openDate), null] : null
  );

  // Refs to check whether the data has changed to initiate update or creation of new QC
  const prevExpDate = useRef(expDate);
  const prevFileDate = useRef(fileDate);
  const prevQCLotInput = useRef(QCLotInput);
  const prevQCElements = useRef(QCElements);

  // React-hook-form states
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminQCLot>();

  function presetLotAndDate() {
    // console.log(currentQCLot);
    if (currentQCLot) {
      setQCLotInput(currentQCLot.lotNumber);
      setExpDate(dayjs(currentQCLot.expirationDate));
      setFileDate(dayjs(currentQCLot.fileDate));

      if (currentQCLot.closedDate) {
        setFileDateRange([
          dayjs(currentQCLot.openDate),
          dayjs(currentQCLot.closedDate),
        ]);
      } else {
        setFileDateRange([
          dayjs(currentQCLot.openDate),
          null,
        ]);
      }
    }
  }

  function handleModeButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    setIntModeDropdownAnchor(e.currentTarget);
  }

  function handleModeMenuClose(mode: InteractionMode) {
    setInteractionMode(mode);
    setIntModeDropdownAnchor(null);
  }

  // Function to handle the Save QC Button
  const saveQC: SubmitHandler<AdminQCLot> = async (data) => {
    console.log("Entered save QC button", data);

    if (currentQCLot && currentQCLot.lotNumber === data.lotNumber) {
      setFeedbackNotiType(NotiType.LotNumberTaken);
      setFeedbackNotiOpen(true);
      return;
    }

    // Map the input data to AdminQCLot
    const qcDataToSave: AdminQCLot = {
      qcName:
        // currentQCLot?.isCustom ? currentQCLot.qcName : qcTypeLinkList.find((qcType) => qcType.link.includes(item))?.name ?? "",
        // currentQCLot ? currentQCLot?.qcName : qcTypeLinkList.find((qcType) => qcType.link.includes(item))?.name ?? "",
        loaderData.qcTemplate.qcName,
      lotNumber: data.lotNumber || "",
      openDate: data.openDate || getISOTexasTime(),
      fileDate: data.fileDate || "",
      closedDate: data.closedDate || null,
      expirationDate: data.expirationDate || "",
      isActive: true,
      isCustom: false,
      isOrderable: true,
      slug: null,
      analytes: QCElements.map(
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
      ),
    };

    const createObject = {
      lotNumber: qcDataToSave.lotNumber,
      qcName: qcDataToSave.qcName,
      openDate: qcDataToSave.openDate ?? dayjs().toISOString(),
      expirationDate: qcDataToSave.expirationDate,
      fileDate: qcDataToSave.fileDate ?? dayjs().toISOString(),
      isCustom: loaderData.qcTemplate.isCustom,
      department: Department.Chemistry,
      analytes: qcDataToSave.analytes.map((analyte) => ({
        analyteName: analyte.analyteName,
        analyteAcronym: analyte.analyteAcronym,
        unitOfMeasure: analyte.unitOfMeasure,
        minLevel: parseFloat(parseFloat(analyte.minLevel).toFixed(2)),
        maxLevel: parseFloat(parseFloat(analyte.maxLevel).toFixed(2)),
        mean: parseFloat(parseFloat(analyte.mean).toFixed(2)),
        stdDevi: parseFloat(
          ((+analyte.maxLevel - +analyte.minLevel) / 4).toFixed(2)
        ),
      })),
    }

    // console.log("Create Object: ", createObject);

    // Send request to the server to save the data
    setIsSavingQCLot(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createObject),
      });

      if (res.ok) {
        console.log("Saved:", res.json());
        setFeedbackNotiType(NotiType.SaveQC);
        setIsSavingQCLotSuccessful(true);
        setFeedbackNotiOpen(true);
      } else {
        const error: DefinedRequestError = await res.json();
        console.log("Failed to save data: ", error.errorCode);
        setErrorMessage(error.message);

        if (error.errorCode === ErrorCode.AlreadyExist) {
          setFeedbackNotiType(NotiType.LotNumberTaken);
          setFeedbackNotiOpen(true);
          setIsSavingQCLot(false);
          return;
        }
      }
      setIsSavingQCLot(false);
    } catch (error) {
      console.error("Failed to save data:", error);
      setIsSavingQCLot(false);
    }

    setSaveButtonActionType(SaveButtonActionType.Idle);
  };

  async function handleUpdateQC() {
    const qcDataToUpdate = {
      expDate: expDate?.toISOString(),
      fileDate: fileDate.toISOString(),
      openDate: fileDateRange ? fileDateRange[0] ? fileDateRange[0].toISOString() : getISOTexasTime() : getISOTexasTime(),
      closedDate: fileDateRange ? fileDateRange[1] ? fileDateRange[1].toISOString() : null : null,
      analytes: QCElements.map(
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
      ),
    };

    const updateObject = {
      expirationDate: qcDataToUpdate.expDate,
      fileDate: qcDataToUpdate.fileDate ?? dayjs().toISOString(),
      openDate: qcDataToUpdate.openDate,
      closedDate: qcDataToUpdate.closedDate,
      analytes: qcDataToUpdate.analytes.map((analyte) => ({
        analyteName: analyte.analyteName,
        analyteAcronym: analyte.analyteAcronym,
        unitOfMeasure: analyte.unitOfMeasure,
        minLevel: parseFloat(parseFloat(analyte.minLevel).toFixed(2)),
        maxLevel: parseFloat(parseFloat(analyte.maxLevel).toFixed(2)),
        mean: parseFloat(parseFloat(analyte.mean).toFixed(2)),
        stdDevi: parseFloat(
          ((+analyte.maxLevel - +analyte.minLevel) / 4).toFixed(2)
        ),
      })),
    };

    console.log("Update Object: ", updateObject);

    setIsSavingQCLot(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/AdminQCLots/UpdateQCLot/${activeQCLot?.adminQCLotID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateObject),
        }
      );

      if (res.ok) {
        console.log("Saved:", res.json());
        setFeedbackNotiType(NotiType.UpdateQC);
        setIsUpdatingQCLotSuccessful(true);
        setFeedbackNotiOpen(true);
      } else {
        const error: DefinedRequestError = await res.json();
        console.log("Failed to update data: ", error.errorCode);

        if (error.errorCode === ErrorCode.NotFound) {
          setFeedbackNotiType(NotiType.UpdateQC);
          setIsUpdatingQCLotSuccessful(false);
          setFeedbackNotiOpen(true);
          setIsSavingQCLot(false);
          return;
        }
      }
      setIsSavingQCLot(false);
    } catch (e) {
      console.error("Failed to save data:", e);
      setIsSavingQCLot(false);
    }

    setSaveButtonActionType(SaveButtonActionType.Idle);
  }

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

  function validateInputRange() {
    const minInputArray = inputRefs.current.filter(
      (item) => inputRefs.current.indexOf(item) % 4 === 1
    );

    minInputArray.forEach((item) => {
      if (
        +inputRefs.current[inputRefs.current.indexOf(item) + 1].value <
        +item.value ||
        item.value === "" ||
        (inputRefs.current[inputRefs.current.indexOf(item) + 1].value === "0" &&
          item.value === "0")
      ) {
        item.classList.remove("bg-green-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove(
          "bg-green-500"
        );
        item.classList.add("bg-red-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add(
          "bg-red-500"
        );
      } else {
        // console.log("Item at index " + inputRefs.current.indexOf(item) + " is valid")
        item.classList.remove("bg-red-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.remove(
          "bg-red-500"
        );
        item.classList.add("bg-green-500");
        inputRefs.current[inputRefs.current.indexOf(item) + 1].classList.add(
          "bg-green-500"
        );
      }
    });

    setIsValid(
      !inputRefs.current.some((item) => item.classList.contains("bg-red-500"))
    );
  }

  async function handleChangeOrderableOption() {
    setIsSavingQCLot(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/SetIsOrderable`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: loaderData.qcTemplate.adminQCLotID,
          isOrderable,
        }),
      })

      if (res.ok) {
        console.log("Changed orderable: ", await res.json());
        setIsUpdatingQCLotSuccessful(true);
        setFeedbackNotiType(NotiType.UpdateOrderOptionSuccess);
        setFeedbackNotiOpen(true);
      }

      setIsSavingQCLot(false);
    } catch (e) {
      console.error("Failed to change orderable: ", e);
      setFeedbackNotiType(NotiType.UpdateOrderOptionSuccess);
      setFeedbackNotiOpen(true);
      setIsSavingQCLot(false);
    }
  }

  useEffect(() => {
    console.log("Loader data: ", loaderData);
  }, []);

  useEffect(() => {
    if (!activeQCLot) {
      setInteractionMode(InteractionMode.Create);
    }
  }, []);

  // useEffect(() => {
  //   if (interactionMode === InteractionMode.Create) {
  //     setExpDate(null);
  //     setFileDateRange([null, null]);
  //     setQCElements(loaderData.qcTemplate.analyteTemplates.map(item => ({ ...item, minLevel: "", maxLevel: "", mean: "", stdDevi: "" })));
  //   } else {
  //     setExpDate(dayjs(currentQCLot?.expirationDate));
  //     setFileDateRange([
  //       dayjs(currentQCLot?.openDate),
  //       currentQCLot?.closedDate ? dayjs(currentQCLot.closedDate) : null,
  //     ]);
  //   }
  // }, [interactionMode]);

  useEffect(() => {
    // console.log("From loaderData: ", loaderData, "\nactiveLot: ", activeQCLot, "\ncurrentQCLot: ", currentQCLot);
  }, [loaderData, activeQCLot, currentQCLot]);

  useEffect(() => {
    async function deactivateLot() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/DeactivateQCLot/${currentQCLot?.adminQCLotID}`, {
        method: "PATCH",
      });

      if (res.ok) {
        console.log("Deactivated: ", await res.json());
        setFeedbackNotiType(NotiType.DeactivateResponse);
        setFeedbackNotiOpen(true);
        setDidUserDeactivate(false);
        navigate(0);
      } else {
        const error: DefinedRequestError = await res.json();
        setErrorMessage(error.message);
        setFeedbackNotiType(NotiType.DeactivateResponse);
        setFeedbackNotiOpen(true);
      }
    }

    if (didUserDeactivate) {
      deactivateLot();
    }
  }, [didUserDeactivate]);

  useEffect(() => {
    register("lotNumber", { required: true });
    register("expirationDate", { required: true });
    register("fileDate", { required: false });
    register("openDate", { required: true });
    register("closedDate", { required: false });

    presetLotAndDate();
  }, [register]);

  useEffect(() => {
    //If notification is enabled, disable after 5 seconds
    if (
      isFeedbackNotiOpen &&
      (feedbackNotiType === NotiType.SaveQC ||
        feedbackNotiType === NotiType.UpdateQC)
    ) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);

        if (isSavingQCLotSuccessful) {
          navigate("/admin-home");
        }
      }, 5000);
    }
  }, [isFeedbackNotiOpen]);

  useEffect(() => {
    validateInputRange();
  }, [QCElements]);

  useEffect(() => {
    console.log(fileDateRange);
  }, [fileDateRange]);

  // useEffect to manage the change of interaction mode
  useEffect(() => {
    if (interactionMode === InteractionMode.Create) {
      setSaveButtonActionType(SaveButtonActionType.Save);
      setExpDate(null);
      setFileDateRange([null, null]);
      setQCElements(loaderData.qcTemplate.analyteTemplates.map(item => ({ ...item, minLevel: "", maxLevel: "", mean: "", stdDevi: "" })));
    }

    if (interactionMode === InteractionMode.Edit) {
      setSaveButtonActionType(SaveButtonActionType.Update);
      setExpDate(dayjs(currentQCLot?.expirationDate));
      setFileDateRange([
        dayjs(currentQCLot?.openDate),
        currentQCLot?.closedDate ? dayjs(currentQCLot.closedDate) : null,
      ]);
      setQCElements(currentQCLot?.analytes ?? loaderData.qcTemplate.analyteTemplates.map(item => ({ ...item, minLevel: "", maxLevel: "", mean: "", stdDevi: "" })));
    }

    if (interactionMode === InteractionMode.View) {
      setSaveButtonActionType(SaveButtonActionType.Idle);
      setExpDate(dayjs(currentQCLot?.expirationDate));
      setFileDateRange([
        dayjs(currentQCLot?.openDate),
        currentQCLot?.closedDate ? dayjs(currentQCLot.closedDate) : null,
      ]);
      setQCElements(currentQCLot?.analytes ?? loaderData.qcTemplate.analyteTemplates.map(item => ({ ...item, minLevel: "", maxLevel: "", mean: "", stdDevi: "" })));
    }
  }, [interactionMode]);

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
          dangerouslySetInnerHTML={{ __html: renderSubString(info.getValue()) }}
        />
      ),
    },
    {
      accessorKey: "unitOfMeasure",
      header: "Units of Measure",
      cell: (info) => <></>,
    },
    {
      accessorKey: "minLevel",
      header: "Min Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "maxLevel",
      header: "Max Level",
      cell: (info) => <></>,
    },
    {
      accessorKey: "mean",
      header: "QC Mean",
      cell: (info) => <></>,
    },
    {
      accessorKey: "stdDevi",
      header: "Standard Deviation",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus1",
      header: "+1 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus1",
      header: "-1 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus2",
      header: "+2 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus2",
      header: "-2 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdplus3",
      header: "+3 SD",
      cell: (info) => <></>,
    },
    {
      accessorKey: "sdminus3",
      header: "-3 SD",
      cell: (info) => <></>,
    },
  ];

  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <NavBar
        name={`${qcTypeLinkList.find((qcType) => qcType.link.includes(item))?.name ??
          "Custom"
          } QC Builder`}
      />
      <div className="basic-container relative sm:space-y-4 pb-24">
        <div className="input-container flex justify-center">
          <div className={`infos-container sm:h-full flex items-center py-4 ${loaderData.qcTemplate.isCustom ? "sm:space-x-4" : "sm:space-x-12"}`}>
            
            <div className="control-buttons flex flex-col sm:p-2 bg-[#3A6CC6] rounded-xl sm:space-y-2">
              <div
                className={`text-[#fff] ${interactionMode === InteractionMode.Create || !currentQCLot?.isActive ? "bg-red-500" : "bg-green-500"
                  } sm:text-xl font-semibold text-center rounded-md`}
              >
                {interactionMode === InteractionMode.Create || !currentQCLot?.isActive ? "Inactive" : "Active"}
              </div>
              <Button
                variant="contained"
                onClick={handleModeButtonClick}
                style={{
                  color: "black",
                  backgroundColor: "#CFD5EA",
                  border: "solid",
                  borderColor: "#2F528F",
                  borderWidth: "3px",
                  width: "16svw",
                }}
              >
                {interactionMode === InteractionMode.View && (
                  <>
                    <div className="flex items-center justify-center sm:gap-x-1">
                      <Icon
                        icon="ic:outline-remove-red-eye"
                        className="text-xl"
                      />
                      <span>View Lot</span>
                    </div>
                  </>
                )}
                {interactionMode === InteractionMode.Create && (
                  <>
                    <div className="flex items-center justify-center sm:gap-x-1">
                      <Icon icon="ic:outline-plus" className="text-xl" />
                      <span>Create Lot</span>
                    </div>
                  </>
                )}
                {interactionMode === InteractionMode.Edit && (
                  <>
                    <div className="flex items-center justify-center sm:gap-x-1">
                      <Icon icon="ic:baseline-create" className="text-xl" />
                      <span>Edit Lot</span>
                    </div>
                  </>
                )}
              </Button>

              <Menu
                anchorEl={intModeDropdownAnchor}
                open={isIntModeDropdownOpen}
                onClose={() => handleModeMenuClose(interactionMode)}
              >
                <MenuItem
                  onClick={() => handleModeMenuClose(InteractionMode.View)}
                  className={`${loaderData.qcLotList.length === 0 ? "Mui-disabled" : ""}`}
                >
                  <Icon
                    icon="ic:outline-remove-red-eye"
                    className="text-xl mr-2"
                  />
                  View Lot
                </MenuItem>
                <MenuItem
                  onClick={() => handleModeMenuClose(InteractionMode.Create)}
                >
                  <Icon icon="ic:outline-plus" className="text-xl mr-2" />
                  Create Lot
                </MenuItem>
                <MenuItem
                  onClick={() => handleModeMenuClose(InteractionMode.Edit)}
                  className={`${!currentQCLot?.isActive || interactionMode === InteractionMode.Create ? "Mui-disabled" : ""}`}
                >
                  <Icon icon="ic:baseline-create" className="text-xl mr-2" />
                  Edit Lot
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleModeMenuClose(interactionMode);
                    setFeedbackNotiType(NotiType.DeactivateQC);
                    setFeedbackNotiOpen(true);
                  }}
                  className={`${!currentQCLot?.isActive || interactionMode === InteractionMode.Create ? "Mui-disabled" : ""}`}
                >
                  <Icon icon="ic:sharp-close" className="text-xl mr-2" />
                  Deactivate Lot
                </MenuItem>
              </Menu>
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">
                QC Lot Number
              </div>
              {interactionMode === InteractionMode.Create ? (
                <>
                  <input
                    type="text"
                    className="sm:p-1 rounded-lg border border-solid border-[#548235] sm:w-[18svw] text-center text-sm"
                    value={newQCLotInput}
                    onChange={(e) => {
                      e.preventDefault();

                      setNewQCLotInput(e.target.value);
                      // setValue("lotNumber", e.target.value);
                    }}
                  />
                </>
              ) : (
                <>
                  <Select
                    // type="text"
                    size="large"
                    disabled={interactionMode === InteractionMode.Edit}
                    // className={`${interactionMode === InteractionMode.Edit ? "Mui-disabled" : ""}`}
                    showSearch
                    style={{
                      // padding: "0.25rem",
                      border: "solid 1px #548235",
                      borderRadius: "0.75rem",
                      width: "18svw",
                      height: "34px",
                      textAlign: "center",
                    }}
                    value={QCLotInput}
                    options={loaderData.qcLotList.map((item) => ({
                      label: item.lotNumber,
                      value: item.lotNumber,
                    }))}
                    onChange={(value) => {
                      // console.log(value);
                      // e.preventDefault();

                      setQCLotInput(value);
                      // setValue("lotNumber", value);

                      const selectedQCLot: AdminQCLot | undefined =
                        loaderData.qcLotList.find((item) => item.lotNumber === value);
                      if (selectedQCLot) {
                        setCurrentQCLot(selectedQCLot);
                        setQCElements(selectedQCLot.analytes);
                        setExpDate(dayjs(selectedQCLot.expirationDate));
                        setFileDate(dayjs(selectedQCLot.fileDate));

                        if (selectedQCLot.closedDate) {
                          setFileDateRange([
                            dayjs(selectedQCLot.openDate),
                            dayjs(selectedQCLot.closedDate),
                          ]);
                        } else {
                          setFileDateRange([
                            dayjs(selectedQCLot.openDate),
                            null,
                          ]);
                        }
                      }
                    }}
                  />
                </>
              )}
            </div>
            <div className="expdate-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="expdate-label sm:text-xl font-semibold text-white">
                Expiration Date
              </div>
              <DatePicker
                size="large"
                showTime
                popupStyle={{ color: "black" }}
                disabled={interactionMode === InteractionMode.View}
                style={{
                  padding: "0.25rem",
                  border: "solid 1px #548235",
                  width: "18svw",
                  height: "34px",
                  fontSize: "0.875rem",
                }}
                // defaultValue={loaderData ? dayjs(loaderData.expirationDate) : dayjs()}
                value={expDate}
                format="MM/DD/YYYY"
                onChange={(value) => {
                  // setValue("expirationDate", value.toISOString());
                  setExpDate(value);
                }}
              />
            </div>
            <div className="filedate-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="filedate-label sm:text-xl font-semibold text-white">
                File Date
              </div>
              <DatePicker.RangePicker
                size="large"
                placeholder={["Open Date", "Close Date"]}
                disabled={interactionMode === InteractionMode.View}
                allowEmpty={[false, true]}
                showTime
                style={{
                  padding: "0.25rem",
                  border: "solid 1px #548235",
                  width: "18svw",
                  height: "34px",
                }}
                // defaultValue={loaderData ? dayjs(loaderData.fileDate) : dayjs()}
                value={fileDateRange}
                format="MM/DD/YYYY"
                onChange={(value) => {
                  // setValue("fileDate", value.toISOString());
                  // setFileDate(value);
                  setFileDateRange(value);
                }}
              />
            </div>
            {loaderData.qcTemplate.isCustom && (
              <div className="flex flex-col items-center sm:p-2 bg-[#3A6CC6] rounded-xl sm:space-y-2">
                <div className="sm:text-xl font-semibold text-white">Orderable: <Switch checked={isOrderable} onChange={() => setIsOrderable(prevValue => !prevValue)} /></div>
                <Button variant="contained" disabled={isSavingQCLot} style={{
                  color: "black", backgroundColor: "#CFD5EA", border: "solid",
                  borderColor: "#2F528F",
                  borderWidth: "3px",
                  width: "100%",
                }} onClick={handleChangeOrderableOption}>{ isSavingQCLot ? (<Icon icon="eos-icons:three-dots-loading" />) : <>Save</>}</Button>
              </div>
            )}
          </div>
        </div>
        {loaderData.qcTemplate.isCustom && <div className="info-container text-center">
          <strong>File Name:</strong> {loaderData.qcTemplate.qcName}
        </div>}
        <div className="table-container flex flex-col sm:mt-8 sm:w-[94svw] sm:max-h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
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
            <TableBody
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Validate if all the input fall under constraints
                  validateInputRange();

                  // Move cursor to next input field
                  moveToNextInputOnEnter(e);
                }
              }}
            >
              {/* NO DATA */}
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
                <></>
              )}

              {/* DISPLAY TABLE */}
              {QCElements.map((row, index) => (
                <TableRow
                  key={row.analyteName}
                  className="text-center sm:h-[10%] border-none"
                >
                  {/* ANALYTE NAME COLUMN */}
                  <TableCell>
                    <div>{row.analyteName}</div>
                  </TableCell>

                  {/* ANALYTE ACRONYM COLUMN */}
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderSubString(row.analyteAcronym),
                      }}
                    />
                  </TableCell>

                  {/* UNIT OF MEASURE COLUMN */}
                  <TableCell className="unitOfMeasure">
                    <input
                      // Set the ref for the input field in ref list
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4] = el;
                        }
                      }}
                      type="text"
                      className="sm:w-24 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={
                        row.unitOfMeasure === ""
                          ? ""
                          : row.unitOfMeasure.toString()
                      }
                      // Update value of the input field, use regex to test the conformity of the value
                      readOnly={interactionMode === InteractionMode.View}
                      onChange={(e) => {
                        if (interactionMode === InteractionMode.View) return;
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^[a-zA-Z\u0370-\u03FF\/% ]+$/.test(
                                e.target.value
                              )
                            )
                              return {
                                ...item,
                                unitOfMeasure: e.target.value,
                              };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="minLevel">
                    <input
                      type="text"
                      // Set the ref for the input field in ref list
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 1] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.minLevel || ""}
                      // Update value of the input field, use regex to test the conformity of the value
                      readOnly={interactionMode === InteractionMode.View}
                      onChange={(e) => {
                        if (interactionMode === InteractionMode.View) return;
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            ) {
                              return { ...item, minLevel: e.target.value };
                            } else return item;
                          });

                          return newState;
                        });
                      }}
                      // Set the value to two fixed decimal places
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
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
                  </TableCell>
                  <TableCell className="maxLevel">
                    <input
                      type="text"
                      // Set the ref for the input field in ref list
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 2] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.maxLevel || ""}
                      // Update value of the input field, use regex to test the conformity of the value
                      readOnly={interactionMode === InteractionMode.View}
                      onChange={(e) => {
                        if (interactionMode === InteractionMode.View) return;
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            )
                              return { ...item, maxLevel: e.target.value };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                      // Set the value to two fixed decimal places
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
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
                  </TableCell>
                  <TableCell className="mean">
                    <input
                      type="text"
                      // Set the ref for the input field in ref list
                      ref={(el) => {
                        if (
                          el &&
                          inputRefs.current.length < QCElements.length * 4
                        ) {
                          inputRefs.current[index * 4 + 3] = el;
                        }
                      }}
                      className="sm:w-16 p-1 border border-solid border-[#548235] rounded-lg text-center"
                      value={row.mean || ""}
                      // Update value of the input field, use regex to test the conformity of the value
                      readOnly={interactionMode === InteractionMode.View}
                      onChange={(e) => {
                        if (interactionMode === InteractionMode.View) return;
                        e.preventDefault();

                        setQCElements((prevState) => {
                          const newState = prevState.map((item) => {
                            if (
                              item.analyteName === row.analyteName &&
                              /^\d*\.?\d*$/.test(e.target.value)
                            )
                              return { ...item, mean: e.target.value };
                            else return item;
                          });

                          return newState;
                        });
                      }}
                      // Set the value to two fixed decimal places
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log(e.currentTarget.value);
                          setQCElements((prevState) => {
                            const newState = prevState.map((item) => {
                              if (item.analyteName === row.analyteName) {
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
                  </TableCell>
                  <TableCell className="standard-deviation sm:w-32">
                    {/* Calculate the displayed value using input values */}
                    <div>
                      {((+row.maxLevel - +row.minLevel) / 4).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+1 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean +
                        (+row.maxLevel - +row.minLevel) / 4
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-1 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean -
                        (+row.maxLevel - +row.minLevel) / 4
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+2 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean +
                        ((+row.maxLevel - +row.minLevel) / 4) * 2
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-2 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean -
                        ((+row.maxLevel - +row.minLevel) / 4) * 2
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd+3 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean +
                        ((+row.maxLevel - +row.minLevel) / 4) * 3
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="sd-3 sm:w-20">
                    <div>
                      {/* Calculate the displayed value using input values */}
                      {(
                        +row.mean -
                        ((+row.maxLevel - +row.minLevel) / 4) * 3
                      ).toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ButtonBase
          disabled={interactionMode === InteractionMode.View || !isValid || isSavingQCLot}
          className={`${interactionMode === InteractionMode.View || !isValid || isSavingQCLot ? "Mui-disabled" : ""} save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold`}
          onClick={() => {
            if (saveButtonActionType === SaveButtonActionType.Save) {
              // Check if the QCLot already exists in the database, display warning
              if (activeQCLot) {
                setFeedbackNotiType(NotiType.QCAlreadyExist);
                setFeedbackNotiOpen(true);
                return;
              }

              if (expDate === null) {
                setFeedbackNotiType(NotiType.QCAlreadyExist);
                setFeedbackNotiOpen(true);
                return;
              }

              setValue("lotNumber", newQCLotInput);
              setValue("expirationDate", expDate ? expDate?.toISOString() : "");
              setValue("fileDate", fileDate.toISOString());
              setValue("openDate", fileDateRange ? fileDateRange[0] ? fileDateRange[0].toISOString() : "" : "");
              setValue("closedDate", fileDateRange ? fileDateRange[1] ? fileDateRange[1].toISOString() : null : null);

              // handleSubmit returns a function
              handleSubmit(saveQC)();
            } else if (saveButtonActionType === SaveButtonActionType.Update) {
              handleUpdateQC();
            } else {
              setFeedbackNotiType(NotiType.NoChangesMade);
              setFeedbackNotiOpen(true);
              return;
            }
          }}
        >
          {isSavingQCLot ? (
            <Icon icon="eos-icons:three-dots-loading" />
          ) : (
            "Save QC File"
          )}
        </ButtonBase>
      </div>

      {/* Notification Popup */}
      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setFeedbackNotiOpen(false);
        }}
        style={{ zIndex: 1000 }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            {/* Select the type of notification to appear */}
            {/* NOTI WHEN SAVING QC */}
            {feedbackNotiType === NotiType.SaveQC && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  {isSavingQCLotSuccessful ? (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon
                          icon="clarity:success-standard-line"
                          className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                        />
                        <div>Saved QC Successfully</div>
                        <div className="text-md text-gray-500">
                          Redirecting to Homepage...
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon
                          icon="material-symbols:cancel-outline"
                          className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                        />
                        <div>Error Occurred</div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              </>
            )}

            {/* WARNING NOTI FOR ANOTHER EXISTING ENTRY IS IN ORDER */}
            {feedbackNotiType === NotiType.QCAlreadyExist && (
              <div className="flex flex-col gap-y-2 items-center">
                <div className="text-2xl font-semibold">
                  Another QC is in order!
                </div>
                <div className="text-lg font-semibold">Proceed?</div>
                <Icon
                  icon="ph:warning-octagon-bold"
                  className="text-2xl text-yellow-400 sm:w-20 sm:h-20"
                />
                <div className="flex gap-x-2">
                  <Button
                    variant="contained"
                    className="!bg-[#22C55E]"
                    onClick={() => {
                      if (expDate === null) {
                        setFeedbackNotiType(NotiType.QCAlreadyExist);
                        setFeedbackNotiOpen(true);
                        return;
                      }

                      setValue("lotNumber", newQCLotInput);
                      setValue("expirationDate", expDate.toISOString());
                      setValue("fileDate", fileDate.toISOString());
                      setValue("openDate", fileDateRange ? fileDateRange[0] ? fileDateRange[0].toISOString() : "" : "");
                      setValue("closedDate", fileDateRange ? fileDateRange[1] ? fileDateRange[1].toISOString() : null : null);
                      handleSubmit(saveQC)();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    className="!bg-red-500"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}

            {/* WARNING LOT NUMBER TAKEN */}
            {feedbackNotiType === NotiType.LotNumberTaken && (
              <div className="flex flex-col sm:gap-y-2 items-center">
                <div className="text-2xl font-semibold">
                  Lot Number already exists!
                </div>
                <Icon
                  icon="ph:warning-octagon-bold"
                  className="text-2xl text-yellow-400 sm:w-20 sm:h-20"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    setFeedbackNotiOpen(false);
                  }}
                  className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                >
                  OK
                </Button>
              </div>
            )}

            {/* NOTI WHEN UPDATING QC */}
            {feedbackNotiType === NotiType.UpdateQC && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  {isUpdatingQCLotSuccessful ? (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon
                          icon="clarity:success-standard-line"
                          className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                        />
                        <div>Updated QC Successfully</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col sm:gap-y-2">
                        <Icon
                          icon="material-symbols:cancel-outline"
                          className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                        />
                        <div>Error Occurred</div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                      navigate(0);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              </>
            )}

            {/* NOTI WHEN NO CHANGES WERE MADE */}
            {feedbackNotiType === NotiType.NoChangesMade && (
              <div className="flex flex-col sm:gap-y-2 items-center">
                <div className="text-2xl font-semibold">
                  No changes were made!
                </div>
                <Icon
                  icon="ph:warning-octagon-bold"
                  className="text-2xl text-yellow-400 sm:w-20 sm:h-20"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    setFeedbackNotiOpen(false);
                  }}
                  className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                >
                  OK
                </Button>
              </div>
            )}

            {/* NOTI WHEN USER DEACTIVATES LOT */}
            {feedbackNotiType === NotiType.DeactivateQC && (
              <div className="flex flex-col gap-y-2 items-center">
                <div className="text-2xl font-semibold">
                  Deactivate QC?
                </div>
                <div className="text-red-500 font-semibold">Note: This action is permanent, you cannot reactivate this QC</div>

                <Icon
                  icon="ph:warning-octagon-bold"
                  className="text-2xl text-yellow-400 sm:w-20 sm:h-20"
                />
                <div className="text-lg font-semibold">Proceed?</div>
                <div className="flex gap-x-2">
                  <Button
                    variant="contained"
                    className="!bg-[#22C55E]"
                    onClick={() => {
                      setDidUserDeactivate(true);
                      setFeedbackNotiOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    className="!bg-red-500"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}

            {/* NOTI WHEN DEACTIVATING QC */}
            {feedbackNotiType === NotiType.DeactivateResponse && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon
                      icon="clarity:success-standard-line"
                      className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                    />
                    <div>Deactivated QC Successfully</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              </>
            )}

            {feedbackNotiType === NotiType.UpdateOrderOptionSuccess && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon
                      icon="clarity:success-standard-line"
                      className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                    />
                    <div>Update Order Option Successfully</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              </>
            )}

            {feedbackNotiType === NotiType.UpdateOrderOptionFailure && (
              <>
                <div className="text-center text-gray-600 text-xl font-semibold">
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon
                      icon="material-symbols:cancel-outline"
                      className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"
                    />
                    <div>Update Order Option Failed</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setFeedbackNotiOpen(false);
                    }}
                    className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
                  >
                    OK
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Backdrop>
    </>
  );
};
