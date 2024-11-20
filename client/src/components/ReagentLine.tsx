import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";

export interface ReagentProps {
  controlType: "positive" | "negative"; // Add controlType prop
  reagentName: string;
  Abbreviation: string;
  AntiSeraLot: string;
  reagentExpDate: string;
  PosExpectedRange: string;
  NegExpectedRange: string;
  ExpImmSpinRange: string;
  Exp37Range: string;
  ExpAHGRange: string;
  ExpCheckCellsRange: string;
  handleInputChange: (ims: string, thirty: string, ahg: string, cc: string) => void;
}

const validValues = ["0", "W+", "1+", "2+", "3+", "4+", "H+"];
const partialValues = ["W", "1", "2", "3", "4", "H", ""];

// Returns whether the student input aligns with what staff entered
function alignsWith(input: string, expected: string) {
  return input === expected || expected.includes(input);
}

const ReagentLine = forwardRef((props: ReagentProps, ref) => {
  // const [inputValue, setInputValue] = useState('');
  const [imsValue, setImsValue] = useState('');
  const [thirtyValue, setThirtyValue] = useState('');
  const [ahgValue, setAhgValue] = useState('');     
  const [ccValue, setCcValue] = useState('');
  const imsRef = useRef<HTMLInputElement>(null);
  const thirtyRef = useRef<HTMLInputElement>(null);
  const ahgRef = useRef<HTMLInputElement>(null);
  const ccRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    imsRef,
    thirtyRef,
    nameRef,
    ahgRef,
    ccRef
  }));

  const isValidInput = (inputValue: string) => {
    return validValues.includes(inputValue);
  };

  const isPartial = (inputValue: string) => {
    return partialValues.includes(inputValue) && ! validValues.includes(inputValue);
  }
// flex flex-col border border-gray-300 p-2
// "Reagent-container bg-[#B4C7E7] border-2 border-[#7F9458] rounded-xl p-4">
  
  const imsValid = alignsWith(imsValue, props.ExpImmSpinRange) && isValidInput(imsValue);
  const thirtyValid = (imsValid && imsValue !== "0") || alignsWith(thirtyValue, props.Exp37Range) && isValidInput(thirtyValue);
  const ahgValid = ((thirtyValid && thirtyValue !== "0") ||  (imsValid && imsValue !== "0")) || alignsWith(ahgValue, props.ExpAHGRange) && isValidInput(ahgValue);
  const ccValid = ((ahgValid && ahgValue !== "0") || (thirtyValid && thirtyValue !== "0") ||  (imsValid && imsValue !== "0")) || alignsWith(ccValue, props.ExpCheckCellsRange) && isValidInput(ccValue);
  const imsBackgroundColor = imsValid ? "bg-green-100" : isValidInput(imsValue) ? "bg-red-100" : imsValue === "" ? "bg-gray-200" : isPartial(imsValue) ? "bg-yellow-200" : "bg-gray-200";
  const thirtyBackgroundColor = thirtyValid ? "bg-green-100" : isValidInput(thirtyValue) ? "bg-red-100" : thirtyValue === "" ? "bg-gray-200" : isPartial(thirtyValue) ? "bg-yellow-200" : "bg-gray-200";
  const ahgBackgroundColor = ahgValid ? "bg-green-100" : isValidInput(ahgValue) ? "bg-red-100" : ahgValue === "" ? "bg-gray-200" : isPartial(ahgValue) ? "bg-yellow-200" : "bg-gray-200";
  const ccBackgroundColor = ccValid ? "bg-green-100" : isValidInput(ccValue) ? "bg-red-100" : ccValue === "" ? "bg-gray-200" : isPartial(ccValue) ? "bg-yellow-200" : "bg-gray-200";
  // const thirtyBackgroundColor = isValidInput(imsValue) ? "bg-green-100" : isValidInput(thirtyValue) ? "bg-green-100" : isPartial(thirtyValue) ? "bg-gray-200" : "bg-red-100";
  // const ahgBackgroundColor = (isValidInput(imsValue) || isValidInput(thirtyValue)) ? "bg-green-100" : isValidInput(ahgValue) ? "bg-green-100" : isPartial(ahgValue) ? "bg-gray-200" : "bg-red-100";
  // const ccBackgroundColor = (isValidInput(imsValue) || isValidInput(thirtyValue) || isValidInput(ahgValue)) ? "bg-green-100" : isValidInput(ccValue) ? "bg-green-100" : isPartial(ccValue) ? "bg-gray-200" : "bg-red-100";

  return (
    <div className="Reagent-container flex flex-row gap-12 flex-shrink-0 bg-[#B4C7E7] border-2 border-[#7F9458] rounded-xl p-4">
        <div className="Reagent-name flex-1 bg-gray text-center font-bold">{props.reagentName}</div>
        <input
            type="text"
            ref={imsRef}
            value={imsValue}
            className={`flex-1 text-center w-16 h-8 rounded-lg border ${imsBackgroundColor}`}
            onChange={(event) => {
            const newValue = event.target.value;
            if (validValues.includes(newValue) || partialValues.includes(newValue)) {
                setImsValue(newValue);
                props.handleInputChange(newValue, thirtyValue, ahgValue, ccValue);
            }
            }}
        />
        <input
            type="text"
            ref={thirtyRef}
            value={thirtyValue}
            className={`flex-1 text-center w-16 h-8 rounded-lg border ${thirtyBackgroundColor}`}
            onChange={(event) => {
            const newValue = event.target.value;
            if (validValues.includes(newValue) || partialValues.includes(newValue)) {
                setThirtyValue(newValue);
                props.handleInputChange(imsValue, newValue, ahgValue, ccValue);
            }
            }}
        />
        <input
            type="text"
            ref={ahgRef}
            value={ahgValue}
            className={`flex-1 text-center w-16 h-8 rounded-lg border ${ahgBackgroundColor}`}
            onChange={(event) => {
            const newValue = event.target.value;
            if (validValues.includes(newValue) || partialValues.includes(newValue)) {
                setAhgValue(newValue);
                props.handleInputChange(imsValue, thirtyValue, newValue, ccValue);
            }
            }}
        />
        <input
            type="text"
            ref={ccRef}
            value={ccValue}
            className={`flex-1 text-center w-16 h-8 rounded-lg border ${ccBackgroundColor}`}
            onChange={(event) => {
            const newValue = event.target.value;
            if (validValues.includes(newValue) || partialValues.includes(newValue)) {
                setCcValue(newValue);
                props.handleInputChange(imsValue, thirtyValue, ahgValue, newValue);
            }
            }}
        />

    </div>
  );
});


export default ReagentLine;