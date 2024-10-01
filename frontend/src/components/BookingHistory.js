import React, { useState, useEffect } from "react";
import { getUserBookings, deleteBooking } from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const data = await getUserBookings();
    setBookings(data);
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Booking History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-xl shadow-md transition duration-300 hover:shadow-xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-indigo-600 mb-3">
                {booking.event.name}
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="font-semibold text-gray-600">Date:</span>
                  <span>
                    {new Date(booking.event.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-gray-600">Seats:</span>
                  <span>{booking.seats.join(", ")}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-gray-600">Total:</span>
                  <span>${booking.totalAmount.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Reference:
                  </span>
                  <span className="text-xs">{booking.bookingReference}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-gray-600">Status:</span>
                  <span
                    className={
                      booking.status === "Confirmed"
                        ? "text-red-600"
                        : "text-green-400"
                    }
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete Booking
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
