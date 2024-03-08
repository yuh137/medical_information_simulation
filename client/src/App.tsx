import React from 'react';
import NavBar from './components/NavBar';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/HomeScreen';
import QualityControls from './pages/QualityControls';
import OrderControls from './pages/OrderControls';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<HomeScreen />}/>
        <Route path='/qc' element={<QualityControls />}/>
        <Route path='/order_controls' element={<OrderControls />}/>
      </Routes>
    </>
  );
}

export default App;
