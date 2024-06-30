import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import initIDB from './utils/indexedDB/initIDB';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHomeScreen from './pages/StudentView/StudentHomeScreen';
import StudentQualityControls from './pages/StudentView/StudentQualityControls';
import OrderControls from './pages/StudentView/OrderControls';
import QC_Results from './pages/QC_Results';
import AnalyteInputPage from './pages/AnalyteInputPage';
import Unauthorized from './pages/Unauthorized';
import { useAuth } from './context/AuthContext';
import FacultyHomeScreen from './pages/FacultyView/FacultyHomeScreen';
import FacultyQualityControls from './pages/FacultyView/FacultyQualityControls';
import QCBuilder from './pages/QCBuilderPage';
import { qcTypeLinkList, testTypeLinkList } from './utils/utils';
import EditQC from './pages/EditQCPage';
import {TestInputPage} from './pages/TestInputPage';
import ErrorPage from './pages/ErrorPage';
import ResultsInProgress from './pages/ResultsInProgress';
import CustomQCBuild from './pages/CustomQCBuild';
import CustomTests from './pages/CustomTests';
import Student_QC_Review from './pages/StudentView/StudentReviewControls';
import Faculty_QC_Review from './pages/StudentView/FacultyReviewControls';

function App() {
  initIDB();
  const { checkSession, checkUserType } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={checkSession() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={checkUserType() === 'student' ? <StudentHomeScreen /> : <FacultyHomeScreen />} />
        <Route path='/qc' element={checkUserType() === 'student' ? <StudentQualityControls /> : <FacultyQualityControls />} />
        <Route path="/review_controls" element={checkUserType() === 'student' ? <Student_QC_Review name="Student" link="student" /> : <Faculty_QC_Review name="Faculty" link="faculty" />} />

        <Route path ='/' element={<Navigate to='/unauthorized' />} />Q
        <Route path='/results' element={<ResultsInProgress />} />
        <Route path='/order_controls' element={<OrderControls />} />
        
        {testTypeLinkList.map(item => (
          <Route key={item.link} path={`/${item.link}/qc_results`}>
            <Route path='' element={<QC_Results link={item.link} name={item.name} />} />
            {qcTypeLinkList.map(subItem => (
              <Route key={subItem.link} path={`${subItem.link}`} element={<AnalyteInputPage link={subItem.link} name={subItem.name} />} />
            ))}
          </Route>
        ))}

        {testTypeLinkList.map(item => (
          <Route key={item.link} path={`/${item.link}/qc_builder`} element={<QCBuilder link={item.link} name={item.name} />} />
        ))}

        {testTypeLinkList.map(item => (
          <Route key={item.link} path={`/${item.link}/edit_qc`}>
            <Route path='' element={<EditQC link={item.link} name={item.name} />} />
            {qcTypeLinkList.map(subItem => (
              <Route
                key={subItem.link}
                path={`${subItem.link}`}
                element={
                  <TestInputPage
                    name={subItem.name}
                    link={subItem.link}
                    dataType={
                      subItem.name.includes('Cardiac') ? 'Cardiac' :
                      subItem.name.includes('Lipid') ? 'Lipid' :
                      subItem.name.includes('Liver') ? 'Liver' :
                      subItem.name.includes('Thyroid') ? 'Thyroid' :
                      subItem.name.includes('Iron') ? 'Iron' :
                      subItem.name.includes('Drug') ? 'Drug' :
                      subItem.name.includes('Hormone') ? 'Hormone' :
                      subItem.name.includes('Pancreatic') ? 'Pancreatic' :
                      subItem.name.includes('Vitamins') ? 'Vitamins' :
                      subItem.name.includes('Diabetes') ? 'Diabetes' :
                      subItem.name.includes('Cancer') ? 'Cancer' :
                      'General'
                    }
                  />
                }
              />
            ))}
          </Route>
        ))}

        {testTypeLinkList.map(item => (
          <Route key={item.link} path={`/${item.link}/build_qc/:type`}>
            <Route path='' element={<CustomQCBuild name={item.name} link='' />} />
          </Route>
        ))}

        {testTypeLinkList.map(item => (
          <Route key={item.link} path={`/${item.link}/custom_tests`} element={<CustomTests name={`${item.name} Custom Tests`} />} />
        ))}

        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;