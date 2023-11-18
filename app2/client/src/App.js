import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.js';
import RegisterPage from './components/register.js';
import ReservationPage from './components/reservation.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/reservation" element={<ReservationPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
