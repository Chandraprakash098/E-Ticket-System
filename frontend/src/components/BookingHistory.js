import React, { useState, useEffect } from "react";
import { getUserBookings } from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getUserBookings();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Booking History
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {booking.event.name}
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(booking.event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Seats:</span>{" "}
              {booking.seats.join(", ")}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Total Amount:</span> $
              {booking.totalAmount}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Booking Reference:</span>{" "}
              {booking.bookingReference}
            </p>
            <p
              className={`text-gray-600 ${
                booking.status === "Confirmed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="font-semibold">Status:</span> {booking.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingHistory;
