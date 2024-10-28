import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MolecularQCTemplateBatch, MolecularQCTemplateBatchAnalyte, QualitativeMolecularQCTemplateBatchAnalyte, QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte, ReportType } from  '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import MolecularAnalyte from '../../../components/MolecularAnalyte';
import { Button, ButtonBase, Modal } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { saveToDB } from "../../../utils/indexedDB/getData";


const SimpleMolecularAnalyteInputPage = () => {
  const { theme } = useTheme();
  const [qcData, setQcData] = useState<MolecularQCTemplateBatch | null>(null);
  const [modalData, setModalData] = useState<{ invalidIndex: number; comment: string }[]>([]);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [isInputFull, setIsInputFull] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isValidManual, setIsValidManual] = useState<boolean>(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const analyteNameRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const storedQCData = localStorage.getItem('selectedQCData');
    if (storedQCData) {
      setQcData(JSON.parse(storedQCData));
    } else {
      console.error("No QC data found.");
    }
  }, []);

  const invalidIndexArray: number[] | null = useMemo(() => {
    if (!invalidIndexes) return null;
    let newArray: number[] = [];
    invalidIndexes.forEach(value => newArray.push(value));
    return newArray;
  }, [invalidIndexes]);

  const isValid = useMemo(() => {
    if ((!invalidIndexes || invalidIndexes.size === 0) && analyteValues.length === qcData?.analytes.length) return true;
    else return false;
  }, [analyteValues, invalidIndexes, qcData]);

	const setInvalidIndex = (index: number) => {
  	if (!invalidIndexes) {
			let newInvalidIndexes = new Set<number>();
      newInvalidIndexes.add(index);
      setInvalidIndexes(newInvalidIndexes);
    } else {
    	let newInvalidIndexes = new Set<number>(invalidIndexes);
      newInvalidIndexes.add(index);
      setInvalidIndexes(newInvalidIndexes);
    }
	}
		
  const handleAcceptQC = async () => {
    if (!qcData) {
      console.error("No QC data available to save.");
      return;
    }
    const qcDataToSave: MolecularQCTemplateBatch = {
      ...qcData,
      analytes: qcData.analytes.map((analyte, index) => ({
        ...analyte,
        value: analyteValues[index],
      })),
    };
    console.log("Data to save:", qcDataToSave);
    try {
      await saveToDB("qc_store", qcDataToSave);
      console.log("QC data saved successfully.");
      setAnalyteValues([]);
      setInvalidIndexes(null);
      setModalData([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving QC data:", error);
    }
	};
  
  const handleInputChange = (index: number, value: string, old_analyte: MolecularQCTemplateBatchAnalyte) => {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
    if (old_analyte.reportType === ReportType.QualitativeViralLoadRange) {
			const viralLoadAnalyte = old_analyte as QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte;
			if (isNaN(parseFloat(value)) ||
      (parseFloat(value) < +viralLoadAnalyte.minLevel) ||
      (parseFloat(value) > +viralLoadAnalyte.maxLevel)) {
				setInvalidIndex(index);
    	} else {
      	let newInvalidIndexes = new Set<number>(invalidIndexes);
      	newInvalidIndexes.delete(index);
      	setInvalidIndexes(newInvalidIndexes);
    	}
    } else if (old_analyte.reportType === ReportType.Qualitative) {
				const qualitativeAnalyte = old_analyte as QualitativeMolecularQCTemplateBatchAnalyte;
				if (qualitativeAnalyte.expectedRange !== value) {
					setInvalidIndex(index);
				} else {
      		let newInvalidIndexes = new Set<number>(invalidIndexes);
      		newInvalidIndexes.delete(index);
      		setInvalidIndexes(newInvalidIndexes);
				}
    } else if (typeof value === 'undefined') {
			setInvalidIndex(index);
		}
    setIsInputFull(newValues.length === qcData?.analytes.length && newValues.length > 0);
  };

  const handleTextareaChange = (index: number, invalidIndex: number, value: string) => {
    setModalData(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[index] = { invalidIndex, comment: value };
      return updatedValues;
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent, index: number) => {
    if (
      event.key === "Enter" &&
      index < inputRefs.current.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  if (!qcData) {
    return <p>No data available for this QC record.</p>;
  }

  return (
    <>
      <NavBar name={`Molecular QC Results`} />
      <div
        className="flex flex-col space-y-12 pb-8 justify-center px-[100px] relative"
        style={{ minWidth: "100svw", minHeight: "100svh" }}
      >
        <div className="analyte-list-container flex flex-wrap gap-14 sm:w-[90svw] sm:px-[149.5px] max-sm:flex-col mt-8 px-3 justify-center">
          {qcData.analytes.map((item, index) => (
            <div
              onKeyDown={(event) => {
                handleKeyPress(event, index);
              }}
              key={item.analyteName}
            >
              <MolecularAnalyte
		analyte = {item}
                handleInputChange={(val: string) => {
	      	handleInputChange(index, val, item);
              }}
              
                ref={(childRef: { inputRef: React.RefObject<HTMLInputElement>; nameRef: React.RefObject<HTMLDivElement> }) => {
                  if (childRef) {
                    inputRefs.current.push(childRef.inputRef.current as HTMLInputElement);
                    analyteNameRefs.current.push(childRef.nameRef.current as HTMLDivElement);
                  }
                }}
              />
            </div>
          ))}
        </div>
        <div className="analyte-control-container sm:w-[90svw] w-[100svw] flex justify-between max-sm:flex-col max-sm:w-[100%] max-sm:space-y-4">
          <Button className="shadow-lg sm:w-fit sm:h-[50px] sm:!px-4 !bg-[#DAE3F3] !text-black !font-semibold !border !border-solid !border-[#6781AF]">
            QC Function Overview
          </Button>
          <div className="sm:space-x-16 max-sm:w-full max-sm:space-y-4">
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isInputFull ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isInputFull}
              onClick={() => setIsModalOpen(true)}
            >
              Apply QC Comment
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid ? "!bg-[#DAE3F3] !text-black" : "!bg-[#AFABAB] !text-white"
              }`}
             disabled={!isValid}
              onClick={() => handleAcceptQC()}
            >
              Accept QC
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={`modal-conatiner absolute top-1/1 left-1/2 sm:w-[50svw] sm:h-[80svh] bg-[${theme.secondaryColor}] border-2 border-solid border-[#6781AF] rounded-xl sm:-translate-x-1/2 sm:translate-y-12 flex flex-col items-center sm:py-6 relative overflow-scroll sm:space-y-4`}>
          <div className="modal-title sm:text-2xl font-semibold">QC Comment</div>
          <div className="invalid-items sm:w-[80%]">
            {!invalidIndexArray || invalidIndexArray.length === 0 && (
              <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">No invalid items</div>
            )}
            {invalidIndexArray && invalidIndexArray.length > 0 && (
              <div className="invalid-items-comments flex flex-col sm:space-y-6">
                {invalidIndexArray.map((invalidItem, index) => (
                  <div className="comment flex sm:space-x-12 h-fit" key={invalidItem}>
                    <div className="comment-name w-[5%] sm:text-xl font-semibold self-center" dangerouslySetInnerHTML={{ __html: analyteNameRefs.current[invalidItem]?.innerHTML }} />
                    <textarea className="grow sm:h-16 p-1" value={modalData[index]?.comment || ""} onChange={(e) => handleTextareaChange(index, invalidItem, e.target.value)} required></textarea>
                  </div>
                ))}
                <ButtonBase className={`!rounded-lg sm!my-10 sm:!py-6 sm:!px-10 !bg-[${theme.secondaryColor}] !border-[1px] !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] sm:w-1/2 self-center`} onClick={() => {
                  setIsValidManual(modalData.every(item => item.comment !== ""));
                }}>
                  Apply Comments
                </ButtonBase>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SimpleMolecularAnalyteInputPage;
