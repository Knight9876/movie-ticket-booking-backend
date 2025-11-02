# Movie Ticket Booking - Backend

Backend server for the **Movie Ticket Booking System**, built with **Node.js**, **Express**, and **MongoDB**.

---

## 🧩 Short Description of My Approach

The goal was to build a simple, modular, and secure backend system for managing movies, user authentication, and seat bookings.  
Here’s the approach I followed:

1. **Authentication:** Implemented secure JWT-based signup and login with `bcrypt` password hashing.  
2. **Data Models:** Designed three clean Mongoose models — `User`, `Movie`, and `Booking` — to ensure clear data relationships.  
3. **Atomic Booking Logic:** Used MongoDB’s `$elemMatch` and `$push` operators to prevent duplicate seat bookings through atomic updates.  
4. **Middleware:** Added a reusable `authMiddleware` to protect all booking routes.  
5. **Environment Configuration:** Stored keys in `.env` for scalability and smooth deployment on Render.  
6. **Testing & Verification:** Verified all routes using Thunder Client before frontend integration.

---

## Features

- JWT-based authentication (Signup / Login)
- Secure booking API (atomic seat booking)
- MongoDB + Mongoose models for User, Movie, Booking
- CORS enabled for frontend access
- Deployed on **Render**

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt for password hashing

---

## Environment Variables

Create a `.env` file in the root with the following:

```env
MONGO_URI=your_mongodb_connection_string   # Your MongoDB Atlas connection string
JWT_SECRET=your_jwt_secret_key             # Secret key used for JWT signing
PORT=4000                                  # (Optional) Server port
```

---

## Setup Instructions

1. Install dependencies

```bash
npm install
```

2. Run the server

```bash
npm run dev
```

The backend should be running on http://localhost:4000

---

## Deployment

Deployed on `Render` [https://www.render.com]

Live Link: https://movie-ticket-booking-p8ne.onrender.com

---

## Test Credentials

1. Test User 1

```bash
Email: testuser@example.com
Password: Test@1234
```

2. Test User 2

```bash
Email: test@test.com
Password: testtest
```

---

## Folder Structure

```bash
backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   └── bookings.js
│   │
│   ├── middlewares/
│   │   └── auth.js
│   │
│   ├── index.js
│   └── seed.js
│
├── .env                # Environment variables (not committed)
├── .gitignore          # Ignored files and folders
└── README.md           # Documentation

```
