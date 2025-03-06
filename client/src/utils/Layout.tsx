import React from "react";
import ScrollToTop from "../utils/ScrollToTop";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ReportProvider } from "../context/ReportContext";

const Layout = () => {
  return (
    <>
        <ScrollToTop />
        <AuthProvider>
          <ThemeProvider>
            <ReportProvider>
              {/* App starts here */}
              <Outlet />
            </ReportProvider>
          </ThemeProvider>
        </AuthProvider>
    </>
  );
};

export default Layout;
