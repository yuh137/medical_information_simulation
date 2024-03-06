import React from 'react'

interface NavBarPropsTypes {
    name: string;
}

const NavBar = (props: NavBarPropsTypes) => {
  return (
    <>
        <div className='container bg-[#3a6cc6] relative' style={{ minWidth: '100svw', minHeight: '75px' }}>
            <div className="navbar-title leading-loose text-center text-white font-bold text-4xl my-0 mx-auto">{props.name}</div>
        </div>
    </>
  )
}

export default NavBar