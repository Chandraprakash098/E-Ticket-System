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
    const userEmail = req.user.email;

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

    await booking.populate("event");

    // Generate E-Ticket PDF
    const pdfBuffer = await generateETicketBuffer(booking);

    // Send email with e-ticket attached
    const subject = "Booking Successful - Your E-Ticket";
    const text = `Your booking for ${event.name} is confirmed. Please find your e-ticket attached.`;

    try {
      await sendEmail(userEmail, subject, text, [
        {
          filename: `${bookingReference}_e_ticket.pdf`,
          content: pdfBuffer, // Attach the generated PDF buffer
          contentType: "application/pdf",
        },
      ]);

      console.log("Email with e-ticket sent successfully.");
    } catch (error) {
      console.error("Error sending email with e-ticket:", error);
    }

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

const generateETicketBuffer = async (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer); // Resolve with the PDF data in memory
      });

      // Add content to the PDF
      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .text("E-Ticket", { align: "center" });
      doc.moveDown();
      doc.font("Helvetica").fontSize(14);
      doc.text(`Event: ${booking.event.name}`);
      doc.text(`Date: ${new Date(booking.event.date).toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Booking Reference: ${booking.bookingReference}`);
      doc.text(`Seats: ${booking.seats.join(", ")}`);
      doc.text(`Total Amount: $${booking.totalAmount.toFixed(2)}`);
      doc.moveDown();
      doc
        .font("Helvetica-Oblique")
        .text("Thank you for your purchase!", { align: "center" });
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

      // Finalize the PDF and end the stream
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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
  console.log("getETicket function called");
  console.log("Booking reference:", req.params.bookingReference);
  console.log("Request headers:", req.headers);

  try {
    const { bookingReference } = req.params;
    const booking = await Booking.findOne({ bookingReference }).populate(
      "event"
    );

    if (!booking) {
      console.log("Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", booking);

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${bookingReference}_e_ticket.pdf`
    );

    // Pipe the PDF directly to the response
    doc.pipe(res);

    // Add content to the PDF
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("E-Ticket", { align: "center" });
    doc.moveDown();
    doc.font("Helvetica").fontSize(14);

    doc.text(`Event: ${booking.event.name}`);
    doc.text(`Date: ${new Date(booking.event.date).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Booking Reference: ${bookingReference}`);
    doc.text(`Seats: ${booking.seats.join(", ")}`);
    doc.text(`Total Amount: $${booking.totalAmount.toFixed(2)}`);

    doc.moveDown();
    doc
      .font("Helvetica-Oblique")
      .text("Thank you for your purchase!", { align: "center" });

    // Add a border to the page
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    // Finalize the PDF and end the stream
    doc.end();

    console.log("PDF generation completed successfully");
  } catch (error) {
    console.error("Error generating e-ticket:", error);
    res
      .status(500)
      .json({ message: "Failed to generate e-ticket", error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is authorized to delete this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // You might want to add additional checks here, such as:
    // - Is the event date in the future?
    // - Is it within a cancellation window?

    // Update the event to free up the seats
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.seats.length;
      event.bookedSeats = event.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await event.save();
    }

    // Delete the booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
