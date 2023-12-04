import axios from "axios";

export const addReview = async (data) => {
  try {
    const response = await axios.put(
      "https://y9xx9soj89.execute-api.us-east-1.amazonaws.com/reviews",
      data
    );

    console.log("Success:", response);

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

export const addRating = async (data) => {
  try {
    const response = await axios.put(
      "https://o6u2ibjdxg.execute-api.us-east-1.amazonaws.com/ratings",
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
