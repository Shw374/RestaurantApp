    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import Cookies from 'js-cookie';
    import './reservation.css'


    // const Today = new Date();

    const ReservationList = () => {
    
    const [displayData, setDisplayData] = useState([{
        start_time: "2023-11-17T19:00:00",
        end_time: "2023-11-17T21:00:00",
        restaurantId: "A2B"
    },{
        start_time: "2023-12-17T19:00:00",
        end_time: "2023-12-17T21:00:00",
        restaurantId: "MTR"
    }]);
    const [userId, setUserId] = useState('');
    const getColorForReservation = (index) => {
        // Define a set of colors to rotate through
        const colors = ["#FFB6C1", "#ADD8E6", "#FFD700", "#98FB98", "#FFA07A"];
        return colors[index % colors.length];
    };
    
    useEffect(() => {
        setUserId(Cookies.get('userId'));
        const fetchData = async () => {
        let postdata = {
            "customer_id": "12345"
        }  
        try {
            const response = await axios.post("https://35mb0dp42l.execute-api.us-east-1.amazonaws.com/prod/getallbookings/getallbookings", postdata);
            setDisplayData(response.data); // Assuming the data is in the "data" property of the response
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error("Server responded with a non-2xx status:", error.response.status);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up the request:", error.message);
            }
        }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h4>Restaurant Reservations</h4>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                {displayData &&
                    displayData.map((reservation, index) => (
                        <div 
                            key={reservation.restaurantId}
                            className="reservation-item"
                            style={{
                                marginBottom: "16px",
                                backgroundColor: getColorForReservation(index),
                                backgroundImage: "none"
                            }}
                        >
                            <div>
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
                            <button style={{ marginRight: '8px', padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}> 
                                    Approve
                                </button>
                                
                                <button style={{ marginRight: '8px', padding: '8px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '4px' }}> 
                                    Reject
                                </button>
                                <button style={{ padding: '8px', backgroundColor: '#4682B4', color: 'white', border: 'none', borderRadius: '4px' }}> 
                                    Edit
                                </button>
                                <br/>
                            {/* Additional details and buttons */}
                        </div>
                    ))}
            </div>
        </div>
    );
    };

    export default ReservationList;
