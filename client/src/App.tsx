import React, { useMemo } from "react";
import { Navigate, createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
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
import ChemistryEditQC from "./pages/General/Chemistry/ChemistryEditQCPage";
import { ChemistryTestInputPage } from "./pages/General/Chemistry/ChemistryTestInputPage";
import ErrorPage from "./pages/ErrorPage";
import StudentResultsInProgress from "./pages/StudentView/StudentResultsInProgress";
import ChemistryCustomTests from "./pages/General/Chemistry/ChemistryCustomTests";
import Layout from "./utils/Layout";
import ChemistryLeveyJennings from "./pages/General/Chemistry/ChemistryLeveyJennings";
import { AdminQCLot, AdminQCTemplate, generateSlug, StudentReport } from "./utils/utils";
import ChemistryPanel from "./pages/General/Chemistry/ChemistryPanel";
import FacultyOrderEntry from "./pages/FacultyView/FacultyOrderEntry";
import ChemistryOEBuilder from "./pages/General/Chemistry/ChemistryOEBuilder";
import ChemistryCustomQC from "./pages/General/Chemistry/ChemistryCustomQC";
import FacultyResultsInProgress from "./pages/FacultyView/FacultyResultsInProgress";
import ChemistryReviewControls from "./pages/General/Chemistry/ChemistryReviewControls";
import { AuthToken } from "./context/AuthContext";

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
        errorElement: <ErrorPage />,
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
                    const data: StudentReport = await res.json();
                    if (data.isResulted === true) {
                      return redirect("/error");
                    }

                    return data;
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
                element: <ChemistryReviewControls />,
                loader: async () => {
                  try {
                    const tokenString = localStorage.getItem('token');
                    if (!tokenString) {
                      return null;
                    }
                    const token: AuthToken = JSON.parse(tokenString);
                
                    if (token.roles.includes("Admin")) {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/ByAdminId/${token.userID}`);
                
                      if (res.ok) {
                        const reports: StudentReport[] = await res.json();
                        const qcLotIds = Array.from(new Set(reports.map(report => report.adminQCLotID))); 
                
                        const queryParams = new URLSearchParams();
                        qcLotIds.forEach(item => queryParams.append("lotId", item));
                
                        const qcDataRes = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByIdList?${queryParams.toString()}`);
                
                        if (qcDataRes.ok) {
                          const qcData: AdminQCLot[] = await qcDataRes.json();
                          // setQCLots(qcData);
                          const returnData = qcData.map(item => ({
                            // reportId: item.reportID,
                            qcName: item.qcName ?? "",
                            lotNumber: item.lotNumber ?? "",
                            expDate: item.expirationDate ?? "",
                            isActive: item.isActive ?? false,
                            // qcName: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.qcName ?? "",
                            // lotNumber: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.lotNumber ?? "",
                            // expDate: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.expirationDate ?? "",
                            // isActive: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.isActive ?? false,
                            // createdDate: item.createdDate,
                          }))

                          return qcData;
                        }

                        return null;
                      }

                      return null;
                    } else if (token.roles.includes("Student")) {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/StudentReport/ByStudentId/${token.userID}`);
                
                      if (res.ok) {
                        const reports: StudentReport[] = await res.json();
                        const qcLotIds = Array.from(new Set(reports.map(report => report.adminQCLotID)));
                
                        const queryParams = new URLSearchParams();
                        qcLotIds.forEach(item => queryParams.append("lotId", item));
                
                        const qcDataRes = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/ByIdList?${queryParams.toString()}`);
                
                        if (qcDataRes.ok) {
                          const qcData: AdminQCLot[] = await qcDataRes.json();
                          // setQCLots(qcData);
                          const returnData = qcData.map(item => ({
                            // reportId: item.reportID,
                            qcName: item.qcName ?? "",
                            lotNumber: item.lotNumber ?? "",
                            expDate: item.expirationDate ?? "",
                            isActive: item.isActive ?? false,
                            // qcName: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.qcName ?? "",
                            // lotNumber: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.lotNumber ?? "",
                            // expDate: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.expirationDate ?? "",
                            // isActive: qcData.find(qc => qc.adminQCLotID === item.adminQCLotID)?.isActive ?? false,
                            // createdDate: item.createdDate,
                          }))
                
                          return qcData;
                        } 
                        return null;
                      }

                      return null;
                    }
                  } catch (error) {
                    console.error("Error fetching QC data:", error);
                    return null;
                  }
                }
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
                loader: async ({ request }) => {
                  // const { item } = params;
                  const searchParams = new URL(request.url).searchParams;
                  const qcName = searchParams.get("name");
                  const dep = searchParams.get("dep");
                  // const qcName = qcTypeLinkList.find(qcType => qcType.link.includes(item ?? "undefined"))?.name;

                  if (qcName) {
                    let qcLotList, qcTemplate;
                    try {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/HistoryByName?dep=${dep}&name=${qcName}`);

                      if (res.ok) {
                        const data = await res.json();
                        qcLotList = data;
                      }
                    } catch (e) {
                      console.error("Error fetching QC data", e);
                    }

                    try {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/GetTemplateByName?dep=${dep}&name=${qcName}`);

                      if (res.ok) {
                        const data = await res.json();
                        qcTemplate = data;
                      }
                    } catch (e) {
                      console.error("Error fetching QC template", e);
                    }

                    return { qcLotList, qcTemplate };
                  }

                  return null; 
                },
              },
              {
                path: "custom_qc",
                element: <ChemistryCustomQC />
              },
              {
                path: "custom_tests",
                element: <ChemistryCustomTests />,
                loader: async () => {
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/GetAllCustomTemplates`);

                  if (res.ok) {
                    const data: AdminQCTemplate[] = await res.json();
                    const dataWithSlugs = generateSlug<AdminQCTemplate>(data, "qcName");
                    return dataWithSlugs;
                  }

                  return null;
                }
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
          { path: '*', element: <Login /> },
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