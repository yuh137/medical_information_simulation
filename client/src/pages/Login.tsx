import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Backdrop, CircularProgress } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { CredentialsInput } from './Register';
import { AuthToken, UserType, useAuth } from '../context/AuthContext';
import { Icon } from "@iconify/react";

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { checkSession, checkUserType, login } = useAuth();
  const [loginOptions, setLoginOptions] = useState<"Admin" | "Student" | string>("");
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [isSuccessNotiOpen, setSuccessNotiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("TBD");
  const { register, handleSubmit } = useForm<CredentialsInput>();

  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    setIsLoading(true);
    try {
      if (!loginOptions) {
        setErrorMsg("Please select an account type");
        setErrorNotiOpen(true);
        return;
      }

      const endpoint = `${process.env.REACT_APP_API_URL}/Auth/LoginByUsername`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username: data.username, password: data.password }),
      });

      if (response.status === 200) {
        const token: AuthToken = await response.json();
        localStorage.setItem('token', JSON.stringify(token));
        login(JSON.stringify(token), token.userID, loginOptions === "Admin" ? UserType.Admin : UserType.Student);

        setSuccessNotiOpen(true);
        setTimeout(() => {
          navigate(loginOptions === "Admin" ? '/admin-home' : '/student-home');
        }, 3000);
      } else {
        setErrorMsg("Invalid username or password");
        setErrorNotiOpen(true);
      }
    } catch (e) {
      console.error("Error during login:", e);
      setErrorMsg("Login failed due to a server error");
      setErrorNotiOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  async function checkCurrentSession() {
    const session = await checkSession();
    if (session) {
      navigate(checkUserType() === UserType.Admin ? '/admin-home' : '/student-home');
    }
  }

  useEffect(() => {
    checkCurrentSession();
  }, []);

  useEffect(() => {
    if (isErrorNotiOpen) {
      setTimeout(() => setErrorNotiOpen(false), 4000);
    }
  }, [isErrorNotiOpen]);

  useEffect(() => {
    if (isFeedbackNotiOpen) {
      setTimeout(() => setFeedbackNotiOpen(false), 3000);
    }
  }, [isFeedbackNotiOpen]);

  return (
    <>
      <div
        className="flex flex-col w-svw bg-[#2f5597] pb-12"
        style={{ minHeight: "100svh", minWidth: "100svw" }}
      >
        <div className="title w-fit mb-0 mx-auto mt-8 bg-[#3a6cc6] px-12">
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">
            Medical Information Simulations
          </div>
        </div>
        <div className="login-form sm:w-1/4 w-3/4 mb-0 mt-8 mx-auto bg-slate-100 flex flex-col gap-4 py-10 px-4">
          <div className="login-title text-center text-3xl font-semibold">Choose Account Type</div>
          <div className="user-type flex sm:gap-x-2 box-border">
            <div
              className={`student-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                loginOptions === "Student" ? "border-4 !border-[#2f5597]" : ""
              }`}
              onClick={() => setLoginOptions((prevState) => (prevState === "Student" ? "" : "Student"))}
            >
              <img src="/student-icon.png" alt="Student" />
              <div className="self-center font-semibold text-xl">Student</div>
            </div>
            <div
              className={`admin-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                loginOptions === "Admin" ? "border-4 !border-[#2f5597]" : ""
              }`}
              onClick={() => setLoginOptions((prevState) => (prevState === "Admin" ? "" : "Admin"))}
            >
              <img src="/admin-icon.png" alt="Admin" />
              <div className="self-center font-semibold text-xl">Admin</div>
            </div>
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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
              disabled={isLoading}
              className={`!text-black ${
                isLoading ? "opacity-50" : ""
              } !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition hover:!bg-[${theme.primaryHoverColor}]`}
            >
              {isLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
          <div className="register-link">
            <Link to="/register">
              <div className="register-link-text text-center text-blue-400 text-xl">Don't have an account?</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <Backdrop open={isSuccessNotiOpen}>
        <div className="bg-white rounded-xl p-8">
          <div className="text-center text-gray-600 text-xl font-semibold">
            <Icon icon="material-symbols:check-circle-outline" className="text-green-500 w-20 h-20 mb-4" />
            <div>Login Successful! Redirecting...</div>
          </div>
        </div>
      </Backdrop>

      {/* Error Notification */}
      <Backdrop open={isErrorNotiOpen} onClick={() => setErrorNotiOpen(false)}>
        <div className="bg-white rounded-xl p-8">
          <div className="text-center text-gray-600 text-xl font-semibold">
            <Icon icon="material-symbols:cancel-outline" className="text-red-500 w-20 h-20 mb-4" />
            <div>{errorMsg}</div>
          </div>
          <Button
            variant="contained"
            onClick={() => setErrorNotiOpen(false)}
            className={`!text-white !bg-[${theme.primaryColor}] hover:!bg-[${theme.primaryHoverColor}]`}
          >
            OK
          </Button>
        </div>
      </Backdrop>
    </>
  );
};

export default Login;