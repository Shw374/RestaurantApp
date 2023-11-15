import React, { useState, useEffect } from 'react';
import RegisterPage from './register';
import LoginPage from './login';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function Listrestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const API_ENDPOINT  = 'https://mlpjq9hwih.execute-api.us-east-1.amazonaws.com/dev'

  const handleLogout = () => {
    // Remove the token from cookies or state (depending on your implementation)
    Cookies.remove('userId');
    // Redirect to the login page or any other page after logout
    navigate('/login');
  };

  const ListrestaurantAPI = {

  getAllRestaurants: async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/items`, {
        method: 'GET',
        headers: {
          'origin': 'http://localhost:3000',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data:', data); // Log the data received
        return data;
      } else {
        throw new Error('Failed to fetch all restaurants data');
      }
    } catch (error) {
      throw new Error(`Error fetching all restaurants data: ${error.message}`);
    }
  },

};
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
    <div>
    <div>
        <h2 style={{color:"#fff"}}>List of Restaurants</h2>
        <ul style={{ color: "#fff"}}>
        {restaurants.map((restaurant) => (
          <li key={restaurant.restaurant_id}>
            <p> {restaurant.restaurant_name}</p>
          {restaurant.open_hours && <p>Open Hours: {restaurant.open_hours}</p>}
          {restaurant.close_hours && <p>Close Hours: {restaurant.close_hours}</p>}
          {restaurant.address_line && <p>Address: {restaurant.address_line}</p>}
          {restaurant.phone && <p>Phone: {restaurant.phone}</p>}
          {restaurant.status ? (
            <p>Status: {restaurant.status === "open" ? "Open" : "Closed"}</p>
          ) : (
            <p>Status: Closed</p>
          )}

            {restaurant.menu && (
            <div>
              <h4>Menu</h4>
              {Object.keys(restaurant.menu).map((cuisine) => (
                <div key={cuisine}>
                  <h4>{cuisine}</h4>
                  <ul>
                    {Object.keys(restaurant.menu[cuisine]).map((id) => (
                      <li key={id}>
                        <p>Menu Name: {restaurant.menu[cuisine][id].menu_name}</p>
                        <p>Price: {restaurant.menu[cuisine][id].price}</p>
                        <p>Quantity: {restaurant.menu[cuisine][id].quantity}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          </li>
        ))}
        </ul>
    </div>
    <div>
    <h2 style={{ color: "#fff" }}>List of Restaurants</h2>
    <button onClick={handleLogout}>Logout</button>
  </div>
  </div>
  );
}

export default Listrestaurants;
