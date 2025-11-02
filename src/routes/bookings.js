// Booking Routes
// Handles seat booking creation and user booking history

const express = require("express");
const Movie = require("../models/Movie");
const Booking = require("../models/Booking");

const router = express.Router();

/**
 * POST /api/bookings
 * Body: { movieId, showtimeId, seats: ["A1","A2"], totalPrice }
 * Behavior:
 *  - Atomically adds seats to bookedSeats only if none are already booked.
 *  - Creates a booking record linked to the user.
 */

router.post("/", async (req, res) => {
  try {
    const { movieId, showtimeId, seats, totalPrice } = req.body;

    // Validate input
    if (
      !movieId ||
      !showtimeId ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "movieId, showtimeId, and seats are required" });
    }

    // Attempt atomic seat update
    const filter = {
      _id: movieId,
      showtimes: {
        $elemMatch: {
          _id: showtimeId,
          bookedSeats: { $not: { $elemMatch: { $in: seats } } }, // ensures no overlap
        },
      },
    };

    const update = {
      $push: { "showtimes.$.bookedSeats": { $each: seats } },
    };

    const updatedMovie = await Movie.findOneAndUpdate(filter, update, {
      new: true,
    });

    // Handle seat conflict
    if (!updatedMovie) {
      return res.status(409).json({
        message:
          "One or more selected seats are already booked. Please choose different seats.",
      });
    }

    // Create booking record
    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      showtimeId,
      seats,
      totalPrice: totalPrice || 0,
    });

    // Respond
    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/bookings/my
 * Behavior:
 *  - Returns all bookings for the logged-in user.
 */

router.get("/my", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("movie", "title genre")
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res
        .status(200)
        .json({ message: "No bookings found", bookings: [] });
    }

    res.json({
      message: "Your bookings retrieved successfully",
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Fetch bookings error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
