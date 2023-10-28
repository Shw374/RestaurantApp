import React, { useState } from 'react';
import './register.css';
import { auth } from '../firebase';
import { Card } from 'react-bootstrap';
import quote from '../images/appl.jpeg';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const [name, setName] = useState('');
  const [numberOfCust, setCustNum] = useState(0);
  const navigate = useNavigate();

  const handleregisterSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password === conpassword && password !== '' && conpassword !== '' && name !== "") {
        // Register user
        await createUserWithEmailAndPassword(auth, userId, password)
        .then((userCred2) => {
            alert('Registration Successful');
            axios.get("https://4jz3f26qf6.execute-api.us-east-1.amazonaws.com/dev/custcount")
            .then((response) => {
            setCustNum(response.body)
            console.log(numberOfCust);
            }).catch((err) => {
              alert("Coudnt fetch number of customers")
            })
            let postData = {
              "CustomerId": numberOfCust,
              "Name": name,
              "Email": userId,
              "operation": "create"
            }
            console.log(postData);
            axios.post("https://4jz3f26qf6.execute-api.us-east-1.amazonaws.com/addstage/addcustdetails", postData)
            .then((resp) => {
              console.log("This is resp : "+ resp);
              if(resp.body === "CustomerId created successfully."){
                alert("success")
                navigate("/");
              }
            })
            .catch(error => {
            // Handle errors
            console.error('Error:', error);
            });
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

  // const handleRegisterLink = () => {
  //   navigate("/")
  // };

  return (
    <Card className='cardStyle' style={{ width: '18rem' }}>
      <Card.Img style={{ height: '200px', width: '200px' }} variant='top' src={quote} />
      <Card.Body>
        <form onSubmit={handleregisterSubmit}>
          <label style={{ color: '#f2a183', fontWeight: 'bold' }} htmlFor='name'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            autoComplete='off'
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
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
          <a href='/'>
            Already have an account?
          </a>
        </form>
      </Card.Body>
    </Card>
  );
};

export default RegisterPage;
