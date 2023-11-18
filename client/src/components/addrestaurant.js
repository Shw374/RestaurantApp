import React, { useState } from 'react';
import './addrestaurant.css';

const AddRestaurantPage = () => {
  // State variables
  const [availability, setAvailability] = useState('open');
  const [openingHours, setOpeningHours] = useState('');
  const [closingHours, setClosingHours] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('chinese');
  const [tableCount, setTableCount] = useState(0);
  const [tableSize, setTableSize] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '' });
  const [restaurantId, setRestaurantId] = useState('');

  // Handler functions
  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const handleOpeningHoursChange = (e) => {
    setOpeningHours(e.target.value);
  };

  const handleClosingHoursChange = (e) => {
    setClosingHours(e.target.value);
  };

  const handleCuisineChange = (e) => {
    setSelectedCuisine(e.target.value);
  };

  const handleTableCountChange = (e) => {
    setTableCount(Number(e.target.value));
  };

  const handleTableSizeChange = (e) => {
    setTableSize(Number(e.target.value));
  };

  const handleAddItem = () => {
    setMenuItems([...menuItems, newItem]);
    setNewItem({ name: '', price: '', quantity: '' });
  };

  const handleNewItemChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const generateRestaurantId = () => {
    // Generate restaurant ID based on current timestamp
    const timestamp = new Date().getTime();
    setRestaurantId(`R${timestamp}`);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://ygkj588pcl.execute-api.us-east-1.amazonaws.com/dev/addrestaurant', {
        method: 'POST',
        headers: {
          'origin': 'http://localhost:3000',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurantId,
          availability,
          openingHours,
          closingHours,
          selectedCuisine,
          tableCount,
          tableSize,
          menuItems,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or redirect to another page
        console.log('Restaurant details added successfully');
      } else {
        // Handle errors, e.g., show an error message
        console.error('Failed to add restaurant details');
      }
    } catch (error) {
      console.error('Error submitting restaurant details:', error);
    }
  };

  return (
    <div>
        <h2> Add Restaurant Details </h2>
      <div>
        <label>
          Restaurant ID:
          <input type="text" value={restaurantId} readOnly />
          <button onClick={generateRestaurantId}>Generate ID</button>
        </label>
      </div>
      
      <div>
        <label>
          Availability:
          <input
            type="radio"
            value="open"
            checked={availability === 'open'}
            onChange={handleAvailabilityChange}
          />
          Open
          <input
            type="radio"
            value="closed"
            checked={availability === 'closed'}
            onChange={handleAvailabilityChange}
          />
          Closed
        </label>
      </div>

      <div>
        <label>
          Opening Hours:
          <input type="time" value={openingHours} onChange={handleOpeningHoursChange} />
        </label>
      </div>

      <div>
        <label>
          Closing Hours:
          <input type="time" value={closingHours} onChange={handleClosingHoursChange} />
        </label>
      </div>

      <div>
        <label>
          Number of Tables:
          <input type="number" value={tableCount} onChange={handleTableCountChange} />
        </label>
      </div>

      <div>
        <label>
          Table Size:
          <input type="number" value={tableSize} onChange={handleTableSizeChange} />
        </label>
      </div>

      <div>
        <label>
          Choose Cuisine:
          <select value={selectedCuisine} onChange={handleCuisineChange}>
            <option value="chinese">Chinese</option>
            <option value="italian">Italian</option>
            {/* Add more cuisine options as needed */}
          </select>
        </label>
      </div>

      <div>
        <h3>Add Item to Menu</h3>
        <label>
          Name:
          <input type="text" name="name" value={newItem.name} onChange={handleNewItemChange} />
        </label>
        <label>
          Price:
          <input type="text" name="price" value={newItem.price} onChange={handleNewItemChange} />
        </label>
        <label>
          Quantity:
          <input type="text" name="quantity" value={newItem.quantity} onChange={handleNewItemChange} />
        </label>
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <div>
        <h3>Menu</h3>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>Submit</button>

    </div>
    
  );
};

export default AddRestaurantPage;
