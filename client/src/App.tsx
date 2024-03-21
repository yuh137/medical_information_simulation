import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Student } from './utils/indexedDB/IDBSchema';
import initIDB from './utils/indexedDB/initIDB';
import addData from './utils/indexedDB/addData';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/StudentView/HomeScreen';
import QualityControls from './pages/StudentView/QualityControls';
import OrderControls from './pages/StudentView/OrderControls';
import QC_Results from './pages/StudentView/QC_Results';
import ChemistryQCResult from './pages/StudentView/result_screens/Chemistry';
import Unauthorized from './pages/Unauthorized';
import { useAuth } from './context/AuthContext';

function App() {
  initIDB();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<HomeScreen />}/>
        <Route path='/qc' element={<QualityControls />}/>
        <Route path='/order_controls' element={<OrderControls />}/>
        <Route path='/qc_results' element={<QC_Results />}/>
        <Route path='/chemistry_res' element={<ChemistryQCResult />}/>
        <Route path='/unauthorized' element={<Unauthorized />}/>
      </Routes>
    </>
  );
}

export default App;
