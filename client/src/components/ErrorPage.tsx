import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext';

const ErrorPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    return (
        <>
            <div>Error 404</div>
            <button className={`border border-solid border-[${theme.primaryBorderColor}] bg-[${theme.primaryColor}] px-4 py-3 text-white font-semibold text-xl rounded-xl transition delay-75 hover:scale-110`} onClick={() => navigate("/login")}>Go back to login page</button>
        </>
    )
}

export default ErrorPage