import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import base components for entire website
import NavBar from './components/NavBar.jsx';
import './App.css';
//import react pages
import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CaseStudiesPage from './pages/CaseStudiesPage.jsx';
import GradeBookPage_Faculty from './pages/GradeBookPage_Faculty.jsx';
import GradeBookPage_Student from './pages/GradeBookPage_Student.jsx';
import InputQC_ResultsPage from './pages/InputQC_ResultsPage.jsx';
import PatientReportsPage from './pages/PatientReportsPage.jsx';
import QC_OrderEntriesPage from './pages/QC_OrderEntriesPage.jsx';
import QC_Page from './pages/QC_Page.jsx';
import QuizzesPage_Faculty from './pages/QuizzesPage_Faculty.jsx';
import QuizzesPage_Student from './pages/QuizzesPage_Student.jsx';
import ReferecnceFilesPage from './pages/ReferenceFilesPage.jsx';
import ViewQCResultsPage from './pages/ViewQCResultsPage.jsx';
import ReportSubmissionsPage_Student from './pages/ReportSubmissionsPage_Student.jsx';
import ReportSubmissionsPage_Faculty from './pages/ReportSubmissionsPage_Faculty.jsx';




function App() {

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      
      <div className='nav-bar'>
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home" element={<CaseStudiesPage />} />
        <Route path="/home" element={<GradeBookPage_Faculty />} />
        <Route path="/home" element={<GradeBookPage_Student />} />
        <Route path="/home" element={<InputQC_ResultsPage />} />
        <Route path="/home" element={<PatientReportsPage />} />
        <Route path="/home" element={<QC_OrderEntriesPage />} />
        <Route path="/home" element={<QC_Page />} />
        <Route path="/home" element={<QuizzesPage_Faculty />} />
        <Route path="/home" element={<QuizzesPage_Student />} />
        <Route path="/home" element={<ReferecnceFilesPage />} />
        <Route path="/home" element={<ViewQCResultsPage />} />
        <Route path="/home" element={<ReportSubmissionsPage_Student/>} />
        <Route path="/home" element={<ReportSubmissionsPage_Faculty/>} />

      </Routes>
    </Router>
  );
}

/*

routes to add
<Route path="/account" element={<accountPage />} />
<Route path="/account" element={<accountPage />} />


*/

export default App;
