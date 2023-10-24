// login.js
import React, { useState } from 'react';
import './login.css'; // Import the CSS file
import { auth } from "../firebase"
import {Card} from "react-bootstrap";
import quote from "../images/appl.jpeg"
const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // signInWithEmailAndPassword(auth, email, password)
    // .then()
  };

  return (
    <Card className='cardStyle' style={{ width: '18rem' }}>
    <Card.Img style = {{height: '200px', width: "200px"}}variant="top" src= {quote}/>
    <Card.Body>
      {/* <Card.Title>Login</Card.Title> */}
      <form onSubmit={handleLoginSubmit}>
            <label style={{color:"#f2a183", fontWeight: 'bold'}}htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              autoComplete="off"
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
              required
            />
            <label style={{color:"#f2a183", fontWeight: 'bold'}} htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button style= {{backgroundColor: "#C08261"}}type="submit">Sign In</button>
          </form>
    </Card.Body>
  </Card>
  );
};

export default LoginPage;
