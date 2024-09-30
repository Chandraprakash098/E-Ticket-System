import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../services/api";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();
        console.log("Fetched events:", data);
        setEvents(data);
      } catch (err) {
        console.error("Error in fetchEvents:", err);
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return <div className="text-center text-2xl">Loading events...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (events.length === 0)
    return (
      <div className="text-center text-xl mt-4">
        No upcoming events at the moment. (Total events: {events.length})
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {event.name}
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Time:</span> {event.time}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Venue:</span> {event.venue}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Available Seats:</span>{" "}
              {event.availableSeats}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Price:</span> ${event.price}
            </p>
            <Link
              to={`/booking/${event._id}`}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
