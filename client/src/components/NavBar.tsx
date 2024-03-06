import React from 'react'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom'
import { ButtonBase } from '@mui/material';

interface NavBarPropsTypes {
    name: string;
}

const NavBar = (props: NavBarPropsTypes) => {
  return (
    <>
        <div className='container bg-[#3a6cc6] relative' style={{ minWidth: '100svw', minHeight: '10svh' }}>
            <div className="navbar-title leading-loose text-center text-white font-bold text-4xl my-0 mx-auto">{props.name}</div>
            <div className="home-icon">
              <Link to='/home'>
                <Icon icon='material-symbols:home' className='absolute p-1 text-white text-5xl top-[20%] right-6 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md'/>
              </Link>
            </div>
        </div>
    </>
  )
}

export default NavBar