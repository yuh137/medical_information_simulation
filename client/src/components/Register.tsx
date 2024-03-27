import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import addData from "../utils/indexedDB/addData";
import { generateRandomId } from "../utils/utils";
import { Admin } from "../utils/indexedDB/IDBSchema";
import { getAdminByName, getStudentByName } from "../utils/indexedDB/getData";

export interface CredentialsInput {
  username: string;
  password: string;
}

const Register = () => {
  const { theme } = useTheme();
  const [registerOptions, setRegisterOptions] = useState<"Admin" | "Student" | string>("");
  const { register, handleSubmit } = useForm<CredentialsInput>();
  const onSubmit: SubmitHandler<CredentialsInput> = async (data) => {
    if (registerOptions === "Admin") {
      const check = await getAdminByName(data.username);
      // console.log("Check", await check);

      if (await check === null) {
        const res = await addData<Admin>("admins", {
          id: generateRandomId(),
          name: data.username,
          password: data.password,
        });
  
        console.log(res);
      } else {
        console.log(new Error("Username already exists"));
      }
    } else if (registerOptions === "Student") {
      const check = await getStudentByName(data.username);

      if (!check) {
        const res = await addData<Admin>("students", {
          ["id"]: generateRandomId(),
          name: data.username,
          password: data.password,
        });
  
        console.log(res);
      } else {
        console.log(new Error("Username taken!"))
      }
    } else {
      console.log(new Error("Invalid type"));
    }
  };

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
          {!registerOptions && (
            <div className="option-buttons flex flex-col sm:space-y-4">
              <Button
                variant="outlined"
                className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
                onClick={() => {
                  setRegisterOptions("Admin");
                }}
              >
                Register as Admin
              </Button>
              <Button
                variant="outlined"
                className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
                onClick={() => {
                  setRegisterOptions("Student");
                }}
              >
                Register as Student
              </Button>
            </div>
          )}
          {registerOptions && (
            <>
              <div className="login-title text-center text-3xl font-semibold">
                Sign up as {registerOptions}
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
                  Register
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (registerOptions === "Admin") {
                      setRegisterOptions("Student");
                    } else if (registerOptions === "Student") {
                      setRegisterOptions("Admin");
                    } else {
                      setRegisterOptions("");
                    }
                  }}
                  className={`!text-black !bg-[${theme.secondaryColor}] !border !border-solid !border-[${theme.primaryBorderColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!border-[#2F528F]`}
                >
                  Change register option
                </Button>
              </form>
              
            </>
          )}
          <div className="login-link">
            <Link to="/login">
              <div className="login-link-text text-center text-blue-400 ">
                Already have an account?
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
