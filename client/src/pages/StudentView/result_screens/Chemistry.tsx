import React, { useRef, useState, useEffect, useMemo } from "react";
import Analyte from "../../../components/Analyte";
import NavBar from "../../../components/NavBar";
import { Button, Modal } from "@mui/material";
import { useTheme } from "../../../context/ThemeContext";
import { renderSubString } from "../../../utils/utils";

const data: {
  name: string;
  acronym: string;
  electro?: boolean;
  level: 1 | 2;
  range: [number, number];
  measUnit: string;
}[] = [
  {
    acronym: "Na",
    name: "Sodium",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "K",
    name: "Potassium",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "Cl",
    name: "Chloride",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "CO_2",
    name: "Carbon Dioxide",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "BUN",
    name: "Blood Urea Nitrogen",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "CREA",
    name: "Creatinine",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "CA",
    name: "Calcium",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "GLU",
    name: "Glucose",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "ALB",
    name: "Albumin",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "ALT",
    name: "Alanine Aminotransferase",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "AST",
    name: "Aspartate Aminotransferase",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "ALP",
    name: "Alkaline Phosphatase ",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "BIL",
    name: "Bilirubin",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
  {
    acronym: "TP",
    name: "Total Protein",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L",
  },
];

const ChemistryQCResult = () => {
  const { theme } = useTheme();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const analyteNameRefs = useRef<HTMLDivElement[]>([]);

  const [isValid, setIsValid] = useState<boolean>(false);
  const [isInputFull, setIsInputFull] = useState<boolean>(false);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);
  const [invalidIndexes, setInvalidIndexes] = useState<Set<number> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const invalidIndexArray: number[] | null = useMemo(() => {
    if (!invalidIndexes) return null;
    let newArray: number[] = [];
    invalidIndexes.forEach(value => newArray.push(value));
    return newArray;
  }, [invalidIndexes])

  // const invalidIndexes: number[] = useMemo(
  //   () => {
  //     analyteValues
  //   },
  //   [analyteValues]
  // )

  function handleKeyPress(event: React.KeyboardEvent, index: number) {
    // console.log("From handleKeyPress function: ", inputRefs.current[index]);
    if (
      event.key === "Enter" &&
      index < inputRefs.current.length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleInputChange(
    index: number,
    value: string,
    min: number,
    max: number
  ) {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
    setIsValid(
      newValues.every(
        (val) =>
          !isNaN(parseFloat(val)) &&
          parseFloat(val) > min &&
          parseFloat(val) < max &&
          typeof val != "undefined" &&
          newValues.length === data.length
      )
    );
    // newValues.forEach(val => {
    if (
      isNaN(parseFloat(value)) ||
      parseFloat(value) < min ||
      parseFloat(value) > max ||
      typeof value === "undefined" 
      // newValues.length != data.length
    ) {
      // let newInvalidIndexes;
      if (!invalidIndexes) {
        let newInvalidIndexes = new Set<number>();
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
      else {
        let newInvalidIndexes = new Set<number>(invalidIndexes);
        newInvalidIndexes.add(index);
        setInvalidIndexes(newInvalidIndexes);
      }
      
      // newInvalidIndexes.push(newValues.indexOf(val));
      // setInvalidIndexes(newInvalidIndexes);
    };
    // })
    setIsInputFull(newValues.length === data.length && newValues.length > 0);
  }

  useEffect(() => {
    console.log(analyteNameRefs);
  }, [analyteNameRefs])

  // useEffect(() => {
  //   console.log(inputRefs);
  // }, [inputRefs])

  return (
    <>
      <NavBar name="Chemistry QC Results" />
      <div
        className=" flex flex-col space-y-12 pb-8 justify-center px-[100px] relative"
        style={{ minWidth: "100svw", minHeight: "100svh" }}
      >
        <div className="analyte-list-container flex flex-wrap gap-14 sm:w-[90svw] sm:px-[149.5px] sm:mt-12 max-sm:flex-col mt-8 px-3">
          {data.map((item, index) => (
            <div
              onKeyDown={(event) => {
                handleKeyPress(event, index);
              }}
              key={item.name}
            >
              <Analyte
                name={item.name}
                acronym={item.acronym}
                electro={item.electro}
                range={item.range}
                level={item.level}
                measUnit={item.measUnit}
                handleInputChange={(val) =>
                  handleInputChange(index, val, item.range[0], item.range[1])
                }
                ref={(childRef: { inputRef: { current: HTMLInputElement | null }, nameRef: { current: HTMLDivElement | null } }) => {
                  // console.log(childRef);
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
                isInputFull
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isInputFull}
              onClick={() => setIsModalOpen(true)}
            >
              Apply QC Comment
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValid}
            >
              Print QC
            </Button>
            <Button
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${
                isValid
                  ? "!bg-[#DAE3F3] !text-black"
                  : "!bg-[#AFABAB] !text-white"
              }`}
              disabled={!isValid}
             >
              Accept QC
            </Button>
          </div>
        </div>
        <div className="legends sm:absolute sm:bottom-4 sm:left-[35%] sm:space-y-4 sm:px-3 sm:py-2 border border-solid border-[#6781AF] relative max-sm:top-0">
          <div className="analyte-info flex sm:space-x-4">
            <div className="analyte-box sm:w-16 sm:h-8 bg-[#FFFF00] border border-solid border-[#6781AF]"/>
            <div className="analyte-text sm:h-full self-center">Electrolyte Element</div>
          </div>
          <div className="non-analyte-info flex sm:space-x-4">
            <div className="non-analyte-box sm:w-16 sm:h-8 bg-[#B4C7E7] border border-solid border-[#6781AF]" />
            <div className="non-analyte-text sm:h-full self-center">Non-Electrolyte Element</div>
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
            {!invalidIndexArray && <div className="absolute top-1/2 -translate-x-1/2">No invalid items</div>}
            {invalidIndexArray && (
              <div className="invalid-items-comments sm:space-y-6">
                {invalidIndexArray.map(invalidItem => (
                  <div className="comment flex sm:space-x-12 h-fit" key={invalidItem}>
                    <div className="comment-name w-[5%] sm:text-xl font-semibold self-center" dangerouslySetInnerHTML={{ __html: renderSubString(analyteNameRefs.current[invalidItem].innerHTML) }} />
                    <textarea name="" id="" className="grow sm:h-16 p-1" required></textarea>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChemistryQCResult;
