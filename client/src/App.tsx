import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Student } from './utils/indexedDB/IDBSchema';
import initIDB from './utils/indexedDB/initIDB';
import addData from './utils/indexedDB/addData';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/HomeScreen';
import QualityControls from './pages/QualityControls';
import OrderControls from './pages/OrderControls';
import QC_Results from './pages/QC_Results';
import ChemistryQCResult from './pages/result_screens/Chemistry';

function App() {
  initIDB()
  .then(() => addData<Student>("students", { id: "Q-23456789", name: "John", password: "12345678"}).then((res) => {
    console.log(res);
  }))

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<HomeScreen />}/>
        <Route path='/qc' element={<QualityControls />}/>
        <Route path='/order_controls' element={<OrderControls />}/>
        <Route path='/qc_results' element={<QC_Results />}/>
        <Route path='/chemistry_res' element={<ChemistryQCResult />}/>
      </Routes>
    </>
  );
}

export default App;
