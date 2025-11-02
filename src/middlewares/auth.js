// Auth Middleware
// Protects routes by verifying JWT and ensuring valid user

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check if token header exists and starts with "Bearer"
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res
        .status(401)
        .json({ message: "No or invalid authorization header" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    // 3️⃣ Verify token and extract payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.id)
      return res.status(401).json({ message: "Invalid token payload" });

    // 4️⃣ Find user by ID in DB
    const user = await User.findById(payload.id).lean();
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found or token invalid" });

    // 5️⃣ Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("🔐 Auth Error:", err.message);

    // Distinguishing common JWT errors for better debugging
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authMiddleware };
