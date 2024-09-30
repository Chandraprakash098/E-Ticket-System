import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllEvents = async () => {
  try {
    console.log("Fetching events from API...");
    const response = await api.get("/events");
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error.response || error);
    throw error;
  }
};
// export const getEventById = (id) =>
//   api.get(`/events/${id}`).then((res) => res.data);

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    console.log("Event fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error.response || error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    console.log("Sending booking data:", bookingData);
    const response = await api.post("/bookings", bookingData);
    console.log("Booking response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Booking error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const getUserBookings = () =>
  api.get("/bookings/user").then((res) => res.data);
export const getUserProfile = () =>
  api.get("/users/profile").then((res) => res.data);
export const updateUserProfile = (profileData) =>
  api.put("/users/profile", profileData).then((res) => res.data);


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Return the response data (which might include tokens or user info)
  } catch (error) {
    throw new Error(error.response.data.message || "Login failed"); // Handle errors
  }
};

export default api;
