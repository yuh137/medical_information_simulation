import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import initIDB from './utils/indexedDB/initIDB';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHomeScreen from './pages/StudentView/StudentHomeScreen';
import StudentQualityControls from './pages/StudentView/StudentQualityControls';
import OrderControls from './pages/StudentView/OrderControls';
import QC_Results from './pages/StudentView/QC_Results';
import ChemistryQCResult from './pages/StudentView/result_screens/Chemistry';
import Unauthorized from './pages/Unauthorized';
import { useAuth } from './context/AuthContext';
import FacultyHomeScreen from './pages/FacultyView/FacultyHomeScreen';
import FacultyQualityControls from './pages/FacultyView/FacultyQualityControls';
import QCBuilder from './components/QCBuilderPage';
import { testTypeLinkList } from './utils/utils';
import EditQC from './components/EditQCPage';

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
        <Route path='/qc_results' element={<QC_Results />}/>
        <Route path='/chemistry_res' element={<ChemistryQCResult />}/>
        {testTypeLinkList.map(item => (
          <Route path={`/${item.link}/qc_builder`} element={<QCBuilder link={item.link} name={item.name} key={item.name}/>}/>
        ))}
        {testTypeLinkList.map(item => (
          <Route path={`/${item.link}/edit_qc`} element={<EditQC link={item.link} name={item.name} key={item.name}/>}/>
        ))}
        <Route path='/unauthorized' element={<Unauthorized />}/>
      </Routes>
    </>
  );
}

export default App;
