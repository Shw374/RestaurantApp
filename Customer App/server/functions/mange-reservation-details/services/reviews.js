import axios from "axios";

export const getReview = async (page, data) => {
  try {
    const response = await axios.post(
      "https://y9xx9soj89.execute-api.us-east-1.amazonaws.com/reviews",
      data
    );
    if (response.status === 200) {
      console.log("reviews", response.data);
      return response.data;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getOverallRating = async (data) => {
  try {
    const response = await axios.get(
      "https://o6u2ibjdxg.execute-api.us-east-1.amazonaws.com/ratings/all",
      data
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error:", err);
    return null;
  }
};
