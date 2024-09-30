import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getEventById } from "../services/api";
import SeatSelection from "../components/SeatSelection";
import Checkout from "../components/Checkout";
import { useAuth } from "../services/auth";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
console.log("Stripe Public Key:", process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function BookingPage() {
  const [event, setEvent] = useState(null);
  const { isAuthenticated } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await getEventById(id);
      setEvent(data);
      setBookedSeats(data.bookedSeats || []); // Set bookedSeats from API
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!event) return <div className="text-center text-xl">Loading...</div>;

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  return (
    <div className="container mx-auto p-4 mt-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        Book Tickets for {event.name}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <p className="text-lg font-semibold">Event Details</p>
        <p className="text-gray-700">
          <span className="font-semibold">Date:</span>{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Time:</span> {event.time}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Venue:</span> {event.venue}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Available Seats:</span>{" "}
          {event.availableSeats}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Price:</span> ${event.price}
        </p>
      </div>
      <SeatSelection
        availableSeats={event.availableSeats}
        bookedSeats={bookedSeats} // Pass bookedSeats to SeatSelection
        onSeatSelect={handleSeatSelect}
      />
      {selectedSeats.length > 0 && (
        <Elements stripe={stripePromise}>
          <Checkout
            eventId={event._id}
            seats={selectedSeats}
            totalAmount={selectedSeats.length * event.price}
            setBookedSeats={setBookedSeats} // Pass setBookedSeats to Checkout
          />
        </Elements>
      )}
    </div>
  );
}

export default BookingPage;
