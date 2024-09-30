import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  getUserBookings,
} from "../services/api";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setProfile(data);
      setName(data.name);
    };

    const fetchBookings = async () => {
      const bookingsData = await getUserBookings();
      setBookings(bookingsData);
    };

    fetchProfile();
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateUserProfile({ name });
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const downloadETicket = async (bookingReference) => {
    try {
      const response = await fetch(`/api/bookings/ticket/${bookingReference}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `e-ticket_${bookingReference}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading e-ticket:", error);
    }
  };

  if (!profile) return <div className="text-center text-2xl">Loading...</div>;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-2xl ring-1 ring-gray-300">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
          User Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-lg text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-lg text-gray-700">Email</label>
            <p className="bg-gray-100 p-3 border border-gray-300 rounded-lg text-gray-800">
              {profile.email}
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none shadow-lg"
          >
            Update Profile
          </button>
        </form>

        <h2 className="text-4xl font-extrabold mt-8 mb-4 text-center text-gray-800">
          My Bookings
        </h2>
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.bookingReference}
              className="flex justify-between items-center bg-purple-50 p-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              <span className="text-lg text-gray-700 font-semibold">
                Event: {booking.event.name}
              </span>
              <button
                onClick={() => downloadETicket(booking.bookingReference)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-green-400 focus:outline-none shadow-md"
              >
                Download E-Ticket
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserProfile;
