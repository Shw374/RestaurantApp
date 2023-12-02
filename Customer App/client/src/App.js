import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login.js";
import RegisterPage from "./components/register.js";
import Cookies from "js-cookie";
import Listrestaurants from "./components/listrestaurant.js";
import ReservationPage from "./components/reservationpage.js";

function App() {
  // get userId from cookies each page where you're required to send to server
  const userId = Cookies.get("userId");

  // fetch from localstorage. Set isOwner true on successful login
  const isRestaurantOwner = localStorage.getItem("isOwner");

  // fetch from localstorage. Set isOwner true on successful login
  const isAdmin = localStorage.getItem("isAdmin");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />           
        {/* // Add all the pages below that are only accessible by Admin after successful login */}
        {isAdmin && <></>}

        {/* // Add all the pages below that are only accessible by Restaurant Owners after successful login */}
        {isRestaurantOwner && <></>}

        {/* // Add all the pages below that are only accessible after successful login  */}
        {userId && (
          <>
            <Route path="/listrestaurant" element={<Listrestaurants />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </>
        )}
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
