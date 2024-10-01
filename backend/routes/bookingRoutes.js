const express = require("express");
const {
  createBooking,
  getBookingByReference,
  getUserBookings,
  getETicket,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/reference/:bookingReference", protect, getBookingByReference);
router.get("/user", protect, getUserBookings);
router.get("/ticket/:bookingReference", protect, getETicket);
router.delete("/:id", protect, deleteBooking);

module.exports = router;
