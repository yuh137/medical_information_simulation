import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Backdrop } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import addData from "../utils/indexedDB/addData";
import { generateRandomId } from "../utils/utils";
import { Admin } from "../utils/indexedDB/IDBSchema";
import { getAdminByName, getStudentByName } from "../utils/indexedDB/getData";
import { Icon } from "@iconify/react";

export interface CredentialsInput {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  initials: string;
  registrationKey: string;
}

const Register = () => {
  const { theme } = useTheme();
  const [registerOptions, setRegisterOptions] = useState<
    "Admin" | "Student" | string
  >("");
  const [isSuccessNotiOpen, setSuccessNotiOpen] = useState(false);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store the specific error message

  
  useEffect(() => {
    // Close notifications after 3 seconds
    if (isSuccessNotiOpen || isErrorNotiOpen) {
      setTimeout(() => {
        setSuccessNotiOpen(false);
        setErrorNotiOpen(false);
      }, 100000);
    }
  }, [isSuccessNotiOpen, isErrorNotiOpen]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CredentialsInput>();

  //Register form logic handling
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    // Validate Registration Key
    if (registerOptions === "Admin" && data.registrationKey !== "Admin24") {
      setErrorMessage("Invalid Registration Key for Admin.");
      setErrorNotiOpen(true);
      return;
    }
 
    if (registerOptions === "Student" && data.registrationKey !== "Student42") {
      setErrorMessage("Invalid Registration Key for Student.");
      setErrorNotiOpen(true);
      return;
    }
 
    if (!registerOptions) {
      setErrorMessage("Please choose an account type (Admin or Student).");
      setErrorNotiOpen(true);
      return;
    }

    let usernameExists = false;
  
    // Choose the appropriate API endpoint based on registerOptions
    const endpoint = registerOptions === "Admin" ? "Admins" : "Students";
    
    try {
      // Fetch all users from the selected endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("fetched data from sql database");
        const users = await response.json() as CredentialsInput[]; // Assuming response matches CredentialsInput format

        // Check if the username exists in the fetched data
        usernameExists = users.some(user => user.username === data.username);

        if (usernameExists) {
          console.log("Username already exists");
          setErrorNotiOpen(true); // Show error notification
          setErrorMessage("Username already exists. Please choose a different one.");
          return;
        }
      } else {
        const errorText = await response.text();
        console.error(errorText);
        setErrorNotiOpen(true); // Show error notification
        setErrorMessage(`Failed to fetch users: ${errorText}`);
        return;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
     // setErrorMessage(`Error fetching user data: ${error.message}`);
      setErrorNotiOpen(true); // Show error notification
      
      return;
    }

    // Proceed with registration if username does not exist
    const user = { ...data, roles: [registerOptions] };
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/Auth/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        console.log("Registration successful");
        setSuccessNotiOpen(true); // Show success notification
      } else {
        const errorText = await res.text();
        console.error("Failed to register:", errorText);
        setErrorMessage(`Registration failed: ${errorText}`);
        setErrorNotiOpen(true); // Show error notification
      }
    } catch (e) {
      console.error("Failed to register:", e);
     // setErrorMessage(`Failed to register: ${e.message}`);
      setErrorNotiOpen(true); // Show error notification
    }
  };
  
  

  return (
    <>
      <div className="flex flex-col w-svw bg-[#2f5597] pb-12" style={{ minHeight: "100svh", minWidth: "100svw" }}>
        <div className="title w-fit mb-0 mx-auto mt-28 bg-[#3a6cc6] px-12" style={{ maxWidth: "66.67%" }}>
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">
            Medical Information Simulations
          </div>
        </div>
        <div className="register-form sm:w-1/4 w-3/4 mb-0 mt-24 mx-auto bg-slate-100 flex flex-col gap-4 py-10 px-4 bg-local bg-cover">
          <div className="register-form-container rounded-xl sm:space-y-2">
            <div className="login-title text-center sm:text-2xl font-semibold">Choose Account Type</div>
            <div className="user-type flex sm:gap-x-2 box-border">
              <div
                className={`student-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                  registerOptions === "Student" ? "border-4 !border-[#2f5597]" : ""
                }`}
                onClick={() => setRegisterOptions(registerOptions === "Student" ? "" : "Student")}
              >
                <img src="/student-icon.png" alt="" />
                <div className="self-center font-semibold text-xl">Student</div>
              </div>
              <div
                className={`admin-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                  registerOptions === "Admin" ? "border-4 !border-[#2f5597]" : ""
                }`}
                onClick={() => setRegisterOptions(registerOptions === "Admin" ? "" : "Admin")}
              >
                <img src="/admin-icon.png" alt="" />
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
              {errors.username && <div className="text-red-500">Username is required</div>}
              <input
                type="password"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && <div className="text-red-500">Password is required</div>}
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              {errors.email && <div className="text-red-500">Email is required</div>}
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="First Name"
                {...register("firstname", { required: true })}
              />
              {errors.firstname && <div className="text-red-500">First Name is required</div>}
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Last Name"
                {...register("lastname", { required: true })}
              />
              {errors.lastname && <div className="text-red-500">Last Name is required</div>}
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Initials"
                {...register("initials", { required: true })}
              />

              {errors.initials && <div className="text-red-500">Initials are required</div>}
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Registration Key"
                {...register("registrationKey", { required: true })}
              />
              
              {errors.initials && <div className="text-red-500">Registration Key is required</div>}
              <Button
                variant="outlined"
                onClick={handleSubmit(onSubmit)}
                className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
              >
                Register
              </Button>
            </form>
          </div>
          <div className="login-link">
            <Link to="/login">
            <div className="login-link-text text-center text-blue-400 ">
                Already have an account?
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Backdrop open={isSuccessNotiOpen || isErrorNotiOpen} onClick={() => {
      setSuccessNotiOpen(false);
      setErrorNotiOpen(false);
    }}>
      <div className="bg-white rounded-xl">
        <div className="sm:p-8 flex flex-col sm:gap-4">
          <div className="text-center text-gray-600 text-xl font-semibold">
            {isSuccessNotiOpen ? (
              <>
                <div className="flex flex-col sm:gap-y-2">
                  <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                  <div>Registration Successful</div>
                </div>
              </>
            ) : isErrorNotiOpen ? (
              <>
                <div className="flex flex-col sm:gap-y-2">
                  <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                  <div>{errorMessage}</div> {/* Display the specific error message */}
                </div>
              </>
            ) : null}
          </div>
          <div className="flex justify-center">
            <Button
              variant="contained"
              onClick={() => {
                setSuccessNotiOpen(false);
                setErrorNotiOpen(false);
              }}
              className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </Backdrop>
    </>
  );
};

export default Register;
