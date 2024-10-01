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
      console.log(
        "Attempting to download e-ticket for booking:",
        bookingReference
      );
      const response = await fetch(
        `http://localhost:5000/api/bookings/ticket/${bookingReference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${bookingReference}_e_ticket.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading e-ticket:", error);
      alert(`Failed to download the e-ticket: ${error.message}`);
    }
  };

  if (!profile) return <div className="text-center text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Profile Section */}
            <div className="md:w-1/3 p-8 bg-gray-50">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                User Profile
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-700 sm:text-sm">
                    {profile.email}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Profile
                </button>
              </form>
            </div>

            {/* Bookings Section */}
            <div className="md:w-2/3 p-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                My Bookings
              </h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingReference}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition duration-300 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-center flex-wrap">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.event.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date:{" "}
                          {new Date(booking.event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          downloadETicket(booking.bookingReference)
                        }
                        className="mt-2 sm:mt-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Download E-Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
