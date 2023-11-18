    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import Cookies from 'js-cookie';
    import './register.css'


    // const Today = new Date();

    const ReservationList = () => {
    
    const [displayData, setDisplayData] = useState([{
        start_time: "2023-11-17T19:00:00",
        end_time: "2023-11-17T21:00:00",
        restaurantId: "A2B"
    }]);
    const [userId, setUserId] = useState('');
    
    
    useEffect(() => {
        setUserId(Cookies.get('userId'));
        // const fetchData = async () => {
        // let postdata = {
        //     "customer_id": "12345"
        // }  
        // axios.post("https://us-central1-disco-arcana-394001.cloudfunctions.net/reservationviewbycustomer", postdata)
        // .then((resp) => {
        //     setDisplayData(resp.json())
        // })
        // };

        // fetchData();
    }, []);

    return (
        <>

        <div>
            <h4>Restaurant Reservations</h4>

            <div>
            <strong>Reservations</strong>

            {displayData &&
                displayData.map((reservation) => (
                <div key={reservation.restaurantId} style={{ marginBottom: "16px" }}>
                    <div>
                    {/* <strong>{reservation.restaurantName}</strong> */}
                    <p>
                        {new Date(reservation.start_time).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(reservation.end_time).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        })}
                    </p>
                    </div>
                    {/* Additional details and buttons */}
                </div>
                ))}


    
            </div>

            {/* Confirmation modal
            {isDeleteModalOpen && (
            <div>
                <h6>Confirm Deletion</h6>
                <p>Are you sure you want to delete this reservation?</p>
                <button onClick={() => handleDeleteConfirmation(true)}>Confirm</button>
                <button onClick={() => handleDeleteConfirmation(false)}>Cancel</button>
            </div>
            )}

            {successMessage && <div>{successMessage}</div>}
            {errorMessage && <div>{errorMessage}</div>} */}
        </div>
        </>
    );
    };

    export default ReservationList;
