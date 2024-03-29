import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import initIDB from './utils/indexedDB/initIDB';
import Login from './components/Login';
import Register from './components/Register';
import StudentHomeScreen from './pages/StudentView/StudentHomeScreen';
import StudentQualityControls from './pages/StudentView/StudentQualityControls';
import OrderControls from './pages/StudentView/OrderControls';
import QC_Results from './components/QC_Results';
import AnalyteInputPage from './components/AnalyteInputPage';
import Unauthorized from './components/Unauthorized';
import { useAuth } from './context/AuthContext';
import FacultyHomeScreen from './pages/FacultyView/FacultyHomeScreen';
import FacultyQualityControls from './pages/FacultyView/FacultyQualityControls';
import QCBuilder from './components/QCBuilderPage';
import { qcTypeLinkList, testTypeLinkList } from './utils/utils';
import EditQC from './components/EditQCPage';
import TestInputPage from './components/TestInputPage';
import ErrorPage from './components/ErrorPage';

function App() {
  initIDB();
  const { checkSession, checkUserType } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={checkSession() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={checkUserType() === 'student' ? <StudentHomeScreen /> : <FacultyHomeScreen />}/>
        <Route path='/qc' element={checkUserType() === 'student' ? <StudentQualityControls /> : <FacultyQualityControls />}/>
        <Route path='/order_controls' element={<OrderControls />}/>
        {testTypeLinkList.map(item => (
          <Route path={`/${item.link}/qc_results`}>
            <Route path='' element={<QC_Results link={item.link} name={item.name} key={item.name}/>}/>
            {qcTypeLinkList.map(subItem => (
              <Route path={`${subItem.link}`} element={<AnalyteInputPage link={subItem.link} name={subItem.name} key={subItem.name}/>}/>
            ))}
          </Route>
        ))}
        {testTypeLinkList.map(item => (
          <Route path={`/${item.link}/qc_builder`} element={<QCBuilder link={item.link} name={item.name} key={item.name}/>}/>
        ))}
        {testTypeLinkList.map(item => (
          <Route path={`/${item.link}/edit_qc`}>
            <Route path='' element={<EditQC link={item.link} name={item.name} key={item.name}/>}></Route>
            {qcTypeLinkList.map(subItem => (
              <Route path={`${subItem.link}`} element={<TestInputPage name={`${subItem.name}`} link='' />} key={subItem.link}></Route>
            ))}
          </Route>
        ))}
        <Route path='/unauthorized' element={<Unauthorized />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </>
  );
}

export default App;
