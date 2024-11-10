import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Backdrop } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { CredentialsInput } from './Register';
import { AuthToken, UserType, useAuth } from '../context/AuthContext';
import { getAdminByName, getStudentByName } from '../utils/indexedDB/getData';
import { Icon } from '@iconify/react';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const { checkSession, checkUserType, login } = useAuth();
  const [loginOptions, setLoginOptions] = useState<"Admin" | "Student" | string>("");
  const { register, handleSubmit } = useForm<CredentialsInput>();
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    setIsLoggingIn(true);
    if (loginOptions === "Admin") {
      // const check = await getAdminByName(data.username);
      const sessionCheck = await checkSession();
      if (sessionCheck) {
        setIsLoggingIn(false);
        navigate("/admin-home");
      }

      const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/Auth/LoginByUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username: data.username, password: data.password }),
      })

      try {
        if (checkServer.status === 200) {
          const token: AuthToken = await checkServer.json();

          // localStorage.setItem('token', JSON.stringify(token));
          login(JSON.stringify(token), token.userID, UserType.Admin);
          console.log(localStorage.getItem('token'));
          setIsLoggingIn(false);
          navigate('/admin-home');
        }
      } catch(e) {
        console.log("Error in login ", e);
        setIsLoggingIn(false);
      }
    } else if (loginOptions === "Student") {
      try {
        const sessionCheck = await checkSession();
        if (sessionCheck) {
          setIsLoggingIn(false);
          navigate('/student-home');
        }

        const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/Auth/LoginByUsername`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ username: data.username, password: data.password }),
        })

        if (checkServer.status === 200) {
          const token: AuthToken = await checkServer.json();

          // localStorage.setItem('token', JSON.stringify(token));
          login(JSON.stringify(token), token.userID, UserType.Student);
          console.log(localStorage.getItem('token'));
          setIsLoggingIn(false);
          navigate('/student-home');
        }
      } catch (e) {
        console.log("Error logging in: ", e);
        setIsLoggingIn(false);
      }
    } else {
      console.log(new Error("Invalid type"));
      setIsLoggingIn(false);
    }
  }

  async function checkCurrentSession() {
    const session = await checkSession();

    if (session) {
      if (checkUserType() === UserType.Student) {
        navigate('/student-home');
      } else if (checkUserType() === UserType.Admin) {
        navigate('/admin-home');
      }
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    checkCurrentSession();
  }, [])

  return (
    <>
      <div
        className="relative flex flex-col w-svw bg-black pb-12 bg-no-repeat bg-center bg-contain"
        style={{ minHeight: "100svh", minWidth: "100svw", backgroundImage: "url('(MIS)-MidiSims-Main icon_ Login Slide 2.png')" }}
      >
        <img src="(MIS)-Logo-Horizontal.png" alt="" className='absolute sm:w-48 sm:-top-10'/>
        <div
          className="title w-fit mb-0 mx-auto mt-28 bg-[#3a6cc6] px-12"
          style={{ maxWidth: "66.67%" }}
        >
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">
            Medical Information Simulations
          </div>
        </div>
        <div className="login-form sm:w-1/4 w-3/4 mb-0 mt-24 mx-auto bg-slate-100/80 flex flex-col gap-4 py-10 px-4 bg-local bg-cover">
          <div className="login-title text-center text-3xl font-semibold">
            Choose Account Type
          </div>
          <div className="user-type flex sm:gap-x-2 box-border">
            <div
              className={`student-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                loginOptions === "Student"
                  ? "border-2 !border-[#2f5597]"
                  : ""
              }`}
              onClick={() => {
                setLoginOptions((prevState) =>
                  prevState === "Student" ? "" : "Student"
                );
              }}
            >
              <img src="/student-icon.png" alt="" />
              <div className="self-center font-semibold text-xl">Student</div>
            </div>
            <div
              className={`admin-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                loginOptions === "Admin"
                  ? "border-2 !border-[#2f5597]"
                  : ""
              }`}
              onClick={() => {
                setLoginOptions((prevState) =>
                  prevState === "Admin" ? "" : "Admin"
                );
              }}
            >
              <img src="/admin-icon.png" alt="" />
              <div className="self-center font-semibold text-xl">Admin</div>
            </div>
          </div>
          <form
            action=""
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
              placeholder="Username"
              {...register("username", { required: true })}
            />
            <input
              type="password"
              className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <Button
              variant="outlined"
              onClick={handleSubmit(onSubmit)}
              className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
            >
              { isLoggingIn ? (<Icon icon="eos-icons:three-dots-loading" />) : "Login" }
            </Button>
          </form>
          <div className="register-link">
            <div className="register-link-text text-center hover:cursor-pointer text-blue-400" onClick={() => navigate("/register")}>
              Don't have an account?
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login