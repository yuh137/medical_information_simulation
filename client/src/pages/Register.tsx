import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Backdrop } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
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
  const navigate = useNavigate();
  const [registerOptions, setRegisterOptions] = useState<
    "Admin" | "Student" | string
  >("");
  const [isFeedbackNotiOpen, setFeedbackNotiOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegisterSuccessful, setIsRegisterSuccessful] = useState(false);

  useEffect(() => {
    //If notification is enabled, disable after 3 seconds
    if (isFeedbackNotiOpen) {
      setTimeout(() => {
        setFeedbackNotiOpen(false);
      }, 3000);
    }
  }, [isFeedbackNotiOpen])

  const { register, handleSubmit, formState: { errors } } = useForm<CredentialsInput>({ mode: "onTouched", reValidateMode: "onChange" });

  //Register form logic handling
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    if (registerOptions === "Admin") {
      console.log("Data object: ", data);
      // const check = await getAdminByName(data.username);
      // console.log("Check", await check);
      const user = { ...data, roles: ["Admin"] }
      setIsRegistering(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Auth/Register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })

        if (res.ok) {
          setIsRegisterSuccessful(true);
        } else {
          console.error("Failed to register");
        }

        setIsRegistering(false);
        setFeedbackNotiOpen(true);
      } catch (e) {
        console.error("Failed to register", e);
        setIsRegistering(false);
        setFeedbackNotiOpen(true);
      }
    } else if (registerOptions === "Student") {
      // const check = await getStudentByName(data.username);
      const user = { ...data, roles: ["Student"] }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Auth/Register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })

        if (res.ok) {
          setIsRegisterSuccessful(true);
        } else {
          console.error("Failed to register");
        }
      } catch (e) {
        console.error("Failed to register", e);
      }

      setIsRegistering(false);
      setFeedbackNotiOpen(true);
    } else {
      console.log(new Error("Invalid type"));
      setFeedbackNotiOpen(true);
    }
  };

  return (
    <>
      <div
        className="relative flex flex-col w-svw bg-black pb-12 bg-no-repeat bg-center bg-contain"
        style={{ minHeight: "100svh", minWidth: "100svw", backgroundImage: "url('(MIS)-MidiSims-Main icon_ Login Slide 2.png')" }}
      >
        <img src="(MIS)-Logo-Horizontal.png" alt="" className='absolute sm:w-48 sm:-top-10' />
        <div
          className="title w-fit mb-0 mx-auto mt-28 bg-[#3a6cc6] px-12"
          style={{ maxWidth: "66.67%" }}
        >
          <div className="title-text font-bold text-ellipsis drop-shadow-xl text-white text-center text-3xl sm:text-6xl py-10">
            Medical Information Simulations
          </div>
        </div>
        <div className="register-form sm:w-1/4 w-3/4 mb-0 mt-24 mx-auto bg-slate-100/80 flex flex-col gap-4 py-10 px-4 bg-local bg-cover">
          <div className="register-form-container rounded-xl sm:space-y-2">
            <div className="login-title text-center sm:text-2xl font-semibold">
              Choose Account Type
            </div>
            <div className="user-type flex sm:gap-x-2 box-border">
              <div
                className={`student-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${registerOptions === "Student"
                  ? "border-2 !border-[#2f5597]"
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
                className={`admin-img-container flex flex-col sm:gap-y-2 sm:w-1/2 border border-solid border-black sm:px-2 sm:py-4 rounded-md hover:cursor-pointer hover:bg-slate-500/30 transition-all duration-75 ${registerOptions === "Admin"
                  ? "border-2 !border-[#2f5597]"
                  : ""
                  }`}
                onClick={() => {
                  setRegisterOptions((prevState) =>
                    prevState === "Admin" ? "" : "Admin"
                  );
                }}
              >
                <img src="/admin-icon.png" alt="" />
                <div className="self-center font-semibold text-xl">Faculty</div>
              </div>
            </div>
            <form
              action=""
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="username-container">
                {errors.username && <span className="text-red-500 text-sm text-center">{errors.username.message}</span>}
                <input
                  type="text"
                  className={`border sm:w-full min-h-12 text-center placeholder:font-semibold placeholder:text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-slate-400'}`}
                  placeholder="Username"
                  aria-invalid={errors.username ? "true" : "false"}
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 8, message: "At least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      message: "Must include uppercase, lowercase, and number"
                    }
                  })}
                />
              </div>

              <div className="password-container">
                {errors.password && <span className="text-red-500 text-sm text-center">{errors.password.message}</span>}
                <input
                  type="password"
                  className={`border sm:w-full min-h-12 text-center placeholder:font-semibold placeholder:text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-slate-400'}`}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      message: "Must include uppercase, lowercase, and number"
                    }
                  })}
                />
              </div>

              <div className="email-container">
                {errors.email && <span className={`text-red-500 text-sm text-center transition-all ease-in-out duration-300 transform
                      ${errors.email ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0"}`}>{errors.email.message}</span>}
                <input
                  type="text"
                  className={`border sm:w-full min-h-12 text-center placeholder:font-semibold placeholder:text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-slate-400'}`}
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format"
                    }
                  })}
                />
              </div>

              <div className="firstname-container">
                {errors.firstname && <span className="text-red-500 text-sm text-center">{errors.firstname.message}</span>}
                <input
                  type="text"
                  className={`border sm:w-full min-h-12 text-center placeholder:font-semibold placeholder:text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstname ? 'border-red-500' : 'border-slate-400'}`}
                  placeholder="First Name"
                  {...register("firstname", { required: "Firstname is required" })}
                />
              </div>

              <div className="lastname-container">
                {errors.lastname && <span className="text-red-500 text-sm text-center">{errors.lastname.message}</span>}
                <input
                  type="text"
                  className={`border sm:w-full min-h-12 text-center placeholder:font-semibold placeholder:text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastname ? 'border-red-500' : 'border-slate-400'}`}
                  placeholder="Last Name"
                  {...register("lastname", { required: "Lastname is required" })}
                />
              </div>

              <div className="initials-container">
                {errors.initials && <span className="text-red-500 text-sm text-center">{errors.initials.message}</span>}
                <input
                  type="text"
                  className={`border sm:w-full min-h-12 text-center placeholder:font-semibold placeholder:text-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.initials ? 'border-red-500' : 'border-slate-400'}`}
                  placeholder="Initials"
                  {...register("initials", { required: "Initials are required" })}
                />
              </div>

              <Button
                variant="outlined"
                onClick={handleSubmit(onSubmit)}
                className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F] sm:h-10`}
              >
                {isRegistering ? (<Icon icon="eos-icons:three-dots-loading" />) : "Register"}
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

      <Backdrop
        open={isFeedbackNotiOpen}
        onClick={() => {
          setFeedbackNotiOpen(false);
        }}
      >
        <div className="bg-white rounded-xl">
          <div className="sm:p-8 flex flex-col sm:gap-4">
            <div className="text-center text-gray-600 text-xl font-semibold">
              {isRegisterSuccessful ? (
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>Registration Successful</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:gap-y-2">
                    <Icon icon="material-symbols:cancel-outline" className="text-red-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
                    <div>Error Occurred</div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                onClick={() => {
                  setFeedbackNotiOpen(false);
                  navigate("/login");
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
