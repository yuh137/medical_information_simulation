import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";

export interface ReagentProps {
  controlType: "positive" | "negative"; // Add controlType prop
  reagentName: string;
  Abbreviation: string;
  AntiSeraLot: string;
  reagentExpDate: string;
  ExpImmSpinRange: string;
  Exp37Range: string;
  ExpAHGRange: string;
  ExpCheckCellsRange: string;
  handleInputChange: (value: string) => void;
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
    const parsedValue = parseFloat(inputValue);
    if (props.controlType === "positive") {
      return parsedValue >= 1 && parsedValue <= 4; // Valid range for positive control
    } else if (props.controlType === "negative") {
      return parsedValue === 0; // Only 0 is valid for negative control
    }
    return false;
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
          if (/^\d*\.?\d*$/.test(newValue)) {
            setInputValue(newValue);
            props.handleInputChange(newValue);
          }
        }}
      />
      <div
        className="Reagent-acronym text-2xl font-semibold"
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