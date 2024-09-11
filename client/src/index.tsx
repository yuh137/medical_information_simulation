// import React from 'react';
// import ReactDOM from 'react-dom/client';
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import App from './App';


import "./index.css"
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  // <AuthProvider>
  // </AuthProvider>
  <App />
  // </React.StrictMode>
);