import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import initIDB from "./utils/indexedDB/initIDB";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import StudentHomeScreen from "./pages/StudentView/StudentHomeScreen";
import StudentQualityControls from "./pages/StudentView/StudentQualityControls";
import OrderControls from "./pages/StudentView/OrderControls";
import QC_Results from "./pages/QC_Results";
import { useAuth } from "./context/AuthContext";
import FacultyHomeScreen from "./pages/FacultyView/FacultyHomeScreen";
import FacultyQualityControls from "./pages/FacultyView/FacultyQualityControls";
import QCBuilder from "./pages/QCBuilderPage";
import EditQC from "./pages/EditQCPage";
import { TestInputPage } from "./pages/TestInputPage";
import ErrorPage from "./pages/ErrorPage";
import ResultsInProgress from "./pages/ResultsInProgress";
import CustomQCBuild from "./pages/CustomQCBuild";
import CustomTests from "./pages/CustomTests";
import Student_QC_Review from "./pages/StudentView/StudentReviewControls";
import Faculty_QC_Review from "./pages/StudentView/FacultyReviewControls";
import QCTypeButtonsPage from "./pages/QCTypeSelection";
import Layout from "./utils/Layout";
import LeveyJennings from "./pages/LeveyJennings";
import SimpleAnalyteInputPage from "./pages/SimpleAnalyteInputPage";
import { qcTypeLinkList, testTypeLinkList } from "./utils/utils";
import  Simple_Faculty_QC_Review  from "./pages/StudentView/Simple_Faculty_Review_Controls";

function App() {
  initIDB();
  const { checkSession, checkUserType } = useAuth();

  const router = createBrowserRouter([
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
          element: checkUserType() === 'student' ? <Student_QC_Review name="Student" link="student" /> : <Simple_Faculty_QC_Review name="Faculty" link="faculty" />,
        },
        {
          path: 'levey-jennings/:fileName/:lotNumber/:analyteName',
          element: <LeveyJennings />,
        },
        
        { path: 'results', element: <ResultsInProgress /> },
        { path: 'order_controls', element: <OrderControls /> },
        {
          path: '/simple-analyte-input-page',
          element: <SimpleAnalyteInputPage name="Some Name" />,  // Ensure 'name' is provided
        },
        
        
        // Mapping over testTypeLinkList to create routes dynamically
        ...testTypeLinkList.map((item) => ({
          path: `${item.link}/qc_results`,
          children: [
            {
              index: true,
              element: <QC_Results link={item.link} name={item.name} />,
            },
          // Ensure this route is included in your router setup
          ],
          }
        )),
        ...testTypeLinkList.map((item) => (
          {
            path: `${item.link}/qc_builder`,
            element: <QCBuilder link={item.link} name={item.name} />,
          }
        )),
        ...testTypeLinkList.map((item) => (
          {
            path: `${item.link}/edit_qc`,
            children: [
              {
                index: true,
                element: <EditQC link={item.link} name={item.name} />,
              },
              ...qcTypeLinkList.map((subItem) => ({
                path: subItem.link,
                element: (
                  <TestInputPage
                    name={subItem.name}
                    link={subItem.link}
                    dataType={
                      subItem.name.includes('Cardiac')
                        ? 'Cardiac'
                        : subItem.name.includes('Lipid')
                        ? 'Lipid'
                        : subItem.name.includes('Liver')
                        ? 'Liver'
                        : subItem.name.includes('Thyroid')
                        ? 'Thyroid'
                        : subItem.name.includes('Iron')
                        ? 'Iron'
                        : subItem.name.includes('Drug')
                        ? 'Drug'
                        : subItem.name.includes('Hormone')
                        ? 'Hormone'
                        : subItem.name.includes('Pancreatic')
                        ? 'Pancreatic'
                        : subItem.name.includes('Vitamins')
                        ? 'Vitamins'
                        : subItem.name.includes('Diabetes')
                        ? 'Diabetes'
                        : subItem.name.includes('Cancer')
                        ? 'Cancer'
                        : 'General'
                    }
                  />
                ),
              })),
            ],
          }
        )),
        ...testTypeLinkList.map((item) => (
          {
            path: `${item.link}/build_qc/:type`,
            element: <CustomQCBuild name={item.name} link="" />,
          }
        )),
        ...testTypeLinkList.map((item) => (
          {
            path: `${item.link}/custom_tests`,
            element: <CustomTests name={`${item.name} Custom Tests`} />,
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

  return (
    <>
      {/* <Routes>
        <Route
          path="/"
          element={
            checkSession() ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            checkUserType() === "student" ? (
              <StudentHomeScreen />
            ) : (
              <FacultyHomeScreen />
            )
          }
        />
        <Route
          path="/qc"
          element={
            checkUserType() === "student" ? (
              <StudentQualityControls />
            ) : (
              <FacultyQualityControls />
            )
          }
        />
        <Route
          path="/review_controls"
          element={
            checkUserType() === "student" ? (
              <Student_QC_Review name="Student" link="student" />
            ) : (
              <Faculty_QC_Review name="Faculty" link="faculty" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/unauthorized" />} />Q
        <Route path="/results" element={<ResultsInProgress />} />
        <Route path="/order_controls" element={<OrderControls />} />
        {testTypeLinkList.map((item) => (
          <Route
            key={item.link}
            path={`/${item.link}/qc_results`}
            
          >
            <Route
              path=""
              index={true}
              element={<QC_Results link={item.link} name={item.name} />}
              loader={async () => {
                const data = await getQCRangeByName(item.name);
                console.log(data);
              }}
            />
            {qcTypeLinkList.map((subItem) => (
              <Route
                key={subItem.link}
                path={`${subItem.link}`}
                element={
                  <AnalyteInputPage link={subItem.link} name={subItem.name} />
                }
              />
            ))}
          </Route>
        ))}
        {testTypeLinkList.map((item) => (
          <Route
            key={item.link}
            path={`/${item.link}/qc_builder`}
            element={<QCBuilder link={item.link} name={item.name} />}
          />
        ))}
        {testTypeLinkList.map((item) => (
          <Route key={item.link} path={`/${item.link}/edit_qc`}>
            <Route
              path=""
              element={<EditQC link={item.link} name={item.name} />}
            />
            {qcTypeLinkList.map((subItem) => (
              <Route
                key={subItem.link}
                path={`${subItem.link}`}
                element={
                  <TestInputPage
                    name={subItem.name}
                    link={subItem.link}
                    dataType={
                      subItem.name.includes("Cardiac")
                        ? "Cardiac"
                        : subItem.name.includes("Lipid")
                        ? "Lipid"
                        : subItem.name.includes("Liver")
                        ? "Liver"
                        : subItem.name.includes("Thyroid")
                        ? "Thyroid"
                        : subItem.name.includes("Iron")
                        ? "Iron"
                        : subItem.name.includes("Drug")
                        ? "Drug"
                        : subItem.name.includes("Hormone")
                        ? "Hormone"
                        : subItem.name.includes("Pancreatic")
                        ? "Pancreatic"
                        : subItem.name.includes("Vitamins")
                        ? "Vitamins"
                        : subItem.name.includes("Diabetes")
                        ? "Diabetes"
                        : subItem.name.includes("Cancer")
                        ? "Cancer"
                        : "General"
                    }
                  />
                }
              />
            ))}
          </Route>
        ))}
        {testTypeLinkList.map((item) => (
          <Route
            key={item.link}
            path={`/${item.link}/build_qc/:type`}
            element={<CustomQCBuild name={item.name} link="" />}
          />
        ))}
        {testTypeLinkList.map((item) => (
          <Route
            key={item.link}
            path={`/${item.link}/custom_tests`}
            element={<CustomTests name={`${item.name} Custom Tests`} />}
          />
        ))}
        {testTypeLinkList.map((item) => (
          <Route
            key={item.link}
            path={`/${item.link}/qc_types`}
            element={<QCTypeButtonsPage name={item.name} link={item.link} />}
          />
        ))}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
