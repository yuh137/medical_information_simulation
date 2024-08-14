import React from "react";
import ScrollToTop from "../utils/ScrollToTop";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

const Layout = () => {
  return (
    <>
        <ScrollToTop />
        <ThemeProvider>
            {/* App starts here */}
            <Outlet />
        </ThemeProvider>
    </>
  );
};

export default Layout;
