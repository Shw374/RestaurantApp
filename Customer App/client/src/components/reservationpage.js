import React from 'react';
import { useLocation } from 'react-router-dom';
import './reservationpage.css'

const ReservationPage = () => {
  const location = useLocation();

  if (!location || !location.state) {
    // Handle the case when there's no data or navigate to another page
    return <p className="no-data-message">No data available for reservation.</p>;
  }

  const { restaurantData } = location.state || {};

  if (!restaurantData) {
    // Handle the case when there's no data (optional)
    return <p className="no-data-message">No data available for reservation.</p>;
  }

  return (
    <div className="reservation-container">
      <h2>Continue to reserve</h2>
      <p className="property">Title: {restaurantData.title}</p>
      {restaurantData.openHours && <p className="property">Open Hours: {restaurantData.openHours}</p>}
      {restaurantData.closeHours && <p className="property">Close Hours: {restaurantData.closeHours}</p>}
      {restaurantData.address && <p className="property">Address: {restaurantData.address}</p>}
      {restaurantData.phone && <p className="property">Phone: {restaurantData.phone}</p>}
      {restaurantData.status ? (
        <p className="property">Status: {restaurantData.status === 'open' ? 'Open' : 'Closed'}</p>
      ) : (
        <p className="property">Status: Closed</p>
      )}

      {restaurantData.menu && (
        <div className="menu-content">
          <h2>Menu</h2>
          {Object.keys(restaurantData.menu).map((cuisine) => (
            <div key={cuisine} className="cuisine-section">
              <h3>{cuisine}</h3>
              <ul>
                {Object.keys(restaurantData.menu[cuisine]).map((id) => (
                  <li key={id} className="menu-item">
                    <div>Menu Name: {restaurantData.menu[cuisine][id].menu_name}</div>
                    <div>Price: {restaurantData.menu[cuisine][id].price}</div>
                    <div>Quantity: {restaurantData.menu[cuisine][id].quantity}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
