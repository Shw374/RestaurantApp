import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.js';
import RegisterPage from './components/register.js';
import Listrestaurants from './components/listrestaurants.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/" element={<LoginPage />} />
        <Route path="/listrestaurant" element={<Listrestaurants/>}/>
      </Routes>
    </Router>
  );
}

export default App;
