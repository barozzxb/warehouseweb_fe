import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import ManagerDashboard from './pages/manager/ManagerDashboard';

function App() {
  return (
    <Router>
      <div className="web-container">
        <Routes>

          <Route path="/" element={<LandingPage />} />
          
          <Route path="/manager" element={<ManagerDashboard />} />
        </Routes>
      </div>

    </Router>
  )
}

export default App
