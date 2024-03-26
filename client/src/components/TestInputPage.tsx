import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import NavBar from './NavBar';

const TestInputPage = (props: { name: string, link: string }) => {
    const navigate = useNavigate();
    const { checkSession,checkUserType } = useAuth();

    useEffect(() => {
        if (!checkSession() || checkUserType() === 'student') navigate('/unauthorized');
    }, [])

    return (
        <>
            <NavBar name={`${props.name} QC Builder`} />
            <div className="basic-container">

            </div>
        </>
    )
}

export default TestInputPage