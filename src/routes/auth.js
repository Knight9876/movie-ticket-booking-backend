// Authentication Routes
// Handles signup and login with bcrypt + JWT

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SALT_ROUNDS = 10;

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper: Validate email format
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Behavior:
 *  - Validates input and email format
 *  - Hashes password using bcrypt
 *  - Creates a new user
 *  - Returns a JWT token + user info
 */

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    if (!isValidEmail(email))
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(409)
        .json({ message: "User already exists. Please log in instead." });

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({ name, email, passwordHash });

    // Generate token
    const token = generateToken(user._id);

    // Respond with token + user info
    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Behavior:
 *  - Validates credentials
 *  - Verifies password using bcrypt
 *  - Returns a new JWT token + user info
 */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate new token
    const token = generateToken(user._id);

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
