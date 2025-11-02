// Movie Routes
// Provides access to movie list and individual movie details

const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

/**
 * GET /api/movies
 * Behavior:
 *  - Fetches all movies with their basic details and showtimes
 *  - Sorted by most recently added
 */

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find(
      {},
      { title: 1, description: 1, genre: 1, showtimes: 1 }
    ).sort({ createdAt: -1 });

    if (!movies.length) {
      return res
        .status(200)
        .json({ message: "No movies available", movies: [] });
    }

    res.status(200).json({
      message: "Movies retrieved successfully",
      count: movies.length,
      movies,
    });
  } catch (err) {
    console.error("Fetch movies error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/movies/:id
 * Params: { id } - Movie ID
 * Behavior:
 *  - Fetches a single movie with full details and showtimes
 */

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie details retrieved successfully",
      movie,
    });
  } catch (err) {
    console.error("Fetch movie by ID error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
