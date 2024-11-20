import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import base components for entire website
import NavBar from "./components/NavBar.tsx";
import "./App.css";
// import react pages
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
import QCEditPage from "./pages/QCEditPage.tsx";
import QCAnalytesGrid from "./components/table/QCAnalytesGrid.tsx";
import SubmitCreateQCEntry from "./pages/SubmitCreateQCEntry.tsx";
import EditReportPage from "./pages/EditReportPage.tsx";
import ReviewSubmission from "./pages/ReviewSubmission.tsx";
import ReviewCurrentSubmssions from "./pages/ReviewCurrentSubmissions.tsx";

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Backend data fetching logic commented out
  }, []);

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
        <Route path="/submitCreateQC" element={<SubmitCreateQCEntry />} />
        <Route path="/patientreports" element={<PatientReportsPage />} />
        <Route path="/orderentries" element={<QC_OrderEntriesPage />} />
        <Route path="/reviewCurrentSubmssions" element={<ReviewCurrentSubmssions />} />
        <Route path="/qc" element={<QC_Page />} />
        <Route path="/editreportpage" element={<EditReportPage />} />
        <Route path="/qcedit/:adminQCLotID" element={<QCAnalytesGrid />} />
        <Route path="/reviewSubmission/:selectedReportId" element={<ReviewSubmission />} />
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
