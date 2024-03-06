import React, { useState } from 'react'
import { ButtonBase } from '@mui/material'

export interface DropDownProps {
    options: string[];
}

const DropDown = (props: DropDownProps) => {
    const [isOpen, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleDropdown = () => {
        setOpen(!isOpen);
    };

    const handleMouseEnter = () => {
        setOpen(true);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
        setIsHovered(false);
    };

    const handleClick = () => {
        setOpen(!isOpen);
    };

    return (
        <div className="dropdown-container relative">
            <ButtonBase 
                className='!rounded-lg sm:w-80 sm:h-36 sm:!my-12 !bg-[#dae3f3] !border-[1px] !border-solid !border-[#47669C] transition ease-in-out hover:!bg-[#8faadc] hover:!border-[#2F528F] hover:!border-[4px]'
                style={{}}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="button-text font-bold text-2xl">
                    Results In Progress
                </div>
            </ButtonBase>
            {isOpen && (
            <div className="dropdown-content absolute">
                {props.options.map((option, index) => (
                <div key={index} className="dropdown-option">
                    {option}
                </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default DropDown