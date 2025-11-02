// Movie Ticket Booking System — Backend Entry Point
// ----------------------------------------------------
// Initializes Express app, connects MongoDB, and mounts routes securely.

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); // Added for security

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const bookingRoutes = require("./routes/bookings");
const { authMiddleware } = require("./middlewares/auth");

const app = express();

// Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", authMiddleware, bookingRoutes);

// Health Check Route
app.get("/", (req, res) =>
  res.send("Movie Booking API is live and secure!")
);

// Server + Database Setup
const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server running securely on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Handle unexpected disconnects
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});
