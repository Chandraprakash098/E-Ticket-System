import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createBooking } from "../services/api";
import { useNavigate } from "react-router-dom";

function Checkout({ eventId, seats, totalAmount, setBookedSeats }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not been initialized.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      const booking = await createBooking({
        eventId,
        seats,
        token: paymentMethod.id,
      });

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(booking.clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === "succeeded") {
        alert("Booking successful!");
        setBookedSeats((prev) => [...prev, ...seats]); // Update bookedSeats after successful payment
        setSuccess(true);
        navigate(`/`); // Redirect to confirmation page
      } else {
        throw new Error("Payment not completed");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while processing your payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="text-green-500 font-bold text-center">
        Booking successful! Redirecting to confirmation page...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg mt-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Payment Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
        <CardElement className="p-2 border border-gray-300 rounded" />
      </div>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
      >
        {processing ? "Processing..." : `Pay $${totalAmount}`}
      </button>
    </form>
  );
}

export default Checkout;
