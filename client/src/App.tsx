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
import Simple_Faculty_QC_Review  from "./pages/FacultyView/Simple_Faculty_Review_Controls";
import { qcTypeLinkList, StudentReport } from "./utils/utils";
import { AuthToken } from "./context/AuthContext";
import ChemistryPanel from "./pages/General/Chemistry/ChemistryPanel";
import FacultyOrderEntry from "./pages/FacultyView/FacultyOrderEntry";
import ChemistryOEBuilder from "./pages/General/Chemistry/ChemistryOEBuilder";
import ChemistryCustomQC from "./pages/General/Chemistry/ChemistryCustomQC";
import FacultyResultsInProgress from "./pages/FacultyView/FacultyResultsInProgress";
import ChemistryReviewControls from "./pages/General/Chemistry/ChemistryReviewControls";

function App() {
  // initIDB();
  return (
    // <AuthProvider>
    // </AuthProvider>
    <AppWithRouter />
  );
}

function AppWithRouter() {
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
            path: 'admin-order-entry',
            element: <FacultyOrderEntry />,
          },
          {
            path: 'student-qc',
            element: <StudentQualityControls />,
          },
          {
            path: 'admin-qc',
            element: <FacultyQualityControls />,
          },
          // {
          //   path: 'admin-review_controls',
          //   element: <Simple_Faculty_QC_Review />,
          // },
          
          { path: 'student-results', element: <StudentResultsInProgress /> },

          { path: 'faculty-results', element: <FacultyResultsInProgress /> },
          
          // CHEMISTRY PATHS
          { 
            path: 'chemistry', 
            children: [
              {
                path: 'qc_results',
                element: <ChemistryQCResult />,
              },
              {
                path: "qc_results/:link",
                element: <ChemistryAnalyteInputPage />,
                loader: async ({ params }) => {
                  const { link } = params;

                  const tokenString = localStorage.getItem('token');
                  if (!tokenString) {
                    return null;
                  }
                  // const token: AuthToken = JSON.parse(tokenString);

                  // Return StudentReport by Id
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/${link}`);
                  if (res.ok) {
                    return res.json();
                  }

                  return null;
                }
              },
              { 
                path: 'order_controls', 
                element: <ChemistryOrderControls />,
                // loader: async () => {
                //   await new Promise((resolve) => setTimeout(resolve, 5000));

                //   return null;
                // }
              },
              {
                path: 'review_controls',
                element: <ChemistryReviewControls />
              },
              {
                path: "qc_builder",
                element: <ChemistryQCBuilder />,
              },
              {
                path: 'levey-jennings/:lotNumber/:analyteName',
                element: <ChemistryLeveyJennings />,
                loader: async ({ params }) => {
                  const { lotNumber } = params;

                  try {
                    if (!lotNumber) {
                      return null;
                    }

                    const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByLotNumber/${lotNumber}`);
                    if (res.ok) {
                      const data = await res.json();
                      // console.log("Before going to component: ", data);
                      return data;
                    }
                  } catch (e) {
                    console.error("Error fetching QC data", e);
                  }

                  return null;
                }
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
                  // const qcName = qcTypeLinkList.find(qcType => qcType.link.includes(item ?? "undefined"))?.name;

                  if (qcName) {
                    try {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/HistoryByName?dep=${dep}&name=${qcName}`);

                      if (res.ok) {
                        const data = await res.json();
                        console.log(data);
                        return data;
                      }
                    } catch (e) {
                      console.error("Error fetching QC data", e);
                    }
                  }

                  return null; 
                },
              },
              {
                path: "custom_qc",
                element: <ChemistryCustomQC />
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
              },
              {
                path: "panel",
                element: <ChemistryPanel />
              },
              {
                path: "panel/:link",
                element: <ChemistryOEBuilder />
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