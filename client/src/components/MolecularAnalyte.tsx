import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { Analyte, QualitativeMolecularQCTemplateBatchAnalyte, QualitativeViralLoadRangeMolecularQCTemplateBatchAnalyte, AnalyteReportType } from "../utils/indexedDB/IDBSchema";
import { renderSubString } from "../utils/utils";


export interface AnalyteProps {
	analyte: Analyte;
	focus: boolean;
	value: string
	handleInputChange: (value: string) => void;
}


const MolecularAnalyte = forwardRef((props: AnalyteProps, ref) => {
	const [inputValue, setInputValue] = useState('');
	const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
	const nameRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		inputRef,
		nameRef,
	}));


	let analyteFooter;
	if (props.analyte.type === 'QualitativeAnalyte') {
		analyteFooter = `Exp Range: ${props.analyte.expectedRange}`;
	}
	else {
		analyteFooter = `Range: ${props.analyte.minLevel} - ${props.analyte.maxLevel} ${props.analyte.unitOfMeasure}`;
	}


	return (
		<>
			<div
				className={`
            analyte-container sm:w-56 sm:h-fit px-4 sm:space-y-3 w-48 space-y-2
            bg-[#B4C7E7]
            border-2 border-solid border-[#7F9458] rounded-xl relative
        `}
			>
				{props.analyte.type === "QuanitativeAnalyte" ?
					<input
						type="text"
						ref={inputRef as React.Ref<HTMLInputElement>}
						value={inputValue}
						className="text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
						autoFocus={props.focus}
						onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
							let newInput = inputValue;
							if ((event.key === "Enter") || (event.key === "Tab")) {
								event.preventDefault();
								let minLevel = -1;
								if (props.analyte.minLevel) {
									minLevel = props.analyte.minLevel;
								}
								let maxLevel = -1;
								if (props.analyte.maxLevel) {
									maxLevel = props.analyte.maxLevel;
								}
								newInput = (+inputValue).toFixed(2).replace(/^0+(?!\.|$)/, "");
								if (
									isNaN(+event.currentTarget.value) ||
									+event.currentTarget.value < minLevel ||
									+event.currentTarget.value > maxLevel
								) {
									event.currentTarget.classList.remove("bg-[#00FF00]");
									event.currentTarget.classList.add("bg-[#FF0000]");
								} else {
									event.currentTarget.classList.remove("bg-[#FF0000]");
									event.currentTarget.classList.add("bg-[#00FF00]");
								}
								setInputValue(newInput);
								props.handleInputChange(event.currentTarget.value);
							}
						}}
						onChange={event => {
							event.preventDefault();
							const newValue = event.target.value;
							setInputValue(newValue);
						}}
					/>
					:

					<select
						ref={inputRef as React.Ref<HTMLSelectElement>}
						className="text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
						value={inputValue}
						autoFocus={props.focus}
						onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
							if (((event.target.value === 'Present') && (props.analyte.expectedRange === 'Present')) || ((event.target.value === 'Not Detected') && (props.analyte.expectedRange === 'Not Detected'))) {
								event.target.classList.remove("bg-[#FF0000]");
								event.target.classList.add("bg-[#00FF00]");
							}
							else {
								event.target.classList.remove("bg-[#00FF00]");
								event.target.classList.add("bg-[#FF0000]");
							}
							setInputValue(event.target.value);
							props.handleInputChange(event.currentTarget.value);
						}}
					>
						<option value="" disabled>Select Value</option>
						<option value="Present">Present</option>
						<option value="Not Detected">Not Detected</option>
					</select>
				}
				<div
					className="analyte-acronym text-2xl font-semibold"
					dangerouslySetInnerHTML={{ __html: renderSubString(props.analyte.analyteAcronym) }}
					ref={nameRef}
				/>
				<div className="ananlyte-desc">
					<div className="analyte-name peer text-base truncate">{props.analyte.analyteName}</div>
					<div className="analyte-range text-xs">
						{analyteFooter}
					</div>
				</div>
			</div>
		</>
	);
});

export default MolecularAnalyte;
