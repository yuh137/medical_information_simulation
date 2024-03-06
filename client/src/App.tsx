import React from 'react';
import NavBar from './components/NavBar';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/HomeScreen';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<HomeScreen />}/>
      </Routes>
    </>
  );
}

export default App;
