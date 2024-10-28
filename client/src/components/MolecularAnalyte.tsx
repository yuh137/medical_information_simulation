import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { MolecularQCTemplateBatchAnalyte, QualitativeMolecularQCTemplateBatchAnalyte, QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte, ReportType } from "../utils/indexedDB/IDBSchema";


export interface AnalyteProps {
	analyte: MolecularQCTemplateBatchAnalyte;
  handleInputChange: (value: string) => void;
}


const MolecularAnalyte = forwardRef((props: AnalyteProps, ref) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    inputRef,
    nameRef,
  }));


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
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const numericInputVal = (+inputValue).toFixed(2).replace(/^0+(?!\.|$)/, "");
							if (props.analyte.reportType === ReportType.QualitativeViralLoadRange) {
								const viralLoadRangeAnalyte = props.analyte as QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte;
								if (
									isNaN(+event.currentTarget.value) ||
									+event.currentTarget.value < +viralLoadRangeAnalyte.minLevel ||
									+event.currentTarget.value > +viralLoadRangeAnalyte.maxLevel
								) {
									event.currentTarget.classList.remove("bg-[#00FF00]");
									event.currentTarget.classList.add("bg-[#FF0000]");
								} else {
									event.currentTarget.classList.remove("bg-[#FF0000]");
									event.currentTarget.classList.add("bg-[#00FF00]");
								}
							}
							else if (props.analyte.reportType === ReportType.Qualitative) {
							const qualitativeAnalyte = props.analyte as QualitativeMolecularQCTemplateBatchAnalyte;
								if (((event.currentTarget.value === 'Present') && (qualitativeAnalyte.expectedRange === 'Present')) || ((event.currentTarget.value === 'Not Detected') && (qualitativeAnalyte.expectedRange === 'Not Detected'))) {
									
									event.currentTarget.classList.remove("bg-[#FF0000]");
									event.currentTarget.classList.add("bg-[#00FF00]");
								}
								else {
									event.currentTarget.classList.remove("bg-[#00FF00]");
									event.currentTarget.classList.add("bg-[#FF0000]");
								}
							}
              setInputValue(newInput);
              props.handleInputChange(event.currentTarget.value);
            }
          }}
          onChange={event => {
            event.preventDefault();
            const newValue = event.target.value;
            const isValid = /^\d*\.?\d*$/.test(newValue) || (newValue === 'Present') || (newValue === 'Not Detected');
            if (isValid) {
              setInputValue(newValue);
            }
          }}
        />
        <div
          className="analyte-acronym text-2xl font-semibold"
          dangerouslySetInnerHTML={{ __html: renderSubString(props.analyte.analyteAcronym) }}
          ref={nameRef}
        />
        <div className="ananlyte-desc">
          <div className="analyte-name peer text-base truncate">{props.analyte.analyteName}</div>
          <div className="analyte-range text-xs">
						{props.ananlyte.reportType === ReportType.Qualitative ? `Exp Range: ${props.analyte.expectedRange}` : `Range: ${props.analyte.minLevel} - ${props.analyte.maxLevel} ${props.analyte.measUnit}`}
					</div>
        </div>
      </div>
    </>
	);
});

export default MolecularAnalyte;
