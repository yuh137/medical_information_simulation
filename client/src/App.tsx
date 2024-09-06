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
import { qcTypeLinkList, testTypeLinkList } from "./utils/utils";
import ChemistryEditQC from "./pages/General/Chemistry/ChemistryEditQCPage";
import { ChemistryTestInputPage } from "./pages/General/Chemistry/ChemistryTestInputPage";
import ErrorPage from "./pages/ErrorPage";
import ResultsInProgress from "./pages/ResultsInProgress";
import ChemistryCustomQCBuild from "./pages/General/Chemistry/ChemistryCustomQCBuild";
import ChemistryCustomTests from "./pages/General/Chemistry/ChemistryCustomTests";
import Student_QC_Review from "./pages/StudentView/StudentReviewControls";
import Faculty_QC_Review from "./pages/FacultyView/FacultyReviewControls";
import QCTypeButtonsPage from "./pages/QCTypeSelection";
import { getAllDataFromStore, getQCRangeByName } from "./utils/indexedDB/getData";
import Layout from "./utils/Layout";
import Test from "./pages/Test";

function App() {
  initIDB();
  return (
    <AuthProvider>
      <AppWithRouter />
    </AuthProvider>
  );
}

function AppWithRouter() {
  const { checkSession, checkUserType } = useAuth();

  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: checkSession() ? <Navigate to="/home" /> : <Navigate to="/login" />,
          },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          {
            path: 'home',
            element: checkUserType() === 'student' ? <StudentHomeScreen /> : <FacultyHomeScreen />,
          },
          {
            path: 'qc',
            element: checkUserType() === 'student' ? <StudentQualityControls /> : <FacultyQualityControls />,
          },
          {
            path: 'review_controls',
            element: checkUserType() === 'student' ? <Student_QC_Review name="Student" link="student" /> : <Faculty_QC_Review name="Faculty" link="faculty" />,
          },
          { path: 'results', element: <ResultsInProgress /> },
          
          // CHEMISTRY PATHS
          { path: 'chemistry', children: [
            {
              path: 'qc_results',
              element: <ChemistryQCResult link="chemistry" name="Chemistry" />,
              loader: async () => {
                const data = await getAllDataFromStore("qc_store");
                // const dta = await fetch(`${process.env.REACT_APP_API_URL}/Admins`)
                // console.log(await dta.json())
                return data;
              },
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
              path: "edit_qc",
              element: <ChemistryEditQC />,
            },
            {
              path: "edit_qc/:item",
              element: <ChemistryTestInputPage name="" />,
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
              element: <QCTypeButtonsPage name="" link="chemistry" />,
            }
          ]},
          // { path: 'hema_coag', },
          // { path: 'microbiology', },
          // { path: 'serology', },
          // { path: 'UA_fluids', },
          // { path: 'blood_bank', },
          // { path: 'molecular', },
          // ...testTypeLinkList.map((item) => (
          //   {
          //     path: `${item.link}/qc_results`,
          //     children: [
          //       {
          //         index: true,
          //         element: <ChemistryQCResult link={item.link} name={item.name} />,
          //         loader: async () => {
          //           const data = await getAllDataFromStore("qc_store");
          //           return data;
          //           // const dta = await fetch(`${process.env.REACT_APP_API_URL}/Admins`)
          //           // console.log(await dta.json())
          //         },
          //       },
          //       ...qcTypeLinkList.map((subItem) => ({
          //         path: subItem.link,
          //         element: <AnalyteInputPage link={subItem.link} name={subItem.name} />,
          //       })),
          //     ],
          //   }
          // )),
          // ...testTypeLinkList.map((item) => (
          //   {
          //     path: `${item.link}/qc_builder`,
          //     element: <QCBuilder link={item.link} name={item.name} />,
          //   }
          // )),
          // ...testTypeLinkList.map((item) => (
          //   {
          //     path: `${item.link}/edit_qc`,
          //     children: [
          //       {
          //         index: true,
          //         element: <EditQC link={item.link} name={item.name} />,
          //       },
          //       ...qcTypeLinkList.map((subItem) => ({
          //         path: subItem.link,
          //         element: (
          //           <TestInputPage
          //             name={subItem.name}
          //             link={subItem.link}
          //             dataType={
          //               subItem.name.includes('Cardiac')
          //                 ? 'Cardiac'
          //                 : subItem.name.includes('Lipid')
          //                 ? 'Lipid'
          //                 : subItem.name.includes('Liver')
          //                 ? 'Liver'
          //                 : subItem.name.includes('Thyroid')
          //                 ? 'Thyroid'
          //                 : subItem.name.includes('Iron')
          //                 ? 'Iron'
          //                 : subItem.name.includes('Drug')
          //                 ? 'Drug'
          //                 : subItem.name.includes('Hormone')
          //                 ? 'Hormone'
          //                 : subItem.name.includes('Pancreatic')
          //                 ? 'Pancreatic'
          //                 : subItem.name.includes('Vitamins')
          //                 ? 'Vitamins'
          //                 : subItem.name.includes('Diabetes')
          //                 ? 'Diabetes'
          //                 : subItem.name.includes('Cancer')
          //                 ? 'Cancer'
          //                 : 'General'
          //             }
          //           />
          //         ),
          //       })),
          //     ],
          //   }
          // )),
          // ...testTypeLinkList.map((item) => (
          //   {
          //     path: `${item.link}/build_qc/:type`,
          //     element: <CustomQCBuild name={item.name} />,
          //   }
          // )),
          ...testTypeLinkList.map((item) => (
            {
              path: `${item.link}/custom_tests`,
              element: <ChemistryCustomTests />,
            }
          )),
          ...testTypeLinkList.map((item) => (
            {
              path: `${item.link}/qc_types`,
              element: <QCTypeButtonsPage name={item.name} link={item.link} />,
            }
          )),
          { path: 'unauthorized', element: <Unauthorized /> },
          { path: '*', element: <ErrorPage /> },
        ],
      },
    ]);
  }, [checkSession, checkUserType])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
