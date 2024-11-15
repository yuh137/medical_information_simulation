import React, { useMemo } from "react";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import initIDB from "./utils/indexedDB/initIDB";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHomeScreen from "./pages/StudentView/StudentHomeScreen";
import StudentQualityControls from "./pages/StudentView/StudentQualityControls";
import ChemistryOrderControls from "./pages/General/Chemistry/ChemistryOrderControls";
import ChemistryQCResult from "./pages/General/Chemistry/ChemistryQCResult";
import ChemistryAnalyteInputPage from "./pages/General/Chemistry/ChemistryAnalyteInputPage";
import Unauthorized from "./pages/Unauthorized";
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
import { hemeTypeLinkList } from "./utils/utils";
import { CoagTypeLinkList } from "./utils/utils";

// Heme/Coag 
import HemeCoagQCBuilderPage from "./pages/General/Hema_Coag/HemeCoagQCBuilderPage";
import HemeEditQCPage from "./pages/General/Hema_Coag/Heme/HemeEditQCPage";
import CoagEditQCPage from "./pages/General/Hema_Coag/Coag/CoagEditQCPage";
// Custom QC Panels
import CustomCreateNewPage from "./pages/General/Hema_Coag/Custom/CustomCreateNewPage";
import CustomSelectPage from "./pages/General/Hema_Coag/Custom/CustomSelectPage";
import HemeCoagQCTypeButtonsPage from "./pages/General/Hema_Coag/Custom/HemeCoagQCTypeSelection";
import { HemeTestInputPage } from "./pages/General/Hema_Coag/Heme/HemeTestInputPage";
import { CoagTestInputPage } from "./pages/General/Hema_Coag/Coag/CoagTestInputPage";

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
                element: <ChemistryQCResult />,
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
                element: <ChemistryTestInputPage />,
                loader: async ({ params, request }) => {
                  const { item } = params;
                  const searchParams = new URL(request.url).searchParams;
                  const qcName = searchParams.get("name");
                  const dep = searchParams.get("dep");
                  if (qcName) {
                    try {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByName?dep=${dep}&name=${qcName}`);

                      if (res.ok) {
                        return res.json();
                      }
                    } catch (e) {
                      console.error("Error fetching QC data", e);
                    }
                  }

                  return null; 
                }
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
              {
                path: 'qc_builder',
                element: <HemeCoagQCBuilderPage />,
              },
              {
                path: 'heme',
                children: [
                  {
                    path: 'heme_editQC',
                    element: <HemeEditQCPage />,
                  },
                  {
                    path: 'heme_editQC/:item',
                    element: <HemeTestInputPage />,
                    loader: async ({ params, request }) => {
                      const { item } = params;
                      const searchParams = new URL(request.url).searchParams;
                      const qcName = searchParams.get("name");
                      const dep = searchParams.get("dep");

                      if (qcName) {
                        try {
                          const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByName?dep=${dep}&name=${qcName}`, {method: "GET"});
                          if (res.ok) {
                            return res.json();
                          }
                        } catch (e) {
                          console.error("Error fetching QC data", e);
                        }
                      }
                      return null; 
                    }
                  }
                ]
              },
              {
                //Coag path
                path: 'coag',
                children: [
                  {
                    path: 'coag_editQC',
                    element: <CoagEditQCPage />,
                  },
                  {
                    path: 'coag_editQC/:item',
                    element: <CoagTestInputPage />,
                    loader: async ({ params, request }) => {
                      const { item } = params;
                      const searchParams = new URL(request.url).searchParams;
                      const qcName = searchParams.get("name");
                      const dep = searchParams.get("dep");

                      if (qcName) {
                        try {
                          const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByName?dep=${dep}&name=${qcName}`);

                          if (res.ok) {
                            return res.json();
                          }
                        } catch (e) {
                          console.error("Error fetching QC data", e);
                        }
                      }

                      return null;
                    }

                  }
                ]
              },
              // Move the custom section here under hema_coag
              {
                path: 'custom',
                children: [
                  {
                    path: 'select_custom',
                    element: <CustomSelectPage />,
                  },
                  {
                    path: 'front_page',
                    element: <HemeCoagQCTypeButtonsPage />,
                  },
                  {
                    path: 'create_custom/:item/:item2',
                    element: <CustomCreateNewPage name="Custom" />,
                    loader: async ({ params, request }) => {
                      const { item } = params;
                      const searchParams = new URL(request.url).searchParams;
                      const dep = searchParams.get("dep");
                      const qcName = hemeTypeLinkList.find(qcType => qcType.link.includes(item ?? "undefined"))?.name;
          
                      if (qcName) {
                        try {
                          const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByName?dep=${dep}&name=${qcName}`);
                          if (res.ok) {
                            return res.json();
                          }
                        } catch (e) {
                          console.error("Error fetching QC data", e);
                        }
                      }
                      return null; 
                    }
                  },
                ]
              }
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


