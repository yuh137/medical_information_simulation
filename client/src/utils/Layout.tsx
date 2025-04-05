import React from "react";
import ScrollToTop from "../utils/ScrollToTop";
import { Outlet, useNavigation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ReportProvider } from "../context/ReportContext";
import { Skeleton } from "antd";

const Layout = () => {
  const { state: loaderState } = useNavigation();
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <ThemeProvider>
          <ReportProvider>
            {/* App starts here */}
            {loaderState === "loading" ? (
              <>
                <div className="w-svw sm:px-2 sm:pt-2 flex flex-col gap-y-2 grow">
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </ReportProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
};

export default Layout;
