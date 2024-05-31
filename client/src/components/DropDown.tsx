import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export interface DropDownProps {
  options: {
    name: string;
    link: string;
  }[];
  name: string;
}

const DropDown = (props: DropDownProps) => {
  const { theme } = useTheme();
  const [isOpen, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <div className="dropdown-container relative">
      <ButtonBase
        className={`!rounded-lg sm:w-80 sm:h-36 sm:!mt-12 !bg-[${theme.secondaryColor}] relative !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[4px] before:content-[''] before:absolute before:sm:w-full before:sm:h-12 before:left-0 before:top-full`}
        style={{}}
        onClick={handleClick}
        // onMouseEnter={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
      >
        <div className="button-text font-bold text-2xl">{props.name}</div>
      </ButtonBase>
      {isOpen && (
        <div className="dropdown-content absolute sm:w-80 flex flex-col rounded-lg z-10">
          {props.options.map((option, index) => (
            <div
              key={index}
              className={`dropdown-option bg-[${theme.secondaryColor}] grow py-2 px-4 hover:cursor-pointer hover:italic transition ease-in-out delay-100 relative`}
            >
              <Link to={`/${option.link}`}>
                <div className="relative">{option.name}</div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
