import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { renderSubString } from "../utils/utils";

export interface AnalyteProps {
  name: string;
  acronym: string;
  electro?: boolean;
  // level: number;
  min_level: number;
  max_level: number;
  measUnit: string;
  handleInputChange: (value: string) => void;
}

const Analyte = forwardRef((props: AnalyteProps, ref) => {

  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    inputRef,
    nameRef,
  }));
  
  // console.log(props.measUnit)
  return (
    <>
      <div
        className={`
            analyte-container sm:w-56 sm:h-fit px-4 sm:space-y-3 w-48 space-y-2
            bg-[#B4C7E7]
            border-2 border-solid border-[#7F9458] rounded-xl relative
        `}
      >
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          className="text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
          onChange={(event) => {
            event.preventDefault();
            const newValue = event.target.value;

            // Check if the input is a valid number format
            const isValid = /^\d*\.?\d*$/.test(newValue);
            if (isValid) {
              setInputValue(newValue);

              // Parse the input as a number and check if it’s within range
              const numericValue = parseFloat(newValue);
              if (
                !isNaN(numericValue) &&
                numericValue >= +props.min_level &&
                numericValue <= +props.max_level
              ) {
                event.target.classList.remove("bg-[#FF0000]"); // Valid input
                event.target.classList.add("bg-[#00FF00]");    // Set green background
              } else {
                event.target.classList.remove("bg-[#00FF00]"); // Invalid input
                event.target.classList.add("bg-[#FF0000]");    // Set red background
              }

              // Optionally call the parent function here if needed on every change
              props.handleInputChange(newValue);
            }
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const newInput = (+inputValue).toFixed(2).replace(/^0+(?!\.|$)/, ""); // Format input

              setInputValue(newInput); // Update state with formatted input
              props.handleInputChange(newInput); // Call parent function with final value
            }
          }}
        />

        <div
          className="analyte-acronym text-2xl font-semibold"
          dangerouslySetInnerHTML={{ __html: renderSubString(props.acronym) }}
          ref={nameRef}
        />
        <div className="ananlyte-desc">
          <div className="analyte-name peer text-base truncate">{props.name}</div>
          <div className="absolute invisible transition-all ease-in delay-100 peer-hover:visible text-white text-sm bg-slate-500 max-sm:text-center border border-solid border-gray-300 rounded-lg p-2">{props.name}</div>
          <div className="analyte-range text-xs">
            {/* {props.level === 1 || props.level === 2 ? `Level ${props.level === 1 ? "I" : "II"} range: ${props.min_level} -${" "}
            ${props.max_level} ${props.measUnit}` : `Range: ${props.min_level} -${" "} ${props.max_level} ${props.measUnit}`} */}
            Range: {props.min_level} - {props.max_level} {props.measUnit}
          </div>
        </div>
      </div>
    </>
  );
});

export default Analyte;
