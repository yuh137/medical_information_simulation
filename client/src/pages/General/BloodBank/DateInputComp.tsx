import React from "react";
import { useFormContext } from "react-hook-form";

// Define types for props
interface DateInputProps {
  label: string;
  name: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, name }) => {
  const { setValue } = useFormContext(); // Get setValue from react-hook-form

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    if (input.length >= 3 && input.length <= 4) {
      input = input.slice(0, 2) + "/" + input.slice(2); // Insert first "/"
    } else if (input.length >= 5) {
      input = input.slice(0, 2) + "/" + input.slice(2, 4) + "/" + input.slice(4); // Insert second "/"
    }

    e.target.value = input; // Update input field
    setValue(name, input); // Set formatted date in the form state
  };

  return (
    <div className="lotnumber-input flex flex-col items-center py-2 bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
      <div className="lotnumber-label sm:text-xl font-semibold text-white">{label}</div>
      <input
        type="text"
        placeholder="mm/dd/yyyy"
        maxLength={10} // Limits input to mm/dd/yyyy format
        onChange={handleDateChange}
        className="p-1 rounded-lg border border-solid border-[#548235] sm:w-[170px] text-center"
      />
    </div>
  );
};

export default DateInput;
