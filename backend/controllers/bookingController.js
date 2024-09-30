const dotenv = require("dotenv");
dotenv.config();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../utils/emailService");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Add this check to ensure the key is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is not set. Please check your .env file.");
  process.exit(1);
}

exports.createBooking = async (req, res) => {
  try {
    const { eventId, seats, token } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seats.length) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Check if the selected seats are already booked
    const alreadyBookedSeats = event.bookedSeats.filter((seat) =>
      seats.includes(seat)
    );
    if (alreadyBookedSeats.length > 0) {
      return res.status(400).json({
        message:
          "Some selected seats are already booked: " +
          alreadyBookedSeats.join(", "),
      });
    }

    const totalAmount = event.price * seats.length;

    // Create a PaymentIntent with automatic confirmation
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe requires the amount in cents
      currency: "usd",
      payment_method: token, // Attach the payment method ID
      confirmation_method: "automatic", // Set to automatic
    });

    console.log("Stripe Payment Intent result:", {
      status: paymentIntent.status,
      id: paymentIntent.id,
    });

    // Update the event with booked seats
    event.bookedSeats.push(...seats); // Add booked seats
    event.availableSeats -= seats.length; // Update available seats
    await event.save(); // Save the event with updated booked seats

    // Create a new booking
    const bookingReference = uuidv4(); // Generate a unique booking reference
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      seats,
      totalAmount,
      bookingReference,
      status: "confirmed", // Set the initial status as confirmed
    });

    // Send back the client_secret for frontend confirmation
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      _id: booking._id, // Return the booking ID
      bookingReference, // Return the booking reference
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({ message: "Payment intent creation failed" });
  }
};

exports.getBookingByReference = async (req, res) => {
  try {
    const { bookingReference } = req.params;
    const booking = await Booking.findOne({ bookingReference }).populate(
      "event"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).populate("event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getETicket = async (req, res) => {
  try {
    const { bookingReference } = req.params;
    const booking = await Booking.findOne({ bookingReference }).populate(
      "event"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Set the response headers for a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${bookingReference}_e_ticket.pdf`
    );

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF into the response
    doc.pipe(res);

    // Add ticket details to the PDF
    doc.fontSize(24).text("E-Ticket", { align: "center" });
    doc.fontSize(18).text(`Event: ${booking.event.name}`, { align: "left" });
    doc.text(`Date: ${booking.event.date}`, { align: "left" });
    doc.text(`Location: ${booking.event.location}`, { align: "left" });
    doc.moveDown();

    doc
      .fontSize(16)
      .text(`Booking Reference: ${bookingReference}`, { align: "left" });
    doc.text(`Seats: ${booking.seats.join(", ")}`, { align: "left" });
    doc.text(`Total Amount: $${booking.totalAmount}`, { align: "left" });

    // Signature line
    doc.moveDown();
    doc.text("Thank you for your purchase!", { align: "center" });

    // Finalize the PDF and end the document
    doc.end();
  } catch (error) {
    console.error("Error generating e-ticket:", error);
    res.status(500).json({ message: "Failed to generate e-ticket" });
  }
};


exports.downloadETicket = async (req, res) => {
  const { bookingReference } = req.params;
  const filePath = path.join(
    __dirname,
    "..",
    "tickets",
    `${bookingReference}_e_ticket.pdf`
  );

  // Check if the file exists on the server
  if (fs.existsSync(filePath)) {
    // Send the file as a download
    res.download(filePath, `${bookingReference}_e_ticket.pdf`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Failed to download e-ticket" });
      }
    });
  } else {
    res.status(404).json({ message: "E-ticket not found" });
  }
};
