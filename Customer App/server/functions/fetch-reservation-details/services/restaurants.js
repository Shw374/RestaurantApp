import axios from "axios";

export const getRestaurantDetails = async (data) => {
  try {
    const response = await axios.post(
      "https://2gzybahlmi.execute-api.us-east-1.amazonaws.com/restaurant/details",
      data
    );

    const details = response.data?.details;

    if (details && details.length > 0) {
      return details;
    } else {
      return null;
    }
  } catch (err) {
    const response = err?.response;
    if (!response) {
      console.log("Network error. Please check your internet connection.");
      return { error: true, message: "Network error" };
    }

    if (err.code === "ERR_NETWORK") {
      console.log("Connection problems..");
    } else if (err.code === "ERR_CANCELED") {
      console.log("Connection canceled..");
    }
    if (response) {
      const statusCode = response?.status;
      if (statusCode === 404) {
        console.log(
          "The requested resource does not exist or has been deleted"
        );
      } else if (statusCode === 401) {
        console.log("Unauthorized resource");
      }
    }

    return { error: true, message: "Oops! Something went wrong" };
  }
};

export const createReservation = async (data) => {
  try {
    const response = await axios.put(
      "https://1tjt8xvt44.execute-api.us-east-1.amazonaws.com/test/createreservations",
      data
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
};