import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { renderSubString } from "../utils/utils";
 
export interface AnalyteProps {
  name: string;                  // Name of the analyte
  acronym: string;               // Acronym for the analyte
  electro?: boolean;             // Optional: if it's an electrochemical analyte
  expected_range: string[];      // Array of expected values for validation
  measUnit: string;              // Measurement unit for the analyte
  selectedExpectedRange?: string[];
  handleInputChange: (value: string) => void; // Function to handle input changes
}
 
const QualitativeAnalyte = forwardRef((props: AnalyteProps, ref) => {
  const [inputValue, setInputValue] = useState(''); // State for the input value
  const inputRef = useRef<HTMLInputElement>(null);   // Ref for the input element
  const nameRef = useRef<HTMLDivElement>(null);      // Ref for the analyte name element
 
  // Expose refs to parent components
  useImperativeHandle(ref, () => ({
    inputRef,
    nameRef,
  }));
 
  return (
    <>
      <div className="analyte-container sm:w-56 sm:h-fit px-4 sm:space-y-3 w-48 space-y-2 bg-[#B4C7E7] border-2 border-solid border-[#7F9458] rounded-xl relative">
      <input
        type="text"
        ref={inputRef}
        value={inputValue}                      // Controlled input value
        className="text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
        onChange={(event) => {
          const newInput = event.target.value.trim(); // Get user input
          setInputValue(newInput); // Update the local state with current input value
          
          // Check if the input matches any expected range
          if (!(props.selectedExpectedRange || []).includes(newInput)) {
            event.target.classList.remove("bg-[#00FF00]"); // Invalid input
            event.target.classList.add("bg-[#FF0000]");    // Set red background
          } else {
            event.target.classList.remove("bg-[#FF0000]"); // Valid input
            event.target.classList.add("bg-[#00FF00]");    // Set green background
          }

          // Optionally call the parent function here if you need it on every change
          props.handleInputChange(newInput);
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {          // Check if Enter key is pressed
            event.preventDefault();              // Prevent default behavior
            props.handleInputChange(inputValue); // Call parent function with the final value on Enter
          }
        }}
      />
        <div
          className="analyte-acronym text-2xl font-semibold"
          dangerouslySetInnerHTML={{ __html: renderSubString(props.acronym) }} // Render acronym
          ref={nameRef} // Attach ref for DOM manipulation
        />
        <div className="analyte-desc">
          <div className="analyte-name peer text-base truncate">{props.name}</div>
          <div className="absolute invisible transition-all ease-in delay-100 peer-hover:visible text-white text-sm bg-slate-500 max-sm:text-center border border-solid border-gray-300 rounded-lg p-2">{props.name}</div>
          <div className="analyte-range text-xs">
            Range: {(props.selectedExpectedRange || []).join(", ")}
          </div>
        </div>
      </div>
    </>
  );
});
 
export default QualitativeAnalyte;
 
 

// import React, { forwardRef, useState, useRef, useImperativeHandle } from "react";
// import { renderSubString } from "../utils/utils";

// export interface AnalyteProps {
//   name: string;
//   acronym: string;
//   expectedRanges: string[];  // Add expectedRanges here
//   measUnit: string;  // Add measUnit here
//   selectedExpectedRange?: string[];
//   handleInputChange: (value: string) => void;
// }

// export const QualitativeAnalyte = forwardRef((props: AnalyteProps, ref) => {
//   const [inputValue, setInputValue] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);
//   const nameRef = useRef<HTMLDivElement>(null);

//   useImperativeHandle(ref, () => ({
//     inputRef,
//     nameRef,
//   }));

//   const validateInput = (value: string) => {
//     if (props.expectedRanges.includes(value)) {
//       inputRef.current?.classList.add("bg-[#00FF00]");
//       inputRef.current?.classList.remove("bg-[#FF0000]");
//     } else {
//       inputRef.current?.classList.add("bg-[#FF0000]");
//       inputRef.current?.classList.remove("bg-[#00FF00]");
//     }
//   };

//   return (
//     <div className="analyte-container sm:w-56 sm:h-fit px-4 sm:space-y-3 w-48 space-y-2 bg-[#B4C7E7] border-2 border-solid border-[#7F9458] rounded-xl relative">
//       <input
//         type="text"
//         ref={inputRef}
//         value={inputValue}
//         className="text-base sm:w-[4.5rem] sm:h-10 w-16 h-8 absolute rounded-lg text-center top-0 right-0 border border-solid border-[#7F9458]"
//         onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
//           if (event.key === "Enter") {
//             event.preventDefault();
//             validateInput(event.currentTarget.value);
//             setInputValue(event.currentTarget.value);
//             props.handleInputChange(event.currentTarget.value);
//           }
//         }}
//         onChange={event => {
//           event.preventDefault();
//           const newValue = event.target.value;
//           setInputValue(newValue);
//           validateInput(newValue);
//         }}
//       />
//       <div className="analyte-acronym text-2xl font-semibold" dangerouslySetInnerHTML={{ __html: renderSubString(props.acronym) }} ref={nameRef} />
//       <div className="analyte-desc">
//         <div className="analyte-name peer text-base truncate">{props.name}</div>
//         <div className="absolute invisible transition-all ease-in delay-100 peer-hover:visible text-white text-sm bg-slate-500 max-sm:text-center border border-solid border-gray-300 rounded-lg p-2">{props.name}</div>
//         <div className="analyte-range text-xs">
//           Range: {props.expectedRanges.join(", ")}
//         </div>
//       </div>
//     </div>
//   );
// });

// export default QualitativeAnalyte;
