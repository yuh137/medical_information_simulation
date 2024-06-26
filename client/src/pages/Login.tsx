import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Backdrop } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { CredentialsInput } from './Register';
import { UserType, useAuth } from '../context/AuthContext';
import { getAdminByName, getStudentByName } from '../utils/indexedDB/getData';

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login, checkSession } = useAuth();
  const [loginOptions, setLoginOptions] = useState<"Admin" | "Student" | string>("");
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);
  const { register, handleSubmit } = useForm<CredentialsInput>();
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    if (loginOptions === "Admin") {
      const check = await getAdminByName(data.username);

      if (check && check.password === data.password) {
        login(JSON.stringify({ username: data.username, userType: UserType.Admin, initials: check.initials }), check.initials, data.username, UserType.Admin);
        navigate('/home');
      } else {
        console.log(new Error("Invalid credentials"));
      }
      // console.log(username, type);
    } else if (loginOptions === "Student") {
      const check = await getStudentByName(data.username);

      // console.log(check);
      if (check && check.password === data.password) {
        login(JSON.stringify({ username: data.username, userType: UserType.Student, initials: check.initials }), check.initials, data.username, UserType.Student);
        navigate('/home');
      } else {
        console.log(new Error("Invalid credentials"));
      }
    } else {
      console.log(new Error("Invalid type"));
    }
  }

  useEffect(() => {
    if (checkSession()) {
      navigate('/home');
    }
  }, [])

  useEffect(() => {
    //If notification is enabled, disable after 3 seconds
    if (isFeedbackNotiOpen) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);
      }, 3000);
    }
  }, [isFeedbackNotiOpen])

  return (
    <>
      <div
        className=" flex flex-col w-svw bg-[#2f5597] pb-12"
        style={{ minHeight: "100svh", minWidth: "100svw" }}
      >
        <div
          className="title w-fit mb-0 mx-auto mt-28 bg-[#3a6cc6] px-12"
          style={{ maxWidth: "66.67%" }}
        >
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">
            Medical Information Simulations
          </div>
        </div>
        <div className="login-form sm:w-1/4 w-3/4 mb-0 mt-24 mx-auto bg-slate-100 flex flex-col gap-4 py-10 px-4 bg-local bg-cover">
          {/* {!loginOptions && (
            <div className="option-buttons flex flex-col sm:space-y-4">
              <Button
                variant="outlined"
                className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
                onClick={() => {
                  setLoginOptions("Admin");
                }}
              >
                Login as Admin
              </Button>
              <Button
                variant="outlined"
                className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
                onClick={() => {
                  setLoginOptions("Student");
                }}
              >
                Login as Student
              </Button>
            </div>
          )} */}
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
            {/* <TextField variant='outlined' /> */}
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
              Login
            </Button>
          </form>
          <div className="register-link">
            <Link to="/register">
              <div className="register-link-text text-center text-blue-400 ">
                Don't have an account?
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login