import React, { useRef, useState, useEffect } from "react";
import Analyte from "../../components/Analyte";
import NavBar from "../../components/NavBar";
import { Button } from "@mui/material";

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
    measUnit: "mmol/L"
  },
  {
    acronym: "K",
    name: "Potassium",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "Cl",
    name: "Chloride",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "CO_2",
    name: "Carbon Dioxide",
    electro: true,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "BUN",
    name: "Blood Urea Nitrogen",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "CREA",
    name: "Creatinine",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "CA",
    name: "Calcium",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "GLU",
    name: "Glucose",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "ALB",
    name: "Albumin",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "ALT",
    name: "Alanine Aminotransferase",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "AST",
    name: "Aspartate Aminotransferase",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "ALP",
    name: "Alkaline Phosphatase ",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "BIL",
    name: "Bilirubin",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
  {
    acronym: "TP",
    name: "Total Protein",
    electro: false,
    range: [136, 145],
    level: 1,
    measUnit: "mmol/L"
  },
];

const ChemistryQCResult = () => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [analyteValues, setAnalyteValues] = useState<string[]>([]);

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

  function handleInputChange(index: number, value: string, min: number, max: number) {
    const newValues = [...analyteValues];
    newValues[index] = value;
    setAnalyteValues(newValues);
    setIsValid(newValues.every(val => !isNaN(parseFloat(val)) && parseFloat(val) > min && parseFloat(val) < max && typeof val != 'undefined' && newValues.length === data.length));
  }

  useEffect(() => {
    console.log(analyteValues);
  }, [analyteValues])

  return (
    <>
      <NavBar name="Chemistry QC Results" />
      <div
        className="container flex flex-col space-y-12 pb-8 justify-center px-[100px]"
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
                handleInputChange={(val) => handleInputChange(index, val, item.range[0], item.range[1])}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current.push(el as HTMLInputElement); 
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
              className={`sm:w-32 sm:h-[50px] !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full ${isValid ? '!bg-[#DAE3F3] !text-black' : '!bg-[#AFABAB] !text-white'}`}
              disabled={!isValid}
            >
              Apply QC Comment
            </Button>
            <Button className="sm:w-32 sm:h-[50px] !bg-[#DAE3F3] !text-black !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full">
              Print QC
            </Button>
            <Button className="sm:w-32 sm:h-[50px] !bg-[#DAE3F3] !text-black !font-semibold !border !border-solid !border-[#6781AF] max-sm:w-full">
              Accept QC
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChemistryQCResult;
