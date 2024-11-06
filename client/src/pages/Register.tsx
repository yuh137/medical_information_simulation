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
}

const Register = () => {
  const { theme } = useTheme();
  const [registerOptions, setRegisterOptions] = useState<
    "Admin" | "Student" | string
  >("");

  // let error_msg: string = "";  // Errors for Error Notification
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);
  const [isErrorNotiOpen, setErrorNotiOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("TBD")

  useEffect(() => {
    //If notification is enabled, disable after 3 seconds
    if (isFeedbackNotiOpen) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);
      }, 4000);
    } else if (isErrorNotiOpen) {
      setTimeout(() => {
        setErrorNotiOpen(false);
      }, 4000);
    }
  }, [isFeedbackNotiOpen, isErrorNotiOpen])
  
  const { register, handleSubmit } = useForm<CredentialsInput>();

  //Register form logic handling
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    // First, some checks regardless of class 
    console.log(data);  
    if ( (!data["email"].endsWith("@ttu.edu") && !data["email"].endsWith("@ttuhsc.edu")) || data["email"].charAt(0) === '@') {
      setErrorMsg("Please enter a valid TTU or TTUHSC email");
      setErrorNotiOpen(true);
    }  // Now check if Admin or Student
    else if (registerOptions === "Admin") {
      console.log("Data object: ", data);
      // const check = await getAdminByName(data.username);
      // console.log("Check", await check);
      const user = { ...data, roles: [ "Admin" ] }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Auth/Register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })

        if (res.ok) {
          setFeedbackNotiOpen(true);
          console.log(res.text());
        } else {  // Res not OK
          console.log("Failed to register");
          try {
            const resJSON = await res.json();  // Check if this is a JSON formatted error
            console.log(resJSON);
            if (resJSON["errors"]) {
              let resKeys = Object.keys(resJSON["errors"]);
              if (resKeys[0] === "Password") {  // Password error
                console.log(resJSON["errors"]["Password"]);
                setErrorMsg(resJSON["errors"]["Password"][0]);
              }
            } 
          } catch {
            setErrorMsg("This account already exists");
          }
          setErrorNotiOpen(true);
        }
      } catch (e) {
        console.error("Failed to register", e);
        setErrorMsg("Failed to register");
        setErrorNotiOpen(true);
      }

      // if ((await check) === null) {
      //   const res = await addData<Admin>("admins", {
      //     ["id"]: generateRandomId(),
      //     username: data.username,
      //     password: data.password,
      //     firstname: data.firstname,
      //     lastname: data.lastname,
      //     initials: data.initials,
      //   });

      //   console.log(res);
      // } else {
      //   console.log(new Error("Username already exists"));
      // }
    } else if (registerOptions === "Student") {
      // const check = await getStudentByName(data.username);
      const user = { ...data, roles: [ "Student" ] }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Auth/Register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })

        if (res.ok) {
          setFeedbackNotiOpen(true);
          console.log(res.text());
        } else {  // Res not OK
          console.error("Failed to register");
          try {
            const resJSON = await res.json();  // Check if this is a JSON formatted error
            console.log(resJSON);
            if (resJSON["errors"]) {
              let resKeys = Object.keys(resJSON["errors"]);
              if (resKeys[0] === "Password") {  // Password error
                console.log(resJSON["errors"]["Password"]);
                setErrorMsg(resJSON["errors"]["Password"][0]);
              }
            } 
          } catch {
            setErrorMsg("This account already exists");
          }
          setErrorNotiOpen(true);
        }
      } catch (e) {
        console.error("Failed to register", e);
        setErrorMsg("Failed to register");
        setErrorNotiOpen(true);
      }
    } else {
      console.log(new Error("Invalid type"));
      setErrorMsg("Please select an account type")
      setErrorNotiOpen(true);
    }
  };

  return (
    <>
      <div
        className=" flex flex-col w-svw bg-[#2f5597] pb-12"
        style={{ minHeight: "100svh", minWidth: "100svw" }}
      >
        <div
          className="title w-fit mb-0 mx-auto mt-8 bg-[#3a6cc6] px-12"
          style={{ maxWidth: "66.67%" }}
        >
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">
            Medical Information Simulations
          </div>
        </div>
        <div className="register-form sm:w-1/4 w-3/4 mb-0 mt-8 mx-auto bg-slate-100 flex flex-col gap-4 py-10 px-4 bg-local bg-cover">
          <div className="register-form-container rounded-xl sm:space-y-2">
            <div className="login-title text-center sm:text-2xl font-semibold">
              Choose Account Type
            </div>
            <div className="user-type flex sm:gap-x-2 box-border">
              <div
                className={`student-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                  registerOptions === "Student"
                    ? "border-4 !border-[#2f5597]"
                    : ""
                }`}
                onClick={() => {
                  setRegisterOptions((prevState) =>
                    prevState === "Student" ? "" : "Student"
                  );
                }}
              >
                <img src="/student-icon.png" alt="" />
                <div className="self-center font-semibold text-xl">Student</div>
              </div>
              <div
                className={`admin-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${
                  registerOptions === "Admin"
                    ? "border-4 !border-[#2f5597]"
                    : ""
                }`}
                onClick={() => {
                  setRegisterOptions((prevState) =>
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
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Email"
                {...register("email", { required: true })}
              />
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="First Name"
                {...register("firstname", { required: true })}
              />
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Last Name"
                {...register("lastname", { required: true })}
              />
              <input
                type="text"
                className="min-h-10 placeholder:font-semibold placeholder:text-center text-center"
                placeholder="Initials"
                {...register("initials", { required: true })}
              />
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
              <div className="login-link-text text-center text-blue-400 text-xl">
                Already have an account?
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Backdrop // OK BACKDROP
        open={isFeedbackNotiOpen}
        
        onClick={() => {
          setFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              { 
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>Registration Successful</div>
                  </div>
                </>
              }
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setFeedbackNotiOpen(false);
                }}
                className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
      <Backdrop  // ERROR BACKDROP
        open={isErrorNotiOpen}
        
        onClick={() => {
          setErrorNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              { 
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center"/>
                    <div>{errorMsg}</div>
                  </div>
                </>
              }
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
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
