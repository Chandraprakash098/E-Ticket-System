const Event = require("../models/Event");
exports.getAllEvents = async (req, res) => {
  try {
    console.log("Fetching all events...");
    const events = await Event.find();
    console.log(`Found ${events.length} events:`, events);
    res.json(events);
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const events = await Event.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventsByGenre = async (req, res) => {
  try {
    const { genre } = req.query;
    const events = await Event.find({ genre });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
