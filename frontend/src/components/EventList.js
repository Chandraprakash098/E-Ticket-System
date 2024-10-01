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
        setEvents(data);
      } catch (err) {
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
    return <div className="text-center text-xl mt-4">No events found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {event.name}
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Time:</span> {event.time}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Available Seats:</span>{" "}
                {event.availableSeats}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Price:</span> ${event.price}
              </p>
              <Link
                to={`/booking/${event._id}`}
                className="block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;


