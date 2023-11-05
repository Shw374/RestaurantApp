import React, { useState, useEffect } from 'react';
import './App.css';
import ListrestaurantAPI from './listrestaurantAPI';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login.js';
import RegisterPage from './components/register.js';

function App() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await ListrestaurantAPI.getAllRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>List of Restaurants</h1>
        {restaurants.map((restaurant) => (
          <li key={restaurant.restaurant_id}>
            <p>Restaurant name is {restaurant.restaurant_name}</p>
            <p>Opening hours {restaurant.open_hours}</p>
            <p>Closing hours {restaurant.close_hours}</p>
          </li>
        ))}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

// export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/login.js';
// import RegisterPage from './components/register.js';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/" element={<LoginPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/login.js';
// import RegisterPage from './components/register.js';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/" element={<LoginPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

