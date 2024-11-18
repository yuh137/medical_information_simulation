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
  handleInputChange: (value: string) => void;
}

const validValues = ["0", "W+", "1+", "2+", "3+", "4+", "H+"];
const partialValues = ["W", "1", "2", "3", "4", "H", ""];

// Returns whether the student input aligns with what staff entered
function alignsWith(input: string, expected: string) {
  if (!validValues.includes(input)) {  // Not a valid final value
    return false;
  }
  if (expected === "0") {  // If it should be negative
    return input === "0";
  } else {
    return input !== "0";
  }
}

const Reagent = forwardRef((props: ReagentProps, ref) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    inputRef,
    nameRef,
  }));

  const isValidInput = () => {
    if (props.controlType === "positive") {
      return alignsWith(inputValue, props.PosExpectedRange);
    } else { 
      return alignsWith(inputValue, props.NegExpectedRange);
    }
    /*
    const parsedValue = parseFloat(inputValue);
    if (props.controlType === "positive") {
      return parsedValue >= 1 && parsedValue <= 4; // Valid range for positive control
    } else if (props.controlType === "negative") {
      return parsedValue === 0; // Only 0 is valid for negative control
    }
    return false;
    */
  };

  const inputBackgroundColor = isValidInput() ? "bg-green-100" : "bg-red-100";

  return (
    <div className="Reagent-container bg-[#B4C7E7] border-2 border-[#7F9458] rounded-xl p-4">
      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        className={`text-center w-16 h-8 rounded-lg border ${inputBackgroundColor}`}
        onChange={(event) => {
          const newValue = event.target.value;
          if (validValues.includes(newValue) || partialValues.includes(newValue)) {
            setInputValue(newValue);
            props.handleInputChange(newValue);
          }
        }}
      />
      <div
        className="Reagent-acronym text-2xl font-semibold text-sm"
        dangerouslySetInnerHTML={{ __html: props.Abbreviation }}
        ref={nameRef}
      />
      <div className="Reagent-name text-base truncate">{props.reagentName}</div>
      <div className="Reagent-range text-xs">
        Range: {props.controlType === "positive" ? "1-4" : "0"}
      </div>
    </div>
  );
});

export default Reagent;