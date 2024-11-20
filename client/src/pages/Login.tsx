import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Backdrop, CircularProgress } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { CredentialsInput } from './Register';
import { AuthToken, UserType, useAuth } from '../context/AuthContext';
import { getAdminByName, getStudentByName } from '../utils/indexedDB/getData';
import { Icon } from "@iconify/react";

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login, checkSession, checkUserType } = useAuth();
  const [loginOptions, setLoginOptions] = useState<"Admin" | "Student" | string>("");
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store the specific error message
  const { register, handleSubmit, formState: { errors } } = useForm<CredentialsInput>();
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    // Check if an account type is selected
    if (!loginOptions) {
      setErrorNotiOpen(true);
      setErrorMessage("Please choose an account type (Admin or Student).");
      return;
    }
    if (loginOptions === "Admin") {
      // const check = await getAdminByName(data.username);
      const sessionCheck = await checkSession();
      if (sessionCheck) {
        navigate("/admin-home");
      }

      setIsLoading(true); // Start loading

      const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/Auth/LoginByUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username: data.username, password: data.password }),
      })

      // const res = await checkServer;
      console.log(checkServer);

      try {
        if (checkServer.status === 200) {
          // Parse the JSON response
          const responseData = await checkServer.json();

          // Extract and structure AuthToken
          const token: AuthToken = {
            jwtToken: responseData.jwtToken,
            userID: responseData.userID,
            roles: responseData.roles,
          };

          const username = responseData.username;
          const initials = responseData.initials;

          localStorage.setItem('token', JSON.stringify(token));
          login(JSON.stringify(token), initials, username, UserType.Admin);
          console.log(localStorage.getItem('token'));
          setIsLoading(false); // Stop loading
          navigate('/admin-home');
          // if ()
        }
        else {
          const errorText = await checkServer.text();
          console.error("Failed to login:", errorText);
          setIsLoading(false); // Stop loading
          setErrorMessage(`Login failed: ${errorText}`);
          setErrorNotiOpen(true); // Show error notification
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log("Error in login", e);
          setIsLoading(false); // Stop loading
          setErrorNotiOpen(true); // Show error notification
          setErrorMessage(`Error fetching user data: ${e.message}`);
        } else {
          console.error("An unknown error occurred", e);
          setIsLoading(false); // Stop loading
          setErrorNotiOpen(true); // Show error notification
          setErrorMessage("An unknown error occurred.");
        }
      }

      // if (check && check.password === data.password) {
      //   login(JSON.stringify({ username: data.username, userType: UserType.Admin, initials: check.initials }), check.initials, data.username, UserType.Admin);
      //   navigate('/admin-home');
      // } else {
      //   console.log(new Error("Invalid credentials"));
      // }
      // console.log(username, type);
    } else if (loginOptions === "Student") {
      //const check = await getStudentByName(data.username);
      try {
        const sessionCheck = await checkSession();
        if (sessionCheck) {
          navigate('/student-home');
        }
        setIsLoading(true); // Start loading

        const checkServer = await fetch(`${process.env.REACT_APP_API_URL}/Auth/LoginByUsername`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ username: data.username, password: data.password }),
        })

        console.log(checkServer);

        if (checkServer.status === 200) {
          // Parse the JSON response
          const responseData = await checkServer.json();

          // Extract and structure AuthToken
          const token: AuthToken = {
            jwtToken: responseData.jwtToken,
            userID: responseData.userID,
            roles: responseData.roles,
          };

          const username = responseData.username;
          const initials = responseData.initials;

          localStorage.setItem('token', JSON.stringify(token));
          login(JSON.stringify(token), initials, username, UserType.Student);
          console.log(localStorage.getItem('token'));
          setIsLoading(false); // Stop loading
          navigate('/student-home');
        }else {
          setIsLoading(false); // Stop loading
          const errorText = await checkServer.text();
          console.error("Failed to Login:", errorText);
          setErrorMessage(`Login failed: ${errorText}`);
          setErrorNotiOpen(true); // Show error notification
        }
      } catch (e) {
        setIsLoading(false); // Stop loading
        console.log("Error logging in: ", e);
      }

      // console.log(check);
      // if (check && check.password === data.password) {
      //   login(JSON.stringify({ username: data.username, userType: UserType.Student, initials: check.initials }), check.initials, data.username, UserType.Student);
      //   navigate('/student-home');
      // } else {
      //   console.log(new Error("Invalid credentials"));
      // }
    } else {
      setIsLoading(false); // Stop loading
      console.log(new Error("Invalid type"));
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

  useEffect(() => {
    //If notification is enabled, disable after 3 seconds
    if (isFeedbackNotiOpen) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);
      }, 30000);
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
          <div className="login-title text-center text-3xl font-semibold">
            Choose Account Type
          </div>
          <div className="user-type flex sm:gap-x-2 box-border">
            <div
              className={`student-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                loginOptions === "Student"
                  ? "border-4 !border-[#2f5597]"
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
                  ? "border-4 !border-[#2f5597]"
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
            {errors.username && <div className="text-red-500">Username is required</div>}
            <input
              type="password"
              className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && <div className="text-red-500">Password is required</div>}
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
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop open={isErrorNotiOpen} onClick={() => {
        setErrorNotiOpen(false);
      }}>
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              {isErrorNotiOpen && (
                <div className="flex flex-col sm:gap-y-2">
                  <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                  <div>{errorMessage}</div> {/* Display the specific error message */}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => setErrorNotiOpen(false)}
                className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>

    </>
  )
}

export default Login