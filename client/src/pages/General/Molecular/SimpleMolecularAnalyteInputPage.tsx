import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MolecularQCTemplateBatch } from  '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import Analyte from '../../../components/Analyte';


const SimpleMolecularAnalyteInputPage = () => {
  const [qcData, setQcData] = useState<MolecularQCTemplateBatch | null>(null);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [isInputFull, setIsInputFull] = useState<boolean>(false);
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

  
  const handleInputChange = (index: number, value: string, old_analyte: MolecularQCTemplateBatchAnalyte) => {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
		const concreteAnalyte: QualitativeMolecularQCTemplateBatchAnalyte | QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte = old_analyte;

    if (
      ((concreteAnalyte.reportType === ReportType.QualitativeViralLoadRange) && (isNaN(parseFloat(value)) ||
      parseFloat(value) < concreteAnalyte.minLevel ||
      parseFloat(value) > concreteAnalyte.maxLevel)) || 
			((concreteAnalyte.reportType === ReportType.Qualitative) && (value !== concreteAnalyte.expectedRange)) ||
      typeof value === "undefined")
    ) {
      if (!invalidIndexes) {
        let newInvalidIndexes = new Set<number>();
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      } else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
    } else {
      let newInvalidIndexes = new Set<number>(invalidIndexes);
      newInvalidIndexes.delete(index);
      setInvalidIndexes(newInvalidIndexes);
    }
    setIsInputFull(newValues.length === qcData?.analytes.length && newValues.length > 0);
  };

  if (!qcData) {
    return <p>No data available for this QC record.</p>;
  }

  const handleKeyPress = (event: React.KeyboardEvent, index: number) => {
    if (
      event.key === "Enter" &&
      index < inputRefs.current.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

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
      </div>
    </>
  );
};

export default SimpleMolecularAnalyteInputPage;
