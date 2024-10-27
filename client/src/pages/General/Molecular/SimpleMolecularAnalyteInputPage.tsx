import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MolecularQCTemplateBatch } from  '../../../utils/indexedDB/IDBSchema';
import NavBar from '../../../components/NavBar';
import Analyte from '../../../components/Analyte';


const SimpleMolecularAnalyteInputPage = () => {
  const [qcData, setQcData] = useState<MolecularQCTemplateBatch | null>(null);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

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
              <Analyte
                name={item.analyteName}
                acronym={item.analyteAcronym}
                minLevel={+item.minLevel}
                maxLevel={+item.maxLevel}
                // level={detectLevel(props.name)}
                measUnit={item.unitOfMeasure}
                handleInputChange={(val: string) => {
                  // Convert string to number but pass the string to handleInputChange
                  const numericValue = +val;
                  if (item.minLevel !== "" && item.maxLevel !== "") {
                      handleInputChange(index, val, +item.minLevel, +item.maxLevel);  // Pass `val` as a string
                  } else {
                      handleInputChange(index, val, -1, 9999);  // Pass `val` as a string
                  }
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
