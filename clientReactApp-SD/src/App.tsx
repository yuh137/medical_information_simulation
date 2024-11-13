import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import base components for entire website
import NavBar from "./components/NavBar.tsx";
import "./App.css";
//import react pages
import SplashPage from "./pages/SplashPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.tsx";
import CaseStudiesPage from "./pages/CaseStudiesPage.jsx";
import GradeBookPage from "./pages/GradeBookPage.jsx";
import SubmitQCOrderEntry from "./pages/submitQCOrderEntry.js";
import PatientReportsPage from "./pages/PatientReportsPage.jsx";
import QC_OrderEntriesPage from "./pages/QC_OrderEntriesPage.jsx";
import QC_Page from "./pages/QC_Page.jsx";
import QuizzesPage from "./pages/QuizzesPage.tsx";
import ReferecnceFilesPage from "./pages/ReferenceFilesPage.jsx";
import ViewQCResultsPage from "./pages/ViewQCResultsPage.jsx";
import ReportSubmissionsPage from "./pages/ReportSubmissionsPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import axios from "axios";

function App() {
  // Scroll to top when the component mounts
  // initialize client-Side DB with data from azure database

  

  useEffect(() => {
    window.scrollTo(0, 0);
    // const fetchBackEndData = async () => {
    //   try {
    //     const responseQCLots = await axios.get(
    //       "http://localhost:5029/api/AdminQCLots",
    //     );
    //     const dataQCLot = responseQCLots.data;
    //     // console.log("Response QC Lots", dataQCLot);
    //     // console.log("Number of QC Lots", dataQCLot.length);
    //     for (let i = 0; i < dataQCLot.length; i++) {
    //       const QCLotID = dataQCLot[i].adminQCLotID;
    //       console.log("QCLotID", QCLotID);
    //       console.log(
    //         `Axios String: http://localhost:5029/api/Analytes/${QCLotID}`,
    //       );
    //       const responseAnalytesInQCLot = await axios.get(
    //         `http://localhost:5029/api/Analytes/${QCLotID}`,
    //       );
    //
    //       console.log("Analytes in QC Lot", responseAnalytesInQCLot.data);
    //     }
    //     // const responseAnalytes = await axios.get("http");
    //   } catch (error) {
    //     console.log("Error fetching backend initial data", error);
    //   }
    // };
    // fetchBackEndData();
  }, []);

  //Splash Page is login!

  

  return (
    <Router>
      <div className="nav-bar">
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/casestudies" element={<CaseStudiesPage />} />
        <Route path="/gradebook" element={<GradeBookPage />} />
        <Route path="/submitQCOrder" element={<SubmitQCOrderEntry />} />
        <Route path="/patientreports" element={<PatientReportsPage />} />
        <Route path="/orderentries" element={<QC_OrderEntriesPage />} />
        <Route path="/qc" element={<QC_Page />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/referencefiles" element={<ReferecnceFilesPage />} />
        <Route path="/viewqcresults" element={<ViewQCResultsPage />} />
        <Route path="/reportsubmissions" element={<ReportSubmissionsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
