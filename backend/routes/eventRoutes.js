const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByDateRange,
  getEventsByGenre,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/date-range", getEventsByDateRange);
router.get("/genre", getEventsByGenre);
router.post("/", protect, authorize("admin"), createEvent);
router.put("/:id", protect, authorize("admin"), updateEvent);
router.delete("/:id", protect, authorize("admin"), deleteEvent);

module.exports = router;
