import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import base components for entire website
import NavBar from './components/NavBar.jsx';
import './App.css';
//import react pages
import SplashPage from './pages/SplashPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CaseStudiesPage from './pages/CaseStudiesPage.jsx';
import GradeBookPage from './pages/GradeBookPage.jsx';
import InputQC_ResultsPage from './pages/InputQC_ResultsPage.jsx';
import PatientReportsPage from './pages/PatientReportsPage.jsx';
import QC_OrderEntriesPage from './pages/QC_OrderEntriesPage.jsx';
import QC_Page from './pages/QC_Page.jsx';
import QuizzesPage from './pages/QuizzesPage.jsx';
import ReferecnceFilesPage from './pages/ReferenceFilesPage.jsx';
import ViewQCResultsPage from './pages/ViewQCResultsPage.jsx';
import ReportSubmissionsPage from './pages/ReportSubmissionsPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';




function App() {

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //Splash Page is login!
  
  return (
    <Router>
      
      <div className='nav-bar'>
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/casestudies" element={<CaseStudiesPage />} />
        <Route path="/gradebook" element={<GradeBookPage/>} />
        <Route path="/inputqcresults" element={<InputQC_ResultsPage />} />
        <Route path="/patientreports" element={<PatientReportsPage />} />
        <Route path="/orderentries" element={<QC_OrderEntriesPage />} />
        <Route path="/qc" element={<QC_Page />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/referencefiles" element={<ReferecnceFilesPage />} />
        <Route path="/viewqcresults" element={<ViewQCResultsPage />} />
        <Route path="/reportsubmissions" element={<ReportSubmissionsPage/>} />
        <Route path="/account" element={<AccountPage/>} />
        <Route path="/error" element={<ErrorPage/>} />


      </Routes>
    </Router>
  );
}

export default App;
