import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { renderSubString } from "../utils/utils";

// Import the datasets
import { CAT, ESC, GRAM, INDOLE, MONTHLY, MUG, OXID, PYR, STER, STAPH } from "../utils/MICRO_MOCK_DATA"; 

export interface MicroAnalyteProps {
  name: string;
  acronym: string;
  electro?: boolean;
  min_level: number;
  max_level: number;
  measUnit: string;
  handleInputChange: (value: string) => void;
}

const MicroAnalyte = forwardRef((props: MicroAnalyteProps, ref) => {
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    inputRef,
    nameRef,
  }));

  const getExpectedRange = (acronym: string) => {
    // Select the correct dataset based on the acronym
    switch (acronym) {
      case "Catalase-Neg":
      case "Catalase-Pos":
        return CAT.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "Esc-Neg":
      case "Esc-Pos":
        return ESC.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "GNR":
      case "GPC":
        return GRAM.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "Ind-Neg":
      case "Ind-Pos":
        return INDOLE.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "E. coli":
      case "E. Faecalis":
      case "K. pneumoniae":
      case "P. aeruginosa":
      case "S. agalactiae":
      case "S. aureus":
      case "S. epidermidis":
      case "S. pyogenes":
        return MONTHLY.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "MUG Neg":
      case "MUG Pos":
        return MUG.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "Oxidase neg":
      case "Oxidase Pos":
        return OXID.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "PYR-Neg":
      case "PYR-Pos":
        return PYR.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "BAP Sterility":
      case "MAC Sterility":
      case "MH Sterility":
        return STER.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      case "Staphaurex Neg":
      case "Staphaurex Pos":
        return STAPH.find((item) => item.analyteAcronym === acronym)?.expectedRange || "N/A";
      default:
        return "Unknown Analyte";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      // Validate input value when Enter is pressed
      if (inputValue === "Positive-Bubbles" || inputValue === "Negative-No Bubbles" || inputValue === "Negative-Fluorescence" || inputValue === "Positive- No Flourescence" || inputValue === "Gram Negative Rod" || inputValue === "Gram Positive Cocci" || inputValue === "Negative-Not Blue" || inputValue === "Positive-Blue") {
        event.currentTarget.classList.add("bg-[#00FF00]"); // Valid input (green)
        event.currentTarget.classList.remove("bg-[#FF0000]"); // Remove red background
      } else {
        event.currentTarget.classList.add("bg-[#FF0000]"); // Invalid input (red)
        event.currentTarget.classList.remove("bg-[#00FF00]"); // Remove green background
      }

      // Pass the value as a string to the parent's handleInputChange function
      props.handleInputChange(inputValue); // Pass the string directly
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputValue(event.target.value); // Update inputValue freely as user types
  };

  return (
    <>
      <div
        className="
          analyte-container sm:w-[24rem] sm:h-[10rem] px-6 sm:space-y-4 w-[24rem] h-[10rem] space-y-3
          bg-[#B4C7E7]
          border-2 border-solid border-[#7F9458] rounded-xl relative
        "
      >
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          className="text-base sm:w-[12rem] sm:h-[4rem] w-[8rem] h-[3rem] absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
          onKeyDown={handleKeyDown}
          onChange={handleChange} // Allow typing any value
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
            Exp Range: {getExpectedRange(props.acronym)} {/* Display the expected range */}
          </div>
        </div>
      </div>
    </>
  );
});

export default MicroAnalyte;
