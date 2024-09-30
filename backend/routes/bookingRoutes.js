const express = require("express");
const {
  createBooking,
  getBookingByReference,
  getUserBookings,
  getETicket,
  downloadETicket,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/reference/:bookingReference", protect, getBookingByReference);
router.get("/user", protect, getUserBookings);
// router.get("/bookings/ticket/:bookingReference", getETicket);
router.get("/ticket/:bookingReference", getETicket);
router.get("/ticket/download/:bookingReference", downloadETicket);

module.exports = router;
