import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Avr from './pages/projectPages/Avr.jsx';
import Lps from './pages/projectPages/Lps.jsx';
import Prison from './pages/projectPages/Prison.jsx';
import StaringContest from './pages/projectPages/StaringContest.jsx';
import DrugDiscovery from './pages/projectPages/DrugDiscovery.jsx';
import IotWater from './pages/projectPages/IotWater.jsx';
import Leetcode from './pages/projectPages/Leetcode.jsx';
import ChatBot from './pages/projectPages/Chatbot.jsx';
import NavBar from './components/NavBar.jsx';
import ParticleBG from './components/particleBG.jsx';
import HomePage from './pages/Homepage.jsx';
import Contact from './pages/Contact.jsx'; // Import the Contact page
import AboutMe from './pages/AboutMe.jsx';     // Import the About Me page
import ProjectPage from './pages/ProjectPage.jsx'

import './App.css';

function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <ParticleBG />
      <div className='nav-bar'>
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/projects" element={<ProjectPage />} />


        <Route path="/avr" element={<Avr />} />
        <Route path="/prison" element={<Prison />} />
        <Route path="/staringcontest" element={<StaringContest />} />
        <Route path="/drugdiscovery" element={<DrugDiscovery />} />
        <Route path="/iotwater" element={<IotWater />} />
        <Route path="/lps" element={<Lps />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/leetcode" element={<Leetcode />} />

        
      </Routes>
    </Router>
  );
}

export default App;
