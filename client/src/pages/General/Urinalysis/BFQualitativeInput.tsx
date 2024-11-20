
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Backdrop } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { saveToDB } from "../../../utils/indexedDB/getData";
import Select, { MultiValue } from 'react-select';

import {
  ColumnDef,
  RowData,
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
import { renderSubString } from "../../../utils/UrinalysisUtils";
import {BFAnalytes, BFcrystals} from "../../../utils/UA_MOCK_DATA";

import { ButtonBase, Checkbox, Drawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTheme } from "../../../context/ThemeContext";
import addData from "../../../utils/indexedDB/addData";
import { UABFQCTemplateBatch } from "../../../utils/indexedDB/IDBSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDataByKey } from "../../../utils/indexedDB/getData";
import { deleteData } from "../../../utils/indexedDB/deleteData";
import NavBar from "../../../components/NavBar";
import { UABFtypeLinkList } from "../../../utils/UrinalysisUtils";



interface Option {
  value: string;
  label: string;
}
interface AnalyteExpectedRangeProps {
  analyteIndex: number;
  onChange: (ranges: string[]) => void;
}


interface QCRangeElements {
  isQualitative?: boolean;
  analyteName: string;
  analyteAcronym: string;
  unit_of_measure: string;
  min_level: string;
  max_level: string;
  mean: string;
  std_devi: string;
  electrolyte: boolean;
  expected_range?: string[];
  selectedExpectedRange?: string[];
}


export const BFQualitativeInput = (props: { name: string }) => {
  const navigate = useNavigate();
  const { item } = useParams();
  const { checkSession, checkUserType, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const selectRefs = useRef<HTMLSelectElement[]>([]);
  const initialData =
    item?.includes('BFAnalytes_1') ? BFAnalytes :
    item?.includes('BFAnalytes_2') ? BFAnalytes :
    item?.includes('BFAnalytes_3') ? BFAnalytes :
    item?.includes('BFcrystals') ? BFcrystals :
    BFcrystals;
    
  console.log("DataType:", item);

  // Find the object with the matching link
  const matchingItem = UABFtypeLinkList.find(linkName => linkName.link === item);
  // Get the name or handle case when no match is found
  const matchingName = matchingItem ? matchingItem.name : "";
  const cleanedmatchingName = matchingName.replace(/[^\x20-\x7E]/g, "").trim();


  const [QCElements, setQCElements] = useState<QCRangeElements[]>(initialData);
  const [isValid, setIsValid] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<UABFQCTemplateBatch>();
  const [isSuccessNotiOpen, setSuccessNotiOpen] = useState(false);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store the specific error message

  const saveQC: SubmitHandler<UABFQCTemplateBatch> = async (data) => {
    const qcDataToSave: UABFQCTemplateBatch = {
      isQualitative: true,
      fileName: data.fileName || "",
      lotNumber: data.lotNumber || "",
      openDate: data.openDate || "",
      closedDate: data.closedDate || "",
      analytes: QCElements.map(({ analyteName, analyteAcronym, unit_of_measure, electrolyte, mean, std_devi, min_level, max_level, expected_range, selectedExpectedRange }) => ({
        analyteName, analyteAcronym, unit_of_measure, electrolyte, mean, std_devi, min_level, max_level,expected_range, selectedExpectedRange
      })),
    };

  // Transform structure to match API requirements
  const qcDataForAPI = {
    ...qcDataToSave,
    QCName: data.fileName || "",
    analytes: qcDataToSave.analytes.map((analyte) => ({
        ...analyte,
        UnitOfMeasure: analyte.unit_of_measure, // Convert for API
        maxLevel: analyte.max_level,
        minLEvel: analyte.min_level,
        stdDevi: analyte.std_devi,
        ExpectedRange: analyte.expected_range, // Convert for API
        SelectedExpectedRange: analyte.selectedExpectedRange, // Convert for API
    })),
};

  console.log("Attempting to save:", qcDataToSave);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(qcDataForAPI),
      });

      if (response.ok) {
        setSuccessNotiOpen(true); // Show success notification
        console.log("Data saved successfully.");
      } else {
        const errorText = await response.text();
        setErrorNotiOpen(true); // Show error notification
        setErrorMessage(`Failed to save data: ${errorText}`);
        console.error("Failed to save data:", errorText);
      }
    } catch (error) {
        console.error("Failed to save data:", error);
    }

    // Saving to LocalStorage
    // try {
    //   await saveToDB("qc_store", qcDataToSave);
    //   console.log("Data saved successfully.");
    // } catch (error) {
    //   console.error("Failed to save data:", error);
    // }
  };

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);



  const handleRangesChange = (selectedOptions: MultiValue<Option>, index: number) => {
    const ranges = selectedOptions.map(option => option.value);
    setQCElements(prevState => {
      const newState = [...prevState];
      newState[index].selectedExpectedRange = ranges; // Update selectedExpectedRange

      return newState;
    });
  };
  

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedRanges]);

 

  function moveToNextInputOnEnter(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && inputRefs.current.find(ele => ele === e.target)) {
      const currentFocus = inputRefs.current.find(ele => ele === e.target);
      if (currentFocus && inputRefs.current.indexOf(currentFocus) < inputRefs.current.length) {
        const currentIndex = inputRefs.current.indexOf(currentFocus);
        inputRefs.current[currentIndex + 1]?.focus();
      }
      else return;
    }
  }

  const columns: ColumnDef<QCRangeElements, string>[] = [
    {
      accessorKey: "analyteName",
      header: "Analyte",
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
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
      accessorKey: "expected_range",
      header: "Expected Range",
      cell: (info) => <></>,
    },
   

  ];

  const table = useReactTable({
    data: useMemo(() => QCElements, [QCElements]),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!checkSession() || checkUserType() === "Student") {}
  }, []);


  useEffect(() => {
    (async () => {
      const res = await getDataByKey<UABFQCTemplateBatch>("qc_store", props.name);
  
      if (res && typeof res !== "string") {
        const analytesWithExpectedRange = res.analytes.map((analyte) => ({
          ...analyte,
          expected_range: "expected_range" in analyte ? analyte.expected_range : [], // Ensure default if missing
        }));
        setQCElements(analytesWithExpectedRange as QCRangeElements[]);
      }
    })();
  }, []);

  useEffect(() => {
    console.log(QCElements);  
  }, [QCElements]);

  return (
    <>
      <NavBar name={`Body Fluids QC Builder(Qualitative)`} />
      <div className="basic-container relative sm:space-y-2 pb-18">
        <div className="input-container flex justify-center">
          <div className="drawer-container sm:h-full flex items-center py-4 sm:space-x-4">
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC File Name</div>
              <input type="text" readOnly defaultValue={cleanedmatchingName} className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("fileName")} />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Lot Number</div>
              <input type="text" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("lotNumber")} />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">QC Expiration Date</div>
              <input type="date" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("closedDate")} pattern="\d{2}/\d{2}/\d{4}" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Open Date</div>
              <input type="date" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("openDate")} pattern="\d{2}/\d{2}/\d{4}" />
            </div>
            <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
              <div className="lotnumber-label sm:text-xl font-semibold text-white">Closed Date</div>
              <input type="date" className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center" {...register("closedDate")} pattern="\d{2}/\d{2}/\d{4}" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="basic-container relative sm:space-y-2 pb-18">
        {/* Container for report type buttons */}
        
        <div className="mb-4">
          <h3 className="text-lg font-bold text-center">Report Type</h3>
          <div className="flex justify-center space-x-4 mt-2">
            {/* Button to navigate to LevyJennis version */}
            
            <Link to={`/UA_fluids/BFEdit_qc/levyjennings/${item}`}>
              <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
              Levey-Jennings
              </ButtonBase>
          </Link>

            {/* Button to come back to the Qualitative page */}
            <Link to={`/UA_fluids/BFEdit_qc/${item}`}>
              <ButtonBase className="sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold">
              Qualitative
              </ButtonBase>
          </Link>
          </div>
        </div>
        <div className="table-container flex flex-col mt-8 sm:w-[94svw] sm:h-[75svh] sm:mx-auto w-100svw bg-[#CFD5EA] relative">
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
                  <TableCell colSpan={columns.length} className="sm:h-32 !p-2 text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                QCElements.map((row, index) => {
                  // Merge initial expected ranges with user-selected ones
                  // const mergedExpectedRanges = Array.from(new Set([...(BFcrystals[index]?.expected_range || []), ...(row.expected_range || [])]));
                  return (
                    <TableRow key={row.analyteName} className="text-center sm:h-[10%] border-none">
                      <TableCell>
                        <div>{row.analyteName}</div>
                      </TableCell>
                      <TableCell>
                        <div dangerouslySetInnerHTML={{ __html: renderSubString(row.analyteAcronym) }} />
                      </TableCell>
                      <TableCell className="w-96 overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="relative w-full">
                          <Select
                            isMulti
                            name="expectedRanges"
                            options={(row.expected_range || []).map(range => ({ value: range, label: range }))}
                            placeholder="Choose One or More Ranges"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => handleRangesChange(selectedOptions as MultiValue<Option>, index)}
                            styles={{
                              container: (provided) => ({ ...provided, width: '100%' }),
                              menu: (provided) => ({ ...provided, width: 'auto', minWidth: '100%', position: 'absolute', zIndex: 9999 }),
                              valueContainer: (provided) => ({ ...provided, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }),
                              menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                              option: (provided) => ({ ...provided, transition: 'none' }) // Disable animations
                            }}
                            menuPortalTarget={document.body}
                          />
                        </div>
                      </TableCell>
                  
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <ButtonBase className="save-button !absolute left-1/2 -translate-x-1/2 sm:w-48 !text-lg !border !border-solid !border-[#6A89A0] !rounded-lg sm:h-16 !bg-[#C5E0B4] transition ease-in-out duration-75 hover:!bg-[#00B050] hover:!border-4 hover:!border-[#385723] hover:font-semibold" onClick={handleSubmit(saveQC)}>
          Save QC File
        </ButtonBase>
      </div>
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
                    <div>Data Saved Successfully</div>
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