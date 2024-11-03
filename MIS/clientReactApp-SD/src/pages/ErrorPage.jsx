import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ErrorPage(){
    const navigate = useNavigate();
    const { theme } = useTheme();
    return (
        <>
            <div>Error in processing...</div>
        </>
    )
}