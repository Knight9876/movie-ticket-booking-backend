// Movie Model
// Contains movie info and embedded showtimes with seat tracking

const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema(
  {
    time: { type: Date, required: true },
    seats: [{ type: String, required: true }], // Available seats for this showtime
    bookedSeats: [{ type: String, default: [] }], // Seats that have been booked already
  },
  { _id: true }
);

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    showtimes: [showtimeSchema],
  },
  { timestamps: true }
);

// index title for faster searches
movieSchema.index({ title: 1 });

module.exports = mongoose.model("Movie", movieSchema);
