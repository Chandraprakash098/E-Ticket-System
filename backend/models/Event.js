const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    bookedSeats: [{ type: Number }],
    genre: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Event", eventSchema);
