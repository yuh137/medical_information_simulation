import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { renderSubString } from "../utils/utils";

export interface ReagentProps {
  reagentName: string,
  Abbreviation: string,
  AntiSeraLot: string,
  reagentExpDate: string,
  ExpImmSpinRange: string,
  Exp37Range: string,
  ExpAHGRange: string,
  ExpCheckCellsRange: string
  handleInputChange: (value: string) => void;
}

const Reagent = forwardRef((props: ReagentProps, ref) => {
  const Positive =['1+','2+','3+','4+'];
  const Negative = ['0']
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
            Reagent-container sm:w-56 sm:h-fit px-4 sm:space-y-3 w-48 space-y-2
            bg-[#B4C7E7]
            border-2 border-solid border-[#7F9458] rounded-xl relative
        `}
      >
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          className="text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const newInput = (+inputValue).toFixed(2).replace(/^0+(?!\.|$)/, "");

              // console.log(+event.currentTarget.value);
              // if (
              //   isNaN(+event.currentTarget.value) ||
              //   +event.currentTarget.value < +props.min_level ||
              //   +event.currentTarget.value > +props.max_level
              // ) {
              //   event.currentTarget.classList.remove("bg-[#00FF00]");
              //   event.currentTarget.classList.add("bg-[#FF0000]");
              // } else {
              //   event.currentTarget.classList.remove("bg-[#FF0000]");
              //   event.currentTarget.classList.add("bg-[#00FF00]");
              // }

              setInputValue(newInput);
              props.handleInputChange(event.currentTarget.value);
            }
          }}
          // onChange={(event) => props.handleInputChange(event.target.value)}
          onChange={event => {
            event.preventDefault();
            const newValue = event.target.value;

            const isValid = /^\d*\.?\d*$/.test(newValue);
            if (isValid) {
              setInputValue(newValue);
            }
          }}
        />
        <div
          className="Reagent-acronym text-2xl font-semibold"
          dangerouslySetInnerHTML={{ __html: renderSubString(props.Abbreviation) }}
          ref={nameRef}
        />
        <div className="ananlyte-desc">
          <div className="Reagent-name peer text-base truncate">{props.reagentName}</div>
          <div className="absolute invisible transition-all ease-in delay-100 peer-hover:visible text-white text-sm bg-slate-500 max-sm:text-center border border-solid border-gray-300 rounded-lg p-2">{props.reagentName}</div>
          <div className="Reagent-range text-xs">
            {/* {props.level === 1 || props.level === 2 ? `Level ${props.level === 1 ? "I" : "II"} range: ${props.min_level} -${" "}
            ${props.max_level} ${props.measUnit}` : `Range: ${props.min_level} -${" "} ${props.max_level} ${props.measUnit}`} */}
            Range: 1-4+
            {/* {props.min_level} - {props.max_level} {props.measUnit} */}
          </div>
        </div>
      </div>
    </>
  );
});

export default Reagent;
