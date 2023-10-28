import React, { useState, useEffect } from 'react';
import './App.css';
import ListrestaurantAPI from './listrestaurantAPI';

function App() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurant data here or handle the API call in ListrestaurantAPI
    const fetchRestaurants = async () => {
      try {
        const data = await ListrestaurantAPI.getAllRestaurants(); // Assuming getRestaurants is a method in ListrestaurantAPI
        setRestaurants(data || []); // Update the state with the fetched restaurants
      } catch (error) {
        // Handle errors
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
    </div>
  );
}

export default App;
