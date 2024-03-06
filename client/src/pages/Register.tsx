import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <>
      <div className="container flex flex-col w-svw bg-[#2f5597]" style={{ minHeight: "100svh", minWidth: "100svw" }}>
        <div className="title w-fit mb-0 mx-auto mt-28 bg-[#3a6cc6] px-12" style={{ maxWidth: "66.67%" }}>
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">Medical Information Simulations</div>
        </div>
        <div className="login-form sm:w-1/4 w-3/4 mb-0 mt-24 mx-auto bg-slate-100 flex flex-col gap-4 py-10 px-4 bg-local bg-cover" style={{ backgroundImage: "url('')" }}>
          <div className="login-title text-center text-3xl font-semibold">Sign up</div>
          <form action="" className='flex flex-col gap-6'>
            {/* <TextField variant='outlined' /> */}
            <input type="text" className='min-h-10 placeholder:font-semibold placeholder:text-center text-center' placeholder='Username' />
            <input type="text" className='min-h-10 placeholder:font-semibold placeholder:text-center text-center'  placeholder='Password' />  
          </form>
          <div className="login-link">
            <Link to='/login'>
              <div className="login-link-text text-center text-blue-400 ">Already have an account?</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register