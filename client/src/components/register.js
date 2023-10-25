import React, { useState } from 'react';
import './register.css';
import { auth } from '../firebase';
import { Card } from 'react-bootstrap';
import quote from '../images/appl.jpeg';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const navigate = useNavigate();

  const handleregisterSubmit = (e) => {
    e.preventDefault();

    try {
      if (password === conpassword && password !== '' && conpassword !== '') {
        // Register user
        const userCred = createUserWithEmailAndPassword(auth, userId, password)
        .then((userCred2) => {
            alert('Registration Successful');
            navigate('/')
        })
        .catch((error) => {
            alert(error)
        })
        
        // You might want to do additional actions after successful registration
      } else {
        alert('Passwords don\'t match or are empty. Please try again.');
      }
    } catch (error) {
      alert('Error during registration. Please try again.');
      console.error(error);
    }
  };

  const handleRegisterLink = () => {
    navigate("/")
  };

  return (
    <Card className='cardStyle' style={{ width: '18rem' }}>
      <Card.Img style={{ height: '200px', width: '200px' }} variant='top' src={quote} />
      <Card.Body>
        <form onSubmit={handleregisterSubmit}>
          <label style={{ color: '#f2a183', fontWeight: 'bold' }} htmlFor='userId'>
            User ID:
          </label>
          <input
            type='text'
            id='userId'
            autoComplete='off'
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
            required
          />
          <label style={{ color: '#f2a183', fontWeight: 'bold' }} htmlFor='password'>
            Password:
          </label>
          <input
            type='password'
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <label style={{ color: '#f2a183', fontWeight: 'bold' }} htmlFor='password'>
            Confirm Password:
          </label>
          <input
            type='password'
            id='Conpassword'
            onChange={(e) => setConPassword(e.target.value)}
            value={conpassword}
            required
          />
          <button style={{ backgroundColor: '#C08261' }} type='submit'>
            Sign up
          </button>
          <br />
          <a href='#' onClick={handleRegisterLink}>
            Already have an account?
          </a>
        </form>
      </Card.Body>
    </Card>
  );
};

export default RegisterPage;
