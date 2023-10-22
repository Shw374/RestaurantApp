// login.js
import React, { useState } from 'react';
import './login.css'; // Import the CSS file
import { auth } from "../firebase"

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // signInWithEmailAndPassword(auth, email, password)
    // .then()
  };

  return (
    <div className="login-container">
      <div className="split-container">
        {/* Left Half - Image of a Restaurant */}
        <div className="left-half">
          {/* Include an image of a restaurant */}
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D" // Replace with your image path
            alt="Restaurant"
            className="restaurant-image"
          />
        </div>
        
        {/* Right Half - Sign In Form */}
        <div className="right-half">
          <h1>Halifax DineDiscover</h1>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              autoComplete="off"
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
