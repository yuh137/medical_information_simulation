import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Drawer, Divider } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import { AuthToken, useAuth } from "../context/AuthContext";
import { Admin, Student } from "../utils/utils";

interface NavBarPropsTypes {
  name: string;
}

const NavBar = (props: NavBarPropsTypes) => {
  const [isDrawerOpen, openDrawer] = useState<boolean>(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, checkUserType } = useAuth();

  const [initials, setInitials] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  const loggedinUser: Promise<Admin | Student | null> = useMemo(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const authToken: AuthToken = JSON.parse(token);
      const role = authToken.roles[0];
      setUserRole(role.toLowerCase());
      
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/${role + "s"}/${authToken.userID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken.jwtToken}`,
          },
        });

        if (res.ok) {
          const user = await res.json();
          // console.log(`Type: ${typeof user}`, user);
          setInitials(user.initials);
          return user;
        }
      } catch (e) {
        console.error("Error fetching user data: ", e);
      }
    }
    return null;
  }, [])

  return (
    <>
      <div
        className={`bg-[${theme.primaryColor}] relative flex items-center sm:px-1 sm:py-5 z-10`}
        style={{ minWidth: "100svw", minHeight: "10svh" }}
      >
        <div className="left-items flex gap-x-2">
          <button className="text-white text-5xl hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => navigate(-1)}>
            <Icon icon="material-symbols:arrow-left-alt-rounded" />
          </button>
          <button className="text-white text-5xl hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => navigate(1)}>
            <Icon icon="material-symbols:arrow-right-alt-rounded" />
          </button>
          <button className="text-white text-3xl sm:px-2 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => openDrawer(true)}>
            <Icon
              icon="fa6-solid:bars"
              onClick={() => openDrawer(true)}
            />
          </button>
          {location.pathname !== `/${userRole}-home` &&
            <button className="sm:p-1 text-white self-center sm:text-5xl sm:left-24 hover:bg-blue-900/75 hover:cursor-pointer transition ease-in-out delay-75 rounded-md" onClick={() => navigate(`/${userRole}-home`)}>
              <Icon
                icon="material-symbols:home"
              />
            </button>
          }
        </div>

        <div className="navbar-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white font-bold sm:text-4xl text-3xl my-0 mx-auto max-sm:w-1/2 max-sm:leading-10">
          {props.name}
        </div>

        <div className="user-info group absolute sm:top-[55%] sm:-translate-y-[55%] sm:right-[1.25svw] sm:p-3 flex sm:gap-x-2 sm:py-2 sm:px-3 border-2 border-solid border-white rounded-xl drop-shadow-xl hover:bg-[#2F528F] hover:cursor-pointer transition delay-75">
          <div className="text-white">
            <div className="sm:max-w-1/2 truncate">User Initials: {initials}</div>
            <div className="text-right">{checkUserType() === "Admin" ? "Admin" : "Student"}</div>
          </div>
          <img src="/user.png" alt="" className="sm:w-[42px] sm:h-[42px]"/>
          <Icon icon="bxs:left-arrow" className="text-white self-center group-hover:-rotate-90 transition duration-150"/>
          <div className="user-info-actions absolute sm:w-full sm:h-fit bg-white sm:py-2 sm:px-3 hidden group-hover:flex hover:flex group-focus:flex flex-col top-full left-0 sm:gap-y-2 rounded-lg sm:translate-y-2 before:content-[''] before:absolute before:left-0 before:-top-3 before:w-full sm:before:h-4">
            <div className="flex sm:gap-x-2 text-black items-center justify-center hover:bg-black/30 hover:cursor-pointer transition delay-75 sm:min-h-8 rounded-lg" onClick={() => {
              navigate("/home");
            }}>
              <div>Home</div>
              <Icon icon="material-symbols:home" />
            </div>
            <div className="flex sm:gap-x-2 text-black items-center justify-center hover:bg-black/30 hover:cursor-pointer transition delay-75 sm:min-h-8 rounded-lg" onClick={() => {
              logout();
              navigate("/login");
            }}>
              <div>Logout</div>
              <Icon icon="mdi:logout" />
            </div>
          </div>
        </div>
      </div>

      <Drawer
        anchor='left'
        open={isDrawerOpen}
        onClose={() => openDrawer(false)}
      >
        <div className="drawer-container sm:w-[15svw] sm:h-full bg-[#CFD5EA] flex flex-col items-center sm:space-y-6">
          <ul className="sm:w-full">
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="fa6-solid:house" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Home</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/admin-qc")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Quality Controls</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/admin-order-entry")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Order Entry</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Patient Reports</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Quizzes</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Case Studies</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Student Report Submissions</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Reference Files</div>
            </li>
            <Divider />
            <li className="sidebar-item flex items-center justify-center sm:py-4 sm:gap-x-2 hover:cursor-pointer hover:bg-black/30 transition delay-75" onClick={() => navigate("/home")}>
              <Icon icon="" className="sm:text-xl"/>
              <div className="sm:text-lg sm:translate-y-[2px]">Student Roster</div>
            </li>
            <Divider />
          </ul>
        </div>
      </Drawer>
    </>
  );
};

export default NavBar;