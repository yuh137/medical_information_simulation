import React, { useMemo } from "react";
import { Routes, Route, Navigate, Link, useNavigate, createBrowserRouter, RouterProvider, useParams } from "react-router-dom";
import initIDB from "./utils/indexedDB/initIDB";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHomeScreen from "./pages/StudentView/StudentHomeScreen";
import StudentQualityControls from "./pages/StudentView/StudentQualityControls";
import ChemistryOrderControls from "./pages/General/Chemistry/ChemistryOrderControls";
import ChemistryQCResult from "./pages/General/Chemistry/ChemistryQCResult";
import ChemistryAnalyteInputPage from "./pages/General/Chemistry/ChemistryAnalyteInputPage";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider, useAuth } from "./context/AuthContext";
import FacultyHomeScreen from "./pages/FacultyView/FacultyHomeScreen";
import FacultyQualityControls from "./pages/FacultyView/FacultyQualityControls";
import ChemistryQCBuilder from "./pages/General/Chemistry/ChesmistryQCBuilderPage";
// import { qcTypeLinkList, testTypeLinkList } from "./utils/utils";
import ChemistryEditQC from "./pages/General/Chemistry/ChemistryEditQCPage";
import { ChemistryTestInputPage } from "./pages/General/Chemistry/ChemistryTestInputPage";
import ErrorPage from "./pages/ErrorPage";
import StudentResultsInProgress from "./pages/StudentView/StudentResultsInProgress";
import ChemistryCustomQCBuild from "./pages/General/Chemistry/ChemistryCustomQCBuild";
import ChemistryCustomTests from "./pages/General/Chemistry/ChemistryCustomTests";
import Student_QC_Review from "./pages/StudentView/StudentReviewControls";
import Faculty_QC_Review from "./pages/FacultyView/FacultyReviewControls";
import ChemistryQCTypeButtonsPage from "./pages/General/Chemistry/ChemistryQCTypeSelection";
import Layout from "./utils/Layout";
import ChemistryLeveyJennings from "./pages/General/Chemistry/ChemistryLeveyJennings";
import SimpleAnalyteInputPage from "./pages/General/Chemistry/SimpleAnalyteInputPage";
import Simple_Faculty_QC_Review  from "./pages/FacultyView/Simple_Faculty_Review_Controls";
import { getAllDataFromStore } from "./utils/indexedDB/getData";
// BLOOD BANK imports
import BloodBankQCBuilder from "./pages/General/BloodBank/BloodBankQCBuilderPage";
import BloodBankEditQC from "./pages/General/BloodBank/BloodBankEditQCPage";
import BloodBankQCResult from "./pages/General/BloodBank/BloodBankQCResult";
import BloodBankAnalyteInputPage from "./pages/General/BloodBank/BloodBankAnalyteInputPage";
import BloodBankOrderControls from "./pages/General/BloodBank/BloodBankOrderControls";
import BloodBankLeveyJennings from "./pages/General/BloodBank/BloodBankLeveyJennings";
import { BloodBankTestInputPage } from "./pages/General/BloodBank/BloodBankTestInputPage";
import BloodBankCustomQCBuild from "./pages/General/BloodBank/BloodBankCustomQCBuild";
import BloodBankCustomTests from "./pages/General/BloodBank/BloodBankCustomTests";
import BloodBankQCTypeButtonsPage from "./pages/General/BloodBank/BloodBankQCTypeSelection";

function App() {
  initIDB();
  return (
    // <AuthProvider>
    // </AuthProvider>
    <AppWithRouter />
  );
}

function AppWithRouter() {
  // const { checkSession, checkUserType } = useAuth();

  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/login" /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          {
            path: 'student-home',
            element: <StudentHomeScreen />,
          },
          {
            path: 'admin-home',
            element: <FacultyHomeScreen />,
          },
          {
            path: 'student-qc',
            element: <StudentQualityControls />,
          },
          {
            path: 'admin-qc',
            element: <FacultyQualityControls />,
          },
          {
            path: 'student-review_controls',
            element: <Student_QC_Review />,
          },
          {
            path: 'admin-review_controls',
            element: <Simple_Faculty_QC_Review />,
          },
          
          { path: 'student-results', element: <StudentResultsInProgress /> },
          
          // CHEMISTRY PATHS
          { 
            path: 'chemistry', 
            children: [
              {
                path: 'qc_results',
                element: <ChemistryQCResult link="chemistry" name="Chemistry" />,
              },
              {
                path: 'simple-analyte-input-page',
                element: <SimpleAnalyteInputPage name="Chemistry" />,  
              },
              {
                path: "qc_results/:link",
                element: <ChemistryAnalyteInputPage name="" />,
                loader: async ({ params }) => {
                  const { link } = params;
                  console.log("loader function: ", link);

                  return null;
                }
              },
              { 
                path: 'order_controls', 
                element: <ChemistryOrderControls /> 
              },
              {
                path: "qc_builder",
                element: <ChemistryQCBuilder />,
              },
              {
                path: 'levey-jennings/:fileName/:lotNumber/:analyteName',
                element: <ChemistryLeveyJennings />,
              },
              {
                path: "edit_qc",
                element: <ChemistryEditQC />,
              },
              {
                path: "edit_qc/:item",
                element: <ChemistryTestInputPage name="CMP Level I" />,
              },
              {
                path: "build_qc/:item",
                element: <ChemistryCustomQCBuild name="Chemistry" />,
              },
              {
                path: "custom_tests",
                element: <ChemistryCustomTests />,
              },
              {
                path: "qc_types",
                element: <ChemistryQCTypeButtonsPage />,
              }
            ]
          },

          //  HEMATOLOGY/COAG PATHS
          { 
            path: 'hema_coag', 
            children: [

            ]
          },

          // MICROBIOLOGY PATHS
          {
            path: 'microbiology',
            children: [

            ]
          },

          // SEROLOGY PATHS
          {
            path: 'serology',
            children: [

            ]
          },

          // URINALYSIS PATHS
          {
            path: 'urinalysis',
            children: [

            ]
          },

          // BLOOD BANK PATHS
          { 
            path: 'blood_bank', 
            children: [
              {
                path: 'qc_results',
                element: <BloodBankQCResult link="blood_bank" name="BloodBank" />,
              },
              {
                path: 'simple-analyte-input-page',
                element: <SimpleAnalyteInputPage name="BloodBank" />,  
              },
              {
                path: "qc_results/:link",
                element: <BloodBankAnalyteInputPage name="" />,
                loader: async ({ params }) => {
                  const { link } = params;
                  console.log("loader function: ", link);

                  return null;
                }
              },
              { 
                path: 'order_controls', 
                element: <BloodBankOrderControls /> 
              },
              {
                path: "qc_builder",
                element: <BloodBankQCBuilder />,
              },
              {
                path: 'levey-jennings/:fileName/:lotNumber/:analyteName',
                element: <BloodBankLeveyJennings />,
              },
              {
                path: "edit_qc",
                element: <BloodBankEditQC />,
              },
              {
                path: "edit_qc/:item",
                element: <BloodBankTestInputPage name="CMP Level I" />,
              },
              {
                path: "build_qc/:item",
                element: <BloodBankCustomQCBuild name="BloodBank" />,
              },
              {
                path: "custom_tests",
                element: <BloodBankCustomTests />,
              },
              {
                path: "qc_types",
                element: <BloodBankQCTypeButtonsPage />,
              }
            ]
          },

          // MOLECULAR PATHS
          {
            path: 'molecular',
            children: [

            ]
          },
          { path: 'unauthorized', element: <Unauthorized /> },
          { path: '*', element: <ErrorPage /> },
        ],
      },
    ]);
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
